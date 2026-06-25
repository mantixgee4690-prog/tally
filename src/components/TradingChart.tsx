import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMarket } from '../MarketContext';
import { generateMockCandles } from '../lib/api';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export const TradingChart: React.FC = () => {
  const { selectedPair, assets, isLoading } = useMarket();
  const asset = assets.find(a => a.symbol === selectedPair);
  
  const [data, setData] = React.useState(generateMockCandles(asset?.price || 100));

  React.useEffect(() => {
    if (asset) {
      setData(generateMockCandles(asset.price));
    }
  }, [selectedPair]);

  if (isLoading || !asset) {
    return <Skeleton className="w-full h-[400px] rounded-xl" />;
  }

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{selectedPair}/USD</span>
            <span className="text-sm text-muted-foreground">{asset.name}</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex flex-col">
            <span className={`text-xl font-mono font-bold ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-muted-foreground">Live Price</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-tight">24h High</span>
            <span className="text-sm font-mono font-medium">${asset.high24h.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-tight">24h Low</span>
            <span className="text-sm font-mono font-medium">${asset.low24h.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-tight">24h Vol</span>
            <span className="text-sm font-mono font-medium">{(asset.volume24h / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <XAxis 
              dataKey="time" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              interval={5}
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value}`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />
            <Bar dataKey="close" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.close > entry.open ? '#22c55e' : '#ef4444'} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};