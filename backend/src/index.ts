import app from "./express";
import { database, logs } from "@/middleware";
import { ENV } from "@/config";

// Access environment variables from ./config
const { PORT } = ENV;

// Access all functions from ./middleware
const { connectDatabase } = database;

// this is just for testing
console.log("test");

// set up MONGODB
connectDatabase();

// Start the Express app and listen on the predefined port
app.listen(PORT, () => {
  console.log(logs.API.SERVER_STARTED, PORT);
});
