# use node.js image
FROM node:25-bookworm-slim

# Install required packages
RUN apt-get update && apt-get install -y unzip wget libaio1 libnsl-dev libstdc++6 zlib1g curl && rm -rf /var/lib/apt/lists/*

# Install Oracle Instant Client
RUN mkdir -p /opt/oracle && \
    cd /opt/oracle && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2390000/instantclient-basic-linux.x64-23.9.0.25.07.zip && \
    unzip -oq instantclient-basic-linux.x64-23.9.0.25.07.zip && \
    rm instantclient-basic-linux.x64-23.9.0.25.07.zip

# Set environment variable to enable Thick mode
ENV ORACLE_CLIENT_LOCAL_PATH=/opt/oracle/instantclient_23_9
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_9:${LD_LIBRARY_PATH}

# set current directory
WORKDIR /api

# copy application files
COPY . .

# install node dependencies
RUN npm install
# run the backend
CMD ["npm", "run", "dev"]
