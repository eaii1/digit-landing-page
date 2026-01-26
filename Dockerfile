# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

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

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]