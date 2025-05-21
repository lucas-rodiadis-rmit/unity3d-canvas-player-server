import express from "express";

import cors from "cors";
import { exit } from "process";

import { errorHandler } from "./middlewares";
import { initialiseRoutes } from "./routes";

import { initDatabase } from "./database";

if (!initDatabase(true, true)) {
	console.error(
		"\nUnable to initialise the database. Exiting now."
	);
	exit(1);
}

const app = express();

if (true) {
	app.use(cors());
}

// app.use(express.json());
initialiseRoutes(app);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
