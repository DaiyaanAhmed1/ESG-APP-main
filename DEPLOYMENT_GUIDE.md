# ESG-APP Deployment Guide

This guide provides detailed instructions for deploying the ESG-APP to GitHub Pages.

## 🚀 Quick Deployment

### Prerequisites

1. **GitHub Account**: Ensure you have a GitHub account
2. **Repository Access**: Make sure you have access to the [ESG-APP repository](https://github.com/nitu-das305/ESG-APP)
3. **Node.js**: Version 18 or higher
4. **npm**: Latest version

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/nitu-das305/ESG-APP.git
cd ESG-APP

# Install dependencies
npm install
```

### Step 2: Build the Application

```bash
# Build for production
npm run build
```

### Step 3: Deploy to GitHub Pages

```bash
# Deploy using the preconfigured script
npm run deploy
```

The application will be available at: **https://nitu-das305.github.io/ESG-APP**

## 🔧 Manual Deployment

If the automatic deployment doesn't work, follow these manual steps:

### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 2: Build the Application

```bash
npm run build
```

### Step 3: Deploy Manually

```bash
# Create and push to gh-pages branch
npx gh-pages -d dist/esg-app/browser
```

## ⚙️ Configuration Details

### package.json Configuration

The project is configured with the following deployment settings:

```json
{
  "homepage": "https://nitu-das305.github.io/ESG-APP",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist/esg-app/browser"
  }
}
```

### Angular Configuration

The `angular.json` file is configured for production builds with the correct output path.

## 🌐 GitHub Pages Setup

### Repository Settings

1. Go to your GitHub repository: https://github.com/nitu-das305/ESG-APP
2. Navigate to **Settings** → **Pages**
3. Set the source to **Deploy from a branch**
4. Select the **gh-pages** branch
5. Set the folder to **/(root)**
6. Click **Save**

### Branch Protection (Optional)

To protect the gh-pages branch:
1. Go to **Settings** → **Branches**
2. Add rule for **gh-pages** branch
3. Enable **Restrict pushes that create files that are executable**

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/esg-app/browser
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Deployment Fails**
   ```bash
   # Check if gh-pages is installed
   npm list gh-pages
   
   # Reinstall if needed
   npm install --save-dev gh-pages
   ```

3. **404 Errors on GitHub Pages**
   - Ensure the homepage URL in `package.json` is correct
   - Check that the build output directory matches the deploy directory
   - Verify the gh-pages branch exists and contains the built files

### Debugging Steps

1. **Check Build Output**
   ```bash
   npm run build
   ls -la dist/esg-app/browser
   ```

2. **Verify gh-pages Branch**
   ```bash
   git branch -a
   git checkout gh-pages
   ls -la
   ```

3. **Check GitHub Pages Settings**
   - Repository settings → Pages
   - Ensure correct branch and folder are selected

## 📊 Monitoring Deployment

### Check Deployment Status

1. **GitHub Actions**: Check the Actions tab for deployment status
2. **Repository Settings**: Go to Settings → Pages to see deployment status
3. **Live Site**: Visit https://nitu-das305.github.io/ESG-APP

### Logs and Debugging

```bash
# Check deployment logs
npm run deploy --verbose

# Check gh-pages logs
npx gh-pages --help
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **API Keys**: Use environment variables for production
3. **Dependencies**: Regularly update dependencies for security patches

## 📞 Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/nitu-das305/ESG-APP/issues)
2. Review the [Angular Deployment Guide](https://angular.io/guide/deployment)
3. Check [GitHub Pages Documentation](https://pages.github.com/)

---

**Last Updated**: January 2025
**Version**: 1.0.0 