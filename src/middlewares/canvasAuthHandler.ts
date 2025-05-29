import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import session from "express-session";

export const canvasAuthHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// If no cookie exists
	if (!req.session.user) {
		console.log(
			`Unable to authenticate request to ${req.url}.`
		);

		// Do not pass the request on to other handlers and end it here
		res.status(StatusCodes.UNAUTHORIZED);
		res.send(`Unauthorised to access ${req.url}`);
		return;
	}

	next();

	// If no cookie exists
	if (!req.session.user) {
		console.log(
			`Unable to authenticate request to ${req.url}.`
		);

		// Do not pass the request on to other handlers and end it here
		res.status(StatusCodes.UNAUTHORIZED);
		res.send(`Unauthorised to access ${req.url}`);
		return;
	}

	session({
		secret: "your-secret-key",
		resave: false,
		saveUninitialized: false
	});

	next();
};
