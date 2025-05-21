import { Request, Response, Router } from "express";

import appConfig from "../appConfig";
import { loadResource } from "../constants";
import { unityAppConfigFrom } from "../unity";

import { unityappController } from "../database";

const router = Router();

function playerFunction(req: Request, res: Response) {
	// res.send("<html> <iframe src='../../dist/index.html' width='50%' 'height=50%' /> </html>");

	if (!req.params.appId) {
		res.status(400).send("Bad request.");
		return;
	}

	// TODO: Check if the appId is valid
	const appId: string = req.params.appId;
	const app = unityappController.getUnityApp(appId);
	if (app === null) {
		res.status(404).send(
			`Unable to find project with ID ${appId}`
		);
		return;
	}

	const unityAppConfig = unityAppConfigFrom(app);
	if (unityAppConfig === null) {
		throw Error(
			"Unable to create config from Unity app."
		);
	}

	// TODO: Log that someone created a session for the app
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
		"__UNITY_CONFIG__",
		JSON.stringify(unityAppConfig)
	);

	res.set("Content-Type", "text/html");
	res.send(reactEntryPoint);
}

// Serve Unity player at the 'unity-player' endpoint
router.post("/unity-player/:appId", playerFunction);
router.get("/unity-player/:appId", playerFunction);

export default router;
