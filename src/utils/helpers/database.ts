import { exists, type SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { Database, Transaction } from '@/config/types';

export const dbCheckExist = async (
	db: Database | Transaction,
	table: PgTable,
	whereClause?: SQL,
) => {
	return db
		.select({
			exists: exists(db.select().from(table).where(whereClause)),
		})
		.from(table)
		.then((result) => !!result[0].exists);
};
