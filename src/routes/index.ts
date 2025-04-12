import {
	Express,
	Router,
	static as staticRoute
} from "express";

import path from "path";

import {
	canvasAuthHandler,
	gzipHandler
} from "../middlewares";

import baseRouter from "./baseRouter";
import embedRouter from "./embedRouter";
import registerRouter from "./registerRouter";
import unityRouter from "./unityRouter";

const router = Router();

// Handle headers of gzip first
router.use(gzipHandler);

// The base routes should be accessible to unauthenticated users
router.use("", baseRouter);

// ALL ROUTES BELOW HERE ARE REQUIRED TO BE AUTHENTICATED
router.use(canvasAuthHandler);

router.use("", unityRouter);
router.use("/register", registerRouter);
router.use("/embed", embedRouter);

router.use(
	"/",
	staticRoute(path.join(__dirname, "../../dist"))
);

export function initialiseRoutes(app: Express) {
	app.use("/", router);
}
