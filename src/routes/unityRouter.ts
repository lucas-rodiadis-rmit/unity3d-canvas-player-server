import { Request, Response, Router } from "express";
import path from "path";

import { static as staticRoute } from "express";

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

	// TODO: Check if the appId is valid and exists in the database
	const appId: string = req.params.appId;
	// TODO: Currently set only to use test123456 appId
	const appConfig = getUnityAppConfig(appId);

	// TODO: Log that someone created a session for the app
	let reactEntryPoint: string = fs.readFileSync(
		path.join(
			process.cwd(),
			"storage",
			"unity_projects",
			appId,
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

router.use(
	"/unity-player",
	staticRoute(
		path.join(
			process.cwd(),
			"src",
			"public",
			"frontend"
		)
	)
);

export default router;
