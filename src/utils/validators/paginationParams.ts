import z from 'zod';
import { validationMiddleware } from '@/middlewares/validation';

const paginationParamsValidator = z.object({
	page: z
		.string()
		.optional()
		.default('1')
		.transform(Number)
		.refine((val) => val > 0, {
			message: 'Page must be a positive number',
		}),
	limit: z
		.string()
		.optional()
		.default('10')
		.transform(Number)
		.refine((val) => val > 0, {
			message: 'Limit must be a positive number',
		}),
});

export type PaginationParams = z.infer<typeof paginationParamsValidator>;

export const zPaginationParamsValidator = validationMiddleware(
	'query',
	paginationParamsValidator,
);
