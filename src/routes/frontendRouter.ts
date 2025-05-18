import { Request, Response, Router } from "express";

import { resourcePath } from "../constants";

const router = Router();

router.get(
	"/:page",
	function (req: Request, res: Response) {
		res.sendFile(resourcePath("frontend/index.html"));
	}
);

export default router;
