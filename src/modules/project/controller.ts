import { createFactory } from 'hono/factory';
import { getPaginationFromQuery } from '@/utils/helpers/pagination';
import { successResponse } from '@/utils/helpers/response';
import { zPaginationParamsValidator } from '@/utils/validators/paginationParams';
import ProjectService from './service';
import type { CreateProjectPayload } from './types';
import { zPayloadCreateProjectValidator } from './validator';

const { createHandlers } = createFactory();

export const getProjects = createHandlers(
	zPaginationParamsValidator,
	async (c) => {
		const pagination = getPaginationFromQuery(c);

		const projectService = new ProjectService();
		const { projects, meta } = await projectService.getAll({
			pagination,
		});

		return c.json(
			successResponse({
				message: 'Success get all projects',
				data: {
					projects,
				},
				meta,
			}),
		);
	},
);

export const createProject = createHandlers(
	zPayloadCreateProjectValidator,
	async (c) => {
		const payload = c.req.valid('json') as CreateProjectPayload;

		const projectService = new ProjectService();
		const project = await projectService.create(payload);

		return c.json(
			successResponse({
				message: 'Success create project',
				data: {
					project,
				},
			}),
		);
	},
);
