# ESG-APP-main

A comprehensive ESG (Environmental, Social, and Governance) application built with Angular, featuring a complete translation system and modern UI/UX design.

## 🌟 Features

- **Complete Translation System**: English and Arabic support with real-time language switching
- **LTR Layout**: Consistent Left-to-Right layout with RTL text support for Arabic
- **Modern UI/UX**: Glassmorphism design, gradient backgrounds, and responsive layout
- **Multiple Roles**: Marketing Head, Social Manager, and other ESG roles
- **Dashboard Components**: Analytics, reports, team management, and more

## 🚀 Live Demo

**GitHub Pages**: https://daiyaanahmed1.github.io/ESG-APP-main/

> **Note**: If you see a 404 error, please check the GitHub Actions tab to ensure deployment is complete.

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/DaiyaanAhmed1/ESG-APP-main.git

# Navigate to the project directory
cd ESG-APP-main

# Install dependencies
npm install

# Start the development server
npm start
```

## 📦 Build

```bash
# Build for production
npm run build

# Build for development
npm run build --configuration=development
```

## 🌐 Deployment

This application is automatically deployed to GitHub Pages when changes are pushed to the `master` branch.

### Manual Deployment

1. Build the application: `npm run build`
2. The built files will be in `dist/esg-app/browser/`
3. Deploy to your preferred hosting service

## 🎯 Key Components

- **Global Translation Service**: Centralized translation management
- **Language Toggle**: Real-time language switching
- **Responsive Design**: Works on all device sizes
- **Modern Styling**: CSS Grid, Flexbox, and modern design patterns

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── services/           # Application services
│   ├── marketing-head/     # Marketing Head role components
│   ├── social-dashboard/   # Social Manager components
│   └── ...                 # Other role components
├── assets/
│   └── i18n/              # Translation files
└── styles.scss            # Global styles
```

## 🔧 Configuration

- **Angular**: Latest version with SSR support
- **Translation**: Embedded translation system (no HTTP requests)
- **Styling**: SCSS with modern CSS features
- **Build**: Optimized for production deployment

## 📄 License

This project is part of the ESG application suite.

---

**Built with ❤️ using Angular**