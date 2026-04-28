# Prediction Market Frontend

React-based frontend application for the Prediction Market platform.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Language:** TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Wallet:** wagmi + RainbowKit
- **State Management:** Zustand + React Query
- **Forms:** React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ (use [nvm](https://github.com/nvm-sh/nvm))
- npm

### Installation

```bash
# Switch to the correct Node.js version
nvm use

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your values
```

### Development

```bash
# Start dev server (http://localhost:5173)
nvm use && npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Layout components
│   ├── market/      # Market components
│   ├── trading/     # Trading components
│   ├── portfolio/   # Portfolio components
│   └── wallet/      # Wallet components
├── hooks/           # Custom React hooks
├── lib/             # Libraries and utilities
│   ├── api/         # API client
│   └── wagmi/       # Wagmi configuration
├── pages/           # Page components
├── routes/          # Route configuration
├── stores/          # Zustand stores
├── styles/          # Global styles
└── types/           # TypeScript types
```

## Environment Variables

See `.env.example` for required environment variables.

## Features

Features will be implemented in subsequent pull requests:

- [ ] Market browsing and filtering
- [ ] Market detail with order book
- [ ] Trading interface (limit & market orders)
- [ ] Portfolio management
- [ ] Wallet integration
- [ ] Real-time WebSocket updates
- [ ] User authentication
- [ ] And more...

## Documentation

- [Functional Specifications](../docs/functional_specs.md)
- [Technical Specifications](../docs/technical_specs.md)
- [Development Guide](../CLAUDE.md)
