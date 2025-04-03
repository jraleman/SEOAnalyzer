#!/bin/bash

BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}Cleaning GitHub Pages directories...${NC}"

rm -rf gh-pages-build gh-pages-deploy