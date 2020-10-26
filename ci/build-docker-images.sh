#!/bin/bash

export DOCKER_BUILDKIT=1

set -e

[ "${JENKINS_URL}" ] && set -x

PR_NUMBER=$(echo $GIT_BRANCH | sed -n '/^PR-/s/PR-//gp')
if [ "$TAG_NAME" ]; then
    TMP_TAG="ci-$TAG_NAME"
elif [ "$GIT_BRANCH" == "master" ]; then
    TMP_TAG="ci-$GIT_BRANCH"
elif [ "$PR_NUMBER" ]; then
    TMP_TAG=ci-pr-$PR_NUMBER
else
    # Not built with Jenkins
    TMP_TAG="dev"
fi


image_url="jolibrain/platform_ui"

docker build \
    -t $image_url:$TMP_TAG \
    --progress plain \
    -f Dockerfile \
    .

if [ "$TMP_TAG" != "dev" ]; then
    docker tag $image_url:$TMP_TAG ceres:5000/$image_url:$TMP_TAG
    docker push ceres:5000/$image_url:$TMP_TAG
    docker rmi ceres:5000/$image_url:$TMP_TAG

    if [ "$TAG_NAME" ]; then
        docker tag $image_url:$TMP_TAG $image_url:${TAG_NAME}
        docker push $image_url:${TAG_NAME}
    elif [ "$GIT_BRANCH" == "master" ]; then
        docker push $image_url:$TMP_TAG

        # TODO(sileht): Automatically push it when it's ready
        # docker tag $image_url:$TMP_TAG $image_url:latest
        # docker push $image_url:latest
    fi
fi
