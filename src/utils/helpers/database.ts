import { DrizzleQueryError, exists, type SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import ErrorConstant from '@/constants/error';
import PgErrorConstant from '@/constants/pgError';
import ConflictError from '@/exceptions/ConflictError';
import type { Database, Transaction } from '@/types/database';
import type { ErrorWithCode } from '@/types/error';

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

type CatchErrorDrizzleCause = {
	conflict?: {
		column: string;
	};
};

export const catchErrorDrizzle = (
	error: unknown,
	cause: CatchErrorDrizzleCause,
) => {
	if (error instanceof DrizzleQueryError) {
		if (
			cause.conflict &&
			(error.cause as ErrorWithCode).code ===
				PgErrorConstant.code.UNIQUE_VIOLATION
		) {
			throw new ConflictError(
				ErrorConstant.template.conflict(cause.conflict.column),
			);
		}
	}
};
