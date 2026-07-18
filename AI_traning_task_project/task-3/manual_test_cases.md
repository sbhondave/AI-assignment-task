# Manual test cases — Simple Auth Service

## TC-01 — Duplicate registration is rejected when emails match after normalization

**Preconditions**
- The auth API is running and reachable.
- No existing account for `user@example.com` in the current test environment.

**Steps**
1. Send `POST /register` with:
   `{ "email": "User@Example.com", "password": "FirstSecret1" }`
2. Send `POST /register` again with:
   `{ "email": "user@example.com", "password": "Different2!" }`

**Expected outcome**
- First request returns HTTP `201` with `accessToken` and `refreshToken`.
- Second request returns HTTP `409` with duplicate-email error.

## TC-02 — Login fails when password is incorrect

**Preconditions**
- The auth API is running.
- An account exists for `loginfail@example.com` with password `CorrectHorse1`.

**Steps**
1. (If needed) Register the user using `POST /register`:
   `{ "email": "loginfail@example.com", "password": "CorrectHorse1" }`
2. Send `POST /login` with wrong password:
   `{ "email": "loginfail@example.com", "password": "WrongPassword!" }`

**Expected outcome**
- Login request returns HTTP `401`.
- Response contains authentication error and does not issue valid tokens.

## TC-03 — Registration rejects password shorter than 6 characters

**Preconditions**
- The auth API is running.

**Steps**
1. Send `POST /register` with:
   `{ "email": "shortpass@example.com", "password": "short" }`

**Expected outcome**
- Request returns HTTP `400`.
- Response indicates validation failure.
- User is not created from this invalid request.
