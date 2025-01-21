import { PriceData } from '../types/arbitrage';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

export async function getBinancePrice(symbol: string): Promise<PriceData> {
  try {
    // Convert BTC-USDC to BTCUSDC format for Binance API
    const formattedSymbol = symbol.replace('-', '');
    
    const response = await fetch(`${BINANCE_API_URL}/ticker/price?symbol=${formattedSymbol}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("this is data:",data.price);
    if (!data.price) {
       
      throw new Error('Invalid price data received from Binance');
    }
    
    return {
      exchange: 'Binance',
      price: parseFloat(data.price),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching Binance price:', error);
    throw new Error(`Failed to fetch price from Binance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}