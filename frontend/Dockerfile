# build using node.js
FROM node:24-bookworm-slim AS builder

# set current directory
WORKDIR /app

# Copy only package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Pass the backend API URL as a build argument
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the frontend
RUN npm run build

# use nginx
FROM nginx:alpine-slim

# set current nginx directory
WORKDIR /usr/share/nginx/html

# remove unnecessary assets from nginx
RUN rm -rf ./*

# copy the previously built frontend files
COPY --from=builder /app/dist ./


# replace the default config with our 8080 version
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions for OpenShift's random UID (non-root)
# Grant group write permission to required dirs
RUN chmod -R g+rw /var/cache/nginx /var/run \
    && chmod -R g+rw /etc/nginx \
    && chown -R 1001:0 /var/cache/nginx /var/run /usr/share/nginx/html /etc/nginx

# Use a non-root user (OpenShift runs with random UID, so avoid hardcoding)
USER 1001

# use standard frontend port 8080
EXPOSE 8080

# start the frontend server
CMD ["nginx", "-g", "daemon off;"]
