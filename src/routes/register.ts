import {
	NextFunction,
	Request,
	Response,
	Router
} from "express";

const router = Router();

router.get(
	"/",
	function (
		req: Request,
		res: Response,
		next: NextFunction
	) {
		res.render("index", { title: "Express" });
	}
);
