import { createMiddleware } from 'hono/factory';

export const logMiddleware = createMiddleware(async (c, next) => {
	const start = Date.now();

	await next();

	const duration = Date.now() - start;
	const now = new Date().toISOString();
	const ip = c.req.header('x-forwarded-for') || 'unknown';
	const method = c.req.method;
	const path = c.req.path;
	const status = c.res.status;
	const userAgent = c.req.header('user-agent') || 'unknown';
	const ref = c.req.header('referer') || '-';

	console.log(
		`[${now}] ${ip} - ${method} ${path} - ${status} - ${duration}ms - UA: "${userAgent}" - Referer: ${ref}`,
	);
});
