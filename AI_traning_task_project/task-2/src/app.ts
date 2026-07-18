import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "16kb" }));

if (process.env.NODE_ENV !== "test") {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many authentication attempts, please try again later." }
  });

  app.use(["/register", "/login", "/refresh"], authLimiter);
}
app.use("/", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
