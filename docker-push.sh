#!/bin/bash

# Docker Hub configuration
DOCKER_USERNAME="your-dockerhub-username"  # Replace with your Docker Hub username
IMAGE_NAME="complaint-frontend"
VERSION="latest"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building Docker image...${NC}"
docker build -t ${IMAGE_NAME}:${VERSION} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
    
    # Tag the image for Docker Hub
    echo -e "${BLUE}Tagging image for Docker Hub...${NC}"
    docker tag ${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
    
    # Login to Docker Hub
    echo -e "${BLUE}Logging in to Docker Hub...${NC}"
    docker login -u ${DOCKER_USERNAME}
    
    if [ $? -eq 0 ]; then
        # Push to Docker Hub
        echo -e "${BLUE}Pushing image to Docker Hub...${NC}"
        docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Successfully pushed ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} to Docker Hub!${NC}"
        else
            echo -e "${RED}Failed to push image to Docker Hub${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Failed to login to Docker Hub${NC}"
        exit 1
    fi
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi
