import type { Context } from 'hono';
import type {
	CursorPaginationParams,
	PaginationParams,
} from '../validators/paginationParams';

export const getPaginationFromQuery = (c: Context) => {
	// @ts-expect-error
	const query = c.req.valid('query') as PaginationParams;

	const offset = (query.page - 1) * query.limit;

	return {
		page: query.page,
		limit: query.limit,
		offset,
	};
};

export type Pagination = ReturnType<typeof getPaginationFromQuery>;

export const generatePaginationMetaResponse = (
	pagination: Pagination,
	total: number,
) => {
	return {
		page: pagination.page,
		limit: pagination.limit,
		total,
		totalPages: Math.ceil(total / pagination.limit),
	};
};

export type PaginationMetaResponse = ReturnType<
	typeof generatePaginationMetaResponse
>;

export const getCursorPaginationFromQuery = (c: Context) => {
	// @ts-expect-error
	const query = c.req.valid('query') as CursorPaginationParams;

	return {
		cursor: query.cursor,
		limit: query.limit,
	};
};

export type CursorPagination = ReturnType<typeof getCursorPaginationFromQuery>;

export const generateCursorPaginationMetaResponse = (
	pagination: CursorPagination,
	nextCursor: string | null | undefined,
) => {
	return {
		limit: pagination.limit,
		nextCursor,
	};
};

export type CursorPaginationMetaResponse = ReturnType<
	typeof generateCursorPaginationMetaResponse
>;
