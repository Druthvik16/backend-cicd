#!/bin/bash

set -e

APP_DIR="/home/ubuntu/app"
APP_NAME="backendserver"

echo "========================================="
echo " After Deploy Script Started"
echo " $(date)"
echo "========================================="

cd $APP_DIR

# ----- Smart install: only run if package.json changed -----
HASH_FILE="/home/ubuntu/.pkg_hash"
CURRENT_HASH=$(md5sum package.json | awk '{ print $1 }')

if [ ! -f "$HASH_FILE" ] || [ "$(cat $HASH_FILE)" != "$CURRENT_HASH" ]; then
  echo "📦 package.json changed — running npm install..."
  npm install
  echo "$CURRENT_HASH" > "$HASH_FILE"
  echo "✅ npm install done"
else
  echo "✅ package.json unchanged — skipping npm install"
fi

# ----- Build TypeScript -----
echo "🔨 Building TypeScript..."
./node_modules/.bin/tsc
echo "✅ Build complete"

# ----- PM2: start or restart -----
if pm2 describe $APP_NAME > /dev/null 2>&1; then
  echo "🔄 Restarting PM2 process: $APP_NAME"
  pm2 restart $APP_NAME
else
  echo "🚀 Starting PM2 process: $APP_NAME"
  pm2 start dist/server.js --name $APP_NAME
fi

pm2 save
echo "✅ PM2 done"
echo "========================================="
echo " Deploy Finished Successfully — $(date)"
echo "========================================="