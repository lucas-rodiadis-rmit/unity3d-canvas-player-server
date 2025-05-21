interface DBResultBase {
	status: "SUCCESS" | "FAILURE" | "ERROR";
}

interface DBResultSuccess extends DBResultBase {
	status: "SUCCESS";
}

interface DBResultFailure extends DBResultBase {
	status: "FAILURE";
}

interface DBResultError extends DBResultBase {
	status: "ERROR";
	message: string;
}

interface DBGetSuccess<T> extends DBResultSuccess {
	data: T;
}

export type DBGetResult<T> =
	| DBGetSuccess<T>
	| DBResultFailure
	| DBResultError;

export type DBGetManyResult<T> =
	| DBGetSuccess<T[]>
	| DBResultError;

export type DBCreateResult<T> =
	| DBGetSuccess<T>
	| DBResultError;

export type DBUpdateResult<T> =
	| DBGetSuccess<T>
	| DBResultError;

export type DBDeleteResult =
	| DBResultSuccess
	| DBResultFailure
	| DBResultError;
