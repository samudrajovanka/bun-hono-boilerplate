import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/utils/helpers/schema';

export const projectsTable = pgTable(
	'projects',
	{
		...baseColumns,
		name: varchar('name').notNull(),
	},
	(table) => [uniqueIndex('projects_name_idx').on(table.name)],
);
