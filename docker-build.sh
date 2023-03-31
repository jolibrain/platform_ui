#!/bin/bash

script="docker-build.sh"
#Declare the number of mandatory args
margs=0

# Common functions - BEGIN
function example {
    echo -e "examples:"
    echo -e ""
    echo -e "  - build dev docker image: ./docker-build.sh --dev"
    echo -e "  - build tagged docker image: ./docker-build.sh --tag"
    echo -e ""
}

function usage {
    echo -e "usage: ./$script [OPTIONS]\n"
}

function help {
  usage
    echo -e "OPTIONS:"
    echo -e ""
    echo -e "  --dev                           Build dev docker image (default)"
    echo -e "  --tag                           Build docker image tagged with latest git tag"
    echo -e ""
    echo -e "  -h, --help                      Prints this help\n"
  example
}

# Ensures that the number of passed args are at least equals
# to the declared number of mandatory args.
# It also handles the special case of the -h or --help arg.
function margs_precheck {
    if [ $2 ] && [ $1 -lt $margs ]; then
        if [ $2 == "--help" ] || [ $2 == "-h" ]; then
            help
            exit
        else
            usage
            example
            exit 1 # error
        fi
    fi
}

# Ensures that all the mandatory args are not empty
function margs_check {
    if [ $# -lt $margs ]; then
        usage
        example
        exit 1 # error
    fi
}
# Common functions - END

# Main
margs_precheck $# $1

IMAGE_NAME="docker.jolibrain.com/platform_ui"

# Args while-loop
while [ "$1" != "" ];
do
    case $1 in
        --dev )             shift
                            docker build -t ${IMAGE_NAME}:dev --no-cache .
                            docker push ${IMAGE_NAME}:dev
                            ;;
        --tag )             shift
                            TAG=$(git tag --sort=committerdate | tail -1)
                            docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${TAG} --no-cache .
                            docker push ${IMAGE_NAME}:latest
                            docker push ${IMAGE_NAME}:${TAG}
                            ;;
        -h   | --help )     help
                            exit
                            ;;
        *)
            echo "$script: illegal option $1"
            usage
            example
            exit 1 # error
            ;;
    esac
    shift
done
