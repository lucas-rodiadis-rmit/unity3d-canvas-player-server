import {
	Express,
	json,
	Router,
	static as staticRoute,
	urlencoded
} from "express";

import { gzipHandler } from "../middlewares";

import morgan from "morgan";

import { resourcePath } from "../constants";

import appConfig from "../appConfig";
import requiresCanvasUser from "../auth/requiresCanvasUser";
import requiresCanvasUserDev from "../auth/requiresCanvasUserDev";
import apiRouter from "./api";
import baseRouter from "./baseRouter";
import dataRouter from "./dataRouter";
import frontendRouter from "./frontendRouter";
import unityRouter from "./unityRouter";

const router = Router();

router.use(morgan("common"));

// Handle headers of gzip first
router.use(gzipHandler);

// The base routes should be accessible to unauthenticated users
router.use("", baseRouter);

// ALL ROUTES BELOW HERE ARE REQUIRED TO BE AUTHENTICATED
if (appConfig.nodeEnv === "development") {
	router.use(requiresCanvasUserDev);
} else {
	router.use(requiresCanvasUser);
}

router.use("/data", dataRouter);
//
// router.use(
// 	["/frontend/", "/frontend/index\.html"],
// 	(req: Request, res: Response) => {
// 		res.status(403).send("Forbidden");
// 	}
// );

// Define endpoints using modularised routers
router.use("", unityRouter);

router.use("/api/v1", apiRouter);

// Set static for public resources
router.use("/", staticRoute(resourcePath("frontend")));
router.use("/", staticRoute(resourcePath("public")));
router.use("/", frontendRouter);

export function initialiseRoutes(app: Express) {
	// Automatically parse application/x-www-form-urlencoded request bodies
	app.use(urlencoded({ extended: true }));

	// Automatically parse application/json request bodies
	app.use(json());

	// Attach the main router to handle all routes
	app.use("/", router);
}
