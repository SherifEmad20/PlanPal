#!/bin/bash
# enter project dir

# build image with tag latest

# push to dockerhub with new latest
    # using docker username and password

# deploy to minikube

DOCKER_USERNAME=sherifemad21
DOCKER_PASSWORD=SherifEmad359654187


CURRENT_DATE=$(date +%Y-%m-%d)

# Get the current timestamp in the format HH-MM-SS
CURRENT_TIMESTAMP=$(date +%H-%M-%S)

cd /home/sherif/proj/PlanPal/Frontend

docker login -u="${DOCKER_USERNAME}" -p="${DOCKER_PASSWORD}"

docker build -t sherifemad21/planpal:frontend-${CURRENT_TIMESTAMP} .

docker push docker.io/sherifemad21/planpal:frontend-${CURRENT_TIMESTAMP}

docker rmi -f sherifemad21/planpal:frontend-${CURRENT_TIMESTAMP}

cd ../k8s_files

sed "s|DockerImageToPull|docker.io/sherifemad21/planpal:frontend-${CURRENT_TIMESTAMP}|g" planpal-frontend-deployment-template.yaml > planpal-frontend-deployment.yaml

cat planpal-frontend-deployment.yaml