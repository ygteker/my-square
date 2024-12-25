import type { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';

interface JwtPayload {
  exp: number;
  iat?: number; // Optional issued-at timestamp
  sub?: string; // Optional subject
  [key: string]: any; // Allow additional properties
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded) {
      return res
        .status(400)
        .json({ message: "Expired" });
    } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res
        .status(400)
        .json({ message: "Expired" });
    } else {
      return res
        .status(200)
        .json({ data: "protected data" });
    }
  } catch (error) {
    console.error('Token validation failed', error);
    return res.status(400).json({ message: "Unauthorized" });
  }
}
