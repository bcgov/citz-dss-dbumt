import "dotenv/config.js";
import express, { Application, Request, Response } from "express";
import * as modules from "./modules";

// Define and create the express app
const app: Application = express();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTING to controllers
app.use('/health', modules.healthRouter);
app.use("/passwordUpdate", modules.passwordUpdateRouter);

export default app;
