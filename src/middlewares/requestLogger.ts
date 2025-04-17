import { NextFunction, Request, Response } from "express";
export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.log("New request: ", JSON.stringify(req));
	next();
};
