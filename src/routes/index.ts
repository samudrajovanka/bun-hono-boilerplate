import { sql } from 'drizzle-orm';
import { Hono } from 'hono';
import { db } from '@/config/db';
import appApi from './api';

const app = new Hono();

app.get('/health', async (c) => {
	const healthStatus = {
		status: 'ok',
		timestamp: new Date().toISOString(),
		services: {
			database: 'unknown',
		},
	};

	try {
		await db.execute(sql`SELECT 1`);
		healthStatus.services.database = 'healthy';
	} catch {
		healthStatus.services.database = 'unhealthy';
		healthStatus.status = 'degraded';
	}

	const statusCode = healthStatus.status === 'ok' ? 200 : 503;
	return c.json(healthStatus, statusCode);
});

app.route('/', appApi);

export default app;
