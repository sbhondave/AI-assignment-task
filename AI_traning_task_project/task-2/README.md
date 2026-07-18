# Simple Auth Service

Containerized authentication microservice (Node.js + TypeScript) with JWT access tokens, refresh token rotation, and logout (revocation).

## Layout

| Path | Purpose |
|------|---------|
| `src/` | Application source |
| `tests/` | Jest + Supertest tests |
| `Dockerfile` | Production image build |
| `docker-compose.yml` | Run app in a container |
| `README.md` | This file (setup + API) |
| `ai_build_log.md` | Navigator / build log |
| `test_results.txt` | Last captured `npm test` output (regenerate locally) |

## Prerequisites

- Node.js 20+
- npm
- Docker Desktop (optional, for container run)

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `JWT_ACCESS_SECRET` | _(required)_ | Secret for access JWT (must be strong, >=32 chars) |
| `JWT_REFRESH_SECRET` | _(required)_ | Secret for refresh JWT (must be strong, >=32 chars) |
| `JWT_ISSUER` | `simple-auth-service` | JWT issuer claim |
| `JWT_AUDIENCE` | `simple-auth-clients` | JWT audience claim |
| `ACCESS_TOKEN_TTL_SECONDS` | `900` | Access token lifetime (seconds) |
| `REFRESH_TOKEN_TTL_SECONDS` | `604800` | Refresh token lifetime (seconds) |

Use strong secrets in production.

## Local setup

```bash
cd task-2
npm install
npm run dev
```

Service: `http://localhost:3000`  
Health: `GET http://localhost:3000/health`

### Build and run (compiled JS)

```bash
npm run build
npm start
```

### Tests

```bash
npm test
```

To refresh `test_results.txt` (Windows `cmd`):

```cmd
npm test > test_results.txt 2>&1
```

## Docker

Build and run:

```bash
docker compose up --build
```

App listens on port **3000** (mapped to host `3000`).

Stop:

```bash
docker compose down
```

## API reference

Base URL: `http://localhost:3000` (or your Docker host/port).

### `POST /register`

Create a user and return tokens.

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Responses:**

- `201` — `{ "accessToken": "...", "refreshToken": "..." }`
- `400` — validation error
- `409` — email already registered

---

### `POST /login`

Authenticate and return tokens.

**Body (JSON):**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Responses:**

- `200` — `{ "accessToken": "...", "refreshToken": "..." }`
- `400` — validation error
- `401` — invalid credentials

---

### `POST /refresh`

Exchange a refresh token for a new pair (rotation). The previous refresh token becomes invalid after a successful refresh.

**Body (JSON):**

```json
{
  "refreshToken": "<refresh-jwt>"
}
```

**Responses:**

- `200` — `{ "accessToken": "...", "refreshToken": "..." }`
- `400` — validation error
- `401` — invalid, revoked, or reused token

---

### `POST /logout`

Revoke the refresh token session. Response has **no body**.

**Body (JSON):**

```json
{
  "refreshToken": "<refresh-jwt>"
}
```

**Responses:**

- `204` — success (no content)
- `400` — validation error

---

### `GET /me`

Return the current user (requires access token).

**Headers:**

- `Authorization: Bearer <access-jwt>`

**Responses:**

- `200` — `{ "id": "...", "email": "...", "createdAt": "..." }`
- `401` — missing or invalid access token
- `404` — user not found (edge case)

---

## Notes

- User and session data are stored **in memory**; restarting the process clears it.
- For production, persist users and refresh sessions in a database or cache.
