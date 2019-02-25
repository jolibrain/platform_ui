#!/bin/bash

set -ex

CURRENT_DIR="${PWD##*/}"
IMAGE_NAME="platform/ui"
TAG=$(git rev-parse --verify --short HEAD)

###
### on eris registry
###
# IMAGE_NAME="eris:7750/platform/ui"

###
### on dockerhub registry
###
IMAGE_NAME="jolibrain/platform_ui"

yarn run build
docker build -t ${IMAGE_NAME}:${TAG} -t ${IMAGE_NAME}:latest .
docker push ${IMAGE_NAME}
