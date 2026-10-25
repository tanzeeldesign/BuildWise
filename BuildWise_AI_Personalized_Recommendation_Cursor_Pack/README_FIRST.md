# BuildWise — AI Personalized Recommendations Implementation Pack

This pack is designed to be given to Cursor alongside your existing BuildWise repository. It is an implementation guide and reference package, not a replacement for your current app.

## Important constraints

- Preserve the existing UI and user flow. Do not rebuild screens.
- Treat the existing project files as the source of truth:
  - `src/features/buildwise/types.ts`
  - `src/features/buildwise/recommendations.ts`
  - UI consumers: `PlanHub`, `Guide`, `FinalPlan`, and `Profile`
- Keep the existing `Answers`, `TopicId`, `TopicContent`, and `BuiltPlan` contracts unless repository inspection proves they differ. If they differ, report the discrepancy and adapt without breaking existing consumers.
- Keep exactly these six topic IDs: `orientation`, `ventilation`, `sunlight`, `materials`, `spatial`, `design-direction`.
- Do not introduce new screens, a new database, training/fine-tuning, live weather, or unrelated dependencies.
- Build a deterministic/offline recommendation path first. Add AI generation only through a secure server-side endpoint and retain a safe fallback.
- Never expose an AI provider API key in browser code or a `VITE_*`, `NEXT_PUBLIC_*`, or other public client-side environment variable.

## Suggested workflow

1. Open the existing BuildWise repository in Cursor.
2. Add this pack's files to the repository root or keep the ZIP extracted in a nearby folder.
3. Open `02_CURSOR_MASTER_PROMPT.md` and paste it into Cursor Agent mode.
4. Ask Cursor to complete Step 1 only from `03_CURSOR_STEP_PROMPTS.md`: inspect the repository and report its plan before editing.
5. Review the report. Then run Steps 2–6 in order, one at a time.
6. Use `04_ACCEPTANCE_CHECKLIST.md` to verify the implementation.
7. Do not enable live AI until the deterministic fallback and tests pass.
8. If you want live AI, configure a server-side provider key using the repository's existing backend/serverless conventions.

## What this pack contains

- `01_IMPLEMENTATION_PLAN.md` — phases, architecture, and deliverables.
- `02_CURSOR_MASTER_PROMPT.md` — main instructions to Cursor.
- `03_CURSOR_STEP_PROMPTS.md` — smaller prompts to run in order.
- `04_ACCEPTANCE_CHECKLIST.md` — functional, security, and regression checks.
- `05_AI_ARCHITECTURE.md` — safe local-first + optional AI architecture.
- `06_ENV_SETUP.md` — environment-variable and deployment guidance.
- `reference/topic-catalog.ts` — copy/content catalog matching the supplied contract.
- `reference/ai-system-prompt.md` — prompt for the server-side AI provider.
- `reference/ai-output-schema.json` — constrained example output contract for AI.
- `reference/manual-test-cases.md` — sample answer sets and expected behavior.

## Product recommendation

For the first release, the app should personalize recommendations using the existing answer data and local topic catalog. This works without an AI API, has predictable output, costs nothing per request, and avoids sending homeowner data to a third party. The optional AI layer can then rewrite/explain recommendations using validated input and strict structured output. AI must not invent engineering specifications, prices, approvals, or safety guarantees.
