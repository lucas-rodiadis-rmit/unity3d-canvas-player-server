import { Request, Response, Router } from "express";

import { resourcePath } from "../constants";

const router = Router();

// TODO: Clean this up later potentially
router.post(
	"/embed",
	function (req: Request, res: Response) {
		res.sendFile(resourcePath("frontend/index.html"));
	}
);

router.get(
	"/:page",
	function (req: Request, res: Response) {
		res.sendFile(resourcePath("frontend/index.html"));
	}
);

export default router;
