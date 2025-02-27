import mongoose from "mongoose";
import { ENV } from "../config"

// set env variables from .env to process.env
const { MONGO_USER, MONGO_PASSWORD, APPLICATION_NAME, MONGO_EXTERNAL_PORT, MONGO_SERVICE_NAME } =
  ENV;

/**
 * @summary Establish a connection to MongoDB container.
 *          Will do this with `localhost` URI string if running the ExpressJS server is running from
 *          anywhere except Docker. Nothing needs to be returned once the connection is established.
*/

export const connectDatabase = async () => {
  // Throw an error if the environment variables are not set.
  if (!(MONGO_SERVICE_NAME && APPLICATION_NAME && MONGO_USER && MONGO_PASSWORD))
    throw new Error(
      "One or more of [MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE_NAME, MONGO_HOST] env vars is undefined."
    );

  try {
    // Connection from local ExpressJS server
    const localDBUri = `localhost:${MONGO_EXTERNAL_PORT}/${MONGO_SERVICE_NAME}`
    // Connection from containerized ExpressJS server
    const containerDBUri = `${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_SERVICE_NAME}:${MONGO_EXTERNAL_PORT}/${APPLICATION_NAME}?authSource=admin`

    // if we are running in docker set the uri to use container URI otherwise use local URI
    const mongoURI = process.env.NODE_ENV === 'development' ? containerDBUri : localDBUri

    // log changes to connection to MongoDB
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    mongoose.connection.on('open', () => console.log('Oonnection to MongoDB is open'));
    mongoose.connection.on('disconnected', () => console.log('Disconnected from MongoDB'));
    mongoose.connection.on('reconnected', () => console.log('Reconnected to MongoDB'));
    mongoose.connection.on('disconnecting', () => console.log('Disconnecting from MongoDB'));
    mongoose.connection.on('close', () => console.log('Close connection to MongoDB'));

    // Build the mongoose connection to MongoDB
    await mongoose.connect(`mongodb://${mongoURI}`)

  } catch (err) {
    // catch and log any errors
    console.log("Error connecting to MongoDB")
    console.log(err)
  };
}
