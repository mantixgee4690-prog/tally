import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, UserPortfolio, Order } from './types/crypto';
import { fetchAssets } from './lib/api';
import { toast } from 'sonner';

interface MarketContextType {
  assets: Asset[];
  portfolio: UserPortfolio;
  orders: Order[];
  selectedPair: string;
  setSelectedPair: (pair: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => void;
  cancelOrder: (id: string) => void;
  isLoading: boolean;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedPair, setSelectedPair] = useState('BTC');
  const [isLoading, setIsLoading] = useState(true);
  
  const [portfolio, setPortfolio] = useState<UserPortfolio>(() => {
    const saved = localStorage.getItem('crypto_portfolio');
    return saved ? JSON.parse(saved) : {
      totalBalance: 50000,
      availableUSD: 50000,
      assets: {},
    };
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('crypto_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAssets();
        setAssets(data);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000); // Poll for price updates
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('crypto_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('crypto_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'timestamp' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: orderData.orderType === 'market' ? 'filled' : 'open',
    };

    if (newOrder.type === 'buy') {
      if (portfolio.availableUSD < newOrder.total) {
        toast.error('Insufficient USD balance');
        return;
      }
      
      setPortfolio(prev => ({
        ...prev,
        availableUSD: prev.availableUSD - newOrder.total,
        assets: newOrder.status === 'filled' ? {
          ...prev.assets,
          [selectedPair]: {
            amount: (prev.assets[selectedPair]?.amount || 0) + newOrder.amount,
            avgPrice: newOrder.price, // Simple avg for now
          }
        } : prev.assets
      }));
    } else {
      const currentAsset = portfolio.assets[selectedPair];
      if (!currentAsset || currentAsset.amount < newOrder.amount) {
        toast.error(`Insufficient ${selectedPair} balance`);
        return;
      }

      setPortfolio(prev => ({
        ...prev,
        availableUSD: newOrder.status === 'filled' ? prev.availableUSD + newOrder.total : prev.availableUSD,
        assets: {
          ...prev.assets,
          [selectedPair]: {
            ...currentAsset,
            amount: currentAsset.amount - newOrder.amount,
          }
        }
      }));
    }

    setOrders(prev => [newOrder, ...prev]);
    toast.success(`${newOrder.type.toUpperCase()} order ${newOrder.status}`);
  };

  const cancelOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (order.status === 'open') {
      if (order.type === 'buy') {
        setPortfolio(prev => ({
          ...prev,
          availableUSD: prev.availableUSD + order.total
        }));
      } else {
        setPortfolio(prev => ({
          ...prev,
          assets: {
            ...prev.assets,
            [order.pair]: {
              ...prev.assets[order.pair],
              amount: prev.assets[order.pair].amount + order.amount
            }
          }
        }));
      }
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } as Order : o));
      toast.info('Order cancelled');
    }
  };

  return (
    <MarketContext.Provider value={{ assets, portfolio, orders, selectedPair, setSelectedPair, placeOrder, cancelOrder, isLoading }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};