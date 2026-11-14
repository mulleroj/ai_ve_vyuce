'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
const virtualRoot = path.join(path.parse(projectRoot).root, 'wave17-magazine-generator-isolated-test');
const generatorPath = 'scripts/build-magazine-articles.js';
const fixturePaths = [
  generatorPath,
  'content/magazine/articles.json',
  'content/magazine/ai-novinka-ai-duvod-premyslet.body',
  'content/magazine/ai-novinka-ai-ve-vzdelavani-zari-2026.body',
  'js/site-articles.js',
  'templates/magazine/page.tpl',
  'templates/magazine/toc.tpl',
  'templates/magazine/hero.tpl',
  'templates/magazine/intro.tpl',
  'templates/magazine/related.tpl',
  'templates/magazine/back-to-top.tpl',
  'templates/magazine/footer.tpl',
  'templates/site-navigation.tpl',
  'ai-novinka-ai-duvod-premyslet.html',
  'ai-novinka-ai-ve-vzdelavani-zari-2026.html'
];
const outputs = ['ai-novinka-ai-duvod-premyslet.html', 'ai-novinka-ai-ve-vzdelavani-zari-2026.html'];
const original = new Map(fixturePaths.map(file => [file, fs.readFileSync(path.join(projectRoot, file), 'utf8')]));
const repoFs = fs;

