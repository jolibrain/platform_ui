#!/bin/bash

set -ex
TAG=$(git rev-parse --verify --short HEAD)

echo ${TAG}
#exit()

###
### on eris registry
###
# IMAGE_NAME="eris:7750/platform/ui"

###
### on dockerhub registry
###
IMAGE_NAME="jolibrain/platform_ui"

yarn run build
docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${TAG} --no-cache .
docker push ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}:${TAG}
