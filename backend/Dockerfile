# use node.js image
FROM node:18

# set current directory
WORKDIR /app

# copy necessary node files
COPY package.json package-lock.json ./

# install node dependencies
RUN npm install

# copy application files
COPY . .

# run the backend
CMD ["npm", "run", "start"]
