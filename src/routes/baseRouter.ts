import { Request, Response, Router } from "express";

const router = Router();

router.get("/", function (req: Request, res: Response) {
	res.send("Hello world!");
});

export default router;
