import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/database/schemas/*.schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: process.env.POSTGRES_URL
    ? {
        // Use connection string (Supabase/Production)
        connectionString: process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false, // Required for Supabase
        },
      }
    : {
        // Fallback to individual parameters
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DATABASE || 'postgres',
        ssl: {
          rejectUnauthorized: false, // Required for Supabase
        },
      },
  verbose: true,
  strict: true,
} satisfies Config;
