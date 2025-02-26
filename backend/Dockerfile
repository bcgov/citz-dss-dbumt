# use node.js image
FROM node:22.9-bullseye-slim

# set current directory
WORKDIR /api

# copy necessary node files
COPY package.json package-lock.json ./

# install node dependencies
RUN npm install
# run the backend
CMD ["npm", "run", "dev"]
