# AI Coding Tools Policy

**Version:** 1.0  
**Effective date:** [To be set by Legal]  
**Owner:** Engineering Leadership + Information Security  
**Review cadence:** Annual, or upon material change to tools, regulations, or PCI scope  

---

## 21. Purpose & Scope

### 21.1 Purpose

This policy exists to (a) capture productivity benefits from approved AI-assisted development tools, (b) protect cardholder data and other regulated information consistent with PCI-DSS obligations, (c) preserve the company’s intellectual property and license posture, and (d) give Security and Legal predictable rules for risk acceptance and vendor management.

### 21.2 Scope — Who this applies to

This policy applies to **everyone** who writes, reviews, or modifies software or infrastructure-as-code for the company or its customers, including:

- All Engineering roles (backend, frontend, mobile, quality, and technical leadership)
- DevOps, Site Reliability, and Platform Engineering
- Data Science and Machine Learning Engineering when they produce or maintain code, notebooks, or pipelines that touch company systems or customer environments
- Contractors and vendors with repository, CI/CD, or production access, unless a signed engagement letter explicitly supersedes specific clauses (Security and Legal must approve any supersession)

Human Resources, Finance, and other functions that use **generative AI for non-code purposes** are governed by separate acceptable-use and data-handling policies; this document governs **AI coding and developer tooling** only.

### 21.3 Scope — Tools covered

“AI coding tools” include, without limitation:

- In-IDE assistants (e.g., code completion, chat-in-editor, patch suggestions)
- CLI or web-based coding assistants used for implementation, refactor, debugging, or documentation of software
- Tools that send **source code, prompts, file paths, repository metadata, or terminal output** to a vendor or third-party model for processing

Infrastructure monitoring, traditional static analysis without generative cloud backends, and locally executed deterministic linters **are not** AI coding tools **unless** they transmit company content to a cloud generative service.

---

## 22. Tool Classification

Tools are classified into three tiers. **Tier assignment is authoritative until Security publishes an updated inventory** (maintained in the internal wiki / vendor registry). Teams **must not** substitute personal judgment for the published tier without a formal exception (see Section 27).

### 22.1 Tier definitions

| Tier | Definition |
|------|------------|
| **Approved** | May be used for day-to-day development subject to this policy’s data rules and license checks. Vendor has an executed agreement, appropriate subprocessors, and (where applicable) meets Security’s minimum bar for handling company-confidential material. |
| **Conditional** | Use is permitted only under documented guardrails: approved use cases, approved networks, configuration requirements (e.g., prompt/data retention off, enterprise tenancy), and often a time-bound pilot or exception ticket. Misconfiguration defaults the tool to **Prohibited** use. |
| **Prohibited** | Must not be used with company code, credentials, customer data, or other non-public company information. Includes free/personal tiers of cloud assistants when they lack contractual protections, and any tool that cannot meet PCI-adjacent data constraints for the intended use. |

### 22.2 Current company tool assignments (illustrative — maintain live list internally)

| Tool / category | Tier | Notes |
|-----------------|------|--------|
| **GitHub Copilot Business / Enterprise** (org-enforced policies, telemetry and retention per Security baseline) | **Approved** | Default approved assistant when connected only to approved repositories and per Section 23. |
| **Company-standard IDE + built-in indexing without cloud generative upload** (offline/local features only) | **Approved** | No transmission of code to external generative APIs. |
| **Cursor / similar AI-first IDEs (Business or Enterprise with org controls, audit logging, and data handling per vendor DPA)** | **Conditional** | Allowed after Security configuration checklist; not permitted on machines holding raw PAN or full cardholder environments without isolated workflow. |
| **Anthropic Claude (API or Team/Enterprise with BAA/DPA as applicable, no training on customer data per contract)** | **Conditional** | Permitted for designated squads under pilot parameters; prompts must follow Section 23; no production secrets. |
| **GitHub Copilot Individual / personal subscription tied to personal billing** | **Prohibited** for company work | Lacks org policy enforcement and consistent contractual coverage. |
| **Free or anonymous web chatbots** (e.g., public ChatGPT free tier, unauthenticated coding assistants) | **Prohibited** | Unacceptable data handling and no enterprise indemnity path for IP or leakage events. |
| **AI plugins that upload repo snapshots or “sync entire project” to unknown clouds** | **Prohibited** unless explicitly listed as Approved/Conditional after Security review | |

