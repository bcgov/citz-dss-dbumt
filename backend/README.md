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

Run the application locally (use command above for development mode). The console will display a note similar to `Server started. API listening on port: <PORT>` if the server is running correctly.
- To test the health endpoint send a `GET` request to `http://localhost:<PORT>/health`.
- The serrver should return a `200 OK` status.

## Directory

| Item                       | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
|  `src/`                    | Folder holding service files and API server material             |
| `eslint.config.mjs`        | Configuration file for linting with eslint                       |
| `index.html`               | Main component for application                                   |
| `package.json`             | Scripts, dependencies, and other API information                 |
| `.prettier.cjs`            | Configuration file for formatting with prettier                  |
| `.prettierignore`          | Holds list of files to not be scanned or updated by prettier     |
| `tsconfig.json`            | Configuration file for TypeScript                                |
| `README.md`                | This document                                                    |
