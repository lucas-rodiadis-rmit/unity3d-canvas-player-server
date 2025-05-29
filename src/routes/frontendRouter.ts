import { Request, Response, Router } from "express";

import { loadResource } from "../constants";

import appConfig from "../appConfig";

const router = Router();

interface ReactAppData {
	returnUrl?: string;
	newToken?: string;
}

function returnReactApp(
	res: Response,
	data?: ReactAppData
): void {
	let reactEntryPoint: string | null = loadResource(
		"frontend/index.html"
	);

	if (reactEntryPoint === null) {
		throw Error(
			`Unable to read React entry point at ${appConfig.resourcesDir}/index.html`
		);
	}

	// TODO: Fix this to be robust against XSS scripting
	reactEntryPoint = reactEntryPoint.replace(
		"__LOCAL_DATA__",
		JSON.stringify(data || {})
	);

	res.set("Content-Type", "text/html");
	res.send(reactEntryPoint);
}

/**
 * Route to handle LTI Embed selection requests
 */
router.post(
	"/embed",
	function (req: Request, res: Response) {
		// // TODO: Replace this with a real database call
		// setReturnUrl(returnUrl);

		// TODO: Make this input the return url into cache and generate a token
		returnReactApp(res, {
			returnUrl: req.session.user?.returnUrl,
			newToken: "test_token"
		});
	}
);

// TODO: Make this route debug/test only
router.get(
	"/embed",
	function (req: Request, res: Response) {
		// TODO: Make this input the return url into cache and generate a token
		returnReactApp(res, { newToken: "test_token" });
	}
);

router.get(
	"/:page",
	function (req: Request, res: Response) {
		returnReactApp(res);
	}
);

export default router;
