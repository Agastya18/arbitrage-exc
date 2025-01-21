import { PriceData } from '../types/arbitrage';

// const JUPITER_API_URL = 'https://api.jup.ag/price/v2';

// Jupiter uses different token symbols
// const TOKEN_MAPPING: Record<string, string> = {
//   'BTC-USDC': 'BTC/USDC',
//   'ETH-USDC': 'ETH/USDC',
//   'SOL-USDC': 'SOL/USDC'
// };

export async function getSolanaDEXPrice(symbol: string): Promise<PriceData> {
  try {
    // const jupiterSymbol = TOKEN_MAPPING[symbol];
    // if (!jupiterSymbol) {
    //   throw new Error(`Unsupported token pair: ${symbol}`);
    // }
    
    // Properly encode the symbol for the URL
    // const encodedSymbol = encodeURIComponent(jupiterSymbol);
    if(symbol!=="SOL-USDC"){
      throw new Error(`Unsupported token pair: ${symbol}`);
    }

    
    const response = await fetch('https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    //console.log("this is data22:",data.data.So11111111111111111111111111111111111111112.price);
    
    // Jupiter returns null for the whole pair if it doesn't exist
    // if (!data.data ) {
    //   throw new Error(`No price data available for ${jupiterSymbol}`);
    // }

    const priceData = data.data.So11111111111111111111111111111111111111112.price
   // console.log(priceData)
    
   
    
    return {
      exchange: 'Solana DEX',
      price: priceData,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching Solana DEX price:', error);
    throw new Error(`Failed to fetch price from Solana DEX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}