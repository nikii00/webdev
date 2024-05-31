// pages/api/signup.js
import { query } from '../../utils/db';

export default async function handler(req, res) {
  const { firstname, lastname, email, password, bio } = req.body;
  const result = await query(
    `INSERT INTO users (firstname, lastname, email, password, bio) VALUES (?, ?, ?, ?, ?)`,
    [firstname, lastname, email, password, bio]
  );
  res.status(201).json(result);
}
