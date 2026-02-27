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


# Use system Chromium and prevent Puppeteer from downloading its own
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium
# Make Chromium cache/config writable
ENV XDG_CONFIG_HOME=/tmp/.chromium-config
ENV XDG_CACHE_HOME=/tmp/.chromium


# Create and open up dirs for random OpenShift UID (anyuid/uid-range)
RUN mkdir -p /api /tmp/.chromium /tmp/.chromium-config && \
    chgrp -R 0 /api /tmp && \
    chmod -R g+rwX /api /tmp


# set current directory
WORKDIR /api
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS from builder
COPY --from=builder /api/dist ./dist

# run the backend
CMD ["node", "dist/index.js"]
