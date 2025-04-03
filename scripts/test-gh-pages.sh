#!/bin/bash

# This script tests the content of gh-pages-build after Vite builds the project

# Set up colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting test server for gh-pages-build...${NC}"

# Start the test server
npx vite serve --base=/SEOAnalyzer gh-pages-build

echo -e "${GREEN}Test server started successfully!${NC}"
echo -e "You can now access the test server at http://localhost:3000/SEOAnalyzer"