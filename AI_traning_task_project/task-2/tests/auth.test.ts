import request from "supertest";
import app from "../src/app";
import { resetStore } from "../src/services/store";

describe("Simple Auth Service", () => {
  beforeEach(() => {
    resetStore();
  });

  test("registers a new user", async () => {
    const response = await request(app).post("/register").send({
      email: "user1@example.com",
      password: "password123"
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });

  test("rejects duplicate registration", async () => {
    await request(app).post("/register").send({
      email: "duplicate@example.com",
      password: "password123"
    });

    const response = await request(app).post("/register").send({
      email: "duplicate@example.com",
      password: "password123"
    });

    expect(response.status).toBe(409);
  });

  test("logs in and fetches protected profile", async () => {
    await request(app).post("/register").send({
      email: "login@example.com",
      password: "password123"
    });

    const loginResponse = await request(app).post("/login").send({
      email: "login@example.com",
      password: "password123"
    });

    expect(loginResponse.status).toBe(200);
    const meResponse = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${loginResponse.body.accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.email).toBe("login@example.com");
  });

  test("rotates refresh token and rejects reused old token", async () => {
    const registerResponse = await request(app).post("/register").send({
      email: "rotate@example.com",
      password: "password123"
    });

    const oldRefreshToken = registerResponse.body.refreshToken as string;
    const rotateResponse = await request(app).post("/refresh").send({
      refreshToken: oldRefreshToken
    });

    expect(rotateResponse.status).toBe(200);
    expect(rotateResponse.body.refreshToken).not.toBe(oldRefreshToken);

    const reusedResponse = await request(app).post("/refresh").send({
      refreshToken: oldRefreshToken
    });
    expect(reusedResponse.status).toBe(401);
  });

  test("revokes refresh token on logout", async () => {
    const registerResponse = await request(app).post("/register").send({
      email: "logout@example.com",
      password: "password123"
    });

    const refreshToken = registerResponse.body.refreshToken as string;
    const logoutResponse = await request(app).post("/logout").send({ refreshToken });
    expect(logoutResponse.status).toBe(204);

    const refreshResponse = await request(app).post("/refresh").send({ refreshToken });
    expect(refreshResponse.status).toBe(401);
  });

  test("returns 401 for protected route without token", async () => {
    const response = await request(app).get("/me");
    expect(response.status).toBe(401);
  });

  describe("Manual cases → automated (see manual_test_cases.md)", () => {
    test("TC-01: duplicate register after email case normalization returns 409", async () => {
      const first = await request(app).post("/register").send({
        email: "User@Example.com",
        password: "FirstSecret1"
      });
      expect(first.status).toBe(201);
      expect(first.body).toHaveProperty("accessToken");
      expect(first.body).toHaveProperty("refreshToken");

      const duplicate = await request(app).post("/register").send({
        email: "user@example.com",
        password: "Different2!"
      });
      expect(duplicate.status).toBe(409);
      expect(duplicate.body).toHaveProperty("error");
    });

    test("TC-02: login with wrong password returns 401", async () => {
      await request(app).post("/register").send({
        email: "loginfail@example.com",
        password: "CorrectHorse1"
      });

      const response = await request(app).post("/login").send({
        email: "loginfail@example.com",
        password: "WrongPassword!"
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body).not.toHaveProperty("accessToken");
    });

    test("TC-03: register with password shorter than 6 characters returns 400", async () => {
      const response = await request(app).post("/register").send({
        email: "shortpass@example.com",
        password: "short"
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation failed");

      const loginAttempt = await request(app).post("/login").send({
        email: "shortpass@example.com",
        password: "short"
      });
      expect(loginAttempt.status).toBe(401);
    });
  });
});
