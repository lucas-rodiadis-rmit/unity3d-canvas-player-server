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

import requiresCanvasUser from "../auth/requiresCanvasUser";
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

router.use("/", frontendRouter);
router.use("/api/v1", apiRouter);

// Set static for public resources
router.use("/", staticRoute(resourcePath("frontend")));
router.use("/", staticRoute(resourcePath("public")));

// ALL ROUTES BELOW HERE ARE REQUIRED TO BE AUTHENTICATED
router.use(requiresCanvasUser);

//
// router.use(
// 	["/frontend/", "/frontend/index\.html"],
// 	(req: Request, res: Response) => {
// 		res.status(403).send("Forbidden");
// 	}
// );

router.use("/data", dataRouter);

// Define endpoints using modularised routers
router.use("", unityRouter);

export function initialiseRoutes(app: Express) {
	// Automatically parse application/x-www-form-urlencoded request bodies
	app.use(urlencoded({ extended: true }));

	// Automatically parse application/json request bodies
	app.use(json());

	// Attach the main router to handle all routes
	app.use("/", router);
}
