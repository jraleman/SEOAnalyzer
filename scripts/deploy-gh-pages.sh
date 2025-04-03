#!/bin/bash

# This script deploys the SEO Analyzer to GitHub Pages for jraleman/SEOAnalyzer

# Exit on any error
set -e

USER_NAME="jraleman"
REPO_NAME="SEOAnalyzer"

REPO_URL="git@github.com:${USER_NAME}/${REPO_NAME}.git"
BRANCH="gh-pages"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="${ROOT_DIR}/gh-pages-deploy"

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npx gh-pages -d "${DEPLOY_DIR}" -b "${BRANCH}" -r "${REPO_URL}" -m "Deploy SEOAnalyzer to GitHub Pages"

echo "✅ Deployment completed successfully!"
echo "🌐 Your site should be available at: https://${USER_NAME}.github.io/${REPO_NAME}/"