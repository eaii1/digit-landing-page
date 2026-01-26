# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
<<<<<<< HEAD

# Set the production API URL during build
# This avoids the "localhost:9260" issue entirely
ARG REACT_APP_API_URL=/pgr-analytics
ARG REACT_APP_BASE_URL=/complaint
ARG REACT_APP_BACKEND_BASE_URL=http://localhost:9260
ARG REACT_APP_ANALYTICS_API_PATH=/pgr-analytics/v1/_summary
# REACT_APP_TENANT_ID is optional - tenant ID is now extracted from URL query params or path
# Only set this if you want a default fallback when no tenant is specified in URL
ARG REACT_APP_TENANT_ID=
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_BACKEND_BASE_URL=$REACT_APP_BACKEND_BASE_URL
ENV REACT_APP_ANALYTICS_API_PATH=$REACT_APP_ANALYTICS_API_PATH
ENV REACT_APP_TENANT_ID=$REACT_APP_TENANT_ID

=======
COPY .env ./
>>>>>>> a7e74f5331d9a7087049a67543e6ade7372d4b58
RUN npm run build

# Production stage
FROM alpine:latest

# Install dependencies (nginx, supervisord, ssh, kubectl)
RUN apk add --no-cache \
    nginx \
    supervisor \
    openssh-client \
    kubectl

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy supervisor config
COPY supervisord.conf /etc/supervisord.conf

# Expose port 80
EXPOSE 80

# Start supervisord
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
