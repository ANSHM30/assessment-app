import { Request, Response } from "express";
import pool from "../../config/db";
import { signJwt } from "../../utils/jwt";
import config from "../../config";

export async function login(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // 1️⃣ Find user
  const userResult = await pool.query(
    "SELECT id, role FROM users WHERE email = $1",
    [email]
  );

  if (userResult.rowCount === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = userResult.rows[0];

  // 2️⃣ Sign JWT
  const token = signJwt({
    userId: user.id,
    role: user.role,
  });

  // 3️⃣ Set HttpOnly Cookie
  const isProd = config.NODE_ENV === "production";

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: isProd,                 // ❗ false in dev
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? config.COOKIE_DOMAIN : undefined, // ❗ REMOVE domain in dev
    maxAge: 4 * 60 * 60 * 1000, // 4 hours
  });

  // 4️⃣ Response
  return res.json({
    message: "Login successful",
    role: user.role,
  });
}
