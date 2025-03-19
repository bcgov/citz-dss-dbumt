import "dotenv/config.js";
import express, { Application } from "express";

// test update to a backend file to see if action runs

// Define and create the express app
const app: Application = express();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default app;
