import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import {
  getUserProfile,
  loginUser,
  registerUser,
  revokeRefreshToken,
  rotateRefreshToken
} from "../services/authService";

const router = Router();

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

const parseBody = <S extends z.ZodTypeAny>(schema: S, data: unknown): z.infer<S> => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw parsed.error;
  }
  return parsed.data;
};

router.post("/register", async (req, res) => {
  try {
    const body = parseBody(registerSchema, req.body);
    const tokens = await registerUser(body.email, body.password);
    res.status(201).json(tokens);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    res.status(409).json({ error: (error as Error).message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = parseBody(loginSchema, req.body);
    const tokens = await loginUser(body.email, body.password);
    res.json(tokens);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    res.status(401).json({ error: (error as Error).message });
  }
});

router.post("/refresh", (req, res) => {
  try {
    const body = parseBody(refreshSchema, req.body);
    const tokens = rotateRefreshToken(body.refreshToken);
    res.json(tokens);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    res.status(401).json({ error: (error as Error).message });
  }
});

router.post("/logout", (req, res) => {
  try {
    const body = parseBody(refreshSchema, req.body);
    revokeRefreshToken(body.refreshToken);
    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    res.status(204).send();
  }
});

router.get("/me", requireAuth, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const profile = getUserProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
});

export default router;
