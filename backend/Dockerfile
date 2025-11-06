# Dockerfile for SiD backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (CRITICAL - must include package.json with "type": "module")
COPY package.json ./
COPY package-lock.json* ./

# Verify package.json is copied and has type: module
RUN cat package.json && \
    grep -q '"type": "module"' package.json || (echo "ERROR: package.json missing type: module" && cat package.json && exit 1)

# Install ALL dependencies
RUN npm ci

# Copy all source files
COPY src/ ./src/
COPY scripts/ ./scripts/
# Copy database migrations (needed for migrate script)
COPY database/ ./database/

# Final verification: ensure package.json exists and show its contents
RUN echo "=== Verifying package.json ===" && \
    test -f package.json && \
    echo "package.json exists" && \
    cat package.json && \
    echo "=== Verifying type: module ===" && \
    grep -q '"type": "module"' package.json && \
    echo "type: module found" || \
    (echo "ERROR: type: module NOT FOUND" && exit 1)

# Verify package.json is still in working directory
RUN pwd && ls -la && test -f package.json && echo "✅ package.json verified in /app"

# Copy and make start script executable
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose port
EXPOSE 3001

# Start application using wrapper script
CMD ["./start.sh"]

