import { Request, Response, Router } from "express";
import {
	unityappController,
	userController
} from "../../database";
import { isCreateUnityAppPayload } from "../../types";
import { UnityApp, unityAppConfigFrom } from "../../unity";

import multer from "multer";

const router = Router();

const receiver = multer({
	dest: "./storage/unity_projects",
	preservePath: true
});

router.get("/:id", function (req: Request, res: Response) {
	const app = unityappController.getUnityApp(
		req.params.id
	);

	const config = unityAppConfigFrom(app);

	if (config === null) {
		res.status(404).send("No config available.");
		return;
	}

	res.send(config);
});

router.get("/", function (req: Request, res: Response) {
	const apps = unityappController.getAllUnityApps();

	const configs = apps
		.map((app) => unityAppConfigFrom(app))
		.filter((config) => config !== null);

	res.send(configs);
});

router.post(
	"/upload",
	receiver.array("files"),
	function (req: Request, res: Response) {
		// TODO: Make this fetch the users token so we can say they uploaded the project
		const token = "test_instructor_1";

		let instructor =
			userController.getInstructor(token);

		// If the requested instructor doesn't exist in the database
		if (instructor === null) {
			instructor = userController.addInstructor(
				token,
				// TODO: Double check this is actually fetching the email from the canvas body
				req.body.email
			);
			// If the instructor failed to be created, we can't proceed
			if (instructor === null) {
				throw Error(
					"Unable to fetch instructor from request."
				);
			}
		}

		if (!isCreateUnityAppPayload(req.body)) {
			res.status(403).send(
				"Invalid payload received."
			);
			return;
		}

		if (!req.files) {
			throw Error("Files undefined.");
		}

		// TODO: Create the folder here in storage
		// TODO: Also verify that this matches the new id (might need to create the new ID first)
		const rootFilepath = "/TEST/ROOT/FILEPATH";
		for (const file in req.files) {
			// TODO: Create each file on the server
			// TODO: Call addUnityProjectFile to add the database entry of the file's existence
		}

		let unityApp: UnityApp | null = null;

		try {
			unityApp = unityappController.createUnityApp(
				token,
				rootFilepath,
				req.body
			);

			if (unityApp === null) throw Error("");
		} catch (error) {
			console.debug(
				"Internal error message: ",
				(error as Error).message
			);
			throw Error("Unable to create Unity app.");
		}

		res.status(201).send(unityAppConfigFrom(unityApp));
	}
);

export default router;
