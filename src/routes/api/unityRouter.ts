import { Request, Response, Router } from "express";
import {
	unityappController,
	userController
} from "../../database";
import { isCreateUnityAppPayload } from "../../shared/types/validation";
import {
	partialUnityAppConfigFrom,
	UnityApp,
	unityAppConfigFrom
} from "../../unity";

import multer from "multer";
import unityappRepository from "../../database/unityapp.repository";

import fs from "fs";
import path from "path";

import appConfig from "../../appConfig";
import requiresCanvasUser from "../../auth/requiresCanvasUser";
import requiresInstructor from "../../auth/requiresInstructor";

const router = Router();

const storage = multer.memoryStorage();

const receiver = multer({
	storage,
	preservePath: true
});

router.get(
	"/:id",
	requiresCanvasUser,
	function (req: Request, res: Response) {
		const app = unityappController.getUnityApp(
			req.params.id
		);

		const config = unityAppConfigFrom(app);

		if (config === null) {
			res.status(404).send("No config available.");
			return;
		}

		res.send(config);
	}
);

router.get(
	"/",
	requiresInstructor,
	function (req: Request, res: Response) {
		const apps = unityappController.getAllUnityApps();
		console.log(`Returning ${apps.length} apps`);

		const configs = apps
			.map((app) => unityAppConfigFrom(app))
			.filter((config) => config !== null);

		console.log(configs);
		res.send(configs);
	}
);

router.post(
	"/",
	requiresInstructor,
	function (req: Request, res: Response) {
		// TODO: Make this fetch the users token so we can say they uploaded the project
		const token = req.session.user?.canvasUserId;
		if (!token) throw Error("No user cookie present.");

		let instructor =
			userController.getInstructor(token);

		// If the requested instructor doesn't exist in the database
		if (instructor === null) {
			instructor = userController.createInstructor(
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

		res.status(201).send(
			partialUnityAppConfigFrom(unityApp)
		);
	}
);

router.post(
	"/:id/upload",
	requiresInstructor,
	receiver.single("chunk"),
	function (req: Request, res: Response) {
		// TODO: Make this fetch the users token so we can say they uploaded the project
		const projectId = req.params.id;

		const canvasUserId = req.session.user?.canvasUserId;

		if (!canvasUserId) {
			throw Error(
				"User accessed unauthorised route /id/upload"
			);
		}

		const unityProject =
			unityappRepository.getUnityProject(projectId);

		if (unityProject.status !== "SUCCESS") {
			res.status(404).send(
				`No app available for project ID ${projectId}`
			);
			return;
		}

		if (unityProject.data.user_id !== canvasUserId) {
			res.status(403).send(
				"You do not own this Unity project, and are unable to update it."
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
			filename.substring(filename.indexOf("/"));

		if (!req.file) {
			res.send(403).send(
				"key 'chunk' missing in request."
			);
			return;
		}

		if (!req.body.offset) {
			res.send(403).send(
				"key 'offset' missing in request."
			);
			return;
		}
		const offset = Number(req.body.offset);

		if (!req.body.path) {
			res.send(403).send(
				"key 'path' missing in request."
			);
			return;
		}

		const filepath = chopFilename(req.body.path);
		const fullFilepath = path.join(
			projectDir,
			filepath
		);

		console.log(`Creating ${fullFilepath}.`);

		fs.mkdirSync(path.dirname(fullFilepath), {
			recursive: true
		});

		const openFile = fs.openSync(
			fullFilepath,
			fs.existsSync(fullFilepath) ? "r+" : "w+"
		);

		fs.writeSync(
			openFile,
			req.file.buffer,
			0,
			req.file.buffer.length,
			offset
		);
		fs.closeSync(openFile);

		console.log(`Writing ${filepath} to database.`);

		unityappController.addUnityProjectFile(projectId, {
			filepath: filepath,
			filesize: req.file.size
		});

		res.status(201).send({
			message: "Successful upload."
		});
	}
);

/*
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
*/

export default router;
