import express, { Express, Request, Response } from "express";
import middleware from "./middleware";
import { ENV } from "./config"

// Access environment variables from ./config
const { PORT } =
  ENV;

// Access all functions from ./middleware
const { connectDatabase } = middleware;

// set up MONGODB
connectDatabase();

// create Express application
const app: Express = express();

// Setup health endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200);
  res.send("API Healthy");
});

// Start the Express app and listen on the predefined port
app.listen(PORT, () => {
  console.log("Server started. API listening on port: ", PORT);
});
