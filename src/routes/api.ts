import { Hono } from 'hono';
import { cors } from 'hono/cors';
import projectRoute from '@/modules/projects/project.route';

const apiApp = new Hono().basePath('/api');

const allowedOrigins = (process.env.ALLOWED_CORS_ORIGINS || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

apiApp.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

apiApp.route('/projects', projectRoute);

export default apiApp;
