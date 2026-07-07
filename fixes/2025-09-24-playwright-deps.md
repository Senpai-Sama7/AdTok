# Fix Log — 2025-09-24T23:00:23Z

1. `npx playwright install chromium`
   - Purpose: download Chromium + headless shell required by Playwright.
   - Evidence: see install transcript in shell history prior to verification runs.
2. `npx playwright install-deps`
   - Purpose: install missing system libraries so Chromium can launch.
   - Evidence: apt-get transcript captured in terminal (packages installed, finishing successfully).
3. Re-ran smoke tests via `npm run test:smoke` (captured in evidence/npm-test-smoke-20250214.txt).
