# 💰 Finance Tracker

A comprehensive full-stack Next.js application for tracking personal finances, investments, and portfolio management with real-time market data integration, dark theme support, and privacy features.

## 🚀 Features

### 📊 **Portfolio Overview**
- **Total Portfolio Value** with real-time updates
- **Category Breakdown** (Bank Accounts, Investments, Crypto, Cash)
- **Interactive Charts** showing portfolio growth over time with dark theme support
- **Historical Data** with 30+ days of portfolio history
- **Privacy Mode** - hide/show all financial data with one click

### 🏦 **Bank Account Management**
- Add and manage multiple bank accounts
- Track balances in EUR with privacy controls
- Transaction history with deposits/withdrawals
- Real-time balance updates
- Empty state messages for better UX

### 📈 **Investment Tracking**
- **Real-time Stock Prices** via Yahoo Finance API
- **Smart Asset Search** with autocomplete
- **Automatic Price Updates** for accurate portfolio valuation
- **Transaction Management** with buy/sell/dividend tracking
- **Profit/Loss Calculation** with improved dark theme colors
- **Enhanced UI** with better readability in both themes

### ₿ **Cryptocurrency Portfolio**
- **Live Crypto Prices** via CoinGecko API
- **Smart Crypto Search** with popular cryptocurrencies
- **Automatic Price Updates** for real-time valuation
- **Transaction Tracking** for crypto purchases/sales
- **Multi-crypto Support** (Bitcoin, Ethereum, Cardano, Solana, etc.)
- **Dark Theme Optimized** colors for better visibility

### 💵 **Cash Management**
- Track physical cash holdings
- Multiple cash locations (Home, Bank, Wallet)
- Transaction history for cash movements
- Consistent UI with other asset types

### 🎨 **Theme & Privacy Features**
- **Dark/Light Theme Toggle** - switch between themes instantly
- **Balance Visibility Toggle** - hide/show all financial data
- **System Theme Detection** - automatically detects user's preferred theme
- **Persistent Settings** - theme and privacy preferences saved
- **Improved Color Scheme** - better contrast and readability
- **Consistent UI** - all components support both themes

### 🔄 **Smart Transaction System**
- **Auto-calculated Quantities** - just enter the amount in EUR
- **Real-time Price Fetching** for accurate calculations
- **Automatic Portfolio Updates** after transactions
- **Transaction History** across all asset types
- **Enhanced Forms** with dark theme support

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS with dark mode support
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Chart.js with React integration and theme support
- **APIs**: Yahoo Finance, CoinGecko
- **Deployment**: Docker & Docker Compose
- **Development**: Hot reload, TypeScript, ESLint
- **State Management**: React Context for theme and privacy

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your database configuration
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Initialize Database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Access the Application**
   - Open http://localhost:3000
   - Toggle between light/dark themes
   - Use privacy mode to hide/show balances
   - Start tracking your finances!

## 🎯 Usage

### Portfolio Management
- **View Overview**: See total portfolio value and breakdown
- **Add Assets**: Use smart search to find stocks and crypto
- **Track Performance**: Monitor gains/losses with real-time prices
- **Transaction History**: Complete audit trail of all movements
- **Privacy Control**: Hide sensitive data when needed

### Theme & Privacy Features
- **Theme Toggle**: Click the sun/moon icon to switch themes
- **Balance Toggle**: Click the eye icon to hide/show all financial data
- **Automatic Detection**: App detects your system theme preference
- **Persistent Settings**: Your preferences are saved automatically

### Smart Investment Features
- **Amount-based Investing**: Enter €1,000 → system calculates shares automatically
- **Real-time Prices**: Always up-to-date market data
- **Portfolio Rebalancing**: Track allocation across asset classes
- **Performance Analytics**: Historical growth visualization with theme support
- **Enhanced Charts**: Better visibility in both light and dark themes

### Data Management
```bash
# Clear all data and start fresh
npm run portfolio:clear

# Load demo data for testing
npm run portfolio:demo

# Reset to demo data
npm run portfolio:reset
```

## 📊 API Integration

### Real-time Market Data
- **Yahoo Finance API**: Stock prices, company information
- **CoinGecko API**: Cryptocurrency prices, market data
- **Automatic Updates**: Refresh button updates all prices
- **EUR Conversion**: All prices displayed in Euros
- **Theme-aware Charts**: Charts adapt to current theme

