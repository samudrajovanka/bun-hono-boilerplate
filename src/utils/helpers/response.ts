import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import ErrorConstant from '@/constants/error';
import ClientError from '@/exceptions/ClientError';
import type { PaginationMetaResponse } from './pagination';

type SuccessResponseParams = {
	message: string;
	data?: Record<string, unknown>;
	meta?: {
		pagination?: PaginationMetaResponse;
		[key: string]: unknown;
	};
	[key: string]: unknown;
};

export const successResponse = (params: SuccessResponseParams) => {
	return {
		success: true,
		...params,
	};
};

export const clientErrorResponse = (error: ClientError) => ({
	success: false,
	message: error.message,
	...(error.validations && { validations: error.validations }),
	type: error.type,
});

export const serverErrorResponse = (error: Error) => ({
	success: false,
	message: error.message,
	type: ErrorConstant.type.SERVER_ERR,
	error: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
});

export const errorHandler = (error: Error, c: Context) => {
	if (error instanceof ClientError) {
		return c.json(
			clientErrorResponse(error),
			error.statusCode as ContentfulStatusCode,
		);
	}

	return c.json(serverErrorResponse(error), 500);
};
