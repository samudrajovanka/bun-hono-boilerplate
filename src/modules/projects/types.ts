import type z from 'zod';
import type { Pagination } from '@/utils/helpers/pagination';
import type { payloadCreateProjectValidator } from './project.validator';

export type GetProjectsParams = {
	pagination: Pagination;
};

export type CreateProjectPayload = z.infer<
	typeof payloadCreateProjectValidator
>;
