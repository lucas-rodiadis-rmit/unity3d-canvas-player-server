import { Request, Response, Router } from "express";

import { getUnityAppConfig } from "../database";

const router = Router();

router.get(
	"/unity-config/:id",
	function (req: Request, res: Response) {
		const config = getUnityAppConfig(req.params.id);

		if (config === null) {
			res.status(404);
			return;
		}

		res.send(config);
	}
);

export default router;
