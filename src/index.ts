import { Hono } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';
import NotFoundError from '@/exceptions/NotFoundError';
import { logMiddleware } from '@/middlewares/log';
import routes from '@/routes';
import { clientErrorResponse, errorHandler } from '@/utils/helpers/response';

const app = new Hono();

// MIDDLEWARES
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
