import { Request, Response, Router } from "express";
import path from "path";

import * as fs from "fs";

const router = Router();

// Serve Unity player at the 'unity-player' endpoint
router.post(
	"/unity-player",
	function (req: Request, res: Response) {
		// res.send("<html> <iframe src='../../dist/index.html' width='50%' 'height=50%' /> </html>");

		let reactEntryPoint: string = fs.readFileSync(
			path.join(__dirname, "../../dist/index.html"),
			"utf-8"
		);

		// TODO: Fix this to be robust against XSS scripting
		reactEntryPoint = reactEntryPoint.replace(
			"__UNITY_CONFIG__",
			JSON.stringify({
				buildUrl: "/ClinicSim/Build"
			})
		);

		res.set("Content-Type", "text/html");
		res.send(reactEntryPoint);
	}
);

export default router;
