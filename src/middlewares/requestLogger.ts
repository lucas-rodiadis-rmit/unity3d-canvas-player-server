import { NextFunction, Request, Response } from "express";
export const gzipHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("New request: ", JSON.stringify(req));
	next();
};
