# AI Tool Comparison Report
## Participant: Sagar Bhondave  |  Date: 30-04-2016
## Prompt Used :"Build a React form component with multi-step validation, real-time feedback,
accessibility (ARIA), and a loading state during async submission"

## Tool 1: ChatGPT (GPT-4/Free-tier equivalent) - Time to generate: Not recorded

Lines of code produced: 202 - Summary of output: The response provides a full 3-step form flow with name, email, and password handling, plus input-level validation and async submit simulation. It includes useful accessibility support such as `aria-invalid`, `aria-describedby`, and alert roles for inline errors. The implementation is more detailed and includes both forward/back navigation and field touch-state handling.

## Tool 2: Gemini (Gemini model / Free-tier equivalent) - Time to generate: Not recorded - Lines of code produced: 124 - Summary of output: The response delivers a cleaner and shorter 3-step experience focused on name and email, with a success screen and status messaging. It includes ARIA live region usage and real-time validation for key fields, but overall form logic is less exhaustive. The code is readable and pragmatic, though it is lighter in validation depth and production safeguards.

## Comparison
| Criterion           | Tool 1 | Tool 2 |
|---------------------|--------|--------|
| Output Quality      | High: detailed and feature-rich | Good: concise and readable |
| Security Awareness  | Medium: basic client-side checks only | Medium-Low: minimal validation scope |
| Code Completeness   | High: full flow with back/next/submit states | Medium: functional but simplified flow |
| Production Ready?   | Partially: needs stronger hardening/tests | Partially: needs feature and validation expansion |
| Estimated Time Save | ~60-75 minutes | ~40-55 minutes |

## My Verdict
For this specific prompt, I would choose Tool 1 because it is closer to what I would actually ship after refinement. It better captures the full requirement set: multi-step progression, field-level validation, accessibility attributes, and a visible loading state during async submit. I like that it tracks touched fields and supports step-wise gating, which reduces user confusion and avoids incomplete submissions. Tool 2 is easier to read at first glance and may be faster for prototype demos, but it leaves more implementation work before production. In real project conditions, I value completeness and requirement coverage over shorter code, since missing validation paths and edge states usually cost more later. Tool 1 gives me a stronger base and saves more end-to-end engineering time.

## One Thing That Surprised Me
I was surprised that the shorter Tool 2 output still communicated accessibility intent clearly through an ARIA live status region, even while being less complete overall. That balance between brevity and UX-awareness was a positive insight.
