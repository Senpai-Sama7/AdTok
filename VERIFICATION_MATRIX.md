| ID | Feature | Command | Expected signal | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| FEAT-001 | Production build emits relative asset URLs | npm run build | dist/index.html references ./assets/ URLs | VERIFIED | [npm-build-20250214.txt](evidence/npm-build-20250214.txt) |
| FEAT-002 | Automated QA gate verifies structure & accessibility | npm test | All automated QA checks passed. | VERIFIED | [npm-test-20250924T231742Z.txt](evidence/npm-test-20250924T231742Z.txt) |
| FEAT-003 | Tab navigation maintains aria state across sidebar and header | npm run test:smoke | Sidebar navigation updates aria state and reveals panel | VERIFIED | [npm-test-smoke-20250924T231748Z.txt](evidence/npm-test-smoke-20250924T231748Z.txt) |
| FEAT-004 | Charts render crisply at device pixel ratio | npm run test:smoke | Charts initialize with non-zero canvas dimensions | VERIFIED | [npm-test-smoke-20250924T231748Z.txt](evidence/npm-test-smoke-20250924T231748Z.txt) |
