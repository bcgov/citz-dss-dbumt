/*  This script initializes a MongoDB database and creates a user with readWrite permissions.
    It is intended to be used as part of a Docker container setup for MongoDB on local development environments.
*/

const dbName = process.env.MONGO_DATABASE || process.env.APPLICATION_NAME;
const user = process.env.MONGO_USER;
const pwd = process.env.MONGO_PASSWORD;

db = db.getSiblingDB(dbName);

// Create the user only if it doesn't already exist
const existing = db.getUser(user);
if (!existing) {
  db.createUser({
    user,
    pwd,
    roles: [{ role: "readWrite", db: dbName }],
  });
} else {
  print(`[INFO] User '${user}' already exists in '${dbName}', skipping createUser.`);
}