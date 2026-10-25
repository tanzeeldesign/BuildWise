# Environment and Deployment Setup

This guide applies only if the optional server-side AI enhancement is implemented.

## 1. Keep secrets server-side

Use the environment variable convention supported by the actual backend/deployment platform. A generic example is:

```env
AI_PROVIDER=your-chosen-provider
AI_API_KEY=replace-with-your-server-side-secret
AI_MODEL=your-selected-model
BUILDWISE_AI_ENABLED=false
```

These names are examples, not mandatory names. Cursor should follow existing repository conventions and document the actual names it implements.

Do not use `VITE_AI_API_KEY`, `NEXT_PUBLIC_AI_API_KEY`, or any variable intended to be exposed to browser code for a secret key.

## 2. Local development

- Add secret values to the backend's local `.env` file or the platform's supported local secret mechanism.
- Ensure `.env` files containing secrets are gitignored.
- Commit only a sanitized `.env.example` with placeholder values.
- Start the frontend and backend using the repository's actual scripts.
- Keep `BUILDWISE_AI_ENABLED=false` until the fallback and response validation are tested.

## 3. Deployment

- Add the provider secret in the hosting platform's server-side environment/secret settings.
- Deploy the API/serverless route with the frontend.
- Confirm the endpoint is not exposing the key in response bodies, logs, or static assets.
- Test disabled mode and provider-failure mode in production-like conditions.

## 4. Cost and quota controls

- Set a conservative output token limit.
- Add a request timeout.
- Avoid sending repeated requests for unchanged answers if the app has a suitable existing cache strategy.
- Add rate limits if supported by the current backend.
- Monitor provider quotas and errors without logging raw homeowner answers.
- Do not promise a provider's free tier will remain available.
