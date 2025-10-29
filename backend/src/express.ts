import "dotenv/config.js";
import express, { Application } from "express";
import cors from "cors";
import * as modules from "./modules";
import errorHandler from "./middleware/errorHandler";

// Define and create the express app
const app: Application = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTING to controllers
app.use("/health", modules.healthRouter);
app.use("/passwordUpdate", modules.passwordUpdateRouter);
app.use("/verifyAccount", modules.verifyAccountRouter);
app.use("/changePassword", modules.changePasswordRouter);

// Error handler middleware. Must come last
app.use(errorHandler);

export default app;