*Security will reconcile this table with the enterprise SSO catalog and procurement records quarterly.*

---

## 23. Data Classification Rules

### 23.1 Company data classification (summary)

For AI tooling, the following mapping applies (aligned to PCI and internal confidentiality levels):

| Internal label | Examples | Cloud AI coding tools |
|----------------|----------|------------------------|
| **Public** | Published docs, open-source the company has released | May be referenced in prompts **if** it does not disclose unreleased product plans or combine with internal-only context. |
| **Internal** | Design docs, ticket titles, non-production stack traces without secrets | **Conditional:** Allowed only in **Approved** or **Conditional** tools configured per Section 22; no cardholder data; minimize identifiers. |
| **Confidential** | Customer names in contracts, unreleased roadmaps, security architecture | **Restricted:** Redact or abstract; prefer synthetic examples. Never paste full configs from production. |
| **Restricted — PCI / secrets** | PAN, full track data, CVV, magnetic stripe equivalent; live payment credentials; production database connection strings; decrypted keys; HSM or vault exports | **Never** paste into any cloud generative tool. Use only approved secret-scanning and break-glass procedures outside AI chat. |

### 23.2 PCI-DSS alignment (practical rules)

1. **Cardholder data environment (CDE):** No AI coding tool may be configured to read files or environment variables that contain **full PAN**, **cardholder name + PAN**, or **sensitive authentication data** as defined by PCI. Engineers working in CDE-adjacent code must use **abstractions, masked samples, or synthetic data** in prompts.  
2. **Secrets:** Passwords, API keys, private keys, OAuth client secrets, and session tokens **must not** appear in prompts, snippets, or logs sent to vendors. Use placeholders (`REDACTED_KEY`, `example.invalid`) and rotate any credential that was accidentally exposed (see incident process).  
3. **Production likeness:** Avoid pasting production URLs, real customer IDs, or live database query results. Use staging data or anonymized fixtures approved by Data Governance.  
4. **Logging:** Assume vendor-side retention may exist; classify prompts as if they could be stored for troubleshooting unless Security confirms zero-retention settings in writing for that deployment.

### 23.3 What may be sent (summary)

- Non-secret code fragments from **non-production** branches with secrets removed  
- Error messages and stack traces with **paths, hostnames, and IDs redacted**  
- Public documentation and standard library references  

### 23.4 What must not be sent

- Any **Restricted** data per Section 23.1  
- Unredacted **PII** of customers or employees when avoidable  
- **Full file trees** or proprietary algorithms where the combination could reconstruct trade secrets (use smaller, abstracted excerpts when possible)  

---

## 24. IP Ownership & Indemnity

### 24.1 Ownership of AI-generated code

Code produced by employees or contractors within the scope of their duties using company-approved tools is treated as a **work made for hire** (or equivalent under applicable law) and is **owned by the company**, subject to third-party rights in any incorporated third-party or open-source components.

Engineers **must** ensure AI-suggested code is reviewed like human-written code: it must comply with our licensing policy and must not introduce unrecognized dependencies.

### 24.2 Company position on IP indemnity from AI vendors

The company **does not rely** on generic marketing claims that an AI vendor “indemnifies” users for IP infringement. **Legal and Procurement** evaluate indemnification, limitation of liability, and IP representations **per vendor agreement**. Until a tool is under an executed enterprise agreement with acceptable IP and confidentiality terms, it **must not** be used for material contributions to the product (see Tier **Prohibited**).

### 24.3 Requirements for production code

All code deployed to **production** or **customer-facing environments** must:

1. Be authored or reviewed under this policy (no **Prohibited** tools in the chain of contribution for that change).  
2. Pass normal **code review**, **security review** where required by the Secure Development Policy, and **CI checks** including dependency and license scanning.  
3. Include **attribution in commit messages or internal tickets** when a substantial portion of a change was AI-assisted (for auditability), without implying third-party copyright ownership.  

