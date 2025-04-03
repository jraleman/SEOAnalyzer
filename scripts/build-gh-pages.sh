#!/bin/bash

# This script deploys the SEO Analyzer to GitHub Pages for jraleman/SEOAnalyzer

# Exit on any error
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="${ROOT_DIR}/gh-pages-deploy"

# Build the project
echo "🏗️  Building project..."
npm run build

# Create deployment directory
echo "📁 Creating deployment directory..."
rm -rf "${DEPLOY_DIR}"
mkdir -p "${DEPLOY_DIR}"

# Create index.html with proper paths for GitHub Pages
echo "📝 Creating index.html..."
cp "${ROOT_DIR}/gh-pages-build/index.html" "${DEPLOY_DIR}/index.html"

# Copy assets
echo "📦 Copying built assets..."
mkdir -p "${DEPLOY_DIR}/assets"
cp -r "${ROOT_DIR}/dist/public"/* "${DEPLOY_DIR}/assets/"

# Add .nojekyll file to disable Jekyll processing
echo "🔧 Adding .nojekyll file..."
touch "${DEPLOY_DIR}/.nojekyll"

echo "✅ Build completed successfully!"