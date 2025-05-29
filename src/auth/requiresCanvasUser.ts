import { NextFunction, Request, Response } from "express";

const requiresCanvasUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// If we have seen the user before (ie, they have a cookie), let them through
	if (req.session.user) {
		next();
		return;
	}

	// Otherwise, we double check the legitimacy of the request and who made it

	const returnUrl: string =
		req.body?.ext_content_return_url;

	if (!returnUrl) {
		console.warn(
			"No ext_content_return_url found in request body."
		);
		res.status(400).send("Missing return URL");
		return;
	}

	// TODO: Check signed Canvas data here. For now, let's assume if it looks like it came from Canvas that it came from Canvas
	if (
		typeof req.body.context_id === "string" &&
		typeof req.body.roles === "string" &&
		typeof req.body.user_id === "string"
	) {
		// Create the user's session
		req.session.user = {
			launchId: req.body.context_id,
			isInstructor: req.body.roles === "Instructor",
			returnUrl: req.body.ext_content_return_url,
			canvasUserId: req.body.user_id
		};
	} else {
		res.status(403).send(
			"This route is for Canvas users only."
		);

		return;
	}

	next();
};

export default requiresCanvasUser;
