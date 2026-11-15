#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { PAGE_FILES, snapshotPage } = require('./subject-pages-baseline');

const sourceDir = path.resolve(process.argv[2] || '');
const outputPath = path.resolve(process.argv[3] || '');
const baselineSha = process.env.SUBJECT_PAGES_BASELINE_SHA;
if (!process.argv[2] || !process.argv[3] || !baselineSha) {
  throw new Error('Usage: SUBJECT_PAGES_BASELINE_SHA=<sha> node scripts/capture-subject-pages-baseline.js <source-dir> <output-json>');
}
const pages = {};
for (const file of PAGE_FILES) {
  const inputPath = path.join(sourceDir, file);
  if (!fs.existsSync(inputPath)) throw new Error('Missing baseline page: ' + inputPath);
  pages[file] = snapshotPage(fs.readFileSync(inputPath, 'utf8'));
}
fs.writeFileSync(outputPath, JSON.stringify({ baselineSha, captureVersion: 1, pages }, null, 2) + '\n');
