import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/seo-preflight-8p2-baseline.json'), 'utf8'));
const sitemapUrl = 'https://ai-ve-vyuce.netlify.app/';
const targetFiles = Object.keys(fixture.pages);

function snapshot(html) {
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m => ({ level: Number(m[1]), text: m[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() }));
  const ids = [...html.matchAll(/\bid=["']([^"']+)['"]/gi)].map(m => m[1]);
  const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(m => ({ href: (m[1].match(/\bhref=["']([^"']*)['"]/i) || [])[1] || '', text: m[2].replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() }));
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map(m => ({ src: (m[1].match(/\bsrc=["']([^"']*)['"]/i) || [])[1] || '', alt: (m[1].match(/\balt=["']([^"']*)['"]/i) || [])[1] ?? null }));
  const scripts = [...html.matchAll(/<script\b([^>]*)>/gi)].map(m => ({ src: (m[1].match(/\bsrc=["']([^"']*)['"]/i) || [])[1] || '', type: (m[1].match(/\btype=["']([^"']*)['"]/i) || [])[1] || '' }));
  const controls = [...html.matchAll(/<(input|textarea|select|button)\b([^>]*)>/gi)].map(m => ({ tag: m[1].toLowerCase(), id: (m[2].match(/\bid=["']([^"']*)['"]/i) || [])[1] || '', name: (m[2].match(/\bname=["']([^"']*)['"]/i) || [])[1] || '' }));
  const preserved = html.replace(/<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>\s*/ig, '').replace(/<meta\b(?=[^>]*\bproperty\s*=\s*["']og:url["'])[^>]*>\s*/ig, '').replace(/\r\n/g, '\n');
  return {
    title: (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '',
    canonical: (html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i) || [])[0] || null,
    og: (html.match(/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i) || [])[0] || null,
    robots: (html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i) || [])[0] || null,
    headings, ids, links, images, scripts, forms: controls,
    contentSha256: crypto.createHash('sha256').update(preserved, 'utf8').digest('hex')
  };
}

test('SEO metadata and source content match the approved six-page baseline', async () => {
  expect(fixture.baselineSha).toBe('2d1bbb915a393d78dbefbfebfd2acc9ea00bb30f');
  expect(targetFiles).toHaveLength(6);
  for (const file of targetFiles) {
    const current = snapshot(fs.readFileSync(path.join(root, file), 'utf8'));
    const expected = fixture.pages[file];
    const { canonical: _baselineCanonical, og: _baselineOg, ...expectedInvariant } = expected;
    const { canonical: _currentCanonical, og: _currentOg, ...currentInvariant } = current;
    expect(currentInvariant, file + ' content, headings, links, images, IDs, scripts and controls').toEqual(expectedInvariant);
    const cleanPath = file.replace(/\.html$/, '');
    expect(current.canonical, file + ' canonical').toBe(sitemapUrl + cleanPath);
    expect(current.og, file + ' Open Graph URL').toBe(sitemapUrl + cleanPath);
    expect(current.robots || '').not.toMatch(/noindex/i);
  }
});

test('XML sitemap is valid, unique, indexable, and resolves to matching canonical pages', async ({ page }) => {
  const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const parsed = await page.evaluate(source => {
    const doc = new DOMParser().parseFromString(source, 'application/xml');
    return {
      root: doc.documentElement?.localName,
      errors: doc.getElementsByTagName('parsererror').length,
      locs: [...doc.querySelectorAll('url > loc')].map(node => node.textContent.trim())
    };
  }, xml);
  expect(parsed.root).toBe('urlset');
  expect(parsed.errors).toBe(0);
  expect(parsed.locs.length).toBe(103);
  expect(new Set(parsed.locs).size).toBe(parsed.locs.length);
  for (const value of parsed.locs) {
    const url = new URL(value);
    expect(url.origin).toBe('https://ai-ve-vyuce.netlify.app');
    expect(url.search).toBe('');
    expect(url.hash).toBe('');
    expect(url.pathname).not.toMatch(/\.html$/);
    const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1) + '.html';
    const fullPath = path.join(root, relative);
    expect(fs.existsSync(fullPath), 'missing sitemap target ' + value).toBe(true);
    const html = fs.readFileSync(fullPath, 'utf8');
    expect(snapshot(html).canonical, 'canonical mismatch for ' + value).toBe(value);
    expect(snapshot(html).robots || '', 'noindex URL in sitemap ' + value).not.toMatch(/noindex/i);
  }
  const cleanTargets = targetFiles.map(file => sitemapUrl + file.replace(/\.html$/, ''));
  for (const url of cleanTargets) expect(parsed.locs.filter(item => item === url)).toHaveLength(1);
  const catalog = fs.readFileSync(path.join(root, 'ai.html'), 'utf8');
  for (const file of targetFiles) {
    const slug = file.replace(/\.html$/, '');
    expect(catalog.includes(slug), 'internal article link missing for ' + file).toBe(true);
  }
});

test('_redirects has unique sources and no redirect cycles', async () => {
  const rules = fs.readFileSync(path.join(root, '_redirects'), 'utf8').split(/\r?\n/)
    .map(line => line.trim()).filter(line => line && !line.startsWith('#'))
    .map(line => line.split(/\s+/)).filter(parts => parts.length >= 3 && !parts[0].startsWith('#'));
  const targets = new Map();
  for (const [from, to] of rules) {
    expect(targets.has(from), 'duplicate redirect source ' + from).toBe(false);
    targets.set(from, to);
  }
  for (const start of targets.keys()) {
    const seen = new Set();
    let current = start;
    while (targets.has(current)) {
      expect(seen.has(current), 'redirect cycle at ' + current).toBe(false);
      seen.add(current);
      current = targets.get(current);
    }
  }
});
