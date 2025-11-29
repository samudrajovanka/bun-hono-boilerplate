import ErrorConstant from '@/constants/error';
import ClientError from './ClientError';

interface ConflictErrorOptions {
	type?: string;
	statusCode?: number;
}

class ConflictError extends ClientError {
	name: string;

	constructor(
		message: string = ErrorConstant.message.CONFLICT_ERR_MSG,
		options?: ConflictErrorOptions,
	) {
		super(message, {
			type: options?.type ?? ErrorConstant.type.CONFLICT_ERR,
			statusCode: 409,
		});

		this.name = 'ConflictError';
	}
}

export default ConflictError;
