# Dockerfile for SiD backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for build tools)
RUN npm ci

# Copy application files
COPY . .

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "src/index.js"]

