import "dotenv/config.js";
import express, { Application } from "express";
import * as modules from "./modules";
import errorHandler from "./middleware/errorHandler";

// Define and create the express app
const app: Application = express();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTING to controllers
app.use("/health", modules.healthRouter);
app.use("/passwordUpdate", modules.passwordUpdateRouter);

// Error handler middleware. Must come last
app.use(errorHandler);

export default app;
