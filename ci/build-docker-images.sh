#!/bin/bash

export DOCKER_BUILDKIT=1

[ "${JENKINS_URL}" ] && set -x

image_url="docker.jolibrain.com/platform_ui"

PR_NUMBER=$(echo $GIT_BRANCH | sed -n '/^PR-/s/PR-//gp')
if [ "$TAG_NAME" ]; then

    TMP_TAG="ci-$TAG_NAME"
    DOCKER_CLI_EXPERIMENTAL=enabled docker manifest inspect ${image_url}:$TAG_NAME >/dev/null 2>&1
    [ $? -eq 0 ] && echo "${image_url}:$TAG_NAME already built skipping" && exit 0

elif [ "$GIT_BRANCH" == "master" ]; then
    TMP_TAG="ci-$GIT_BRANCH"
elif [ "$PR_NUMBER" ]; then
    TMP_TAG=ci-pr-$PR_NUMBER
else
    # Not built with Jenkins
    TMP_TAG="dev"
fi

set -e

docker build \
    -t $image_url:$TMP_TAG \
    --progress plain \
    -f Dockerfile \
    .

if [ "$TMP_TAG" != "dev" ]; then

    if [ "$TAG_NAME" ]; then
        docker tag $image_url:$TMP_TAG $image_url:${TAG_NAME}
        docker tag $image_url:$TMP_TAG $image_url:latest
        docker push $image_url:${TAG_NAME}
        docker push $image_url:latest
        docker image rm $image_url:${TAG_NAME}
        docker image rm $image_url:latest
    elif [ "$GIT_BRANCH" == "master" ]; then
        docker push $image_url:$TMP_TAG
    fi
    docker image rm $image_url:$TMP_TAG
fi
