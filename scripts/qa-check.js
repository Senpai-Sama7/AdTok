#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const requiredFiles = [
  'index.html',
  path.join('assets', 'styles.css'),
  path.join('assets', 'app.js'),
  path.join('docs', 'test-report.md'),
  path.join('.github', 'workflows', 'deploy.yml')
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
const stylesheet = readFile(path.join('assets', 'styles.css'));
const appJs = readFile(path.join('assets', 'app.js'));
const qaReport = readFile(path.join('docs', 'test-report.md'));

// Ensure the HTML references the bundled assets and accessibility landmarks.
expect(/assets\/styles\.css/.test(indexHtml), 'index.html links styles.css', 'index.html missing styles.css link');
expect(/assets\/app\.js/.test(indexHtml), 'index.html links app.js', 'index.html missing app.js script');
expect(/role="tablist"/.test(indexHtml), 'Navigation preserves tablist roles', 'Navigation missing tablist role');
expect(/aria-/.test(indexHtml), 'ARIA attributes present', 'Expected ARIA attributes in index.html');

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

// Sanity checks on the JS tab system.
expect(/function\s+switchToTab/.test(appJs), 'Tab switcher exported', 'Tab switcher function missing');
expect(/addEventListener\(\'keydown\'/.test(appJs), 'Keyboard navigation wired', 'Keyboard navigation handler missing');

// Confirm the QA document still reads like a test report.
expect(/Test Report:/i.test(qaReport), 'docs/test-report.md retains heading', 'Test report heading missing');
expect(/Overall Quality/i.test(qaReport), 'QA report publishes overall score', 'Test report missing overall score');

if (failed) {
  console.error('\nAutomated QA gate failed. Review the messages above.');
  process.exit(1);
}

console.log('\nAll automated QA checks passed.');
