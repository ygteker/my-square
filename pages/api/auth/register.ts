import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import User from "@/models//User";
import bcrypt from "bcryptjs";

const initializeDatabase = async () => {
  const db = await open({
    filename: "userdatabase.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `)

  return db;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const db = await initializeDatabase();
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    return res.status(201).json({ messag: "Signup successful", userId: result.lastID });
  } catch (error: any) {
    if (error.code === 'SQL_CONSTRAINT') {
      return res.status(400).json({ error: "Email already exists" })
    }
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
