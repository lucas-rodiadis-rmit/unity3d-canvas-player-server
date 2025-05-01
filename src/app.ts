import express from "express";

import { initialiseDb } from "./database";
import { errorHandler } from "./middlewares";
import { initialiseRoutes } from "./routes";

import { exit } from "process";

if (!initialiseDb(true)) {
	console.error(
		"\nUnable to initialise the database. Exiting now."
	);
	exit(1);
}

const app = express();

// app.use(express.json());
initialiseRoutes(app);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
