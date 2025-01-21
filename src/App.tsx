import  { useState, useEffect } from 'react';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { getBinancePrice } from './services/binance';
import { getSolanaDEXPrice } from './services/solana';
import { calculateArbitrage } from './utils/arbitrage';
import { ArbitrageOpportunity, TokenPair } from './types/arbitrage';

const SUPPORTED_PAIRS: TokenPair[] = [

  { symbol: 'SOL-USDC', baseToken: 'SOL', quoteToken: 'USDC' },
];

function App() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function scanArbitrageOpportunities() {
    setLoading(true);
    setError(null);
    
    try {
      const newOpportunities: ArbitrageOpportunity[] = [];

      for (const pair of SUPPORTED_PAIRS) {
        try {
          const [binancePrice, dexPrice] = await Promise.all([
            getBinancePrice(pair.symbol),
            getSolanaDEXPrice(pair.symbol)
          ]);

          const opportunity = calculateArbitrage(pair, binancePrice, dexPrice);
          if (opportunity) {
            newOpportunities.push(opportunity);
          }
        } catch (pairError) {
          console.warn(`Failed to fetch prices for ${pair.symbol}:`, pairError);
          // Continue with other pairs even if one fails
          continue;
        }
      }

      setOpportunities(newOpportunities);
      if (newOpportunities.length === 0) {
        setError('No profitable opportunities found at this time.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price data. Please try again.');
      console.error('Error scanning opportunities:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    scanArbitrageOpportunities();
    const interval = setInterval(scanArbitrageOpportunities, 60000); // Scan every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                CEX/DEX Arbitrage Scanner
              </h1>
              <button
                onClick={scanArbitrageOpportunities}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Scanning...' : 'Scan Now'}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {opportunities.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowUpDown className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No arbitrage opportunities</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We'll keep scanning for profitable opportunities.
                  </p>
                </div>
              ) : (
                opportunities.map((opp, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {opp.pair.baseToken}/{opp.pair.quoteToken}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Buy on {opp.buyExchange} at ${opp.buyPrice.toFixed(4)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Sell on {opp.sellExchange} at ${opp.sellPrice.toFixed(4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          +{opp.profitPercentage.toFixed(2)}%
                        </p>
                        <p className="text-sm text-gray-500">
                          Est. Profit: ${opp.estimatedProfit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;