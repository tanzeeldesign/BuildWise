# Acceptance Checklist

## Compatibility
- [ ] Existing `Answers`, `TopicId`, `TopicContent`, and `BuiltPlan` contracts remain compatible.
- [ ] Only the six existing topic IDs are used.
- [ ] `buildPlan`, `getTopic`, and `nextTopicId` exports/signatures remain compatible.
- [ ] PlanHub, Guide, FinalPlan, and Profile still work.
- [ ] No screens, navigation, or database were added.

## Personalization
- [ ] Priority mappings match the existing rules.
- [ ] Climate mappings match the existing rules.
- [ ] City fallback matches the existing rules.
- [ ] Existing multi-priority tie-breaking is preserved and tested.
- [ ] Location, climate, style, plot, family, outdoor, and future values are inserted where relevant.
- [ ] Missing values use graceful defaults.
- [ ] No output contains `undefined`, `null`, or unresolved `{placeholder}` tokens.
- [ ] Same input produces the same deterministic plan.
- [ ] Content is short, useful, non-repetitive, and suitable for Pakistani residential planning.

## AI (if implemented)
- [ ] AI is optional and feature-flagged.
- [ ] Ranking is deterministic; AI cannot change topic IDs or ranking.
- [ ] Provider key exists only on the server.
- [ ] No secret is exposed in a browser bundle or public environment variable.
- [ ] Request payload is validated and size-limited.
- [ ] Response is validated against the expected schema.
- [ ] Timeout, rate limit, malformed output, and provider outage all fall back safely.
- [ ] User answers/prompts are not logged by default.
- [ ] No AI-generated structural dimensions, code claims, prices, or guarantees are presented as facts.
- [ ] AI can be disabled and app still builds/renders.

## Verification
- [ ] Existing lint command passes.
- [ ] Existing typecheck command passes.
- [ ] Existing tests pass.
- [ ] Production build passes.
- [ ] Manual tests in `reference/manual-test-cases.md` pass.
- [ ] Cursor reports exact commands and actual results.
