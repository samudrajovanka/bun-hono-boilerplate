import ErrorConstant from '@/constants/error';
import ClientError from './ClientError';

interface InvariantErrorOptions {
	type?: string;
	statusCode?: number;
}

class InvariantError extends ClientError {
	name: string;

	constructor(
		message: string = ErrorConstant.message.INVARIANT_ERR_MSG,
		options?: InvariantErrorOptions,
	) {
		super(message, {
			type: options?.type ?? ErrorConstant.type.INVARIANT_ERR,
			statusCode: 400,
		});

		this.name = 'InvariantError';
	}
}

export default InvariantError;
