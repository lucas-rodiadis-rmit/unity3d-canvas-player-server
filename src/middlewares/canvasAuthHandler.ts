import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const canvasAuthHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// TODO: Implement actual authentication here from canvas
	const auth: boolean = true;

	if (!auth) {
		console.log(
			`Unable to authenticate request to ${req.url}.`
		);

		// Do not pass the request on to other handlers and end it here
		res.status(StatusCodes.UNAUTHORIZED);
		res.send(`Unauthorised to access ${req.url}`);
		return;
	}

	next();
};
