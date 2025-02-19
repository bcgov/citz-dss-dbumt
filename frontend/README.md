# DBUMT Frontend

This service was built using the Vite and the React framework. It runs using Node.

## Commands

These commands can be found and edited in this folder `citz-dss-dbumt/frontend`. To use the commands as shown below run with `npm run <command>`.

| Command    | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `dev`      | Uses `vite` to run the applicaiton in development mode.                  |
| `build`    | Builds the app as a distributable. Can be found in the `./dist` folder   |
| `lint`     | Runs `eslint` to find any linting errors                                 |
| `lint:fix` | Runs `eslint` with `--fix` flag to find and fix linting errors           |
| `format`   | Runs `prettier` with `--write` flag to find and update formatting errors |
| `check`    | Runs `prettier` with `--check` flag to find formatting errors            |

## Usage

Run the application locally (use command `dev` for development mode) and use a web browser to view the applicaiton locally. `5173` is the default port (`http://localhost:5173/`).

## Directory

| Item                       | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| `public/`                  | Folder holding images and other resources for the frontend       |
|  `src/`                    | Folder holding rendering files and application source            |
| `eslint.config.js`         | Configuration file for linting with eslint                       |
| `index.html`               | Main component for application                                   |
| `package.json`             | Scripts, dependencies, and other applicaiton information         |
| `prettierrc.cjs`           | Configuration file for formatting with prettier                  |
| TypeScript config files    | Configuration file for TypeScript                                |
|  ---- `tsconfig.app.json`  | Application configuration (extends or overrides `tsconfig.json`) |
|  ---- `tsconfig.json`      | General TypeScript configuration                                 |
|  ---- `tsconfig.node.json` | Node configuration (extends or overrides `tsconfig.json`)        |
| `vite.config.ts`           | Configuration file for vite                                      |
| `README.md`                | This document                                                    |
