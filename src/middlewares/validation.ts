import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import type { z } from 'zod';
import ErrorConstant from '@/constants/error';
import ClientError from '@/exceptions/ClientError';

export const validationMiddleware = (
	target: keyof ValidationTargets,
	schema: z.ZodSchema,
) => {
	return zValidator(target, schema, (result) => {
		if (!result.success) {
			const validationsError = result.error.issues.reduce(
				(res, error) => {
					res[error.path.join('.')] = error.message;
					return res;
				},
				{} as Record<string, string>,
			);

			throw new ClientError('Validation error', {
				type: ErrorConstant.type.VALIDATION_ERR,
				validations: validationsError,
			});
		}
	});
};
