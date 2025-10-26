# 💰 Finance Tracker

A comprehensive full-stack Next.js application for tracking personal finances, investments, and portfolio management with real-time market data integration.

## 🚀 Features

### 📊 **Portfolio Overview**
- **Total Portfolio Value** with real-time updates
- **Category Breakdown** (Bank Accounts, Investments, Crypto, Cash)
- **Interactive Charts** showing portfolio growth over time
- **Historical Data** with 30+ days of portfolio history

### 🏦 **Bank Account Management**
- Add and manage multiple bank accounts
- Track balances in EUR
- Transaction history with deposits/withdrawals
- Real-time balance updates

### 📈 **Investment Tracking**
- **Real-time Stock Prices** via Yahoo Finance API
- **Smart Asset Search** with autocomplete
- **Automatic Price Updates** for accurate portfolio valuation
- **Transaction Management** with buy/sell/dividend tracking
- **Profit/Loss Calculation** based on current market prices

### ₿ **Cryptocurrency Portfolio**
- **Live Crypto Prices** via CoinGecko API
- **Smart Crypto Search** with popular cryptocurrencies
- **Automatic Price Updates** for real-time valuation
- **Transaction Tracking** for crypto purchases/sales
- **Multi-crypto Support** (Bitcoin, Ethereum, Cardano, Solana, etc.)

### 💵 **Cash Management**
- Track physical cash holdings
- Multiple cash locations (Home, Bank, Wallet)
- Transaction history for cash movements

### 🔄 **Smart Transaction System**
- **Auto-calculated Quantities** - just enter the amount in EUR
- **Real-time Price Fetching** for accurate calculations
- **Automatic Portfolio Updates** after transactions
- **Transaction History** across all asset types

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Chart.js with React integration
- **APIs**: Yahoo Finance, CoinGecko
- **Deployment**: Docker & Docker Compose
- **Development**: Hot reload, TypeScript, ESLint

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
   - Start tracking your finances!

## 🎯 Usage

### Portfolio Management
- **View Overview**: See total portfolio value and breakdown
- **Add Assets**: Use smart search to find stocks and crypto
- **Track Performance**: Monitor gains/losses with real-time prices
- **Transaction History**: Complete audit trail of all movements

### Smart Investment Features
- **Amount-based Investing**: Enter €1,000 → system calculates shares automatically
- **Real-time Prices**: Always up-to-date market data
- **Portfolio Rebalancing**: Track allocation across asset classes
- **Performance Analytics**: Historical growth visualization

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

### API Routes
- `/api/portfolio` - Portfolio overview with price updates
- `/api/assets/search` - Asset search functionality
- `/api/assets/price` - Real-time price fetching
- `/api/transactions` - Transaction management

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
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   └── page.tsx        # Main page
├── components/         # React components
├── lib/               # Utilities (Prisma, API)
├── prisma/            # Database schema
├── scripts/           # Management scripts
└── public/            # Static assets
```

## 🎨 Features in Detail

### Smart Asset Search
- **Autocomplete**: Type "Apple" → see Apple Inc. (AAPL)
- **Real-time Results**: Live search with API integration
- **Keyboard Navigation**: Arrow keys, Enter, Escape
- **Visual Feedback**: Loading states and error handling

### Automatic Calculations
- **Investment Amount**: Enter €1,000 → get exact shares
- **Crypto Amount**: Enter €500 → get exact crypto units
- **Portfolio Value**: Real-time total with all assets
- **Performance Metrics**: Gains/losses automatically calculated

### Data Persistence
- **Tab State**: Active tab persists across page reloads
- **Transaction History**: Complete audit trail
- **Portfolio History**: Daily snapshots for trend analysis
- **Real-time Updates**: Automatic refresh after changes

## 🌟 Key Benefits

- **💰 Real-time Valuation**: Always know your true portfolio value
- **📈 Performance Tracking**: Monitor gains/losses across all assets
- **🔄 Automated Updates**: No manual price entry required
- **📊 Visual Analytics**: Charts and graphs for portfolio analysis
- **💾 Data Persistence**: All data saved securely in PostgreSQL
- **🚀 Easy Setup**: Docker-based deployment in minutes

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
- **TailwindCSS** for beautiful styling

---

**Built with ❤️ for personal finance management**

*Track your wealth, grow your portfolio, achieve your financial goals!*