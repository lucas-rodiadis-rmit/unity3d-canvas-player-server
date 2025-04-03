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
		// Change this to send back the react app instead
		res.send("Hello world!");
	}
);

export default router;
