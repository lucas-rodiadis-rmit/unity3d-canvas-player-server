import registerRouter from "./registerRouter";
import baseRouter from "./baseRouter";
import embedRouter from "./embedRouter";
import { Router } from "express";
import { Express } from "express";

const router = Router();

router.use("", baseRouter);
router.use("/register", registerRouter);
router.use("/embed", embedRouter);

export function initialiseRoutes(app: Express) {
	app.use("/", router);
}


