import { Request, Response, Router } from "express";

import { loadResource } from "../constants";

import appConfig from "../appConfig";

const router = Router();

function returnFrontend<T>(res: Response, data?: T): void {
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

// TODO: Clean this up later potentially
router.post(
	"/embed",
	function (req: Request, res: Response) {
		console.log("BODY:", req.body);

		const returnUrl: string =
			req.body?.ext_content_return_url;

		if (!returnUrl) {
			console.warn(
				"No ext_content_return_url found in request body."
			);
			res.status(400).send("Missing return URL");
			return;
		}

		// TODO: Make this input the return url into cache and generate a token
		returnFrontend(res, { token: "test_token" });
	}
);

// TODO: Make this route debug/test only
router.get(
	"/embed",
	function (req: Request, res: Response) {
		const returnUrl: string = "TEST_RETURN_URL";
		if (!returnUrl) {
			console.warn(
				"No ext_content_return_url found in request body."
			);
			res.status(400).send("Missing return URL");
			return;
		}

		// TODO: Make this input the return url into cache and generate a token
		returnFrontend(res, { token: "test_token" });
	}
);

router.get(
	"/:page",
	function (req: Request, res: Response) {
		returnFrontend(res);
	}
);

export default router;
