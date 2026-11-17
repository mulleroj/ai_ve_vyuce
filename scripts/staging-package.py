#!/usr/bin/env python3
"""Create a reproducible static bundle from the pinned AI ve výuce commit."""
from __future__ import annotations
import argparse, csv, hashlib, html.parser, json, mimetypes, os, re, shutil
import stat, subprocess, sys, tomllib, urllib.parse, urllib.request, zipfile
from collections import deque
from pathlib import Path, PurePosixPath
from xml.etree import ElementTree as ET

EXPECTED_SHA = "69221d32aad4258c365eb41d14dc52aa2b303a8e"
EXPECTED_PUBLIC_HTML = 103
DEV_DIRS = {".git", ".github", ".netlify", "__pycache__", "node_modules",
            "test", "tests", "fixtures", "skills", "artifacts", "coverage",
            "backup", "backups", "audit"}
DEV_FILES = {".gitignore", ".gitattributes", "AGENTS.md", "CONTRIBUTING.md",
             "README", "README.md", "package.json", "package-lock.json",
             "playwright.config.js", "playwright.config.ts", "yarn.lock",
             "pnpm-lock.yaml", "bun.lock", "bun.lockb"}
ASSET_DIRS = {"css", "js", "img", "images", "media", "assets", "fonts"}
SUFFIXES = {".html", ".css", ".js", ".mjs", ".json", ".xml", ".txt", ".md",
            ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico",
            ".woff", ".woff2", ".ttf", ".otf", ".pdf", ".zip", ".mp3",
            ".mp4", ".webm", ".ogg", ".wav", ".avif"}
CSS_URL = re.compile(r"""url\(\s*(['"]?)(.*?)\1\s*\)|@import\s+['"]([^'"]+)['"]""", re.I)
JS_STRING = re.compile(r"""(?<![A-Za-z0-9_])(['"])(.*?)\1""", re.S)

def die(message):
    raise SystemExit("ERROR: " + str(message))

def cmd(source, *args):
    return subprocess.check_output(["git", "-C", str(source), *args], text=True).strip()

def digest(path):
    h = hashlib.sha256()
    with open(path, "rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def excluded(rel):
    p = PurePosixPath(rel)
    if any(part.lower() in DEV_DIRS for part in p.parts):
        return True
    return p.name in DEV_FILES or p.name.startswith("README.") or p.name.endswith((".log", ".tmp", ".pyc"))

def tracked_set(source):
    raw = subprocess.check_output(["git", "-C", str(source), "ls-files", "-z"])
    return {x.decode("utf-8") for x in raw.split(b"\0") if x}

def lfs_list(source):
    try:
        text = subprocess.check_output(["git", "-C", str(source), "lfs", "ls-files", "--long"],
                                       text=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as exc:
        die("git lfs ls-files failed: " + exc.output)
    result = []
    for line in text.splitlines():
        bits = line.split(" ", 2)
        if len(bits) == 3:
            rel = bits[2]
            path = source / rel
            if not path.is_file():
                die("LFS object missing after checkout: " + rel)
            with path.open("rb") as stream:
                if stream.read(64).startswith(b"version https://git-lfs.github.com/spec/v1"):
                    die("LFS pointer remains instead of its object: " + rel)
            result.append(rel)
    return result

def parse_redirects(root):
    routes, counts = {}, {}
    f = root / "_redirects"
    if f.is_file():
        counts["_redirects"] = 0
        for no, raw in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            line = raw.split("#", 1)[0].strip()
            if not line:
                continue
            bits = line.split()
            if len(bits) < 2:
                die(f"Malformed _redirects line {no}")
            code = int(bits[2].rstrip("!")) if len(bits) >= 3 and bits[2][:3].isdigit() else 301
            counts["_redirects"] += 1
            if "*" not in bits[0]:
                if bits[0] in routes and routes[bits[0]][0] != bits[1]:
                    die("Conflicting _redirects source: " + bits[0])
                routes[bits[0]] = (bits[1], code)
    toml = root / "netlify.toml"
    if toml.is_file():
        try:
            config = tomllib.loads(toml.read_text(encoding="utf-8"))
        except Exception as exc:
            die("Invalid netlify.toml: " + exc)
        if config.get("build", {}).get("command"):
            die("netlify.toml has a build command; review a build procedure before packaging")
        rules = config.get("redirects", [])
        counts["netlify.toml"] = len(rules)
        for rule in rules:
            src, dst = rule.get("from"), rule.get("to")
            if not src or not dst:
                die("Incomplete redirect in netlify.toml")
            if "*" not in src:
                if src in routes and routes[src][0] != dst:
                    die("Conflicting Netlify redirect source: " + src)
                routes[src] = (dst, int(rule.get("status", 301)))
    return routes, counts

class HTMLRefs(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs, self.styles, self.scripts = [], [], []
        self.base = None
        self.mode = None
    def handle_starttag(self, tag, attrs):
        a = {k.lower(): (v or "") for k, v in attrs}
        if tag.lower() == "base" and a.get("href"):
            self.base = a["href"]
        if tag.lower() == "script":
            if a.get("src"):
                self.refs.append(a["src"])
            else:
                self.mode = "js"
        elif tag.lower() == "style":
            self.mode = "css"
        for key in ("href", "src", "poster", "data-src", "data-lazy-src", "data-original", "data", "action"):
            if a.get(key):
                self.refs.append(a[key])
        for key in ("srcset", "data-srcset"):
            for item in a.get(key, "").split(","):
                parts = item.strip().split()
                if parts:
                    self.refs.append(parts[0])
        if a.get("style"):
            self.styles.append(a["style"])
    def handle_endtag(self, tag):
        if tag.lower() in ("script", "style"):
            self.mode = None
    def handle_data(self, data):
        if self.mode == "js":
            self.scripts.append(data)
        elif self.mode == "css":
            self.styles.append(data)

def text_refs(rel, text):
    suffix = Path(rel).suffix.lower()
    if suffix == ".css":
        for match in CSS_URL.finditer(text):
            value = match.group(2) or match.group(3)
            if value:
                yield value.strip()
    elif suffix in (".js", ".mjs"):
        for _, value in JS_STRING.findall(text):
            value = value.strip()
            if not value or value.startswith(("http:", "https:", "//", "data:", "blob:", "mailto:", "#")):
                continue
            parsed = urllib.parse.urlsplit(value)
            if value.startswith(("/", "./", "../")) or Path(parsed.path).suffix.lower() in SUFFIXES:
                yield value

def follow_redirect(path, routes, origin):
    seen = set()
    for _ in range(12):
        if path in seen:
            die("Redirect loop at " + path)
        seen.add(path)
        if path not in routes:
            return path
        target = urllib.parse.urljoin(origin + path, routes[path][0])
        parsed = urllib.parse.urlsplit(target)
        if parsed.hostname and parsed.hostname != urllib.parse.urlsplit(origin).hostname:
            return path
        path = parsed.path
    die("Redirect chain exceeded 12 for " + path)

def url_file(url, root, origin, routes):
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme and parsed.scheme not in ("http", "https"):
        return None, "non-http"
    host = parsed.hostname
    known = {urllib.parse.urlsplit(origin).hostname, "ai-ve-vyuce.netlify.app"}
    if host and host not in known:
        return None, "external"
    path = urllib.parse.unquote(parsed.path or "/")
    if not path.startswith("/"):
        path = "/" + path
    path = follow_redirect(path, routes, origin)
    clean = path.lstrip("/")
    candidates = [clean]
    if not clean or path.endswith("/"):
        candidates.append((clean.rstrip("/") + "/" if clean else "") + "index.html")
    elif not Path(clean).suffix:
        candidates.extend([clean + ".html", clean + "/index.html"])
    for rel in candidates:
        if rel and (root / rel).is_file():
            return PurePosixPath(rel).as_posix(), "local"
    return None, "missing"

def make_pages(root, tracked, origin, routes):
    sitemap = root / "sitemap.xml"
    if not sitemap.is_file() or "sitemap.xml" not in tracked:
        die("Missing committed sitemap.xml")
    try:
        xml = ET.parse(sitemap).getroot()
    except Exception as exc:
        die("Invalid sitemap.xml: " + exc)
    locs = [e.text.strip() for e in xml.iter() if e.tag.endswith("loc") and e.text]
    if len(locs) != EXPECTED_PUBLIC_HTML:
        die(f"Expected 103 public HTML URLs in sitemap; found {len(locs)}")
    pages = {}
    for loc in locs:
        rel, kind = url_file(loc, root, origin, routes)
        if kind != "local" or not rel or not rel.lower().endswith(".html"):
            die("Sitemap URL does not resolve to local HTML: " + loc)
        if rel not in tracked:
            die("Sitemap page is not tracked: " + rel)
        if rel in pages:
            die("Duplicate sitemap page mapping: " + rel)
        pages[rel] = loc
    if len(pages) != 103:
        die("Sitemap does not map to 103 unique HTML files")
    return pages

def build(source, output):
    source, output = Path(source).resolve(), Path(output).resolve()
    if not (source / ".git").exists():
        die("Source path is not a Git checkout")
    actual = cmd(source, "rev-parse", "HEAD")
    if actual != EXPECTED_SHA:
        die(f"Wrong source SHA: {actual}")
    if cmd(source, "status", "--porcelain"):
        die("Source checkout is dirty")
    tracked = tracked_set(source)
    lfs = lfs_list(source)
    toml = source / "netlify.toml"
    if toml.is_file():
        cfg = tomllib.loads(toml.read_text(encoding="utf-8"))
        if cfg.get("build", {}).get("command"):
            die("Non-empty Netlify build command requires review")
    origin = "https://www.ai-ve-vyuce.cz"
    try:
        first = next(e.text.strip() for e in ET.parse(source / "sitemap.xml").getroot().iter()
                     if e.tag.endswith("loc") and e.text)
        p = urllib.parse.urlsplit(first)
        if not p.scheme or not p.netloc:
            die("Sitemap loc must be absolute")
        origin = p.scheme + "://" + p.netloc
    except StopIteration:
        die("Sitemap has no URLs")
    routes, rule_counts = parse_redirects(source)
    pages = make_pages(source, tracked, origin, routes)
    public = set(pages)
    htmls = {p for p in tracked if p.lower().endswith(".html") and not excluded(p)}
    verification = {
        p for p in htmls - public - ({"404.html"} if "404.html" in htmls else set())
        if "/" not in p and re.fullmatch(r"google[a-f0-9]+\.html", p)
        and (source / p).read_text(encoding="utf-8", errors="replace").strip() == "google-site-verification: " + p
    }
    extras = htmls - public - ({"404.html"} if "404.html" in htmls else set()) - verification
    if extras:
        die("Unclassified HTML outside sitemap/404/Google verification: " + ", ".join(sorted(extras)))
    if "404.html" in tracked:
        pages["404.html"] = origin.rstrip("/") + "/404.html"
    for config in ("robots.txt", "_redirects", "_headers", "netlify.toml"):
        if (source / config).is_file() and config not in tracked:
            die("Runtime config is untracked: " + config)

    included, queue = {}, deque()
    def add(rel, why, effective=None):
        rel = PurePosixPath(rel).as_posix()
        if excluded(rel):
            die("Runtime dependency points into excluded development path: " + rel)
        f = source / rel
        if not f.is_file() or f.is_symlink():
            die("Missing or unsafe dependency: " + rel)
        if rel not in tracked:
            die("Dependency is not committed at source SHA: " + rel)
        reasons = included.setdefault(rel, set())
        first = not reasons
        reasons.add(why)
        if first:
            queue.append((rel, effective or (origin.rstrip("/") + "/" + urllib.parse.quote(rel))))

    for rel, url in pages.items():
        add(rel, "sitemap" if rel != "404.html" else "Netlify 404", url)
    for rel in sorted(verification):
        add(rel, "Google Search Console verification resource", origin.rstrip("/") + "/" + rel)
    for name in ("sitemap.xml", "robots.txt", "_redirects", "_headers", "netlify.toml"):
        if (source / name).is_file():
            add(name, "required site/Netlify config")

    def ref(value, base, why):
        if not value or value.startswith(("#", "mailto:", "tel:", "javascript:", "data:", "blob:")):
            return
        url = urllib.parse.urljoin(base, value)
        rel, kind = url_file(url, source, origin, routes)
        if kind in ("external", "non-http"):
            return
        if kind == "missing" or rel is None:
            die(f"Broken local dependency from {base}: {value}")
        if rel.lower().endswith(".html") and rel not in pages:
            die("Linked HTML is outside the 103-page sitemap/404 set: " + rel)
        add(rel, why, url)

    processed = set()
    while queue:
        rel, current_url = queue.popleft()
        if rel in processed:
            continue
        processed.add(rel)
        ext = Path(rel).suffix.lower()
        if ext == ".html":
            parser = HTMLRefs()
            parser.feed((source / rel).read_text(encoding="utf-8", errors="replace"))
            base = urllib.parse.urljoin(current_url, parser.base) if parser.base else current_url
            for value in parser.refs:
                ref(value, base, "HTML dependency: " + rel)
            for block in parser.styles:
                for value in text_refs(".css", block):
                    ref(value, base, "inline CSS: " + rel)
            for block in parser.scripts:
                for value in text_refs(".js", block):
                    ref(value, base, "inline JS: " + rel)
        elif ext in (".css", ".js", ".mjs"):
            for value in text_refs(rel, (source / rel).read_text(encoding="utf-8", errors="replace")):
                ref(value, current_url, "dependency: " + rel)

    active_dirs = {PurePosixPath(p).parts[0].lower() for p in included
                   if len(PurePosixPath(p).parts) > 1 and PurePosixPath(p).parts[0].lower() in ASSET_DIRS}
    for directory in sorted(active_dirs):
        for rel in sorted(tracked):
            if rel.startswith(directory + "/") and not excluded(rel) and (source / rel).is_file():
                add(rel, "referenced runtime directory: " + directory)
    while queue:
        rel, current_url = queue.popleft()
        if rel in processed:
            continue
        processed.add(rel)
        if Path(rel).suffix.lower() in (".css", ".js", ".mjs"):
            for value in text_refs(rel, (source / rel).read_text(encoding="utf-8", errors="replace")):
                ref(value, current_url, "dependency: " + rel)

    if len(public) != EXPECTED_PUBLIC_HTML or not public.issubset(included):
        die("The complete set of 103 public HTML pages is not packaged")
    if output.exists():
        shutil.rmtree(output)
    publish = output / "publish"
    publish.mkdir(parents=True)
    for rel in sorted(included):
        dest = publish / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source / rel, dest)

    archive_path = output / "ai-ve-vyuce-2-staging.zip"
    with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for rel in sorted(included):
            info = zipfile.ZipInfo(rel, (1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = (stat.S_IFREG | 0o644) << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, (publish / rel).read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    manifest = output / "staging-files-sha256.csv"
    with manifest.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["path", "bytes", "sha256", "source_commit"])
        for rel in sorted(included):
            p = publish / rel
            w.writerow([rel, p.stat().st_size, digest(p), actual])
    zip_sha, manifest_sha = digest(archive_path), digest(manifest)
    summary = [
        "source_commit=" + actual, "public_html_pages=103",
        "packaged_files=" + str(len(included)),
        "zip_file=ai-ve-vyuce-2-staging.zip",
        "zip_bytes=" + str(archive_path.stat().st_size), "zip_sha256=" + zip_sha,
        "manifest_file=staging-files-sha256.csv", "manifest_sha256=" + manifest_sha,
        "build_method=sorted deterministic ZIP from the pinned Git tree using sitemap-rooted HTML/CSS/JS dependency closure",
        "netlify_config=" + (", ".join(f"{k}:{v}" for k, v in sorted(rule_counts.items())) or "none"),
        "git_lfs_files=" + str(len(lfs)),
        "excluded_development=git metadata, github actions, tests/fixtures, skills, node_modules, backups, audit files, unreferenced dev files",
        "excluded_source_files=" + str(len(tracked - set(included))),
    ]
    (output / "staging-manifest-summary.txt").write_text("\n".join(summary) + "\n", encoding="utf-8")
    report = [
        "# Staging package technical report", "",
        "Source commit: " + actual,
        "Public HTML pages from sitemap: 103",
        "Packaged file count: " + str(len(included)),
        "Netlify redirect/header sources: " + (", ".join(f"{k} ({v} rules)" for k, v in sorted(rule_counts.items())) or "none"),
        "LFS source files checked: " + str(len(lfs)),
        "Dependency method: sitemap pages plus recursive local HTML, CSS, JavaScript and referenced runtime asset dependencies.",
        "Static dependency check: passed; no unresolved local references.",
        "ZIP SHA-256: " + zip_sha,
        "Manifest SHA-256: " + manifest_sha,
    ]
    (output / "staging-technical-report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    verify_zip(archive_path, manifest)
    clean = output / "verification-unpacked"
    extract_zip(archive_path, clean)
    verify_tree(clean, manifest)
    print("\n".join(summary))

def rows(manifest):
    result = {}
    with Path(manifest).open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            result[row["path"]] = (int(row["bytes"]), row["sha256"], row["source_commit"])
    return result

def verify_tree(root, manifest):
    root = Path(root)
    expected = rows(manifest)
    actual = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()}
    if actual != set(expected):
        die(f"Extracted file set mismatch: missing={sorted(set(expected)-actual)[:10]}, extra={sorted(actual-set(expected))[:10]}")
    for rel, (size, digest_value, commit) in expected.items():
        p = root / rel
        if p.stat().st_size != size or digest(p) != digest_value or commit != EXPECTED_SHA:
            die("Extracted file hash/length/source mismatch: " + rel)

def verify_zip(archive_path, manifest):
    expected = rows(manifest)
    with zipfile.ZipFile(archive_path) as z:
        bad = z.testzip()
        if bad:
            die("ZIP CRC failure: " + bad)
        names = {i.filename for i in z.infolist() if not i.is_dir()}
        if names != set(expected):
            die("ZIP members do not equal manifest paths")
        for rel, (size, digest_value, commit) in expected.items():
            data = z.read(rel)
            if len(data) != size or hashlib.sha256(data).hexdigest() != digest_value or commit != EXPECTED_SHA:
                die("ZIP member checksum mismatch: " + rel)

def extract_zip(archive_path, destination):
    destination = Path(destination)
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    with zipfile.ZipFile(archive_path) as z:
        for info in z.infolist():
            rel = PurePosixPath(info.filename)
            if rel.is_absolute() or ".." in rel.parts:
                die("Unsafe archive path: " + info.filename)
            target = destination.joinpath(*rel.parts)
            target.parent.mkdir(parents=True, exist_ok=True)
            if info.is_dir():
                target.mkdir(exist_ok=True)
            else:
                target.write_bytes(z.read(info))

def serve(root, port):
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
    root = Path(root).resolve()
    routes, _ = parse_redirects(root)
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.respond(True)
        def do_HEAD(self):
            self.respond(False)
        def log_message(self, fmt, *args):
            print(fmt % args, flush=True)
        def respond(self, body):
            path = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
            rule = routes.get(path)
            if rule and 300 <= rule[1] < 400:
                self.send_response(rule[1]); self.send_header("Location", rule[0]); self.end_headers(); return
            clean = path.lstrip("/")
            candidates = [clean]
            if not clean or path.endswith("/"):
                candidates.append((clean.rstrip("/") + "/" if clean else "") + "index.html")
            elif not Path(clean).suffix:
                candidates += [clean + ".html", clean + "/index.html"]
            target = next((root / p for p in candidates if p and (root / p).is_file()), None)
            if target is None:
                missing = root / "404.html"
                data = missing.read_bytes() if missing.is_file() else b"Not found"
                self.send_response(404); self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data))); self.end_headers()
                if body: self.wfile.write(data)
                return
            data = target.read_bytes()
            self.send_response(200); self.send_header("Content-Type", mimetypes.guess_type(str(target))[0] or "application/octet-stream")
            self.send_header("Content-Length", str(len(data))); self.end_headers()
            if body: self.wfile.write(data)
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Serving extracted package on 127.0.0.1:{port}", flush=True)
    httpd.serve_forever()

