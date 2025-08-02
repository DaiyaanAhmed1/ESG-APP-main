# ESG-APP

A comprehensive Environmental, Social, and Governance (ESG) management application built with Angular. This application provides tools for tracking sustainability metrics, compliance management, stakeholder engagement, and ESG reporting.

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## 🌟 Features

- **Dashboard Analytics**: Real-time ESG metrics and KPIs
- **Environmental Tracking**: Carbon footprint, energy consumption, waste management
- **Social Impact**: Stakeholder engagement, community initiatives, diversity metrics
- **Governance**: Compliance tracking, risk management, policy management
- **Reporting**: Automated ESG reports and analytics
- **IoT Integration**: Smart sensor data integration
- **Multi-language Support**: Internationalization support
- **Role-based Access**: Different user roles and permissions

## 🚀 Live Demo

Visit the application at: [https://nitu-das305.github.io/ESG-APP](https://nitu-das305.github.io/ESG-APP)

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Angular CLI

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nitu-das305/ESG-APP.git
   cd ESG-APP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🏗️ Build

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build --configuration production
```

## 🚀 Deployment

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages.

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

The application will be available at: https://nitu-das305.github.io/ESG-APP

### Manual Deployment Steps

1. Ensure you have the `gh-pages` package installed:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy using the preconfigured script:
   ```bash
   npm run deploy
   ```

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/           # Main dashboard component
│   ├── environmental/       # Environmental tracking
│   ├── social/             # Social impact features
│   ├── governance/         # Governance management
│   ├── reporting/          # Reporting and analytics
│   ├── auth/               # Authentication
│   └── shared/             # Shared components
├── assets/                 # Static assets
└── styles.scss            # Global styles
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build the project
- `npm run test` - Run unit tests
- `npm run lint` - Run linting
- `npm run deploy` - Deploy to GitHub Pages.

### Code Style

This project uses:
- TypeScript for type safety
- Angular CLI for development
- ESLint for code linting
- Prettier for code formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

## 🔗 Links

- [GitHub Repository](https://github.com/nitu-das305/ESG-APP)
- [Live Demo](https://nitu-das305.github.io/ESG-APP)
- [Issues](https://github.com/nitu-das305/ESG-APP/issues)

---

**Built with ❤️ using Angular**