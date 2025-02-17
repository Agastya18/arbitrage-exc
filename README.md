# SOL/USDC Arbitrage Scanner

A real-time arbitrage scanner that monitors price differences between Binance (CEX) and Solana DEX for SOL/USDC trading pair. The application helps identify profitable trading opportunities by comparing prices and calculating potential profits after fees.

<img width="1440" alt="Screenshot 2025-01-21 at 8 21 01 PM" src="https://github.com/user-attachments/assets/eca9e8a0-618b-44f8-ad5b-7b3e06431094" />


## Features

- Real-time price monitoring for SOL/USDC
- Automatic price updates every 60 seconds
- Price comparison between Binance and Solana DEX
- Profit calculation including trading fees
- Clean and responsive user interface
- Error handling and status notifications

## Technical Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Price Data**: 
  - Binance API (CEX prices)
  - Jupiter API (Solana DEX prices)
- **Number Handling**: Decimal.js for precise calculations

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone < https://github.com/Agastya18/arbitrage-exc.git >
cd arbitrage-exc
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Configuration

The application includes several configurable parameters in `src/utils/arbitrage.ts`:

- `BINANCE_TAKER_FEE`: 0.1% (0.001)
- `DEX_SWAP_FEE`: 0.3% (0.003)
- `minProfitThreshold`: 0.2% (configurable in calculateArbitrage function)

## Project Structure

```
src/
├── services/
│   ├── binance.ts    # Binance API integration
│   └── solana.ts     # Solana DEX (Jupiter) API integration
├── types/
│   └── arbitrage.ts  # TypeScript interfaces
├── utils/
│   └── arbitrage.ts  # Arbitrage calculations
├── App.tsx           # Main application component
└── main.tsx         # Application entry point
```

## API Integration

### Binance API
- Endpoint: `https://api.binance.com/api/v3/ticker/price`
- No authentication required for public price data
- Formats symbol from `SOL-USDC` to `SOLUSDC`

### Jupiter API (Solana DEX)
- Endpoint: `https://price.jup.ag/v4/price`
- No authentication required
- Formats symbol from `SOL-USDC` to `SOL/USDC`

## Arbitrage Calculation

The application calculates arbitrage opportunities by:
1. Fetching real-time prices from both exchanges
2. Including trading fees in calculations
3. Computing potential profit percentage
4. Filtering opportunities based on minimum profit threshold

## Error Handling

The application includes comprehensive error handling for:
- API connection issues
- Invalid price data
- Network timeouts
- Rate limiting



## License

MIT License - feel free to use this project for your own purposes.
