// utils/db.js
import mysql from 'mysql2/promise';

export async function query(sql, values) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  const [results] = await db.execute(sql, values);
  db.end();
  return results;
}
 