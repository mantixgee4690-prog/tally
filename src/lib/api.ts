import { Asset, CandleData, Trade } from '../types/crypto';

const SYMBOLS = ['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'XRP', 'DOT', 'DOGE', 'AVAX', 'LINK', 'MATIC', 'UNI', 'LTC', 'BCH', 'ALGO'];

export const fetchAssets = async (): Promise<Asset[]> => {
  // Simulating an API call to Binance or CoinGecko
  return SYMBOLS.map(symbol => {
    const basePrice = symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3500 : 100;
    const randomVar = Math.random() * 0.05 - 0.025;
    return {
      symbol,
      name: getAssetName(symbol),
      price: basePrice * (1 + randomVar),
      change24h: (Math.random() * 10 - 5),
      volume24h: Math.random() * 1000000000,
      high24h: basePrice * 1.05,
      low24h: basePrice * 0.95,
    };
  });
};

const getAssetName = (symbol: string) => {
  const names: Record<string, string> = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    SOL: 'Solana',
    BNB: 'Binance Coin',
    ADA: 'Cardano',
    XRP: 'Ripple',
    DOT: 'Polkadot',
    DOGE: 'Dogecoin',
    AVAX: 'Avalanche',
    LINK: 'Chainlink',
    MATIC: 'Polygon',
    UNI: 'Uniswap',
    LTC: 'Litecoin',
    BCH: 'Bitcoin Cash',
    ALGO: 'Algorand',
  };
  return names[symbol] || symbol;
};

export const generateMockCandles = (basePrice: number): CandleData[] => {
  const data: CandleData[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = 50; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const open = currentPrice;
    const close = currentPrice * (1 + (Math.random() * 0.02 - 0.01));
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    
    data.push({ time, open, high, low, close });
    currentPrice = close;
  }
  return data;
};

export const generateMockTrades = (basePrice: number): Trade[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: Math.random().toString(36).substr(2, 9),
    price: basePrice * (1 + (Math.random() * 0.01 - 0.005)),
    amount: Math.random() * 2,
    timestamp: Date.now() - i * 10000,
    side: Math.random() > 0.5 ? 'buy' : 'sell',
  }));
};