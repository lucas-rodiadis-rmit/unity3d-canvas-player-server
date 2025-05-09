import express from "express";

import dotenv from "dotenv";
import { exit } from "process";

import { errorHandler } from "./middlewares";
import { initialiseRoutes } from "./routes";

import { initDatabase } from "./database";

// Load environment variables from .env file
dotenv.config();

if (!initDatabase(true)) {
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