function invoke(changes = new Map(), checkOnly = false) {
  const files = new Map(original);
  for (const [file, value] of changes) files.set(file, value);
  const written = new Map();
  const stdout = [];
  const stderr = [];
  const virtualPath = file => {
    const absolute = path.resolve(file);
    const relative = path.relative(virtualRoot, absolute);
    return relative && !relative.startsWith('..' + path.sep) && relative !== '..' ? relative.replaceAll(path.sep, '/') : null;
  };
  const fsProxy = {
    readFileSync(file, encoding) {
      const relative = virtualPath(file);
      if (relative !== null && files.has(relative)) return files.get(relative);
      return repoFs.readFileSync(file, encoding);
    },
    existsSync(file) {
      const relative = virtualPath(file);
      if (relative !== null && (files.has(relative) || written.has(relative))) return true;
      if (relative !== null) return repoFs.existsSync(path.join(projectRoot, relative));
      return repoFs.existsSync(file);
    },
    writeFileSync(file, value) {
      const relative = virtualPath(file);
      if (relative === null) throw new Error('Unexpected write outside isolated fixture');
      written.set(relative, String(value));
    }
  };
  const processProxy = { argv: ['node', generatorPath].concat(checkOnly ? ['--check'] : []), exitCode: 0 };
  const context = {
    require(name) {
      if (name === 'node:fs') return fsProxy;
      if (name === 'node:path') return path;
      if (name === 'node:vm') return vm;
      throw new Error('Unexpected module: ' + name);
    },
    __dirname: path.join(virtualRoot, 'scripts'),
    process: processProxy,
    console: { log: line => stdout.push(line), error: line => stderr.push(line) }
  };
  vm.runInNewContext(files.get(generatorPath).replace(/^#!.*\n/, ''), context, { filename: generatorPath });
  return { exitCode: processProxy.exitCode, stdout, stderr, files, written };
}

function negative(name, changes, expectedMessage) {
  const result = invoke(changes);
  assert.equal(result.exitCode, 1, name + ' must be rejected');
  assert.match(result.stderr.join('\n'), expectedMessage, name + ' should report its cause');
  return name;
}

const first = invoke();
assert.equal(first.exitCode, 0, 'the baseline manifest must generate');
for (const output of outputs) {
  assert.equal(first.written.get(output), original.get(output), output + ' must match the committed generator output');
}
const beforeHashes = outputs.map(output => first.written.get(output));
const checkBefore = invoke(new Map(outputs.map(output => [output, original.get(output)])), true);
assert.equal(checkBefore.exitCode, 0, '--check must pass before regeneration');
const second = invoke(new Map(outputs.map(output => [output, first.written.get(output)])));
assert.equal(second.exitCode, 0, 'the second generation must succeed');
assert.deepEqual(outputs.map(output => second.written.get(output)), beforeHashes, 'repeated generation must be byte stable');
const checkAfter = invoke(new Map(outputs.map(output => [output, second.written.get(output)])), true);
assert.equal(checkAfter.exitCode, 0, '--check must pass after repeated generation');

const fixtureBodyPath = 'content/magazine/ai-novinka-ai-duvod-premyslet.body';
const fixtureBody = original.get(fixtureBodyPath);
const fixtureWithGeneratedIds = fixtureBody + '\n<div id="fixture-non-heading-id"></div>\n<a href="#fixture-non-heading-id">odkaz na původní ID</a>\n<h2 id="fixture-existing-heading-id">Existující veřejná kotva</h2>\n<h2>Česká příručka</h2>\n<h2>Česká příručka</h2>\n';
const idFixture = invoke(new Map([[fixtureBodyPath, fixtureWithGeneratedIds]]));
assert.equal(idFixture.exitCode, 0, 'the ID fixture must generate');
const idOutput = idFixture.written.get(outputs[0]);
for (const expected of ['id="fixture-existing-heading-id" tabindex="-1"', 'id="ceska-prirucka" tabindex="-1"', 'id="ceska-prirucka-2" tabindex="-1"', 'id="fixture-non-heading-id"']) {
  assert.ok(idOutput.includes(expected), 'ID fixture should preserve or generate ' + expected);
}

const scenarios = [];
scenarios.push(negative('duplicate non-heading IDs', new Map([[fixtureBodyPath, fixtureBody + '\n<span id="duplicate-fixture"></span><span id="duplicate-fixture"></span>']]), /Duplicate non-heading IDs/));
scenarios.push(negative('duplicate authored heading IDs', new Map([[fixtureBodyPath, fixtureBody + '\n<h2 id="princip-1">Duplicitní veřejná kotva</h2>']]), /Duplicate heading ID/));
scenarios.push(negative('missing fragment target', new Map([[fixtureBodyPath, fixtureBody + '\n<a href="#missing-fixture-anchor">chybějící kotva</a>']]), /missing anchor targets/));
const manifest = JSON.parse(original.get('content/magazine/articles.json'));
const missingLocalManifest = JSON.parse(JSON.stringify(manifest));
missingLocalManifest[0].related[0].href = 'wave17-missing-local-target.html';
scenarios.push(negative('missing local link target', new Map([['content/magazine/articles.json', JSON.stringify(missingLocalManifest, null, 2)]]), /missing local link target/));

function catalogSource(entries) {
  return 'window.siteArticles = ' + JSON.stringify(entries) + ';';
}
function catalogEntries() {
  const context = { window: {} };
  vm.runInNewContext(original.get('js/site-articles.js'), context);
  return context.window.siteArticles;
}
const entriesWithoutFirst = catalogEntries().filter(entry => entry.href !== manifest[0].file);
scenarios.push(negative('missing catalog record', new Map([['js/site-articles.js', catalogSource(entriesWithoutFirst)]]), /no matching central-catalog record/));
const wrongTitle = catalogEntries();
wrongTitle.find(entry => entry.href === manifest[0].file).title = 'Název mimo katalog';
scenarios.push(negative('catalog H1 mismatch', new Map([['js/site-articles.js', catalogSource(wrongTitle)]]), /hero H1 must match the catalog title/));
const missingDate = catalogEntries();
missingDate.find(entry => entry.href === manifest[0].file).date = '';
scenarios.push(negative('missing publication date', new Map([['js/site-articles.js', catalogSource(missingDate)]]), /catalog date metadata is incomplete/));

process.stdout.write(JSON.stringify({
  checkBeforeRegeneration: 'passed',
  generationRuns: 2,
  repeatedGenerationByteStable: true,
  checkAfterRegeneration: 'passed',
  idFixtures: ['existing public heading ID', 'non-heading ID', 'Czech diacritics slug', 'numeric suffix -2'],
  negativeScenarios: scenarios
}, null, 2) + '\n');
