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

## Development

DBUMT is currently currently being built and is in an experimental phase. Watch for the release of v1.0.0 for a more stable version.

Instructions on how to implement DBUMT on your local machine to come.

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
| `package.json`       | Contains run commands for Docker containers                              |
| `README.md`          | This document                                                            |

## Commands

These commands can be found and edited in this folder `citz-dss-dbumt/`. To use the commands as shown below run with `npm run <command>`.

| Command              | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| `up`                 | Build, (re)create, start containers in the background                 |
| `down`               | Stops and removes containers, networks, volumes, and images from `up` |
| `build`              | The same as `up` but faster (build images before starting containers) |
| `prune`              | Same as `down` & remove all Docker elements then `clear-docker-cache` |
| `rebuild`            | Runs `prune` and `up` but will force rebuilding containers            |
| `clear-docker-cache` | Removes the build cache without comfirmation                          |
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
