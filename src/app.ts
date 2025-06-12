import express from "express";

import cors from "cors";
import { exit } from "process";

import { errorHandler } from "./middlewares";
import { initialiseRoutes } from "./routes";

import { initDatabase } from "./database";

import session from "express-session";
import appConfig from "./appConfig";

if (!initDatabase(true, true)) {
	console.error(
		"\nUnable to initialise the database. Exiting now."
	);
	exit(1);
}

const app = express();

// For parsing JSON from frontend
app.use(express.json());

if (appConfig.nodeEnv === "development") {
	app.use(cors());
}

// Define the format of the "Session Data"
declare module "express-session" {
	interface SessionData {
		user?: {
			canvasUserId: string;
			launchId: string;
			isInstructor: boolean;
			returnUrl?: string;
			// roles: string[];  Could store a list of all roles for the user in the future
		};
	}
}

const sessionProps: session.SessionOptions = {
	name: "canvasunityplayer.sid",
	secret: "SESSION_SECRET",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: false,
		sameSite: "none", // Required for cross-site cookies, which is exactly what we're doing
		maxAge: 1000 * 60 * 60 // 1 hour
	}
};

// App is running behind nginx, need trust proxy
if (appConfig.nodeEnv !== "development") {
	sessionProps.cookie!.secure = true;
	app.set("trust proxy", 1);
}

app.use(session(sessionProps));

// app.use(express.json());
initialiseRoutes(app);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
