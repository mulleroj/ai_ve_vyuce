#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'templates', 'magazine');
const MANIFEST_PATH = path.join(ROOT, 'content', 'magazine', 'articles.json');
const CATALOG_PATH = path.join(ROOT, 'js', 'site-articles.js');
const checkOnly = process.argv.includes('--check');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function template(name) {
  return fs.readFileSync(path.join(TEMPLATE_DIR, `${name}.tpl`), 'utf8');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function plainText(html) {
  return decodeEntities(String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? match;
    const hex = entity[1].toLowerCase() === 'x';
    const codePoint = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
  });
}

function slugify(value) {
  return plainText(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('cs')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '') || 'sekce';
}

function idValues(markup) {
  return [...markup.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map(match => decodeEntities(match[2]));
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function buildHeadings(bodySource) {
  const headings = [];
  const nonHeadingMarkup = bodySource.replace(/<h([23])\b[^>]*>[\s\S]*?<\/h\1\s*>/gi, '');
  const nonHeadingIds = idValues(nonHeadingMarkup);
  const duplicates = duplicateValues(nonHeadingIds);
  if (duplicates.length) throw new Error(`Duplicate non-heading IDs in article body: ${duplicates.join(', ')}`);
  const usedIds = new Set(nonHeadingIds);

  const body = bodySource.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1\s*>/gi, (whole, rawLevel, attributes, innerHtml) => {
    const level = Number(rawLevel);
    const idAttribute = attributes.match(/\bid\s*=\s*(["'])(.*?)\1/i);
    const originalId = idAttribute ? decodeEntities(idAttribute[2]) : '';
    const baseId = originalId || slugify(innerHtml);
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
    usedIds.add(id);

    const headingText = plainText(innerHtml);
    const label = headingText.replace(/^\s*\d+\s*[.)\u2013\u2014:-]?\s*/u, '').trim() || headingText;
    headings.push({ level, id, label });

    const nextAttributes = idAttribute
      ? attributes.replace(idAttribute[0], `id="${escapeHtml(id)}"`)
      : `${attributes} id="${escapeHtml(id)}"`;
    return `<h${level}${nextAttributes}>${innerHtml}</h${level}>`;
  });

  return { body, headings };
}

function renderToc(headings) {
  if (!headings.length) return '';
  const sections = [];
  let currentSection = null;
  for (const heading of headings) {
    if (heading.level === 2) {
      currentSection = { heading, children: [] };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.children.push(heading);
    } else {
      sections.push({ heading, children: [] });
    }
  }

  const renderItems = items => items.map(item => {
    const nested = item.children.length
      ? `<ol>${renderItems(item.children.map(heading => ({ heading, children: [] })))}</ol>`
      : '';
    return `<li><a href="#${encodeURIComponent(item.heading.id)}">${escapeHtml(item.heading.label)}</a>${nested}</li>`;
  }).join('');
  return template('toc').replace('{{TOC_ITEMS}}', renderItems(sections));
}

function loadCatalog() {
  const context = { window: {} };
  vm.runInNewContext(read('js/site-articles.js'), context, { filename: CATALOG_PATH });
  return context.window.siteArticles;
}

function renderBreadcrumbs(items) {
  return items.map((item, index) => {
    const separator = index ? '<span aria-hidden="true">/</span>' : '';
    const label = item.current
      ? `<span aria-current="page">${escapeHtml(item.label)}</span>`
      : `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
    return `${separator}${label}`;
  }).join('');
}

function renderHeroImage(image) {
  if (!image) return '';
  const picture = image.srcSet
    ? `<picture><source srcset="${escapeHtml(image.srcSet)}" type="image/webp" /><img class="philosophy-cover-image" src="${escapeHtml(image.src)}" width="${Number(image.width)}" height="${Number(image.height)}" alt="${escapeHtml(image.alt)}" fetchpriority="high" decoding="async" /></picture>`
    : `<img class="philosophy-cover-image" src="${escapeHtml(image.src)}" width="${Number(image.width)}" height="${Number(image.height)}" alt="${escapeHtml(image.alt)}" fetchpriority="high" decoding="async" />`;
  return `<figure class="philosophy-hero-cover"><a href="${escapeHtml(image.href)}" aria-label="${escapeHtml(image.label)}">${picture}</a></figure>`;
}

function renderHighlights(article) {
  if (!article.heroHighlights?.length) return '';
  const items = article.heroHighlights.map((item, index) => `<li><span class="magazine-highlight-number">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.summary)}</small></span></li>`).join('');
  return `<ul class="magazine-hero-highlights" aria-label="${escapeHtml(article.heroHighlightsLabel || 'Hlavní témata článku')}">${items}</ul>`;
}

function renderHero(article, catalogEntry) {
  const meta = [`<span><time datetime="${escapeHtml(catalogEntry.date)}">${escapeHtml(catalogEntry.dateLabel)}</time></span>`, ...(article.metaLabels || []).map(label => `<span>${escapeHtml(label)}</span>`)].join('');
  return template('hero')
    .replace('{{BREADCRUMBS}}', renderBreadcrumbs(article.breadcrumbs || []))
    .replace('{{EYEBROW}}', escapeHtml(article.eyebrow || catalogEntry.category))
    .replace('{{HERO_TITLE}}', article.heroTitleHtml)
    .replace('{{HERO_LEAD}}', escapeHtml(article.heroLead || ''))
    .replace('{{HERO_META}}', meta)
    .replace('{{HERO_HIGHLIGHTS}}', renderHighlights(article))
    .replace('{{HERO_IMAGE}}', renderHeroImage(article.heroImage));
}

function renderIntro(article, catalogEntry) {
  return template('intro')
    .replace('{{INTRO_SUMMARY}}', escapeHtml(article.introSummary || catalogEntry.summary))
    .replace('{{DATE}}', escapeHtml(catalogEntry.date))
    .replace('{{DATE_LABEL}}', escapeHtml(catalogEntry.dateLabel))
    .replace('{{CATEGORY}}', escapeHtml(article.introCategory || catalogEntry.category));
}

function renderRelated(article) {
  if (!article.related?.length) return '';
  const cards = article.related.map(item => `<a class="workflow-related-card" href="${escapeHtml(item.href)}"><span class="workflow-card-number">${escapeHtml(item.number || '→')}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p></a>`).join('\n');
  return template('related')
    .replaceAll('{{RELATED_HEADING_ID}}', escapeHtml(`${article.articleId}-related`))
    .replace('{{RELATED_HEADING}}', escapeHtml(article.relatedHeading || 'Další články'))
    .replace('{{RELATED_LEAD}}', escapeHtml(article.relatedLead || ''))
    .replace('{{RELATED_CARDS}}', cards);
}

function renderFooter(article) {
  const links = (article.footerLinks || []).map(link => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join(' · ');
  return template('footer').replace('{{FOOTER_LINKS}}', links);
}

function renderSeo(article, catalogEntry) {
  const title = `${catalogEntry.title} | AI ve Výuce`;
  const seo = article.seo || {};
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description || catalogEntry.summary)}" />`,
    `<meta property="article:published_time" content="${escapeHtml(catalogEntry.date)}" />`,
    `<link rel="canonical" href="${escapeHtml(article.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle || title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription || seo.description || catalogEntry.summary)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.ogUrl || article.canonical)}" />`,
    '<meta property="og:type" content="article" />',
    '<meta property="og:locale" content="cs_CZ" />'
  ];
  if (seo.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`);
    if (seo.ogImageAlt) tags.push(`<meta property="og:image:alt" content="${escapeHtml(seo.ogImageAlt)}" />`);
  }
  return tags.join('\n  ');
}

function validateRendered(html, article) {
  const ids = idValues(html);
  const duplicates = duplicateValues(ids);
  if (duplicates.length) throw new Error(`${article.file}: duplicate IDs: ${duplicates.join(', ')}`);
  const idSet = new Set(ids);
  const missingAnchors = [...html.matchAll(/href="#([^"]+)"/g)]
    .map(match => decodeURIComponent(match[1]))
    .filter(id => !idSet.has(id));
  if (missingAnchors.length) throw new Error(`${article.file}: missing anchor targets: ${missingAnchors.join(', ')}`);
  const localLinks = [...html.matchAll(/href="([^"#][^"]*)"/g)].map(match => match[1]);
  for (const link of localLinks) {
    if (/^(?:https?:|mailto:|tel:|\/)/i.test(link)) continue;
    const target = link.split(/[?#]/, 1)[0];
    if (target && !fs.existsSync(path.join(ROOT, target))) throw new Error(`${article.file}: missing local link target ${link}`);
  }
}

function renderArticle(article, catalogEntry) {
  if (!catalogEntry) throw new Error(`${article.file}: no matching central-catalog record`);
  if (catalogEntry.contentType !== 'magazine') throw new Error(`${article.file}: set contentType to 'magazine' only after applying this template`);
  if (!catalogEntry.date || !catalogEntry.dateLabel) throw new Error(`${article.file}: catalog date metadata is incomplete`);
  const sourceBody = read(article.bodySource);
  const { body, headings } = buildHeadings(sourceBody);
  const toc = renderToc(headings);
  const rendered = template('page')
    .replace('{{SEO_META}}', renderSeo(article, catalogEntry))
    .replace('{{NAVIGATION}}', template('navigation'))
    .replace('{{HERO}}', renderHero(article, catalogEntry))
    .replace('{{GRID_CLASS}}', toc ? '' : ' magazine-reading-grid-no-toc')
    .replace('{{TOC}}', toc)
    .replace('{{ARTICLE_ID}}', escapeHtml(article.articleId))
    .replace('{{INTRO}}', renderIntro(article, catalogEntry))
    .replace('{{ARTICLE_BODY}}', `<div class="article-content">${body}</div>`)
    .replace('{{BACK_TO_TOP}}', template('back-to-top'))
    .replace('{{RELATED}}', renderRelated(article))
    .replace('{{FOOTER}}', renderFooter(article))
    .replace('{{ARTICLE_SCRIPTS}}', (article.articleScripts || []).map(script => `<script src="${escapeHtml(script)}" defer></script>`).join('\n  '))
    .replace(/^[\t ]+$/gm, '');
  validateRendered(rendered, article);
  const headingText = plainText(article.heroTitleHtml.replace(/<\/h1>/i, ''));
  if (headingText !== catalogEntry.title.replace(/\s+/g, ' ').trim()) {
    throw new Error(`${article.file}: hero H1 must match the catalog title`);
  }
  return { html: rendered, headingCount: headings.length };
}

function main() {
  const articles = JSON.parse(read(path.relative(ROOT, MANIFEST_PATH)));
  const catalog = loadCatalog();
  const catalogByHref = new Map(catalog.map(entry => [entry.href, entry]));
  const seenFiles = new Set();
  for (const article of articles) {
    if (seenFiles.has(article.file)) throw new Error(`Duplicate output file: ${article.file}`);
    seenFiles.add(article.file);
    const catalogEntry = catalogByHref.get(article.file);
    const { html, headingCount } = renderArticle(article, catalogEntry);
    const destination = path.join(ROOT, article.file);
    if (checkOnly) {
      const currentHtml = fs.existsSync(destination) ? fs.readFileSync(destination, 'utf8').replace(/\r\n/g, '\n') : null;
      if (currentHtml !== html.replace(/\r\n/g, '\n')) {
        throw new Error(`${article.file}: generated HTML is out of date; run node scripts/build-magazine-articles.js`);
      }
      console.log(`OK ${article.file}: ${headingCount} headings, static body and generated table of contents`);
    } else {
      fs.writeFileSync(destination, html, 'utf8');
      console.log(`Wrote ${article.file}: ${headingCount} headings, static body and generated table of contents`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
