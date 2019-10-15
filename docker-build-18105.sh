#!/bin/bash

set -ex
IMAGE_NAME="jolibrain/platform_ui"

npm run build
docker build -t ${IMAGE_NAME}:dev_18105 --no-cache .
#docker push ${IMAGE_NAME}:latest
#docker push ${IMAGE_NAME}:${TAG}
