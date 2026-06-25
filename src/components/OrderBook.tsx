import React from 'react';
import { useMarket } from '../MarketContext';
import { generateMockTrades } from '../lib/api';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const OrderBook: React.FC = () => {
  const { selectedPair, assets } = useMarket();
  const asset = assets.find(a => a.symbol === selectedPair);
  
  // Simulated Order Book
  const asks = React.useMemo(() => {
    if (!asset) return [];
    return Array.from({ length: 12 }).map((_, i) => ({
      price: asset.price * (1 + 0.001 * (i + 1)),
      amount: Math.random() * 5,
      total: 0
    })).reverse();
  }, [asset]);

  const bids = React.useMemo(() => {
    if (!asset) return [];
    return Array.from({ length: 12 }).map((_, i) => ({
      price: asset.price * (1 - 0.001 * (i + 1)),
      amount: Math.random() * 5,
      total: 0
    }));
  }, [asset]);

  const recentTrades = React.useMemo(() => {
    if (!asset) return [];
    return generateMockTrades(asset.price);
  }, [asset]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="grid grid-cols-3 text-[10px] font-bold text-muted-foreground px-4 py-2 bg-muted/30 uppercase tracking-widest border-b border-border">
        <span>Price (USD)</span>
        <span className="text-right">Amount ({selectedPair})</span>
        <span className="text-right">Total</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 flex flex-col justify-end">
          {asks.map((ask, i) => (
            <div key={i} className="relative group overflow-hidden">
              <div 
                className="absolute inset-0 bg-red-500/10 transition-all origin-right" 
                style={{ width: `${Math.min(ask.amount * 20, 100)}%`, right: 0, left: 'auto' }} 
              />
              <div className="grid grid-cols-3 text-xs px-4 py-1 relative z-10 font-mono">
                <span className="text-red-500">{ask.price.toFixed(2)}</span>
                <span className="text-right text-foreground/80">{ask.amount.toFixed(4)}</span>
                <span className="text-right text-muted-foreground">{(ask.price * ask.amount).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="px-4 py-3 bg-muted/20 border-y border-border/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold font-mono text-green-500">
              {asset?.price.toFixed(2)}
            </span>
            <span className="text-[10px] text-muted-foreground">Last Price</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-muted-foreground">
              Spread: 0.12%
            </span>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1">
          {bids.map((bid, i) => (
            <div key={i} className="relative group overflow-hidden">
              <div 
                className="absolute inset-0 bg-green-500/10 transition-all origin-right" 
                style={{ width: `${Math.min(bid.amount * 20, 100)}%`, right: 0, left: 'auto' }} 
              />
              <div className="grid grid-cols-3 text-xs px-4 py-1 relative z-10 font-mono">
                <span className="text-green-500">{bid.price.toFixed(2)}</span>
                <span className="text-right text-foreground/80">{bid.amount.toFixed(4)}</span>
                <span className="text-right text-muted-foreground">{(bid.price * bid.amount).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-48 border-t border-border flex flex-col">
        <div className="px-4 py-2 bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase">
          Recent Trades
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="grid grid-cols-3 text-[11px] px-4 py-1.5 font-mono">
              <span className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                {trade.price.toFixed(2)}
              </span>
              <span className="text-right">{trade.amount.toFixed(4)}</span>
              <span className="text-right text-muted-foreground">
                {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};