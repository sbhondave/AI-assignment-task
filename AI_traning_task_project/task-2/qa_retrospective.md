# QA Retrospective

## What AI did well

- Mapped three manual test cases into clear automated Jest + Supertest scenarios.
- Kept the automated tests close to real API behavior by asserting status codes and response structure.
- Added coverage for important negative paths:
  - duplicate registration conflict (`409`)
  - invalid login credentials (`401`)
  - register validation failure (`400`)

## What needed fixing

- Initial test execution depended on JWT secrets being present in environment variables.
  - Fix: added `tests/jest-env.ts` and wired it in `jest.config.ts` via `setupFiles` so tests run consistently.
- Test reliability issue from rate limiting (`429`) when many auth requests run in one suite.
  - Fix: skip auth rate limiter in test mode (`NODE_ENV === "test"`) in `src/app.ts`.
- First attempt to save terminal output used a PowerShell redirection form that included extra wrapper noise.
  - Fix: re-ran capture using `cmd` redirection and saved clean output to `test_output.txt`.

## Final result

- Automated scripts are present in `tests/` (`auth.test.ts`, `jest-env.ts`).
- Test run output is captured in `test_output.txt`.
- All tests pass in current setup (`9 passed, 0 failed`).
