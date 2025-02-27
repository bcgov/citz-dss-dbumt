import mongoose from "mongoose";
import { ENV } from "../config"

// set env variables from .env to process.env
const { MONGO_USER, MONGO_PASSWORD, APPLICATION_NAME, MONGO_EXTERNAL_PORT, MONGO_SERVICE_NAME } =
  ENV;

export const connectDatabase = async () => {
  if (!(MONGO_SERVICE_NAME && APPLICATION_NAME && MONGO_USER && MONGO_PASSWORD))
    throw new Error(
      "One or more of [MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE_NAME, MONGO_HOST] env vars is undefined."
    );

  try {
    const localDBUri = `localhost:${MONGO_EXTERNAL_PORT}/${MONGO_SERVICE_NAME}`
    const containerDBUri = `${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_SERVICE_NAME}:${MONGO_EXTERNAL_PORT}/${APPLICATION_NAME}?authSource=admin`

    // if we are running in docker set the uri to use container URI otherwise use local URI
    const mongoURI = process.env.NODE_ENV === 'development' ? containerDBUri : localDBUri
    console.log("attempting to connect to MongoDB with: ", `mongodb://${mongoURI}`)

    const connection = await mongoose.connect(`mongodb://${mongoURI}`)
    if (connection)
      console.log("Connected to MongoDB")
  } catch (err) {
    console.log("Error connecting to MongoDB")
    console.log(err)
  };
}
