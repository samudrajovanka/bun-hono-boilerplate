import { projectsTable } from '@/modules/project/schema';
import { db } from '../config/db';

export const seedProjects = async () => {
	console.log('Seeding projects...');

	await db
		.insert(projectsTable)
		.values([
			{
				id: '1',
				name: 'Project 1',
			},
		])
		.onConflictDoNothing();
};
