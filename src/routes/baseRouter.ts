import express, {
	NextFunction,
	Request,
	Response,
	Router
} from "express";
import path from "path";

import * as fs from "fs";

const router = Router();

router.get(
	"/",
	function (
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// Change this to send back the react app instead
		res.send("Hello world!");
	}
);

// Serve Unity player at the 'unity-player' endpoint
router.get(
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
			JSON.stringify({ testKey: "testValue" })
		);

		res.set("Content-Type", "text/html");
		res.send(reactEntryPoint);
	}
);

/**
 * Middleware to set the Content-Encoding header for gzipped files
 * This middleware checks if the requested file ends with .gz and sets the appropriate headers.
 * It also sets the Content-Type header based on the file extension.
 */
router.use((req, res, next) => {
	// If the file ends with .gz, set the Content-Encoding to gzip
	if (req.path.endsWith(".gz")) {
		res.set("Content-Encoding", "gzip");

		// Set the correct content type for .js.gz files
		if (req.path.endsWith(".js.gz")) {
			res.set(
				"Content-Type",
				"application/javascript"
			);
		}

		// Set the correct content type for .wasm files
		if (req.path.endsWith(".wasm.gz")) {
			res.set("Content-Type", "application/wasm");
		}

		if (req.path.endsWith(".data.gz")) {
			res.set(
				"Content-Type",
				"application/octet-stream"
			);
		}
	}

	next();
});

// Serve static files from the 'dist' folder
router.use(
	"/",
	express.static(path.join(__dirname, "../../dist"))
);

export default router;
