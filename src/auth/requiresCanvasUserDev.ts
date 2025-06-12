import { NextFunction, Request, Response } from "express";

const requiresCanvasUserDev = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// If we have seen the user before (ie, they have a cookie), let them through
	if (req.session.user) {
		next();
		return;
	}

	const returnUrl: string = `TEST_RETURN_URL-${new Date().toISOString()}`;

	req.session.user = {
		launchId: "test_context_1",
		isInstructor: true,
		returnUrl: returnUrl,
		canvasUserId: "test_instructor_3"
	};

	next();
};

export default requiresCanvasUserDev;
