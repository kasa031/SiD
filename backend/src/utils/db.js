import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env file only if DATABASE_URL is not set (local development)
// Railway sets DATABASE_URL automatically, so we don't need to load from file
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: join(__dirname, '../../env') });
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('✅ Koblet til database');
});

pool.on('error', (err) => {
  console.error('❌ Database feil:', err);
});

export default pool;

