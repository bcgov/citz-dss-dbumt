# DBUMT Backend

This service was built using Node and the Express framework.

## Commands

These commands can be found and edited in this folder `citz-dss-dbumt/backend/package.json`. To use the commands as shown below run with `npm run <Command>`.

| Command    | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `dev`      | Uses `nodemon` to run the applicaiton in development mode with hot reloading. |
| `build`    | Builds the app as a distributable. Can be found in the `./dist` folder   |
| `lint`     | Runs `eslint` to find any linting errors                                 |
| `lint:fix` | Runs `eslint` with `--fix` flag to find and fix linting errors           |
| `format`   | Runs `prettier` with `--write` flag to find and update formatting errors |
| `check`    | Runs `prettier` with `--check` flag to find formatting errors            |

## Usage

Run the application locally (use command above for development mode). The console will display a note similar to `DBUMT Server Started Successfully. Listening on port: <BACKEND_PORT>` if the server is running correctly. The server will also attempt to connect to MongoDB running in a Docker container. The console will print `Connection successful.` and `Connection open.` if the connection is established.
- To test the health endpoint send a `GET` request to `http://localhost:<PORT>/health/server`.
- The server should return a `200 OK` status.

## Directory

| Item                       | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `src/`                     | Folder holding service files and API server material                                 |
|   `src/config/`                |   Used to set environment variables.                                                 |
|   `src/constants/`             |   Values that are set and never updated. Can be used across `backend/src`.           |
|   `src/middleware/`            |   Operations that communicate between modules and external services.                 |
|   `src/modules/`               |   Self-written endpoints, provide the core functionality of the backend.             |
|   `src/types/`               |   Interfaces and types defined here and used across the backend code     |
|   `src/utilities/`             |   Reusable functions, helpers, and common code for files within `backend/src`.       |
| `.prettier.cjs`            | Configuration file for formatting with prettier                                      |
| `.prettierignore`          | Holds list of files to not be scanned or updated by prettier                         |
| `Dockerfile`               | Used to build backend container for Docker                                           |
| `eslint.config.mjs`        | Configuration file for linting with eslint                                           |
| `package.json`             | Scripts (see commands for more information), dependencies, and other API information |
| `tsconfig.json`            | Configuration file for TypeScript                                                    |
| `README.md`                | This document                                                                        |
