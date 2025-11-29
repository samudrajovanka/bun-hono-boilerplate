import ErrorConstant from '@/constants/error';
import ClientError from './ClientError';

interface AuthorizationErrorOptions {
	type?: string;
	statusCode?: number;
}

class AuthorizationError extends ClientError {
	name: string;

	constructor(
		message: string = ErrorConstant.message.AUTHORIZATION_ERR_MSG,
		options?: AuthorizationErrorOptions,
	) {
		super(message, {
			type: options?.type ?? ErrorConstant.type.AUTHORIZATION_ERR,
			statusCode: 401,
		});

		this.name = 'AuthorizationError';
	}
}

export default AuthorizationError;
