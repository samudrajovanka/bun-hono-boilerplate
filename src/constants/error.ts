const ErrorConstant = {
	message: {
		INVARIANT_ERR_MSG: 'Invariant error',
		CONFLICT_ERR_MSG: 'Conflict error',
		PERMISSION_ERR_MSG: 'You not allowed to access this resource',
		AUTH_ERR_MSG: 'You are not authenticated',
		AUTHORIZATION_ERR_MSG: 'You are not authorized',
		FORBIDDEN_ERR_MSG: "You don't have access",
		CLIENT_ERR_MSG: 'Client error',
		NOT_FOUND_ERR_MSG: 'Not found error',
		TOKEN_INVALID_ERR_MSG: 'Token invalid',
		TOKEN_EXPIRED_ERR_MSG: 'Token expired',
		NOT_FIELDS_PROVIDED_ERR_MSG: 'No fields provided to update',
	},
	template: {
		conflict: (column: string) => `${column} already used`,
		notFound: (resource: string) => `${resource} not found`,
	},
	type: {
		SERVER_ERR: 'SERVER_ERR',
		CLIENT_ERR: 'CLIENT_ERR',
		NOT_FOUND_ERR: 'NOT_FOUND_ERR',
		VALIDATION_ERR: 'VALIDATION_ERR',
		INVARIANT_ERR: 'INVARIANT_ERR',
		AUTHENTICATION_ERR: 'AUTHENTICATION_ERR',
		AUTHORIZATION_ERR: 'AUTHORIZATION_ERR',
		FORBIDDEN_ERR: 'FORBIDDEN_ERR',
		TOKEN_ERR: 'TOKEN_ERR',
		TOKEN_EXPIRED_ERR: 'TOKEN_EXPIRED_ERR',
		CONFLICT_ERR: 'CONFLICT_ERR',
		DATABASE_VALIDATION: 'DATABASE_VALIDATION',
	},
} as const;

export default ErrorConstant;