### Supported Assets
- **Stocks**: All major exchanges (NYSE, NASDAQ, LSE, etc.)
- **ETFs**: Exchange-traded funds
- **Cryptocurrencies**: 1000+ coins via CoinGecko
- **Custom Assets**: Add any tradable asset

## 🏗️ Architecture

### Database Schema
```
Portfolio
├── Accounts (Bank accounts)
├── Investments (Stocks, ETFs)
├── Crypto (Cryptocurrencies)
├── Cash (Physical cash)
├── Transactions (All movements)
└── PortfolioHistory (Historical data)
```

### Context Providers
- **ThemeContext**: Manages light/dark theme state
- **BalanceVisibilityContext**: Controls privacy mode
- **Persistent Storage**: Settings saved in localStorage

### API Routes
- `/api/portfolio` - Portfolio overview with price updates
- `/api/assets/search` - Asset search functionality
- `/api/assets/price` - Real-time price fetching
- `/api/transactions` - Transaction management

## 🎨 UI/UX Improvements

### Dark Theme Features
- **Consistent Color Scheme**: All components support both themes
- **Improved Contrast**: Better readability in dark mode
- **Theme-aware Charts**: Charts automatically adapt to current theme
- **Smooth Transitions**: Elegant theme switching animations

### Privacy Features
- **One-click Privacy**: Hide all financial data instantly
- **Consistent Hiding**: All components respect privacy mode
- **Visual Feedback**: Clear indication when data is hidden
- **Persistent Setting**: Privacy preference remembered across sessions

### Enhanced Components
- **Better Empty States**: Informative messages when no data
- **Improved Forms**: Dark theme support for all inputs
- **Consistent Buttons**: Unified styling across all components
- **Accessible Design**: Better focus states and keyboard navigation

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:seed      # Seed with test data
npm run db:studio    # Open Prisma Studio

# Portfolio Management
npm run portfolio:clear  # Clear all data
npm run portfolio:demo   # Load demo data
npm run portfolio:reset  # Clear + load demo
```

### Project Structure
```
finance-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles with dark mode
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ThemeToggle.tsx    # Theme switching component
│   ├── BalanceToggleButton.tsx # Privacy toggle
│   └── ...               # Other components
├── contexts/              # React Context providers
│   ├── ThemeContext.tsx   # Theme management
│   └── BalanceVisibilityContext.tsx # Privacy management
├── lib/                   # Utilities (Prisma, API)
├── prisma/                # Database schema
├── scripts/               # Management scripts
└── public/                # Static assets
```

## 🌟 Key Benefits

- **💰 Real-time Valuation**: Always know your true portfolio value
- **📈 Performance Tracking**: Monitor gains/losses across all assets
- **🔄 Automated Updates**: No manual price entry required
- **📊 Visual Analytics**: Theme-aware charts and graphs
- **💾 Data Persistence**: All data saved securely in PostgreSQL
- **🚀 Easy Setup**: Docker-based deployment in minutes
- **🎨 Beautiful UI**: Dark/light themes with smooth transitions
- **🔒 Privacy Control**: Hide sensitive data when needed
- **♿ Accessible**: Better focus states and keyboard navigation
- **📱 Responsive**: Works great on all device sizes

## 🎨 Theme Features

### Light Theme
- Clean, professional appearance
- High contrast for readability
- Consistent color scheme
- Optimized for daytime use

### Dark Theme
- Easy on the eyes for low-light use
- Improved contrast for better readability
- Consistent with modern design trends
- Automatic system theme detection

### Privacy Mode
- Instantly hide all financial data
- Visual feedback with "••••••" placeholders
- Consistent across all components
- Perfect for screenshots or public viewing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Yahoo Finance** for stock market data
- **CoinGecko** for cryptocurrency prices
- **Next.js** team for the amazing framework
- **Prisma** for excellent database tooling
- **TailwindCSS** for beautiful styling and dark mode support
- **Chart.js** for powerful charting capabilities

---

**Built with ❤️ for personal finance management**

*Track your wealth, grow your portfolio, achieve your financial goals!*

## 🔄 Recent Updates

### v2.0.0 - Theme & Privacy Update
- ✨ Added dark/light theme toggle
- 🔒 Added privacy mode to hide/show balances
- 🎨 Improved color scheme for better readability
- 📊 Enhanced charts with theme support
- 🎯 Better empty states and user feedback
- ♿ Improved accessibility and focus states
- 🔄 Smooth theme transitions and animations