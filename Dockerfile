# Use a lightweight Node.js base image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the server port
EXPOSE 3000

# Set default environment variables (can be overridden at runtime)
# IMPORTANT: 'host.docker.internal' allows the container to reach the DB on your host
ENV DB_HOST=host.docker.internal
ENV DB_USERNAME=pcmadmin
ENV DB_PASSWORD=c1030a8edf1d1ee2
ENV DB_SCHEMA=ppcm
ENV NODE_ENV=production

# Command to start the server
CMD ["node", "server.js"]
