export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  icon?: string;
}

export interface Order {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  price: number;
  amount: number;
  total: number;
  status: 'open' | 'filled' | 'cancelled';
  timestamp: number;
}

export interface Trade {
  id: string;
  price: number;
  amount: number;
  timestamp: number;
  side: 'buy' | 'sell';
}

export interface UserPortfolio {
  totalBalance: number;
  availableUSD: number;
  assets: {
    [symbol: string]: {
      amount: number;
      avgPrice: number;
    };
  };
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}