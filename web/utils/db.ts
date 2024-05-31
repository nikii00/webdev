import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'aa',
};

export const connectToDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};