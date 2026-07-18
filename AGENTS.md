# AI-assignment-task

This repo contains an AI training task deliverable (`AI_traning_task_project/`) with tasks 1–5.
Only **`task-2`** is a runnable application; tasks 1, 3, 4, 5 are documentation/analysis artifacts
(reports, prompts, test data, remediated snippets) and have nothing to run.

## Cursor Cloud specific instructions

### The runnable service: `AI_traning_task_project/task-2`
A containerizable Node.js + TypeScript Express **JWT auth microservice** (register / login / refresh
rotation / logout / `GET /me`). User and session state is **in-memory** and resets on every restart.
Commands below are documented in `AI_traning_task_project/task-2/README.md`; run them from that directory.

- Install: `npm install` (already run by the startup update script).
- Dev server: `npm run dev` (ts-node-dev, hot reload). Serves on `http://localhost:3000`, health at `/health`.
- Tests: `npm test` (jest, `--runInBand`).
- Build / run compiled: `npm run build` then `npm start`.
- There is **no lint script** configured for this project.

### Non-obvious gotcha — JWT secrets are required to run the server
`src/config/env.ts` validates `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` at startup. Each must be
**≥32 chars** and must **NOT** contain any of the forbidden substrings `dev-`, `change-me`, `example`,
`secret` (case-insensitive). If unset or weak, `npm run dev` / `npm start` throws and exits immediately.
Generate strong values, e.g.:

```bash
export JWT_ACCESS_SECRET=$(openssl rand -hex 24)
export JWT_REFRESH_SECRET=$(openssl rand -hex 24)
```

`npm test` does **not** need these — `tests/jest-env.ts` sets its own test secrets, and the auth rate
limiter in `src/app.ts` is disabled when `NODE_ENV=test`.
