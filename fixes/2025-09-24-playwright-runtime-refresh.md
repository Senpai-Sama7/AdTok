# Fix Log — 2025-09-24T23:19:07Z

1. `npx playwright install chromium`
   - Purpose: download Chromium + headless shell required by Playwright.
   - Evidence: see terminal transcript (chunk 0bdc31, 71bd32, b926dd, 3b2c5b).
2. `apt-get update`
   - Purpose: refresh package index before installing browser dependencies.
   - Evidence: terminal chunks 84f61b, efcf8e, 13f9ad.
3. `apt-get install -y libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libxkbcommon0 libatspi2.0-0t64 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64`
   - Purpose: install missing system libraries flagged by Playwright host validation.
   - Evidence: terminal chunks d0e731, 74f428, 6d2b47, 4ab8c0, c73992.
4. `npm run test:smoke`
   - Purpose: confirm Playwright smoke suite passes after installing dependencies.
   - Evidence: terminal chunks b51362, dae44a, a1706a, e91a7d, 35bb8e.
5. Re-run verifications and capture logs:
   - `npm test | tee evidence/npm-test-20250924T231742Z.txt` — evidence chunk dd80d9.
   - `npm run test:smoke | tee evidence/npm-test-smoke-20250924T231748Z.txt` — evidence chunks 3dcd2e, 692abc, 11fbc8, 3838f2.
