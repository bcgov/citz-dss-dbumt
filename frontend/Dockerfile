# build using node.js
FROM node:22.9-bullseye-slim AS builder

# set current directory
WORKDIR /app

# copy application files
COPY . .

# install node dependencies
RUN npm install

# copy application files
COPY . .

# build the frontend fles
RUN npm run build

# use nginx with an openshift-compatible environment
FROM nginx:alpine

# set current nginx directory
WORKDIR /usr/share/nginx/html

# remove unnecessary assets from nginx
RUN rm -rf ./*

# copy the previously built frontend files
COPY --from=builder /app/dist ./


# use standard frontend port 8080
EXPOSE 8080

# start the frontend server
CMD ["nginx", "-g", "daemon off;"]
