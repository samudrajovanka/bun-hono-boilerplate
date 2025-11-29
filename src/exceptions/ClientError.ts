import ErrorConstant from '@/constants/error';

interface ClientErrorOptions {
	statusCode?: number;
	type?: string;
	validations?: Record<string, string>;
}

class ClientError extends Error {
	statusCode: number;
	type: string;
	validations?: Record<string, string>;

	constructor(
		message: string = ErrorConstant.message.CLIENT_ERR_MSG,
		options?: ClientErrorOptions,
	) {
		super(message);

		this.statusCode = options?.statusCode ?? 400;
		this.type = options?.type ?? ErrorConstant.type.CLIENT_ERR;
		this.name = 'ClientError';
		this.validations = options?.validations;
	}
}

export default ClientError;
