import {
	Express, urlencoded, json,
	Router,
	static as staticRoute
} from "express";

import path from "path";

import {
	canvasAuthHandler,
	gzipHandler
} from "../middlewares";

import morgan from "morgan";

import baseRouter from "./baseRouter";
import embedRouter from "./embedRouter";
import registerRouter from "./registerRouter";
import unityRouter from "./unityRouter";

const router = Router();

router.use(morgan("common"));

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
	app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
	app.use(json()); // optional, for automatically parsing json bodies
	app.use("/", router);
}
