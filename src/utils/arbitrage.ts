import Decimal from 'decimal.js';
import { ArbitrageOpportunity, PriceData, TokenPair } from '../types/arbitrage';

const BINANCE_TAKER_FEE = 0.001; // 0.1%
const DEX_SWAP_FEE = 0.003; // 0.3%


export function calculateArbitrage(
  pair: TokenPair,
  binancePrice: PriceData,
  dexPrice: PriceData,
  minProfitThreshold: number = 0.2 // 0.4%
): ArbitrageOpportunity | null {
  const binancePriceWithFee = new Decimal(binancePrice.price)
    .mul(1 + BINANCE_TAKER_FEE);
  const dexPriceWithFee = new Decimal(dexPrice.price)
    .mul(1 + DEX_SWAP_FEE);

  let buyExchange: string;
  let sellExchange: string;
  let buyPrice: Decimal;
  let sellPrice: Decimal;

  if (binancePriceWithFee.lt(dexPriceWithFee)) {
    buyExchange = 'Binance';
    sellExchange = 'Solana DEX';
    buyPrice = binancePriceWithFee;
    sellPrice = dexPriceWithFee;
  } else {
    buyExchange = 'Solana DEX';
    sellExchange = 'Binance';
    buyPrice = dexPriceWithFee;
    sellPrice = binancePriceWithFee;
  }

  const profitPercentage = sellPrice
    .minus(buyPrice)
    .div(buyPrice)
    .mul(100)
    .toNumber();

  if (profitPercentage <= minProfitThreshold) {
    return null;
  }

  const estimatedProfit = sellPrice
    .minus(buyPrice)
    .toNumber();

  return {
    pair,
    buyExchange,
    sellExchange,
    buyPrice: buyPrice.toNumber(),
    sellPrice: sellPrice.toNumber(),
    profitPercentage,
    estimatedProfit,
    timestamp: Date.now()
  };
}