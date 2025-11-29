import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '@/schemas';

const host = process.env.PG_HOST;
const port = process.env.PG_PORT || '5432';
const user = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const database = process.env.PG_DATABASE;

const pool = new Pool({
	host,
	port: Number(port),
	user,
	password,
	database,
	ssl: false,
});

const db = drizzle(pool, { schema });

export { db };
