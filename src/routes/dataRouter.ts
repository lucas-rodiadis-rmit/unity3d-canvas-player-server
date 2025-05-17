import {
	Request,
	Response,
	Router,
	static as staticRoute
} from "express";

import appConfig from "../appConfig";

const router = Router();

router.get("/", function (req: Request, res: Response) {
	res.send("Hello world!");
});

router.use(
	"/project",
	staticRoute(appConfig.unityProjectsDir)
);

export default router;
