'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REQUIRED_FIELDS = [
  'href',
  'title',
  'summary',
  'category',
  'date',
  'dateLabel',
  'icon',
  'tags',
  'badgeClass'
];

const OPTIONAL_FIELDS = [
  'platforms',
  'featured',
  'series',
  'seriesNumber',
  'contentType'
];

const DIRECTORY_PAGES = new Set([
  'ai.html',
  'ai-agenti.html',
  'ai-navody.html',
  'ai-novinky.html',
  'ai-workflow.html'
]);

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] || null;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function decodeHref(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function splitHref(value) {
  const decoded = decodeHref(value.trim());
  const hashIndex = decoded.indexOf('#');
  const queryIndex = decoded.indexOf('?');
  const cutAt = [hashIndex, queryIndex]
    .filter((index) => index !== -1)
    .sort((a, b) => a - b)[0];
  const pathname = cutAt === undefined ? decoded : decoded.slice(0, cutAt);
  const fragment = hashIndex === -1 ? '' : decoded.slice(hashIndex + 1).split('?')[0];
  return { decoded, pathname, fragment };
}

function isExternalHref(value) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

function resolveLocalPath(root, pathname, baseDir = root) {
  const normalizedPath = pathname.startsWith('/')
    ? pathname.slice(1)
    : pathname;
  const resolved = path.resolve(baseDir, normalizedPath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return resolved;
}

function listHtmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function loadCatalog(catalogPath) {
  const source = fs.readFileSync(catalogPath, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: catalogPath });
  if (!Array.isArray(context.window.siteArticles)) {
    throw new Error('window.siteArticles is not an array');
  }
  return context.window.siteArticles;
}

function hasFragmentTarget(html, fragment) {
  if (!fragment) return true;
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const idPattern = new RegExp(`\\bid=["']${escaped}["']`, 'i');
  const namePattern = new RegExp(`\\bname=["']${escaped}["']`, 'i');
  return idPattern.test(html) || namePattern.test(html);
}

function main() {
  const defaultRoot = path.resolve(__dirname, '..');
  const root = path.resolve(getOption('--root') || defaultRoot);
  const catalogPath = path.resolve(
    getOption('--catalog-file') || path.join(root, 'js', 'site-articles.js')
  );
  const skipOmissions = process.argv.includes('--skip-omissions');
  const errors = [];
  const warnings = [];
  const error = (message) => errors.push(message);
  const warn = (message) => warnings.push(message);

  let catalog = [];
  try {
    catalog = loadCatalog(catalogPath);
  } catch (loadError) {
    error(`Cannot load catalog: ${loadError.message}`);
  }

  const hrefCounts = new Map();
  const articleSignatures = new Map();
  const missingTargets = new Set();

  catalog.forEach((record, index) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      error(`Record ${index + 1}: expected an object`);
      return;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!(field in record)) error(`Record ${index + 1}: missing required field '${field}'`);
    }

    for (const field of ['title', 'summary', 'category', 'dateLabel', 'icon', 'badgeClass']) {
      if (field in record && !isNonEmptyString(record[field])) {
        error(`Record ${index + 1}: '${field}' must be a non-empty string`);
      }
    }

    if ('summary' in record && isNonEmptyString(record.summary)) {
      const summaryLength = record.summary.trim().length;
      if (summaryLength < 20 || summaryLength > 400) {
        warn(`Record ${index + 1} (${record.href || 'unknown'}): summary length is ${summaryLength}; review it`);
      }
    }

    if ('tags' in record) {
      if (!Array.isArray(record.tags)) {
        error(`Record ${index + 1}: 'tags' must be an array`);
      } else if (record.tags.some((tag) => !isNonEmptyString(tag))) {
        error(`Record ${index + 1}: 'tags' must contain only non-empty strings`);
      }
    }

    if ('date' in record) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date) || Number.isNaN(Date.parse(`${record.date}T00:00:00Z`))) {
        error(`Record ${index + 1} (${record.href || 'unknown'}): date must be ISO YYYY-MM-DD`);
      }
    }

    for (const field of REQUIRED_FIELDS) {
      const value = record[field];
      if (typeof value !== 'string') continue;
      const trimmed = value.trim();
      if (
        trimmed === '#' ||
        /^javascript:void\s*\(\s*0\s*\)$/i.test(trimmed) ||
        /TODO|lorem ipsum|example\.com/i.test(trimmed)
      ) {
        warn(`Record ${index + 1} (${record.href || 'unknown'}): placeholder-like value in '${field}'`);
      }
    }

    if (isNonEmptyString(record.href)) {
      const href = record.href.trim();
      hrefCounts.set(href, (hrefCounts.get(href) || 0) + 1);
      const signature = `${href}\u0000${record.title || ''}\u0000${record.date || ''}`;
      if (articleSignatures.has(signature)) {
        error(`Duplicate article record: '${href}' (records ${articleSignatures.get(signature)} and ${index + 1})`);
      } else {
        articleSignatures.set(signature, index + 1);
      }

      const { pathname } = splitHref(href);
      if (isExternalHref(pathname) || !/\.html$/i.test(pathname)) {
        error(`Record ${index + 1} (${href}): href must target a local HTML file`);
      } else {
        const target = resolveLocalPath(root, pathname);
        if (!target || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
          missingTargets.add(href);
          error(`Record ${index + 1} (${href}): local HTML target does not exist`);
        }
      }
    }
  });

  const duplicateHrefs = [...hrefCounts.values()].filter((count) => count > 1).length;
  for (const [href, count] of hrefCounts) {
    if (count > 1) error(`Duplicate href: '${href}' appears ${count} times`);
  }

  let htmlFiles = [];
  try {
    htmlFiles = listHtmlFiles(root);
  } catch (scanError) {
    error(`Cannot scan HTML files: ${scanError.message}`);
  }

  if (!skipOmissions) {
    const catalogHrefs = new Set(catalog.map((record) => record && record.href).filter(isNonEmptyString));
    for (const htmlFile of htmlFiles) {
      const relative = path.relative(root, htmlFile).replace(/\\/g, '/');
      const basename = path.basename(relative);
      if (DIRECTORY_PAGES.has(basename)) continue;
      if (!/^ai-(?:novinka|navod|agenti|workflow)-.+\.html$/i.test(basename)) continue;
      if (!catalogHrefs.has(relative) && !catalogHrefs.has(basename)) {
        warn(`Probable catalog omission: ${relative}`);
      }
    }
  }

  const checkedLinks = new Set();
  for (const htmlFile of htmlFiles) {
    const sourceHtml = fs.readFileSync(htmlFile, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    const linkPattern = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi;
    let match;
    while ((match = linkPattern.exec(sourceHtml)) !== null) {
      const { decoded, pathname, fragment } = splitHref(match[2]);
      if (!pathname || isExternalHref(pathname) || !/\.html$/i.test(pathname)) continue;
      const target = resolveLocalPath(root, pathname, path.dirname(htmlFile));
      const linkKey = `${htmlFile}\u0000${decoded}`;
      if (checkedLinks.has(linkKey)) continue;
      checkedLinks.add(linkKey);
      if (!target || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
        error(`Broken local link: ${path.relative(root, htmlFile).replace(/\\/g, '/')} -> ${decoded}`);
        continue;
      }
      if (fragment && !hasFragmentTarget(fs.readFileSync(target, 'utf8'), fragment)) {
        warn(`Missing fragment target: ${path.relative(root, htmlFile).replace(/\\/g, '/')} -> ${decoded}`);
      }
    }
  }

  for (const message of errors) console.error(`ERROR: ${message}`);
  for (const message of warnings) console.warn(`WARNING: ${message}`);

  console.log('Content validation');
  console.log(`Articles: ${catalog.length}`);
  console.log(`Unique hrefs: ${hrefCounts.size}`);
  console.log(`Missing targets: ${missingTargets.size}`);
  console.log(`Duplicate hrefs: ${duplicateHrefs}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  process.exitCode = errors.length > 0 ? 1 : 0;
}

main();
