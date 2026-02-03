# GitHub Workflows

This README will go through the GitHub Actions defined within `.github/workflows`

## Overview of Files

| Name                        | Triggers          | Short Description                                                 |
| --------------------------- | ----------------- | ----------------------------------------------------------------- |
| `backend-image-build-push`  | PR merged to main | Builds the backend image, adds to the ImageStream `dbumt-api` and deploys it on `dev` environment |
| `backend-promote`  | Manual | Gets an environment and a tag, deploys the `dbumt-api` image from tools namespace to the specified env |
| `backend-test`              | Updates to PR     | Runs linting, formatting, and build test on the changes           |
| `frontend-image-build-push` | PR merged to main | Builds the frontend image, adds to the ImageStream `dbumt-app` and deploys it on `dev` |
| `frontend-promote`  | Manual | Gets an environment and a tag, deploys the `dbumt-app` image from tools namespace to the specified env |
| `frontend-test`             | Updates to PR     | Runs linting, formatting, and build test on the changes           |
| `pr-labeller`               | Updates to PR     | Adds labels to PR based on information in `.github/labeler.yaml`  |
| `README.md`                 | None              | This file.                                                        |

## Related Information/ Links

Please see the associated links for more information on the following:

- [GitHub Actions](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions)
  - [Triggers](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow)
  - [Using SHA instead of version number](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses)
  - [Using secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
  - [actions/checkout](https://github.com/actions/checkout)
  - [actions/labeler](https://github.com/actions/labeler)
- Docker
  - [Build](https://docs.docker.com/reference/cli/docker/buildx/build/)
  - [Push](https://docs.docker.com/reference/cli/docker/image/push/)
- [GITHUB_TOKEN](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication)

## Action Secrets

The following secrets are used within the workflows.

| Name | Description |
| ---- | ----------- |
| `PUBLIC_IMAGE_REPOSITORY` | Repository path where new images can be pushed or updated. In this case it is truncated to allow the same secret to be used for frontend and backend. |
| `OPENSHIFT_TOOLS_NAMESPACE` | Specifies the `<licensplate>-<environment>` |
| `OPENSHIFT_SA_NAME` | Service account name with push permission to `PUBLIC_IMAGE_REPOSITORY` |
| `OPENSHIFT_SA_TOOLS_TOKEN` | Token generated for the service account `OPENSHIFT_SA_NAME` |
| `NAMESPACE` | The `dev` Openshift namespace where the image will be deployed on, defined as the same secret in each github environment settings |
| `OPENSHIFT_SERVER_URL` | Openshift server URL where the workflow logs in to deploy the image |
| `OPENSHIFT_DEPLOY_TOKEN` | Openshift deployment service account token, used to deploy the image. The account should have edit access |

## Action Inputs

The following inputs are used within the workflows.
| Name | Description |
| ---- | ----------- |
`environment` | This is used by the promote workflows and is the target environment where the image will be deployed on. It's usually `test` and `prod`, but you can still enter `dev` if you want to deploy a special version to `dev` |
| `image_tag_sha` | The image tag (which is the commit SHA) to deploy on the specified environment. The image should exist on the `tools` namespace |

## Actions Detailed Information

### Backend Image Build & Push on PR

- File Path: `.github/workflows/backend-image-build-push.yml`
- GITHUB_TOKEN Permissions: `read`
- Triggers: Any pull request that has changes to files within `backend/` or `.github/`, branches from `main`, and is closed.

#### Jobs & Steps

1. `Build-Push`
   - Only runs if the condition `github.event.pull_request.merged` (the PR is merged) is true.
   - Set to run on the `dev` environment <!-- May need to update this? -->
   - Runs on `ubuntu-22.04`
     - This ensures that the `Docker` commands can run
   - Steps:
     - `Checkout Repository`
       - Allow the workflow to use the repository and information included. `fetch-depth: 0` fetches all history for all branches and tags. This is required as we need to access the PR#.
     - `Login to Openshift Docker`
       - Uses the `docker login` command to connect to the `PUBLIC_IMAGE_REPOSITORY`.
     - `Build & Tag backend Image`
       - Navigate to the `backend`
       - Use the `docker build` command
         - `-f` specifies the name of the Dockerfile
         - `-t` add a tag to the image with the syntax <repository_name>:<tag>
     - `Push Image`
       - Add the image to the Docker registry (ImageStream) within `PUBLIC_IMAGE_REPOSITORY`/`OPENSHIFT_TOOLS_NAMESPACE`/<repository_name>:<image_tag_sha>
     - `Install oc CLI`
       - Downloads and untar the oc tar file from Openshift website
       - Moves the file to bin folder
     - `Login to OpenShift`
       - Uses oc command to login to `OPENSHIFT_SERVER_URL` by the provided token as `OPENSHIFT_DEPLOY_TOKEN`
     - `Deploy to Dev`
       - Gets the digest of the last pushed `dbumt-api:dev` image to `PUBLIC_IMAGE_REPOSITORY`/`OPENSHIFT_TOOLS_NAMESPACE` and assigns it to `IMAGE_SHA`
       - Uses oc command to rollout the image to `dbumt-api` deployment on `NAMESPACE` (Namespace name defined as a secret in `dev` on GtHub environment settings)

### Promote Backend to the specified environment

- File Path: `.github/workflows/backend-promote.yml`
- Triggers: No triggers, run manually
#### Jobs & Steps

1. `promote`
   - Set to run on the environment that the user enters. Options are `dev`, `test` and `prod`
   - Runs on `ubuntu-22.04`
     - This ensures that the `Docker` commands can run
   - Steps:
     - `Install oc CLI`
       - Downloads and untar the oc tar file from Openshift website
       - Moves the file to bin folder
     - `Login to OpenShift`
       - Uses oc command to login to `OPENSHIFT_SERVER_URL` by the provided token as `OPENSHIFT_DEPLOY_TOKEN`
     - `Set image in the target namespace`
       - Set image in `dbumt-api` deployment to dbumt-api:<image_tag_sha> `image_tag_sha` comes from user input
     - `Wait for rollout to finish`
       - Runs oc rollout status to watch the status until the deployment is done

### Backend Express Linting, Formatting, & Build Check

- File Path: `.github/workflows/backend-test.yml`
- GITHUB_TOKEN Permissions: `read`
- Triggers: Any update to a pull request that has changes to files within `backend/` and branches from `main`.

### Frontend Image Build & Push on PR

- File Path: `.github/workflows/frontend-image-build-push.yml`
- GITHUB_TOKEN Permissions: `read`
- Triggers: Any pull request that has changes to files within `frontend/` or `.github/`, branches from `main`, and is closed.

#### Jobs & Steps

1. `Build-Push`
   - Only runs if the condition `github.event.pull_request.merged` (the PR is merged) is true.
   - Set to run on the `dev` environment <!-- May need to update this? -->
   - Runs on `ubuntu-22.04`
     - This ensures that the `Docker` commands can run
   - Steps:
     - `Checkout Repository`
       - Allow the workflow to use the repository and information included. `fetch-depth: 0` fetches all history for all branches and tags. This is required as we need to access the PR#.
     - `Login to Openshift Docker`
       - Uses the `docker login` command to connect to the `PUBLIC_IMAGE_REPOSITORY`.
     - `Build & Tag frontend Image`
       - Navigate to the `frontend`
       - Use the `docker build` command
         - `-f` specifies the name of the Dockerfile
         - `-t` add a tag to the image with the syntax <repository_name>:<tag>
     - `Push Image`
       - Add the image to the Docker registry (ImageStream) within `PUBLIC_IMAGE_REPOSITORY`/`OPENSHIFT_TOOLS_NAMESPACE`/<repository_name>:<image_tag_sha>
     - `Install oc CLI`
       - Downloads and untar the oc tar file from Openshift website
       - Moves the file to bin folder
     - `Login to OpenShift`
       - Uses oc command to login to `OPENSHIFT_SERVER_URL` by the provided token as `OPENSHIFT_DEPLOY_TOKEN`
     - `Deploy to Dev`
       - Gets the digest of the last pushed `dbumt-app:dev` image to `PUBLIC_IMAGE_REPOSITORY`/`OPENSHIFT_TOOLS_NAMESPACE` and assigns it to `IMAGE_SHA`
       - Uses oc command to rollout the image to `dbumt-app` deployment on `NAMESPACE` (Namespace name defined as a secret in `dev` on GtHub environment settings)

### Promote frontend to the specified environment

- File Path: `.github/workflows/frontend-promote.yml`
- Triggers: No triggers, run manually
#### Jobs & Steps

1. `promote`
   - Set to run on the environment that the user enters. Options are `dev`, `test` and `prod`
   - Runs on `ubuntu-22.04`
     - This ensures that the `Docker` commands can run
   - Steps:
     - `Install oc CLI`
       - Downloads and untar the oc tar file from Openshift website
       - Moves the file to bin folder
     - `Login to OpenShift`
       - Uses oc command to login to `OPENSHIFT_SERVER_URL` by the provided token as `OPENSHIFT_DEPLOY_TOKEN`
     - `Set image in the target namespace`
       - Set image in `dbumt-app` deployment to dbumt-app:<image_tag_sha> `image_tag_sha` comes from user input
     - `Wait for rollout to finish`
       - Runs oc rollout status to watch the status until the deployment is done
### Frontend Express Linting, Formatting, & Build Check

- File Path: `.github/workflows/frontend-test.yml`
- GITHUB_TOKEN Permissions: `read`
- Triggers: Any update to a pull request that has changes to files within `frontend/` and branches from `main`.

#### Jobs & Steps

1. `test-app`
   - Only runs if the condition `github.event.pull_request.merged` (the PR is merged) is true.
   - Set to run on the `dev` environment <!-- May need to update this? -->
   - Runs on `ubuntu-22.04`
     - This ensures that the required commands will run
   - Steps:
     - `Checkout Repository`
       - Allow the workflow to use the repository and information included. `fetch-depth: 0` fetches all history for all branches and tags. This is required as we need to access the PR#.
     - `Install Dependencies`
       - set working directory to `frontend`
       - install dependencies listed in `frontend/package.json`
     - `Run ESLint`
       - set working directory to `frontend`
       - run `lint` script to ensure changes match standards within `frontend/eslint.config.mjs`
     - `Run Prettier`
       - set working directory to `frontend`
       - run `format` script to ensure changes match standards within `frontend/.prettier.cjs`
     - `Build Frontend APP`
       - set working directory to `frontend`
       - run `build` script to ensure the frontend image can be built with the changes made

### Pull Request Labeler

- File Path: `.github/workflows/pr-labeller.yml`
- GITHUB_TOKEN Permissions:
  - content: `read`
  - pull-requests: `write`
- Triggers: Any update to any pull request.

#### Jobs & Steps

1. `triage`
   - Sets the permissions for `GITHUB_TOKEN`
   - Set to run on the `dev` environment <!-- May need to update this? -->
   - Runs on `ubuntu-22.04`
     - This ensures that the required commands will run
   - Steps:
     - `Label PR`
       - uses `actions/labeler` with specified SHA version
       - provides `GITHUB_TOKEN` such that the contents of the repository can be read, and the PR can be updated.
       - configuration-path: `.github/labeler.yaml` file the specifies what labels should go on a PR based on the files that are changed.

