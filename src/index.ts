import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';
import NotFoundError from '@/exceptions/NotFoundError';
import { logMiddleware } from '@/middlewares/log';
import routes from '@/routes';
import { clientErrorResponse, errorHandler } from '@/utils/helpers/response';

const app = new Hono();

const allowedOrigins = (process.env.ALLOWED_CORS_ORIGINS || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(
	cors({
		origin: allowedOrigins,
	}),
);
app.use(secureHeaders());
app.use(trimTrailingSlash());
app.use(logMiddleware);

// ROUTES
app.route('/', routes);

// ERROR HANDLER
app.notFound((c) => {
	return c.json(clientErrorResponse(new NotFoundError('Page not found')), 404);
});
app.onError(errorHandler);

export default {
	port: Number(process.env.PORT) || 5000,
	fetch: app.fetch,
};
