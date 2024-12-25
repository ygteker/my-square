import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from 'js-cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    Cookies.remove('token');
    res.status(200).json({ message: "logged out" });
  } catch (error) {
    console.error('Logout error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
