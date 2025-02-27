// Environment variables set in the .env file.
const {
  APPLICATION_NAME,
  BACKEND_PORT,
  MONGO_EXTERNAL_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_SERVICE_NAME,
} = process.env;

// Exported configuration values.
export default {
  APPLICATION_NAME,
  PORT: BACKEND_PORT ? Number(BACKEND_PORT) : 3200,
  MONGO_EXTERNAL_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_SERVICE_NAME,
};
