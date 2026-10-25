# Package Contents

| File | Purpose |
|---|---|
| `README_FIRST.md` | Quick start and guardrails |
| `01_IMPLEMENTATION_PLAN.md` | Phased implementation plan |
| `02_CURSOR_MASTER_PROMPT.md` | Main Cursor instructions |
| `03_CURSOR_STEP_PROMPTS.md` | Prompts to run sequentially |
| `04_ACCEPTANCE_CHECKLIST.md` | Definition of done |
| `05_AI_ARCHITECTURE.md` | Deterministic + optional AI design |
| `06_ENV_SETUP.md` | Server-side environment guidance |
| `reference/topic-catalog.ts` | Editorial topic copy based on the existing six-topic contract |
| `reference/ai-system-prompt.md` | Constrained server-side model prompt |
| `reference/ai-output-schema.json` | Example strict JSON schema for AI output |
| `reference/manual-test-cases.md` | Sample tests and expected behaviors |

The TypeScript reference catalog intentionally imports from the intended source path and may need its import adjusted when copied into the app. Cursor must adapt it to the actual repository instead of overwriting files blindly.
