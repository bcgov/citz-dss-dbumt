#Builder
# use node.js image
FROM node:24-bookworm-slim AS builder

# set current directory
WORKDIR /api

COPY package*.json tsconfig.json ./
RUN npm install

# Copy source and build TypeScript
COPY src ./src
RUN npm run build


#Runtime
# use node.js image
FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production

# Install required packages + Chromium for pdf generation
RUN apt-get update && apt-get install -y unzip wget \
    libaio1 libnsl-dev libstdc++6 zlib1g \
    chromium fonts-liberation libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libcups2 \
    libdrm2 libgtk-3-0 libnss3 libxcomposite1 libxdamage1 libxrandr2 xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Oracle Instant Client
RUN mkdir -p /opt/oracle && \
    cd /opt/oracle && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2390000/instantclient-basic-linux.x64-23.9.0.25.07.zip && \
    unzip -oq instantclient-basic-linux.x64-23.9.0.25.07.zip && \
    rm instantclient-basic-linux.x64-23.9.0.25.07.zip

# Set environment variable to enable Thick mode
ENV ORACLE_CLIENT_LOCAL_PATH=/opt/oracle/instantclient_23_9
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_9

# set current directory
WORKDIR /api

# copy application files
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from builder
COPY --chown=node:node --from=builder /api/dist ./dist

# Create writable directories for puppeteer
RUN mkdir -p /home/node/.cache \
    && mkdir -p /home/node/.config \
    && chown -R node:node /home/node

ENV HOME=/home/node

# Drop privileges
USER node

# run the backend
CMD ["node", "dist/index.js"]
