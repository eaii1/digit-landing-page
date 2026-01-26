# Docker Hub configuration
$DOCKER_USERNAME = "your-dockerhub-username"  # Replace with your Docker Hub username
$IMAGE_NAME = "complaint-frontend"
$VERSION = "latest"

Write-Host "Building Docker image..." -ForegroundColor Blue
docker build -t "${IMAGE_NAME}:${VERSION}" .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
    
    # Tag the image for Docker Hub
    Write-Host "Tagging image for Docker Hub..." -ForegroundColor Blue
    docker tag "${IMAGE_NAME}:${VERSION}" "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
    
    # Login to Docker Hub
    Write-Host "Logging in to Docker Hub..." -ForegroundColor Blue
    docker login -u $DOCKER_USERNAME
    
    if ($LASTEXITCODE -eq 0) {
        # Push to Docker Hub
        Write-Host "Pushing image to Docker Hub..." -ForegroundColor Blue
        docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully pushed ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} to Docker Hub!" -ForegroundColor Green
        } else {
            Write-Host "Failed to push image to Docker Hub" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Failed to login to Docker Hub" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
