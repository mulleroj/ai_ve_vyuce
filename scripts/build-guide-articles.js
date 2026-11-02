#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const plainText = html => decodeEntities(String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? match;
    const hex = entity[1].toLowerCase() === 'x';
    const codePoint = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
  });
}
const normalizeSourceText = html => plainText(html)
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const sha256 = value => crypto.createHash('sha256').update(value, 'utf8').digest('hex');
const slug = value => plainText(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('cs').replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60) || 'sekce';

function loadCatalog() {
  const context = { window: {} };
  vm.runInNewContext(read('js/site-articles.js'), context, { filename: path.join(ROOT, 'js/site-articles.js') });
  return context.window.siteArticles;
}

function validateSource(a, body, related, footer) {
  const actualText = normalizeSourceText(body);
  if (actualText.length !== a.sourceBodyLength) throw new Error(`${a.file}: source text length mismatch (${actualText.length} != ${a.sourceBodyLength})`);
  if (sha256(actualText) !== a.sourceBodyTextSha256) throw new Error(`${a.file}: source text SHA-256 mismatch`);
  for (const [name, markup, expected] of [
    ['related', related, a.sourceRelatedTextSha256], ['footer', footer, a.sourceFooterTextSha256]
  ]) {
    if (sha256(normalizeSourceText(markup)) !== expected) throw new Error(`${a.file}: ${name} source SHA-256 mismatch`);
  }
  const links = [...body.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)].map(m => decodeEntities(m[2]));
  if (JSON.stringify(links) !== JSON.stringify(a.sourceBodyLinks || [])) throw new Error(`${a.file}: source body links differ from manifest`);
  const images = [...body.matchAll(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi)].map(m => ({ tag: m[0], src: decodeEntities(m[2]) }));
  const expectedImages = a.sourceBodyImages || [];
  if (images.length !== (a.sourceBodyImageCount ?? expectedImages.length) || images.length !== expectedImages.length) {
    throw new Error(`${a.file}: source image count mismatch (${images.length})`);
  }
  images.forEach((image, index) => {
    if (image.src !== expectedImages[index].src) throw new Error(`${a.file}: source image ${index + 1} order/path differs from manifest`);
    if (!expectedImages[index].alt) throw new Error(`${a.file}: missing alt text for image ${index + 1}`);
    const actualAlt = image.tag.match(/\balt\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (actualAlt !== expectedImages[index].alt) throw new Error(`${a.file}: source image ${index + 1} alt text differs from manifest`);
  });
  const relatedLinks = [...related.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)].map(m => decodeEntities(m[2]));
  if (JSON.stringify(relatedLinks) !== JSON.stringify(a.sourceRelatedLinks || [])) throw new Error(`${a.file}: related links differ from manifest`);
  const prompts = [...body.matchAll(/<div\b[^>]*class\s*=\s*(["'])[^"']*\barticle-prompt\b[^"']*\1[^>]*>/gi)].length;
  if (prompts !== a.originalPromptBlockCount) throw new Error(`${a.file}: original prompt count mismatch (${prompts})`);
}

