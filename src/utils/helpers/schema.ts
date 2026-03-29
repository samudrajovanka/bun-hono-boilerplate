import { sql } from 'drizzle-orm';
import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const timestamps = {
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
};

export const baseColumns = {
	id: uuid('id').default(sql`uuid_generate_v7()`).primaryKey(),
	...timestamps,
};
