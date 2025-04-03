import express from "express";
import { errorHandler } from "./middlewares/errorHandler";

import { initialiseRoutes } from "./routes";


const app = express();

// app.use(express.json());
initialiseRoutes(app);


// Global error handler (should be after routes)
app.use(errorHandler);



export default app;
