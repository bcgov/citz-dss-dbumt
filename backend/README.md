# DBUMT Backend

This service was built using Node and the Express framework.

## Commands

These commands can be found and edited in this folder `citz-dss-dbumt/backend`. To use the commands as shown below run with `npm run <command>`.

| Command    | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `dev`      | Uses `nodemon` to run the applicaiton in development mode with hot reloading. |
| `build`    | Builds the app as a distributable. Can be found in the `./dist` folder   |
| `lint`     | Runs `eslint` to find any linting errors                                 |
| `lint:fix` | Runs `eslint` with `--fix` flag to find and fix linting errors           |
| `format`   | Runs `prettier` with `--write` flag to find and update formatting errors |
| `check`    | Runs `prettier` with `--check` flag to find formatting errors            |

## Usage

Run the application locally (use command above for development mode). The console will display a note similar to `Server started. API listening on port: <PORT>` if the server is running correctly. The server will also attempt to connect to MongoDB running in a Docker container. The console will print `Connected to MongoDB` and `Open connection to MongoDB` if the connection is established.
- To test the health endpoint send a `GET` request to `http://localhost:<PORT>/health`.
- The serrver should return a `200 OK` status.

## Directory

| Item                       | Description                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------ |
|  `src/`                    | Folder holding service files and API server material                                 |
| `.prettier.cjs`            | Configuration file for formatting with prettier                                      |
| `.prettierignore`          | Holds list of files to not be scanned or updated by prettier                         |
| `Dockerfile`               | Used to build backend container for Docker                                           |
| `eslint.config.mjs`        | Configuration file for linting with eslint                                           |
| `package.json`             | Scripts (see commands for more information), dependencies, and other API information |
| `tsconfig.json`            | Configuration file for TypeScript                                                    |
| `README.md`                | This document                                                                        |
