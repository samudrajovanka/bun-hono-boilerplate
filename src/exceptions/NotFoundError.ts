import ErrorConstant from '@/constants/error';
import ClientError from './ClientError';

interface NotFoundErrorOptions {
	type?: string;
	statusCode?: number;
}

class NotFoundError extends ClientError {
	name: string;

	constructor(
		message: string = ErrorConstant.message.NOT_FOUND_ERR_MSG,
		options?: NotFoundErrorOptions,
	) {
		super(message, {
			type: options?.type ?? ErrorConstant.type.NOT_FOUND_ERR,
			statusCode: 404,
		});

		this.name = 'NotFoundError';
	}
}

export default NotFoundError;
