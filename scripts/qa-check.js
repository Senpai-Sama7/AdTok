#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const requiredFiles = [
  'index.html',
  path.join('src', 'styles', 'main.css'),
  path.join('src', 'main.js'),
  path.join('src', 'tabs.js'),
  path.join('src', 'charts.js'),
  path.join('docs', 'test-report.md'),
  path.join('.github', 'workflows', 'deploy.yml'),
  'vite.config.mjs'
];

let failed = false;

function report(ok, message) {
  const icon = ok ? '✔' : '✖';
  console.log(`${icon} ${message}`);
  if (!ok) {
    failed = true;
  }
}

function expect(condition, successMessage, failureMessage) {
  if (condition) {
    report(true, successMessage);
  } else {
    report(false, failureMessage);
  }
}

function readFile(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

// Check that the required files exist.
requiredFiles.forEach((relativePath) => {
  const fullPath = path.join(repoRoot, relativePath);
  expect(fs.existsSync(fullPath), `Found ${relativePath}`, `Missing ${relativePath}`);
});

// Stop early if key files are missing.
if (failed) {
  process.exit(1);
}

const indexHtml = readFile('index.html');
const stylesheet = readFile(path.join('src', 'styles', 'main.css'));
const mainJs = readFile(path.join('src', 'main.js'));
const tabsJs = readFile(path.join('src', 'tabs.js'));
const chartsJs = readFile(path.join('src', 'charts.js'));
const qaReport = readFile(path.join('docs', 'test-report.md'));
const viteConfig = readFile('vite.config.mjs');

// Ensure the HTML references the bundled assets and accessibility landmarks.
expect(/type="module"\s+src="\/src\/main\.js"/.test(indexHtml), 'index.html loads Vite entry module', 'index.html missing module script for /src/main.js');
expect(/role="tablist"/.test(indexHtml), 'Navigation preserves tablist roles', 'Navigation missing tablist role');
expect(/aria-/.test(indexHtml), 'ARIA attributes present', 'Expected ARIA attributes in index.html');
expect(/loading="lazy"/.test(indexHtml), 'Images opt into lazy loading where applicable', 'Expected lazy-loading attributes in index.html');
expect(/base:\s*['"]\.\//.test(viteConfig), 'vite.config.mjs sets relative base for GitHub Pages', 'Missing relative base=\'./\' in vite.config.mjs');

// Verify tab panels reference existing labels and a default-visible panel is available.
const idMatches = [...indexHtml.matchAll(/id="([^"]+)"/g)]
  .map(match => match[1]);
const knownIds = new Set(idMatches);
const labelledByMatches = [...indexHtml.matchAll(/aria-labelledby="([^"]+)"/g)];
const labelledByValid = labelledByMatches.every(match => {
  return match[1].split(/\s+/).every(labelId => knownIds.has(labelId));
});
expect(labelledByValid, 'Tab panels reference valid aria-labelledby IDs', 'aria-labelledby points to missing IDs');

const sectionMatches = [...indexHtml.matchAll(/<section[^>]+class="([^"]*)"/g)];
const hasVisiblePanel = sectionMatches.some(match => {
  const classes = match[1].split(/\s+/);
  return classes.includes('view') && !classes.includes('hidden');
});
expect(hasVisiblePanel, 'Default tab panel visible without JavaScript', 'No visible tab panel defined for baseline');

['line', 'bars', 'pie', 'gantt'].forEach(canvasId => {
  expect(indexHtml.includes(`id="${canvasId}"`), `Found canvas #${canvasId}`, `Missing canvas #${canvasId}`);
});

// Basic checks on CSS variables to keep them discoverable.
expect(/:root\s*{[^}]*--bg:/s.test(stylesheet), 'Design tokens defined in :root', 'Missing design tokens in styles.css');
expect(/--brand/.test(stylesheet), 'Brand color variables present', 'Missing brand color variables');
expect(!/[\x00-\x08\x0B-\x0C\x0E-\x1F]/.test(stylesheet), 'styles/main.css has printable characters only', 'Control characters detected in styles/main.css');

// Sanity checks on the JS tab system.
expect(/export\s+function\s+switchToTab/.test(tabsJs), 'Tab switcher exported', 'Tab switcher function missing');
expect(/addEventListener\(\s*'keydown'/.test(tabsJs), 'Keyboard navigation wired', 'Keyboard navigation handler missing');
expect(/export\s+function\s+initializeAllCharts/.test(chartsJs), 'Chart initializer exported', 'Chart initializer function missing');
expect(!/[\x00-\x08\x0B-\x0C\x0E-\x1F]/.test(mainJs + tabsJs + chartsJs), 'Source modules contain printable characters only', 'Detected control characters in source modules');

// Confirm the QA document still reads like a test report.
expect(/Test Report:/i.test(qaReport), 'docs/test-report.md retains heading', 'Test report heading missing');
expect(/Overall Quality/i.test(qaReport), 'QA report publishes overall score', 'Test report missing overall score');

if (failed) {
  console.error('\nAutomated QA gate failed. Review the messages above.');
  process.exit(1);
}

console.log('\nAll automated QA checks passed.');
