import mongoose from "mongoose";
import { ENV } from "../config"

// set env variables from .env to process.env
const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE_NAME, MONGO_EXTERNAL_PORT, MONGO_HOST } =
  ENV;

export const connectDatabase = async () => {
  if (!(MONGO_HOST && MONGO_DATABASE_NAME && MONGO_USER && MONGO_PASSWORD))
    throw new Error(
      "One or more of [MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE_NAME, MONGO_HOST] env vars is undefined."
    );

  try {
    // if we are running in docker set the uri to use 'mongod' otherwise use localhost
    const hostEnv = process.env.NODE_ENV === 'docker' ? 'mongodb' : 'localhost'
    const databaseUri = `mongodb://${hostEnv}:${MONGO_EXTERNAL_PORT}/${MONGO_HOST}`

    const connection = await mongoose.connect(databaseUri)
    if (connection)
      console.log("Connected to MongoDB")
  } catch (err) {
    console.log("Error connecting to MongoDB")
    console.log(err)
  };
}