function prepareBody(raw, a) {
  const used = new Set();
  const headings = [];
  let body = raw.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1\s*>/gi, (_whole, level, attrs, inner) => {
    const attrId = attrs.match(/\bid\s*=\s*(["'])(.*?)\1/i);
    const id = attrId ? decodeEntities(attrId[2]) : `guide-${a.slug}-${slug(inner)}-${headings.length + 1}`;
    if (used.has(id)) throw new Error(`${a.file}: duplicate heading ID ${id}`);
    used.add(id);
    headings.push({ level: Number(level), id, label: plainText(inner) });
    const nextAttrs = attrId ? attrs.replace(attrId[0], `id="${escapeHtml(id)}"`) : `${attrs} id="${escapeHtml(id)}"`;
    return `<h${level}${nextAttrs}>${inner}</h${level}>`;
  });
  const toc = headings.filter(h => !(h.level === 3 && /^prompt(?:\s|$)/i.test(h.label)))
    .map(h => `<li class="guide-toc-${h.level === 3 ? 'sub' : 'major'}"><a href="#${escapeHtml(h.id)}">${escapeHtml(h.label)}</a></li>`).join('\n');
  let promptCount = 0;
  body = body.replace(/<div\b([^>]*\bclass\s*=\s*(["'])[^"']*\barticle-prompt\b[^"']*\2[^>]*\bdata-guide-copyable\s*=\s*(["'])(.*?)\3[^>]*)>([\s\S]*?)<\/div>/gi, (_match, attrs, _q, _q2, _key, content) => {
    promptCount++;
    const id = `guide-prompt-${a.slug}-${String(promptCount).padStart(2, '0')}`;
    const label = attrs.match(/\bdata-guide-copy-label\s*=\s*(["'])(.*?)\1/i)?.[2] || 'Kopírovat prompt';
    return `<section class="prompt-card" aria-label="Prompt ke zkopírování"><div class="prompt-card-head"><span>Prompt</span><button class="prompt-copy-button" type="button" data-copy-prompt="${id}" data-copy-format="rendered" data-copy-label="${escapeHtml(label)}" data-copy-success-label="Zkopírováno">${escapeHtml(label)}</button></div><div class="article-prompt prompt-body" id="${id}">${content}</div><span class="prompt-copy-feedback" aria-live="polite" aria-atomic="true"></span></section>`;
  });
  if (promptCount !== a.copyablePromptBlockCount) throw new Error(`${a.file}: copyable prompt count mismatch (${promptCount})`);
  return { body, toc };
}

function decorateImages(raw, a) {
  const images = a.sourceBodyImages || [];
  let index = 0;
  return raw.replace(/<img\b([^>]*)>/gi, (whole, attrs) => {
    const metadata = images[index++];
    if (!metadata) throw new Error(`${a.file}: image metadata missing`);
    const src = attrs.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (decodeEntities(src || '') !== metadata.src) throw new Error(`${a.file}: image order/path differs from manifest`);
    let next = attrs;
    if (!/\bwidth\s*=/.test(next) && metadata.width) next += ` width="${Number(metadata.width)}"`;
    if (!/\bheight\s*=/.test(next) && metadata.height) next += ` height="${Number(metadata.height)}"`;
    if (!/\bloading\s*=/.test(next)) next += ' loading="lazy"';
    if (!/\bdecoding\s*=/.test(next)) next += ' decoding="async"';
    return `<img${next}>`;
  });
}

function validateHtml(html, file) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const seen = new Set();
  for (const id of ids) { if (seen.has(id)) throw new Error(`${file}: duplicate id ${id}`); seen.add(id); }
  for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)) {
    const href = decodeEntities(match[2]);
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
    const [targetPath, fragment = ''] = href.split('#');
    if (!targetPath) { if (fragment && !seen.has(decodeURIComponent(fragment))) throw new Error(`${file}: missing fragment #${fragment}`); continue; }
    if (!/\.html(?:$|\?)/i.test(targetPath)) continue;
    const target = path.resolve(ROOT, path.dirname(file), targetPath.split('?')[0]);
    if (!target.startsWith(ROOT + path.sep) || !fs.existsSync(target)) throw new Error(`${file}: broken local link ${href}`);
    if (fragment && !new RegExp(`\\bid=["']${decodeURIComponent(fragment).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(read(path.relative(ROOT, target)))) throw new Error(`${file}: missing target fragment ${href}`);
  }
}

function main() {
  const manifest = JSON.parse(read('content/guides/articles.json'));
  const catalog = loadCatalog();
  const catalogByHref = new Map(catalog.map(entry => [entry.href, entry]));
  const navigation = read('templates/magazine/navigation.tpl').trim();
  let stale = false;
  for (const a of manifest) {
    const entry = catalogByHref.get(a.file);
    if (!entry) throw new Error(`Missing catalog entry ${a.file}`);
    const bodySource = read(a.bodySource).trim().replace(/[ \t]+(?=\r?$)/gm, '');
    const relatedSource = read(a.relatedSource).trim().replace(/[ \t]+(?=\r?$)/gm, '');
    const footerSource = read(a.footerSource).trim().replace(/[ \t]+(?=\r?$)/gm, '');
    validateSource(a, bodySource, relatedSource, footerSource);

    let bodyForContent = decorateImages(bodySource, a);
    let cover = '';
    const heroImageSrc = a.hero.imageSrc;
    if (heroImageSrc) {
      const figurePattern = /<figure\b[^>]*>[\s\S]*?<\/figure>/gi;
      bodyForContent = bodyForContent.replace(figurePattern, figure => {
        if (cover || !figure.includes(`src="${heroImageSrc}"`) && !figure.includes(`src='${heroImageSrc}'`)) return figure;
        cover = figure.replace(/\bloading="lazy"/i, 'loading="eager"').replace(/\bdecoding="async"/i, 'decoding="async"');
        return '';
      });
      if (!cover) throw new Error(`${a.file}: hero.imageSrc must reference an existing figure`);
    }
    const { body, toc } = prepareBody(bodyForContent, a);
    const overview = read(a.hero.overviewFile).trim();
    const illustration = a.hero.illustration === false ? '' : '<figure class="guide-hero-illustration"><img src="images/ai-ve-vyuce-robot-navody-transparentni.webp" width="1754" height="897" alt="" decoding="async" /></figure>';
    const footer = footerSource.replace(/<footer class="workflow-footer">([\s\S]*?)<\/footer>/i, '<footer class="guide-footer">$1<span class="guide-human-mark" data-site-footer-mark>AI + 👤 | HUMAN IN THE LOOP</span></footer>');
    const metaHtml = a.hero.metaHtml.replace('workflow-meta', 'guide-meta');
    const html = `<!doctype html>\n<html lang="cs" class="home-redesign-document">\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1" />\n<title>${a.sourceTitle}</title>\n${a.headTags.join('\n')}\n<meta property="og:type" content="article" />\n<link rel="stylesheet" href="css/home.css?v=pr19-robot-brand-20261103" />\n<link rel="stylesheet" href="css/guide-article.css" />\n</head>\n<body class="home-redesign guide-page">\n<a class="skip-link" href="#main-content">Přeskočit na obsah</a>\n${navigation}\n<main id="main-content" class="guide-main">\n<nav class="guide-breadcrumbs" aria-label="Drobečková navigace"><ol><li><a href="index.html">Domů</a></li><li><a href="${escapeHtml(a.parent.href)}">${escapeHtml(a.parent.label)}</a></li><li aria-current="page">${escapeHtml(entry.title)}</li></ol></nav>\n<header class="guide-hero"><div class="guide-hero-copy"><div class="guide-eyebrow">${escapeHtml(a.sourceCategory)} · ${escapeHtml(a.sourceDateLabel)}</div>${a.hero.titleHtml}${a.hero.leadHtml}${metaHtml}${a.intro.summaryHtml}${a.intro.editorialTitleHtml}</div>${illustration}</header>\n<section class="guide-overview" aria-labelledby="guide-overview-title"><h2 id="guide-overview-title">Přehled postupu</h2>${overview}</section>\n${cover ? `<div class="guide-cover">${cover}</div>\n` : ''}<div class="guide-toc-mobile"><details><summary>V tomto návodu</summary><nav aria-label="Obsah návodu"><ul class="guide-toc-list">${toc}</ul></nav></details></div>\n<div class="guide-layout"><aside class="guide-toc guide-toc-desktop"><nav aria-label="Obsah návodu"><h2>V tomto návodu</h2><ul>${toc}</ul></nav></aside><article class="guide-article"><div class="article-content">${body}</div><div class="guide-back-top"><a href="#top">↑ Zpět nahoru</a></div></article></div>\n<section class="guide-related" aria-label="Související obsah">${relatedSource}</section>\n${footer}\n</main>\n<script src="js/main.js" defer></script>\n<script src="js/tool-guide.js" defer></script>\n<script src="js/site-footer.js" defer></script>\n</body></html>\n`;
    const output = html.replace(/[ \t]+(?=\r?$)/gm, '');
    validateHtml(output, a.file);
    const target = path.join(ROOT, a.file);
    if (checkOnly) {
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) { console.error(`${a.file}: generated page is stale`); stale = true; }
    } else fs.writeFileSync(target, output, 'utf8');
  }
  if (stale) process.exitCode = 1;
  else console.log(`${checkOnly ? 'Checked' : 'Built'} ${manifest.length} guide pages.`);
}

main();
