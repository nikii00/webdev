import { query } from '../../utils/db';

export default async function handler(req, res) {
  const { method } = req;
  const { id, search } = req.query;

  switch (method) {
    case 'GET':
      let students;
      if (search) {
        students = await query(
          `SELECT * FROM students WHERE firstname LIKE ? OR lastname LIKE ?`,
          [`%${search}%`, `%${search}%`]
        );
      } else {
        students = await query(`SELECT * FROM students`);
      }
      res.status(200).json(students);
      break;
    case 'POST':
      const { firstname, lastname, email, bio } = req.body;
      await query(
        `INSERT INTO students (firstname, lastname, email, bio) VALUES (?, ?, ?, ?)`,
        [firstname, lastname, email, bio]
      );
      res.status(201).json({ message: 'Student added' });
      break;
    case 'PUT':
      const { firstname: updateFirst, lastname: updateLast, email: updateEmail, bio: updateBio } = req.body;
      await query(
        `UPDATE students SET firstname = ?, lastname = ?, email = ?, bio = ? WHERE id = ?`,
        [updateFirst, updateLast, updateEmail, updateBio, id]
      );
      res.status(200).json({ message: 'Student updated' });
      break;
    case 'DELETE':
      await query(`DELETE FROM students WHERE id = ?`, [id]);
      res.status(200).json({ message: 'Student deleted' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

