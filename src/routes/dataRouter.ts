import {
	Request,
	Response,
	Router,
	static as staticRoute
} from "express";
import { UNITY_PROJECTS_FOLDER } from "../constants";

const router = Router();

router.get("/", function (req: Request, res: Response) {
	res.send("Hello world!");
});

router.use("/project", staticRoute(UNITY_PROJECTS_FOLDER));

export default router;
