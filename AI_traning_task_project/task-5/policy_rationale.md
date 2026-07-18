# Policy Rationale 

We tiered tools by **contractual and administrative control**, not brand popularity. **GitHub Copilot Business/Enterprise** is **Approved** because org-level policy, SSO, and enterprise DPAs give Security enforceable settings and a single vendor relationship—critical for a PCI-scoped codebase. **Claude** (API or enterprise workspace) is **Conditional** so experimenting teams can proceed under DPAs, retention constraints, and pilot boundaries rather than ad hoc consumer use. **Personal Copilot, free web chatbots, and anonymous assistants** are **Prohibited** because they lack org enforcement and create unacceptable leakage and IP indemnity gaps.

**Data rules** mirror PCI reality: anything that could identify cardholder data or live secrets never leaves our controlled boundary via generative clouds; everything else is allowed only through Approved/Conditional tools with minimization. That trades some convenience for a defensible posture with auditors and customers.

**Copyleft mitigation** does not assume vendors filter licenses; we rely on **CI license scanning** and human review because AI can reproduce GPL snippets. **IP ownership** stays work-for-hire; vendor indemnity is **not assumed** until Legal signs enterprise terms.

**Audit** focuses on logs we already need for PCI—identity, repo activity, secret scanning—plus vendor admin telemetry where available, so we do not promise forensic visibility we cannot deliver.
