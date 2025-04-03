import {
	Request,
	Response,
	Router
} from "express";


import { ReasonPhrases, StatusCodes } from "http-status-codes";

const router = Router();

router.get("/", function (_, res) {
	res.status(StatusCodes.METHOD_NOT_ALLOWED)
		.set("Allow", "POST")
		.send(ReasonPhrases.METHOD_NOT_ALLOWED);
})

router.post(
	"/",
	function (
		req: Request,
		res: Response,
	) {
		// Put validation here to make sure its a valid registration request coming from canvas
		res.send("Request is good: " + Boolean(req));
	}
);

export default router;
