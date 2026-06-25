import React from 'react';
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useMarket } from '../MarketContext';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export const MarketSidebar: React.FC = () => {
  const { assets, setSelectedPair, selectedPair } = useMarket();
  const [search, setSearch] = React.useState('');

  const filteredAssets = assets.filter(a => 
    a.symbol.toLowerCase().includes(search.toLowerCase()) || 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border w-full md:w-80">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold mb-4">Markets</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search coins..." 
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground px-4 py-2 uppercase tracking-wider">
          <span>Pair</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h%</span>
        </div>
        
        {filteredAssets.map((asset) => (
          <button
            key={asset.symbol}
            onClick={() => setSelectedPair(asset.symbol)}
            className={`w-full grid grid-cols-3 items-center px-4 py-3 text-sm transition-colors hover:bg-accent/50 ${
              selectedPair === asset.symbol ? 'bg-accent/80' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-muted-foreground hover:text-yellow-500 transition-colors" />
              <div className="flex flex-col items-start">
                <span className="font-bold">{asset.symbol}</span>
                <span className="text-[10px] text-muted-foreground">{asset.name}</span>
              </div>
            </div>
            
            <div className="text-right font-mono">
              ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            
            <div className={`text-right flex items-center justify-end gap-1 ${
              asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(asset.change24h).toFixed(2)}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};