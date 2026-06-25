import React from 'react';
import { useMarket } from '../MarketContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Wallet, Info } from 'lucide-react';

export const TradePanel: React.FC = () => {
  const { selectedPair, assets, portfolio, placeOrder } = useMarket();
  const asset = assets.find(a => a.symbol === selectedPair);
  
  const [orderType, setOrderType] = React.useState<'market' | 'limit'>('market');
  const [price, setPrice] = React.useState(asset?.price.toString() || '0');
  const [amount, setAmount] = React.useState('0');
  const [percent, setPercent] = React.useState([0]);

  React.useEffect(() => {
    if (asset && orderType === 'market') {
      setPrice(asset.price.toString());
    }
  }, [asset, orderType]);

  const handleBuy = () => {
    if (!asset) return;
    const p = parseFloat(price);
    const a = parseFloat(amount);
    placeOrder({
      pair: selectedPair,
      type: 'buy',
      orderType,
      price: p,
      amount: a,
      total: p * a,
    });
  };

  const handleSell = () => {
    if (!asset) return;
    const p = parseFloat(price);
    const a = parseFloat(amount);
    placeOrder({
      pair: selectedPair,
      type: 'sell',
      orderType,
      price: p,
      amount: a,
      total: p * a,
    });
  };

  const handlePercentChange = (val: number[]) => {
    setPercent(val);
    if (!asset) return;
    const p = parseFloat(price);
    if (p <= 0) return;
    
    // Simple logic: % of available USD for buy, % of available asset for sell
    // Defaulting to buy logic for visual
    const maxAffordable = portfolio.availableUSD / p;
    setAmount((maxAffordable * (val[0] / 100)).toFixed(4));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 h-fit">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 p-1">
          <TabsTrigger 
            value="buy" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger 
            value="sell" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all"
          >
            Sell
          </TabsTrigger>
        </TabsList>
        
        {['buy', 'sell'].map((side) => (
          <TabsContent key={side} value={side} className="flex flex-col gap-4 pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                Available:
              </span>
              <span className="font-mono font-medium text-foreground">
                {side === 'buy' 
                  ? `$${portfolio.availableUSD.toLocaleString()}` 
                  : `${portfolio.assets[selectedPair]?.amount || 0} ${selectedPair}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button 
                variant={orderType === 'limit' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setOrderType('limit')}
                className="h-8"
              >
                Limit
              </Button>
              <Button 
                variant={orderType === 'market' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setOrderType('market')}
                className="h-8"
              >
                Market
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Price (USD)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={orderType === 'market'}
                    className="font-mono pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium uppercase">
                    USD
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Amount ({selectedPair})</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="font-mono pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium uppercase">
                    {selectedPair}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-2">
              <Slider 
                value={percent} 
                onValueChange={handlePercentChange} 
                max={100} 
                step={25}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-[10px] mt-2 text-muted-foreground font-mono">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg space-y-2 border border-border/50">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Est. Total:</span>
                <span className="font-mono font-bold">${(parseFloat(price) * parseFloat(amount) || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Info className="w-2.5 h-2.5" /> Fees (0.1%):
                </span>
                <span className="font-mono">${(parseFloat(price) * parseFloat(amount) * 0.001 || 0).toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={side === 'buy' ? handleBuy : handleSell}
              className={`w-full py-6 text-lg font-bold shadow-lg transition-transform active:scale-95 ${
                side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {side === 'buy' ? 'Buy' : 'Sell'} {selectedPair}
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};