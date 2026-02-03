# Database Utility Management Tool (DBUMT)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

## Overview

DBUMT aims to provide B.C. Geographic Warehouse (BCGW) account management tools within one application. The first two tools within DBUMT are as follows:

1. The Oracle Change Password tool will be used to update passwords for BCGW.
2. The account query tool will be used to quickly query an Oracle user's privileges for the BCGW.


## Issues

This repository is managed by the Data Publication Service (DPS) team. If you have a question or concern for the team please subit a ticket through the [service portal](https://dpdd.atlassian.net/servicedesk/customer/portal/1/group/5).

If you wish to make a change to the repository please create an issue.

## Environment Variables (.env)

This project uses environment variables for configuration. Most variable names are self-explanatory. Refer to env-template.txt file to see the full list of environment variables. A few items need some notes explained below.

| Item                    | Description                            |
| ----------------------- | -------------------------------------- |
| `APPLICATION_NAME`      | Application name, also used for Mongo database name |
| `ORACLE_CLIENT_LOCAL_PATH`  | The applicatopm uses Oracle connection in thick mode so needs Oracle client to exist on the machine, this variable holds the path to the client     |
| `CORS_ORIGIN`             | If you leave it blank, it will allow all origins        |
|  `MONGO_IMAGE_TAG` | Only used by docker compose file and indicates MongoDB image tag to be used    |
|  `MONGO_SERVICE_NAME` | Depending on how and where your MongoDB is running, it can be either the service name or the URL, for example if you are running MongoDB locally, it is `localhost` but if you are using docker, it is `MongoDB`    |
| `MONGO_ROOT_USER`            | This is MongoDB's root (admin) username. This is only used by mongo-init.js to connect and create the application database and user. Refer to the docker-compose file to see how mongo-init.js is used   |
| `MONGO_ROOT_PASSWORD`          | This is MongoDB's root (admin) password. This is only used by mongo-init.js to connect and create the application database and user. Refer to the docker-compose file to see how mongo-init.js is used |
| `VITE_API_BASE_URL`          | The API base URL (Backend URL) which is used by the frontend (Vite in development) to call API. |

## Development

This section explains how to run dbumt locally for development.

1- Create your local .env

Copy the template file `env-template.txt` to .env to create your local env file:  
Don’t commit your .env. It is ignored by git.

2- Configure each variable in .env file

3- From the reposiotry root, run  
`docker compose up --build`

This typically starts:

backend API  
frontend dev server  
MongoDB

Verify services

Backend: http://localhost:<BACKEND_PORT>  
Frontend: http://localhost:<FRONTEND_PORT>  
MongoDB: mongodb://localhost:<MONGO_EXTERNAL_PORT>  

To Stop everything run  
`docker compose down`

Alternatively, you can run them locally without docker. This can be helpful when actively developing and you have a lot of changes and development:

1- You can either run MongoDB locally or run the container (only MongoDB container) created earlier.  

2- Open the frontend folder in Visual Studio Code, and in the Terminal run:  
`npm install`  
`npm run dev`  
This will also gives you hot-reloading to help with development and debugging.

3- Open the backend folder in Visual Studio Code. Run  
`npm install`  
Then create .vscode/launch.json with the content bellow:

```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug with Nodemon + ts-node",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/nodemon",
      "runtimeArgs": [
        "--exec",
        "${workspaceFolder}/node_modules/.bin/ts-node.cmd",
        "-r",
        "tsconfig-paths/register",
        "-r",
        "dotenv/config"
      ],
      "args": ["./src/index.ts"],
      "env": {
        "DOTENV_CONFIG_PATH": "../.env",
        "NODE_ENV": "development"
      },
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}\\src\\index.ts",
      "outFiles": ["${workspaceFolder}/**/*.js"],
      "restart": true,
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}

```

This gives you the debug option directy through VScode. You can Run with or without debugging.


## Directory

| Item                 | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `.github/`           | Holds Github related files. See `.github/README.md` for more informaiton |
| `backend/`           | Backend services. See `backend/README.md` for more information           |
| `frontend/`          | Frontend application. See `frontend/README.md` for more information      |
| `.gitattributes`     | Sets standards for development between different environments            |
| `.gitignore`         | Defined files not to be tracked by Github                                |
| `CODE_OF_CONDUCT.md` | Sets standards for contributing to this repository.                      |
| `docker-compose.yml` | Used to build a collection of containers (frontend, backend, mongodb)    |
| `env-template.txt`   | All environment variable names required to run DBUMT locally             |
| `LICENSE`            | The Apache 2.0 license documentation.                                    |
| `package.json`       | Contains run commands for Podman containers                              |
| `mongodb-init.js`          | This script is loaded as a initialize script for MongoDB by Docker compose. It uses the variables provided in .env file to create a database named <APPLICATION_NAME> and database username and password as in <MONGO_USER> and <MONGO_PASSWORD> |
| `README.md`          | This document                                                            |

## Commands

These commands can be found and edited in this folder `citz-dss-dbumt/`. To use the commands as shown below run with `npm run <command>`.

| Command              | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `up`                 | Build, (re)create, start containers in the background                 |
| `down`               | Stops and removes containers, networks, volumes, and images from `up` |
| `build`              | The same as `up` but faster (build images before starting containers) |
| `prune`              | Same as `down` & remove all Podman elements then `clear-podman-cache` |
| `rebuild`            | Runs `prune` and `up` but will force rebuilding containers            |
| `clear-podman-cache` | Removes the build cache without comfirmation                          |
| `shell:mongo`        | Runs an instance of MongoDB shell in the terminal                     |


## .github

<!-- This section is included here as a README in `.github` directory will take precedence over any root file -->

### Overview

The `/github` folder holds any content that is to be used by Github (workflows, actions, templates, ect.).

### Directory

| Item                    | Description                            |
| ----------------------- | -------------------------------------- |
| `ISSUE_TEMPLATE`        | Folder holding issue templates created |
|  ---- `bug_report.yml`  | Standard issue for reporting a bug     |
| `workflows`             | Folder holding all workfolows          |
|  ---- `pr-labeller.yml` | Action to add `labeler.yaml` to PRs    |
| `CODEOWNERS`            | List of github users with owner role   |
| `labeler.yaml`          | Labels to be applied to pull requests. |
| `PULL_REQUEST_TEMPLATE` | Standard pull request template         |
| `README.md`             | This document                          |

## License

```md
Copyright 2025 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