def http_check(root, manifest, base_url):
    root = Path(root)
    count = 0
    for rel, (size, _, _) in sorted(rows(manifest).items()):
        if rel in {"_redirects", "_headers", "netlify.toml"}:
            continue
        url = base_url.rstrip("/") + "/" + urllib.parse.quote(rel)
        with urllib.request.urlopen(url, timeout=25) as response:
            data = response.read()
            if response.status != 200 or len(data) != size:
                die(f"HTTP validation failed for {rel}: status={response.status}, bytes={len(data)}, expected={size}")
        count += 1
    print(f"HTTP GET passed for {count} packaged files.")

def report(output, qa_report, tested_sha):
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    report_path = output / "staging-technical-report.md"
    text = report_path.read_text(encoding="utf-8") if report_path.exists() else "# Staging package technical report\n"
    text += f"\n## Browser QA\n\n- Tested source SHA: {tested_sha}\n"
    try:
        data = json.loads(Path(qa_report).read_text(encoding="utf-8"))
        stats = data.get("stats", {})
        text += f"- Passed: {stats.get('expected', 0)}\n- Failed: {stats.get('unexpected', 0)}\n- Skipped: {stats.get('skipped', 0)}\n- Flaky: {stats.get('flaky', 0)}\n"
    except Exception:
        text += "- Browser QA report was not produced; inspect workflow logs.\n"
    report_path.write_text(text, encoding="utf-8")

