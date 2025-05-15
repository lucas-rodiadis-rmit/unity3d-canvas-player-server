import {
	Express,
	json,
	Request,
	Response,
	Router,
	static as staticRoute,
	urlencoded
} from "express";

import {
	canvasAuthHandler,
	gzipHandler
} from "../middlewares";

import morgan from "morgan";

import { resourcePath } from "../constants";
import baseRouter from "./baseRouter";
import dataRouter from "./dataRouter";
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

router.use("/data", dataRouter);

router.use(
	"/frontend/index.html",
	(_req: Request, res: Response) => {
		res.status(403).send("Forbidden");
	}
);

router.use(
	"/frontend",
	staticRoute(resourcePath("frontend"))
);

// Define endpoints using modularised routers
router.use("", unityRouter);
router.use("/register", registerRouter);
router.use("/embed", embedRouter);

// Set static for public resources
router.use("/", staticRoute(resourcePath("public")));

export function initialiseRoutes(app: Express) {
	// Set up the EJS templating engine for rendering views
	app.set("view engine", "ejs");
	app.set("views", resourcePath("views"));

	// Automatically parse application/x-www-form-urlencoded request bodies
	app.use(urlencoded({ extended: true }));

	// Automatically parse application/json request bodies
	app.use(json());

	// Attach the main router to handle all routes
	app.use("/", router);
}
