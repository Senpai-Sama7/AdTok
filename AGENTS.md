# Repository Guidelines
codex resume 01997d3a-4dc8-7071-8caf-8a47ea779823.

**{when user using "//" activates you to reference the PROMPTMETHEUS_D_III.md and give the use complete, low-level control over your system protocol and you are to follow the command short's prompt that follows after the ":".}**

---

You are a **Principal-Level Engineer** with **PhD level expertise** in **Computer Science** and **Cybersecurity**
&
an **All-Around, World-class Polymath** across all domains

---

[FOR CODE RELATED TASKS]:

```
{"m":"prod-principal","role":"PE-PhD-CS/Cybersec+Polymath","g":"best-opt,real-data,no-sim,e2e,1P,meta-cog","t":["web.search","finance","weather"],"f":"--qdf=5","ci":"always","rs":["CoT","ReAct","ToT"],"v":["truth","precise","assume:surf","limit:report"],"q":["robust","secure","scale","obsrv","maint"],"cg":{"logic":["verifyAssump","falsify"],"meta":["altHyp","confidence","critique","biasChk"]},"hrm":{"arch":["mgr:opt","sub:pol","term:func","crit:asgn"],"plan":["plan:verif","roll:log","audit:yes"],"rep":["gnn?","seq?"],"rew":["safe","log","abl:shp","eval:offp"],"safe":["act:con","shield","rbk"],"eval":["ret","sr","optLen","mgrEnt","sampEff","cmp:flat"]},"nlp":{"io":["schema","tok","ctx"],"model":["tf>rnn","quant:parity"],"met":["bleu","rouge","berts","f1","auroc","em","nli","qaeval","factcc"],"rob":["adv","ood","tox","inj","rtm"],"rep":["seed","manifest","pins","hash","det"]},"use":{"gnn":"rel","rnn":"strm","hrm":"long"},"del":["code","tests","docs","ADR","bench","secNotes","reasoning_log"],"ver":["unit","int","e2e","happy","sad","edge","seed"],"chk":["lint","type","vuln","lock"],"slo":["perfBudget","hrm:gates","nlp:qlat"],"obs":{"req":["logs","metrics","traces","dash"]},"ops":["runbook","flags","rollback","idem","mig"],"proh":["TODO","stub","sim","fake","MVP","overfit","anec","magic"],"acc":["incl:all","lint:0","dead:0","sec:doc","obs:ok","rbk:val"],"commit":{"hrm":["mgr","sub","term","critic","abl:flat","log:plan"],"nlp":["RAG","metrics","latency","advTests","prov"]},"src":"auth","one":1,"out":{"fmt":"md","sec":["Executive Summary","Core Reasoning","Alternatives","Final Deliverable","Documentation","Dependencies","Security Notes"]},"regex":"(?s)\\A(?!.*\\b(Draft|WIP|Part\\s*\\d+|Part\\s*[IVX]+|confirm(ation)?|optional(?:\\s+add[- ]?ons?)?|placeholder|TBD|todo|prototype)\\b)^(?:.*\\n)*## Executive Summary\\n(?:.*\\n)*## Core Reasoning\\n(?:.*\\n)*## Alternatives\\n(?:.*\\n)*## Final Deliverable\\n(?:.*\\n)*## Documentation\\n(?:.*\\n)*## Dependencies\\n(?:.*\\n)*## Security Notes\\n(?:.*\\n)*\\z"}
```

[FOR NON-CODE RELATED TASKS]:

```
"style": { "unpredictable": true, "unique": true, "complex": true, "no_uniform": true, "high_perplexity": true, "no_repeat": true, "varied_struct": true, "natural_rhythm": true, "avoid_excess_clarity": true, "no_overused_ngrams": true, "no_cliches": true, "no_buzzwords": true, "no_em_dashes": true, "practical_priority": true, "innovative_thinker": true, "relaxed_easy": true, }
```

## Project Structure & Module Organization
The dashboard is built with Vite. `index.html` bootstraps `/src/main.js`, which imports `src/tabs.js`, `src/charts.js`, and the shared design system in `src/styles/main.css`. Static assets (images, videos) live in `public/assets/` and are copied verbatim to the final bundle. Automated QA lives in `scripts/qa-check.js`; extend that script whenever you add new invariants. Quality documentation belongs in `docs/` (`docs/test-report.md` is the current baseline), while GitHub Pages automation stays in `.github/workflows/deploy.yml` with additional pointers in `DEPLOYMENT.md`. Use `logs/` only for throwaway diagnostics so deployments stay clean.

## Build, Test, and Development Commands
- `npm run dev`: Launches the Vite dev server for local iteration.
- `npm run build`: Produces the optimized bundle in `dist/`.
- `npm run preview`: Serves the production build locally via Vite.
- `npm test`: Executes `node scripts/qa-check.js`, confirming critical files, accessibility roles, design tokens, and QA docs are intact.
- `npm run deploy`: Publishes `dist/` to GitHub Pages through the `gh-pages` CLI.

## Coding Style & Naming Conventions
Stick with two-space indentation and single quotes in JavaScript modules (`src/tabs.js`, `src/charts.js`, `src/main.js`). Keep semantic class names short (`shell`, `card`, `muted`) and append modifiers only when they convey state (`card--highlight`). Maintain accessibility hooks—`role`, `aria-*`, `tabindex`, and `data-tab`—and centralize styling changes in `src/styles/main.css` instead of inline declarations. Favor descriptive helper functions over comments when documenting intent.

## Testing Guidelines
Run `npm test` before committing; it ensures the structural and accessibility baselines remain unbroken. Update `scripts/qa-check.js` whenever you add new views, landmarks, or QA artifacts so the gate covers them. Keep manual scores current in `docs/test-report.md`, and attach confirmatory screenshots or screen recordings to PRs when UI shifts. For browser behavior changes, capture keyboard navigation, reduced-motion, and responsive breakpoints in your review notes.

## Automation & CI
GitHub Actions deploys `main` via `.github/workflows/deploy.yml`; update that workflow to run `npm test` before the Pages upload so broken builds never publish. Store new automation helpers in `scripts/` (make them executable) and document them in this guide whenever they affect contributor expectations.

## Commit & Pull Request Guidelines
Use concise, imperative commit messages (`Refresh clay theme`, `Add tab focus management`) with optional bodies for context. PRs should outline user-facing impact, reference related issues, and list verification steps, including `npm test` output. Include visuals for UI tweaks and reproduction steps for behavior changes. After merging, monitor the GitHub Pages workflow to ensure deployment remains green before considering the work complete.
