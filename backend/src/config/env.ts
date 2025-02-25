// Environment variables set in the .env file.
const {
  BACKEND_PORT,
  MONGO_EXTERNAL_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DATABASE_NAME,
  MONGO_HOST,
} = process.env;

// Exported configuration values.
export default {
  PORT: BACKEND_PORT ? Number(BACKEND_PORT) : 3200,
  MONGO_EXTERNAL_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DATABASE_NAME,
  MONGO_HOST,
};
