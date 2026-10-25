# Recommended AI Architecture

## Use a local-first hybrid

The app should not depend on AI to create a plan. Use two layers:

### Layer A — deterministic recommendation engine (required)
- Input: existing `Answers`.
- Output: existing `BuiltPlan`.
- Owns topic ranking, topic IDs, stable copy, profile summaries, and fallback behavior.
- Runs locally with no API key, no network, and no per-request model cost.
- This is the canonical plan and must always render.

### Layer B — optional AI editorial enhancement (optional)
- Input: minimum required answer fields plus the already-selected `topTopicId` and deterministic topic content.
- Output: a small validated object such as a short personalized summary and perhaps revised explanation text.
- May clarify why the chosen topic matters for this household.
- Cannot alter ranking, topic IDs, answer values, or app schema.
- Must fall back to Layer A on any failure.

## Request flow

```text
Onboarding answers
      |
      v
Validate / normalize answers
      |
      v
Deterministic buildPlan(answers) ---------> Render plan immediately
      |
      +---- optional request to secure server endpoint
                         |
                         v
                 Validate minimal payload
                         |
                         v
                  AI provider adapter
                         |
                         v
                 Validate model response
                         |
                         v
             Accept safe text fields only
                         |
                         v
                Enhance text if valid
```

## Why not train a model?

No model training or fine-tuning is required for this feature. The user's answers are structured preferences; rules and a curated content catalog are enough to produce consistent personalization. A language model can optionally make explanations feel more conversational, but it should not be trusted to decide architectural feasibility or provide professional engineering advice.

## Privacy and security

- Do not send names, contact details, precise addresses, or unrelated profile data to the AI provider.
- Send only answer values necessary for the selected recommendation.
- Do not log raw prompts/answers by default.
- Do not put provider API keys in client code.
- Validate input against known enum values and cap the number of priorities at three.
- Validate AI output and reject unknown fields/topic IDs.
- Apply request timeout and basic abuse/rate-limit controls appropriate to the existing backend.
- Follow the repository's existing deployment and secret-management practices.

## Provider choice

Use whichever provider the project owner selects and which is supported by the deployed server-side environment. Do not assume a free tier is permanent or available in production. Provider prices, quotas, and model availability change. Keep provider-specific code behind a small adapter so the recommendation engine remains provider-independent.

## If the repository has no backend

Do not call a paid/secret-key AI API directly from the browser. Keep AI disabled and working locally. Ask the owner to choose among:
1. A serverless function compatible with the current hosting platform.
2. A small existing or new backend service.
3. Staying deterministic-only for the prototype.

Do not silently create infrastructure that cannot be deployed with the current app.
