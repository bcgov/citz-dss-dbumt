# GitHub Workflows

This README will go through the GitHub Actions defined within `.github/workflows`

## Overview of Files

| Name                       | Triggers          | Short Description                                                |
| -------------------------- | ----------------- | ---------------------------------------------------------------- |
| `backend-image-build-push` | PR merged to main | Builds the backend image and adds to the ImageStream `dbumt-api` |
| `backend-test`             | Updates to PR     | Runs linting, formatting, and build test on the changes          |
| `pr-labeller`              | Updates to PR     | Adds labels to PR based on information in `.github/labeler.yaml` |
| `README.md`                | None              | This file.                                                       |

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

## Actions Detailed Information

### Backend Image Build & Push on PR

- File Path: `.github/workflows/backend-image-build-push.yml`
- GITHUB_TOKEN Permissions: `read`
- Triggers: Any pull request that has changes to files within `backend/`, branches from `main`, and is closed.

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
       - Navigate to the backend
       - Use the `docker build` command
         - `-f` specifies the name of the Dockerfile
         - `-t` add a tag to the image with the syntax <repository_name>:<tag>
     - `Push Image`
       - Add the image to the Docker registry (ImageStream) within `PUBLIC_IMAGE_REPOSITORY`/`OPENSHIFT_TOOLS_NAMESPACE`/<repository_name>:<PR_number>

### Backend Express Linting, Formatting, & Build Check

- File Path: `.github/workflows/backend-test.yml`
- GITHUB_TOKEN Permissions: `read`
- Triggers: Any update to a pull request that has changes to files within `backend/` and branches from `main`.

#### Jobs & Steps

1. `test-api`
   - Only runs if the condition `github.event.pull_request.merged` (the PR is merged) is true.
   - Set to run on the `dev` environment <!-- May need to update this? -->
   - Runs on `ubuntu-22.04`
     - This ensures that the required commands will run
   - Steps:
     - `Checkout Repository`
       - Allow the workflow to use the repository and information included. `fetch-depth: 0` fetches all history for all branches and tags. This is required as we need to access the PR#.
     - `Install Dependencies`
       - set working directory to `backend`
       - install dependencies listed in `backend/package.json`
     - `Run ESLint`
       - set working directory to `backend`
       - run `lint` script to ensure changes match standards within `backend/eslint.config.mjs`
     - `Run Prettier`
       - set working directory to `backend`
       - run `format` script to ensure changes match standards within `backend/.prettier.cjs`
     - `Build Backend API`
       - set working directory to `backend`
       - run `build` script to ensure the backend image can be built with the changes made

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

