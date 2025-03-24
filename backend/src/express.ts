import "dotenv/config.js";
import express, { Application } from "express";

// Define and create the express app
const app: Application = express();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// new test
export default app;
