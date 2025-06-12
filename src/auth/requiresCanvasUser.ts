import { NextFunction, Request, Response } from "express";
import appConfig from "../appConfig";

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

	// More lenient on auth for dev
	if (appConfig.nodeEnv === "development") {
		const returnUrl: string = `TEST_RETURN_URL-${new Date().toISOString()}`;

		req.session.user = {
			launchId: "test_context_1",
			isInstructor: true,
			returnUrl: returnUrl,
			canvasUserId: "test_instructor_3"
		};
		next();
		return;
	}

	// Otherwise, we double check the legitimacy of the request and who made it

	const returnUrl: string =
		req.body?.ext_content_return_url;

	// All initial canvas requests would have a return URL. We know it didn't come from Canvas in this case
	if (!returnUrl) {
		console.warn(`Non Canvas request received.`, req);
		res.status(403).send(
			"This route is for Canvas users only."
		);
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
