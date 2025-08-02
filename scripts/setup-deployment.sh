#!/bin/bash

# ESG Application Deployment Setup Script
# This script helps set up the initial deployment configuration

echo "🚀 ESG Application Deployment Setup"
echo "=================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run tests
echo "🧪 Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues before proceeding."
    exit 1
fi

echo "✅ Tests passed"

# Run linting
echo "🔍 Running linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️ Linting issues found. Please fix them before deployment."
    echo "You can run 'npm run lint --fix' to auto-fix some issues."
fi

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the issues before proceeding."
    exit 1
fi

echo "✅ Build successful"

# Check git status
echo "📋 Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Working directory is clean"
else
    echo "⚠️ Working directory has uncommitted changes"
    echo "Please commit your changes before pushing to remote"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: initial deployment setup'"
echo "   git push origin main"
echo ""
echo "2. Enable GitHub Pages:"
echo "   - Go to Settings → Pages"
echo "   - Set source to 'Deploy from a branch'"
echo "   - Select 'gh-pages' branch"
echo ""
echo "3. Create your first feature branch:"
echo "   git checkout -b feature/your-feature-name"
echo ""
echo "4. Follow the deployment guide in DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Your application will be available at:"
echo "   https://nitu-das305.github.io/esg-web/"
echo ""
echo "Happy coding! 🚀" 