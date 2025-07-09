// knexfile.ts
import type { Knex } from 'knex';
import 'dotenv/config';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg', // Dice a Knex che stiamo usando PostgreSQL
    connection: { // Prende i dati dal tuo file .env
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: './db/migrations' // Dice a Knex dove trovare i file di migrazione
    }
  }
};

export default config;