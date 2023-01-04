#!/bin/bash

# This script can be used to test out the action locally.
# This script requires NodeJS v16 and the latest GitHub CLI to be installed.
# This script assumes that `npm install` and `npm run all` have already been run.

export INPUT_TOKEN=$(gh auth token)
# GITHUB_REPOSITORY represents the GitHub repo that the action runs in, i.e. the intended destination for the target issues.
export GITHUB_REPOSITORY="mtfoley/copy-issues-action"

# INPUT_SOURCE_REPO represents the GitHub repo to copy issues from.
# This only needs to be set if the GITHUB_REPOSITORY is not a fork or generated from a template.
export INPUT_SOURCE_REPO="mtfoley/pr-compliance-action"

node dist/index.js