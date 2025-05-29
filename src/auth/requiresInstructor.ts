import { NextFunction, Request, Response } from "express";

const requiresInstructor = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (
		!req.session.user ||
		!req.session.user.isInstructor
	) {
		res.status(403).send(
			"This route is for instructors only."
		);
		return;
	}

	next();
};

export default requiresInstructor;
