import { Request, Response, Router } from "express";
import {
	unityappController,
	userController
} from "../../database";
import { isCreateUnityAppPayload } from "../../types";
import { UnityApp, unityAppConfigFrom } from "../../unity";

import multer from "multer";
import unityappRepository from "../../database/unityapp.repository";

import fs from "fs";
import path from "path";

import appConfig from "../../appConfig";

const router = Router();

const storage = multer.memoryStorage();

const receiver = multer({
	storage,
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

router.post("/", function (req: Request, res: Response) {
	// TODO: Make this fetch the users token so we can say they uploaded the project
	const token = "test_instructor_1";

	let instructor = userController.getInstructor(token);

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
		res.status(403).send("Invalid payload received.");
		return;
	}

	let unityApp: UnityApp | null = null;

	try {
		unityApp = unityappController.createUnityApp(
			token,
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
});

router.post(
	"/upload",
	receiver.array("files"),
	function (req: Request, res: Response) {
		const projectId = req.body.projectId;
		if (!projectId) {
			res.status(403).send("No projectId provided.");
			return;
		}

		if (!req.files) {
			res.status(403).send("No files provided.");
			return;
		}

		// TODO: Make this fetch the users token so we can say they uploaded the project
		const token = "test_instructor_1";

		const unityProject =
			unityappRepository.getUnityProject(projectId);

		if (unityProject.status !== "SUCCESS") {
			res.status(404).send(
				`No app available for project ID ${projectId}`
			);
			return;
		}

		const projectDir = path.join(
			appConfig.unityProjectsDir,
			unityProject.data.root_filepath
		);

		if (!fs.existsSync(projectDir)) {
			fs.mkdirSync(projectDir);
		}

		// Removes up to the first folder
		const chopFilename = (filename: string) =>
			(filename = filename.substring(
				filename.indexOf("/")
			));

		console.log("Server received files: ", req.files);

		if (Array.isArray(req.files)) {
			for (const file of req.files) {
				const filepath = path.join(
					projectDir,
					chopFilename(file.originalname)
				);

				console.log(`Creating ${filepath}.`);

				fs.mkdirSync(path.dirname(filepath), {
					recursive: true
				});

				fs.writeFileSync(filepath, file.buffer);

				console.log(
					`Writing ${filepath} to database.`
				);

				unityappController.addUnityProjectFile(
					projectId,
					{
						filepath,
						filesize: file.size
					}
				);
			}
		}

		res.status(201).send(
			unityAppConfigFrom(
				unityappController.getUnityApp(projectId)
			)
		);
	}
);

export default router;
