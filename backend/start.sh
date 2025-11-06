#!/bin/sh
# Start script for SiD backend
# Ensures package.json is available and Node.js uses ES modules correctly

cd /app

# Verify package.json exists
if [ ! -f package.json ]; then
  echo "ERROR: package.json not found in /app"
  ls -la /app
  exit 1
fi

# Verify type: module
if ! grep -q '"type": "module"' package.json; then
  echo "ERROR: package.json missing type: module"
  cat package.json
  exit 1
fi

# Debug: Show current directory and package.json
echo "Current directory: $(pwd)"
echo "Package.json exists: $(test -f package.json && echo 'YES' || echo 'NO')"
echo "Package.json content (first 15 lines):"
head -15 package.json

# Debug: Try to check how Node.js sees the file
echo "Testing Node.js module detection..."
node -e "console.log(require('fs').readFileSync('package.json', 'utf8').includes('\"type\": \"module\"') ? 'ES MODULE DETECTED' : 'NO ES MODULE')"

# Start the application
exec node src/index.js

