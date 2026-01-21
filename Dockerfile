# Build stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY .env ./
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
