#!/bin/bash

# This script creates a standalone version of the application
# for GitHub Pages deployment

# Set up colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating GitHub Pages deployment package...${NC}"

# Create deploy directory
DEPLOY_DIR="gh-pages-build"
echo -e "${BLUE}Creating deployment directory: ${DEPLOY_DIR}${NC}"

# Remove existing directory if it exists
if [ -d "$DEPLOY_DIR" ]; then
  echo -e "${BLUE}Removing existing deployment directory...${NC}"
  rm -rf "$DEPLOY_DIR"
fi

# Create fresh directory
mkdir -p "$DEPLOY_DIR"

# Build the client
echo -e "${BLUE}Building client application...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed!${NC}"
  exit 1
fi

# Copy the necessary files
echo -e "${BLUE}Copying files to deployment directory...${NC}"

# Create the index.html file
echo -e "${BLUE}Creating index.html...${NC}"
cp client/index.html "$DEPLOY_DIR/index.html"

# Copy the built assets
echo -e "${BLUE}Copying built assets...${NC}"
mkdir -p "$DEPLOY_DIR/assets"
cp -r dist/public/* "$DEPLOY_DIR/assets/"

# Create a sample .nojekyll file for GitHub Pages
touch "$DEPLOY_DIR/.nojekyll"

# Write the deployment instructions
echo -e "${GREEN}Deployment package created in ${DEPLOY_DIR}${NC}"
echo -e "${GREEN}To deploy to GitHub Pages:${NC}"
echo -e "1. npm run gh:build"
echo -e "2. npm run gh:test"
echo -e "3. verify that all is good"
echo -e "4. npm run gh:deploy"
