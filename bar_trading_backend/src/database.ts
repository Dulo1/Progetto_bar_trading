// src/database.ts
import knex from 'knex';
import 'dotenv/config';

const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

const db = knex(knexConfig);

export default db;