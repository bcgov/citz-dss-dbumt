import app from "./express";
import { database, logs } from "@/middleware";
import { ENV } from "@/config";

// Access environment variables from ./config
const { PORT } = ENV;

// Access all functions from ./middleware
const { connectDatabase } = database;

// set up MONGODB
connectDatabase();
// test backend build
// with new token

// Start the Express app and listen on the predefined port
app.listen(PORT, () => {
  console.log(logs.API.SERVER_STARTED, PORT);
});
