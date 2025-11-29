import ErrorConstant from '@/constants/error';
import ClientError from './ClientError';

interface ForbiddenErrorOptions {
	type?: string;
	statusCode?: number;
}

class ForbiddenError extends ClientError {
	name: string;

	constructor(
		message: string = ErrorConstant.message.FORBIDDEN_ERR_MSG,
		options?: ForbiddenErrorOptions,
	) {
		super(message, {
			type: options?.type ?? ErrorConstant.type.FORBIDDEN_ERR,
			statusCode: 403,
		});

		this.name = 'ForbiddenError';
	}
}

export default ForbiddenError;
