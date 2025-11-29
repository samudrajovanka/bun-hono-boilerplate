import z from 'zod';
import { validationMiddleware } from '@/middlewares/validation';

const nameValidator = z.string().min(1).max(255);

export const payloadCreateProjectValidator = z.object({
	name: nameValidator,
});

export const zPayloadCreateProjectValidator = validationMiddleware(
	'json',
	payloadCreateProjectValidator,
);
