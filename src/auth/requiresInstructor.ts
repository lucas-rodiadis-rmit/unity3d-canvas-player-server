import { NextFunction, Request, Response } from "express";
import requiresCanvasUser from "./requiresCanvasUser";

const requiresInstructor = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Call requiresCanvasUser, then call our logic afterwards
	requiresCanvasUser(req, res, (err?: any) => {
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
	});
};

export default requiresInstructor;
