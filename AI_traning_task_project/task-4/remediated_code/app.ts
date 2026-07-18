/**
 * Remediation for V-002/V-005/V-006:
 * - Add auth endpoint rate limits
 * - Add HTTP security headers and strict CORS
 * - Add safe centralized error handling
 */

import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "../src/routes/authRoutes";

const app = express();

// BEFORE:
// app.use(express.json());
// app.use("/", authRoutes);

// AFTER:
app.use(helmet());
app.use(
  cors({
    origin: ["https://app.example.com"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Try again later." },
});

app.use(["/login", "/register", "/refresh"], authLimiter);
app.use("/", authRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Intentionally avoid leaking internals to clients.
  console.error("[server-error]", err);
  res.status(500).json({ error: "Unexpected server error" });
});

export default app;