def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="action", required=True)
    b = sub.add_parser("build"); b.add_argument("--source", required=True); b.add_argument("--output", required=True)
    l = sub.add_parser("lfs-check"); l.add_argument("--source", required=True)
    v = sub.add_parser("verify"); v.add_argument("--root", required=True); v.add_argument("--manifest", required=True)
    z = sub.add_parser("verify-zip"); z.add_argument("--zip", required=True); z.add_argument("--manifest", required=True)
    s = sub.add_parser("serve"); s.add_argument("--root", required=True); s.add_argument("--port", type=int, default=4173)
    h = sub.add_parser("http-check"); h.add_argument("--root", required=True); h.add_argument("--manifest", required=True); h.add_argument("--base-url", default="http://127.0.0.1:4173")
    r = sub.add_parser("report"); r.add_argument("--output", required=True); r.add_argument("--qa-report", required=True); r.add_argument("--tested-sha", required=True)
    a = parser.parse_args()
    if a.action == "build": build(a.source, a.output)
    elif a.action == "lfs-check":
        source = Path(a.source)
        files = lfs_list(source)
        print(f"Git LFS objects verified: {len(files)}")
    elif a.action == "verify": verify_tree(a.root, a.manifest); print("Extracted directory matches manifest.")
    elif a.action == "verify-zip": verify_zip(a.zip, a.manifest); print("ZIP CRC and all member SHA-256 values match manifest.")
    elif a.action == "serve": serve(a.root, a.port)
    elif a.action == "http-check": http_check(a.root, a.manifest, a.base_url)
    elif a.action == "report": report(a.output, a.qa_report, a.tested_sha)

if __name__ == "__main__":
    main()
