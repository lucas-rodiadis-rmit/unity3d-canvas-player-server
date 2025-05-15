import {
	Request,
	Response,
	Router,
	static as staticRoute
} from "express";

import { storagePath } from "../constants";

const router = Router();

router.get("/", function (req: Request, res: Response) {
	res.send("Hello world!");
});

router.use(
	"/project/",
	staticRoute(storagePath("unity_projects"))
);

export default router;
