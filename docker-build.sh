#!/bin/bash

set -ex
TAG=$(git rev-parse --verify --short HEAD)
IMAGE_NAME="jolibrain/platform_ui"

npm run build
docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${TAG} --no-cache .
#docker push ${IMAGE_NAME}:latest
#docker push ${IMAGE_NAME}:${TAG}
