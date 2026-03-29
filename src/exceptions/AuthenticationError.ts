import ErrorConstant from '@/constants/error';
import ClientError from './ClientError';

interface AuthenticationErrorOptions {
	type?: string;
	statusCode?: number;
}

class AuthenticationError extends ClientError {
	name: string;

	constructor(
		message: string = ErrorConstant.message.AUTH_ERR_MSG,
		options?: AuthenticationErrorOptions,
	) {
		super(message, {
			type: options?.type ?? ErrorConstant.type.AUTHENTICATION_ERR,
			statusCode: options?.statusCode ?? 401,
		});

		this.name = 'AuthenticationError';
	}
}

export default AuthenticationError;
