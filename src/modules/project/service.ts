import { desc } from 'drizzle-orm';
import { db } from '@/config/db';
import { catchErrorDrizzle } from '@/utils/helpers/globals';
import { generatePaginationMetaResponse } from '@/utils/helpers/pagination';
import { projectsTable } from './schema';
import type { CreateProjectPayload, GetProjectsParams } from './types';

export default class ProjectService {
	async getAll(params: GetProjectsParams) {
		const { pagination } = params;

		const [projects, total] = await Promise.all([
			db.query.projectsTable.findMany({
				limit: pagination.limit,
				offset: pagination.offset,
				orderBy: desc(projectsTable.createdAt),
			}),
			db.$count(projectsTable),
		]);

		return {
			projects,
			meta: {
				pagination: generatePaginationMetaResponse(pagination, total),
			},
		};
	}

	async create(payload: CreateProjectPayload) {
		try {
			const project = await db
				.insert(projectsTable)
				.values({
					name: payload.name,
				})
				.returning();

			return project;
		} catch (error) {
			catchErrorDrizzle(error, { conflict: { column: 'Project name' } });

			throw error;
		}
	}
}
