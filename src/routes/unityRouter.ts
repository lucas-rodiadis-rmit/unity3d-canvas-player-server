import { Request, Response, Router } from "express";
import path from "path";

import * as fs from "fs";
import { getUnityAppConfig } from "../database";

const router = Router();

function playerFunction(req: Request, res: Response) {
	// res.send("<html> <iframe src='../../dist/index.html' width='50%' 'height=50%' /> </html>");

	if (!req.params.appId) {
		res.status(400).send("Bad request.");
		return;
	}
	// Stub for clinic sim
	else if (req.params.appId != "test123456") {
		res.status(404).send(
			`No app found for ${req.params.appId}.`
		);
		return;
	}

	const appConfig = getUnityAppConfig("test123456");

	// TODO: Log that someone created a session for the app
	let reactEntryPoint: string = fs.readFileSync(
		path.join(
			process.cwd(),
			"resources",
			"player",
			"index.html"
		),
		"utf-8"
	);

	// TODO: Fix this to be robust against XSS scripting
	reactEntryPoint = reactEntryPoint.replace(
		"__UNITY_CONFIG__",
		JSON.stringify(appConfig)
	);

	res.set("Content-Type", "text/html");
	res.send(reactEntryPoint);
}

// Serve Unity player at the 'unity-player' endpoint
router.post("/unity-player/:appId", playerFunction);
router.get("/unity-player/:appId", playerFunction);

export default router;
