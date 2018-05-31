#!/usr/bin/env bash
set -e

# Build app and deepdetect containers
docker-compose -f docker/docker-compose.dev.yml build
