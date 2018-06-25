#!/usr/bin/env bash
set -e

# Build app and deepdetect containers
CURRENT_UID=$(id -u):$(id -g) docker-compose -f docker/docker-compose.eris.yml build
