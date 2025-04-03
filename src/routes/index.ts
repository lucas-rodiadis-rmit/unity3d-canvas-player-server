import registerRouter from "./registerRouter";
import baseRouter from "./baseRouter";
import { Router } from "express";
import { Express } from "express";

const router = Router();

router.use("", baseRouter);
router.use("/register", registerRouter);

export function initialiseRoutes(app: Express) {
	app.use("/", router);
}


