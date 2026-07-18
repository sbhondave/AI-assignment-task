# AI Navigator Log

## Service: Simple Auth Service  |  Tools Used: Cursor AI (Composer), Node.js 20, TypeScript, Express 5, Zod, jsonwebtoken, bcryptjs, Helmet, express-rate-limit, Jest, ts-jest, Supertest, Docker (multi-stage image)

## Prompts I Used

To build a functional, containerized microservice from scratch for Simple Auth Service with minimum requirement is → POST `/register`, POST `/login` (JWT), POST `/refresh` (token rotation), POST `/logout` (revoke), GET `/me` (protected route).

### Prompt 1 — [Purpose]

To build a functional, containerized microservice from scratch for Simple Auth Service with minimum requirement is → POST `/register`, POST `/login` (JWT), POST `/refresh` (token rotation), POST `/logout` (revoke), GET `/me` (protected route).

## What the AI Got Right

- Implemented the required routes end-to-end: register, login (JWT pair), refresh with rotation semantics, logout revocation, and protected `/me`.
- Used **Zod** for request-body validation and consistent **400** responses for validation failures.
- **JWT** configuration pulls secrets from environment variables with **minimum length and weak-pattern checks** (`src/config/env.ts`), not hard-coded production secrets.
- **Refresh-token reuse detection**: rotating refresh invalidates the prior session hash pattern aligned with rotation expectations.
- **Helmet** for baseline HTTP headers and **express-rate-limit** on auth routes in non-test environments.
- **Automated tests** (Jest + Supertest) covering happy paths and negative cases, including manual-case traceability in `tests/auth.test.ts`.
- **Docker** multi-stage build: compile TypeScript in a build stage and run production dependencies in a slim runtime image.

## What I Had to Fix

_List every bug, security issue, or logic error you found and corrected. For each fix: describe the problem, the AI's version, and your corrected version._

1. **Tests failing without JWT env vars**
   - **Problem:** Running `npm test` threw because `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` were unset at module load time.
   - **AI's version:** Tests assumed secrets were always exported in the shell before `npm test`.
   - **Corrected version:** Added `tests/jest-env.ts` and registered it in `jest.config.ts` under `setupFiles` so Jest sets safe **test-only** defaults before imports resolve.

2. **Flaky / failing tests due to rate limiting (`429`)**
   - **Problem:** The auth rate limiter capped requests per window; a full suite exceeded the limit and returned **429** instead of expected statuses.
   - **AI's version:** Rate limit applied unconditionally to `/register`, `/login`, `/refresh`.
   - **Corrected version:** Wrapped the limiter in `if (process.env.NODE_ENV !== "test")` in `src/app.ts` so automated tests are not throttled while production behavior stays limited.

3. **Messy `test_output.txt` capture on Windows PowerShell**
   - **Problem:** Redirecting `npm test` with `*>` pulled PowerShell-native stderr framing into the log file.
   - **AI's version:** Single-line PowerShell redirection without separating stdout/stderr cleanly.
   - **Corrected version:** Used `cmd /c "npm test > test_output.txt 2>&1"` or hand-curated the saved transcript so `test_output.txt` matches readable terminal output.

4. **Placeholder / missing deliverable files during iteration**
   - **Problem:** `manual_test_cases.md` or `jest-env.ts` were absent after workspace sync, breaking docs or Jest config.
   - **AI's version:** References existed without files on disk.
   - **Corrected version:** Restored `manual_test_cases.md`, `tests/jest-env.ts`, and aligned `jest.config.ts`.

_Add rows here for anything you changed locally that is not listed (e.g. Dockerfile `USER`, CORS, logging)._

## Security Review Checklist

- [x] All inputs validated  
- [x] No SQL/NoSQL injection vectors _(in-memory maps; no string-built queries)_  
- [x] No secrets in source code _(production secrets must come from env; test defaults only in `tests/jest-env.ts`)_  
- [ ] Error responses don't leak internals _(validation returns `details`; generic auth messages — review for your threat model)_  
- [x] Rate limiting applied _(production / non-test; auth routes)_  
- [ ] Docker runs as non-root user _(current `Dockerfile` does not set `USER`; add a non-root user in the runtime stage if required)_
