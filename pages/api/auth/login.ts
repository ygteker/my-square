import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let db = null;
  if (!db) {
    db = await open({
      filename: "userdatabase.db",
      driver: sqlite3.Database
    })
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  const user = await db.get(sql, email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1m',
  })
  console.log("Login successful", token);
  return res.status(200).json({ token });
}