Use of **Prohibited** tools to generate production-bound code is a **policy violation** regardless of subsequent review.

---

## 25. Copy-Left Risk Mitigation

### 25.1 Objective

Prevent **GPL-, AGPL-, or other copyleft-licensed** code from entering the commercial product in a manner that would require disclosure of proprietary source or impose unintended license obligations.

### 25.2 Controls

1. **Dependency and license scanning** is mandatory in CI for all services that ship to customers; merges that introduce **AGPL** or **GPL** in linked form to proprietary binaries/libraries are **blocked** unless Legal approves an exception with a recorded compatibility analysis.  
2. **AI-generated snippets** must be treated as **untrusted** until reviewed: reviewers confirm license compatibility and absence of copied segments from identifiable GPL/AGPL projects.  
3. **No bulk import** of AI output into core proprietary modules without the same license scan applied to new files.  
4. **Training data provenance:** Engineers must not instruct AI tools to “paste the full implementation from [named open-source project]” into company code; prefer algorithmic description and clean-room style inputs.  
5. **Legal escalation** is required before shipping features where copyleft might apply (e.g., dynamic linking to AGPL databases, network SaaS triggers).

---

## 26. Audit & Compliance

### 26.1 Logs collected

Where technically available, the company collects or relies on:

- **Identity and SSO logs** for access to source control and Approved/Conditional AI tools  
- **Repository audit logs** (clone, push, PR activity)  
- **Enterprise AI tool admin logs** (e.g., Copilot/Cursor org-level usage events as exposed by vendor)  
- **Endpoint or SWG logs** for blocked categories (where deployed) for high-risk data exfiltration patterns  
- **Secret scanning** and **DLP** alerts on repositories and selected ChatOps channels  

Exact fields and retention periods are defined in the **Logging & Retention Standard** and vendor DPAs.

### 26.2 Review

- **Security Operations** reviews high-severity DLP and secret-scanning alerts **per runbook**.  
- **Internal Audit / Security** samples AI tool usage quarterly for policy adherence (e.g., exception counts, pilot boundaries).  
- **PCI** relevant activities are included in evidence collection for access control and change management where AI tooling intersects those domains.

### 26.3 Alert triggers (non-exhaustive)

- Secret-scanning or DLP match on **live credentials**, **PAN patterns**, or **private keys** in repos or tickets  
- Attempted use of **Prohibited** AI domains or tools from corporate-managed devices where blocked  
- Spike in **unauthorized cloud AI** traffic or new unapproved OAuth applications to code repositories  
- Reported or detected paste of **production database credentials** into external tools  

---

## 27. Violation & Enforcement

### 27.1 Example: production database credentials sent to a free-tier AI tool

Sending **production database credentials** (or equivalent unrestricted access to production data) to a **free-tier** or otherwise **Prohibited** cloud AI tool is treated as a **serious security incident** and **policy violation**.

**Immediate actions:**

1. **Containment:** The employee’s manager and Security are notified; credentials are **rotated immediately**; access logs for the affected database are preserved.  
2. **Investigation:** Security determines scope (what was pasted, vendor retention, possible exfiltration).  
3. **Notification:** Legal and, where required, **PCI incident response** and **breach notification** processes are invoked if cardholder data or regulated personal data was exposed.  

**Employment and disciplinary outcomes** depend on facts but may include:

- Mandatory **remediation training** and **written warning** for negligent first offenses without evidence of malice or repeat behavior  
- **Performance improvement plan** or **termination** for intentional misuse, repeat violations after training, or concealment  
- **Contract remedies** for vendors or contractors per agreement  

**Willful circumvention** of Prohibited tiers or **disabled security controls** to use AI tools may result in **immediate escalation** to senior leadership and loss of production access pending review.

---

## Governance

- **Exceptions** require Security + Legal sign-off and are time-bound.  
- **Questions** go to `security@` / internal Slack channel designated by IT Security.  

*This policy supplements the Employee Handbook, Acceptable Use Policy, Secure Development Policy, and PCI policies; in case of conflict on PCI topics, the stricter requirement applies.*
