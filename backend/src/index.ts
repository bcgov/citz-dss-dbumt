import app from "./express";
import { database } from "@/middleware";
import { logs } from "@/utilities";
import { ENV } from "@/config";

// Access environment variables from ./config
const { PORT } = ENV;

// Access all functions from ./middleware
const { connectDatabase } = database;

// set up MONGODB
connectDatabase();

// testing backend build

// Start the Express app and listen on the predefined port
app.listen(PORT, () => {
  console.log(logs.API.SERVER_STARTED, PORT);
});
