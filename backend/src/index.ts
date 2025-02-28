import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { logs } from "./utilities";

// set env variables from .env to process.env
dotenv.config();

// create Express application
const app: Express = express();
// get PORT variable from `.env`
const PORT = process.env.BACKEND_PORT;

// Setup health endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200);
  res.send("API Healthy");
});

// Start the Express app and listen on the predefined port
app.listen(PORT, () => {
  console.log(logs.API.SERVER_STARTED, PORT);
});
