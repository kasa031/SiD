import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env if DATABASE_URL not set
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: join(__dirname, '../../env') });
}

const { Pool } = pg;

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Starter database migrations...');
    
    // Migration 1
    const migration1 = readFileSync(
      join(__dirname, '../database/migrations/001_initial_schema.sql'),
      'utf8'
    );
    console.log('📝 Kjører migration 001_initial_schema.sql...');
    await pool.query(migration1);
    console.log('✅ Migration 001 fullført');

    // Migration 2
    const migration2 = readFileSync(
      join(__dirname, '../database/migrations/002_add_categories_and_badges.sql'),
      'utf8'
    );
    console.log('📝 Kjører migration 002_add_categories_and_badges.sql...');
    await pool.query(migration2);
    console.log('✅ Migration 002 fullført');

    console.log('🎉 Alle migrations fullført!');
  } catch (error) {
    console.error('❌ Feil under migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

