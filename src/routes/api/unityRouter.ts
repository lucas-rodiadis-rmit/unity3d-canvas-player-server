import { Request, Response, Router } from "express";
import { unityappController } from "../../database";
import { unityAppConfigFrom } from "../../unity";

const router = Router();

router.get("/:id", function (req: Request, res: Response) {
	const config = unityAppConfigFrom(
		unityappController.getUnityApp(req.params.id)
	);

	if (config === null) {
		res.status(404);
		return;
	}

	res.send(config);
});

export default router;
