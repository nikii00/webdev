// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  switch (req.method) {
    case 'GET':
      const user = await db.query('SELECT * FROM users WHERE id = ?', [1]);
      res.status(200).json(user);
      break;
    case 'PUT':
      const { firstName, lastName, email } = req.body;
      await db.query('UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ?', [firstName, lastName, email, 1]);
      res.status(200).json({ message: 'Profile updated' });
      break;
    default:
      res.status(405).end();
      break;
  }
};
