import { Request, Response, Router } from "express";
import {
	unityappController,
	userController
} from "../../database";
import { isCreateUnityAppPayload } from "../../types";
import { unityAppConfigFrom } from "../../unity";

const router = Router();

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

router.post(
	"/upload",
	function (req: Request, res: Response) {
		// TODO: Make this fetch the users token so we can say they uploaded the project
		const token = "test_instructor_1";

		let instructor =
			userController.getInstructor(token);

		console.log("Fetched instructor: ", instructor);

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

		// TODO: Create the folder here in storage
		const rootFilepath = "/TEST/ROOT/FILEPATH";

		unityappController.createUnityApp(
			token,
			rootFilepath,
			req.body
		);
	}
);

export default router;
