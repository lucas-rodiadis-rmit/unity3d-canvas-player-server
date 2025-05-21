import { Request, Response, Router } from "express";
import { unityappController } from "../../database";
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

export default router;
