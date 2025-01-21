export interface TokenPair {
    symbol: string;
    baseToken: string;
    quoteToken: string;
  }
  
  export interface PriceData {
    exchange: string;
    price: number;
    timestamp: number;
  }
  
  export interface ArbitrageOpportunity {
    pair: TokenPair;
    buyExchange: string;
    sellExchange: string;
    buyPrice: number;
    sellPrice: number;
    profitPercentage: number;
    estimatedProfit: number;
    timestamp: number;
  }