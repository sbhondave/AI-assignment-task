Act as a senior application security engineer and penetration tester.

Perform a comprehensive security audit of this codebase, with emphasis on the authentication service and JWT/session flows.

## Scope
- Backend API (`Express` app, auth routes, auth service, environment config).
- Deployment/runtime config (environment variable handling, container manifests).
- Dependencies and middleware security posture.
- Frontend attack surface if any JS/Angular clients exist (DOM-XSS, unsafe bindings, token storage).

## Audit Objectives
Analyze and report vulnerabilities including but not limited to:
- Authentication and authorization weaknesses.
- Broken access control, including IDOR patterns.
- Input validation flaws (XSS, SQL injection, command injection, prototype pollution).
- Sensitive data exposure (tokens, secrets, PII leakage, verbose errors).
- Insecure API handling (token validation, claim verification, session management).
- Improper error handling and logging.
- Security misconfigurations (headers, CORS, hardcoded defaults, permissive settings).
- Dependency and supply-chain risks (known vulnerable packages, unsafe transitive deps).
- Frontend security issues (token storage in localStorage, DOM sinks, unsafe eval/bindings).

## Required Methodology
1. Build a threat model:
   - Identify trust boundaries, auth flows, token issuance/refresh, and privilege levels.
2. Perform static review:
   - Review route handlers, middleware chain order, validation paths, and env parsing.
3. Perform abuse-case analysis:
   - Model attacker workflows for token forgery, brute force, account takeover, replay, and enumeration.
4. Validate exploitability:
   - For each HIGH/CRITICAL issue, include reproducible PoC steps or script snippets.
5. Assess impact and likelihood:
   - Use severity rating with CVSS-style rationale (impact, exploitability, prerequisites).
6. Propose practical remediations:
   - Provide secure code patterns with minimal disruption and clear rollout guidance.
7. Re-audit after fixes:
   - Re-evaluate residual risk and defense-in-depth gaps.

## Expected Output
Produce:
1. `vulnerability_report.md` with a findings table containing:
   - ID, title, severity, CWE/OWASP mapping, affected files/components, attack scenario, impact, evidence, remediation, verification status.
2. `poc/` scripts for each HIGH/CRITICAL finding.
3. `remediated_code/` examples with before/after comments.
4. `second_audit.md` documenting post-remediation status and residual risk.

## Quality Bar
- Prioritize concrete, code-grounded findings over generic advice.
- Avoid false positives; call out assumptions explicitly.
- Do not expose secrets in output; redact sensitive material.
- Keep remediation production-practical and testable.
