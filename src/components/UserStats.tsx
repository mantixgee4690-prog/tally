import React from 'react';
import { useMarket } from '../MarketContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, ExternalLink, Clock, History, LayoutGrid } from 'lucide-react';

export const UserStats: React.FC = () => {
  const { orders, portfolio, cancelOrder, assets } = useMarket();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'filled': return <Badge className="bg-green-500/20 text-green-500 border-none">Filled</Badge>;
      case 'cancelled': return <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">Cancelled</Badge>;
      default: return <Badge variant="outline" className="text-blue-500 border-blue-500/50">Open</Badge>;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <Tabs defaultValue="positions" className="w-full">
        <div className="flex items-center justify-between px-4 bg-muted/30 border-b border-border">
          <TabsList className="bg-transparent border-none p-0 h-12">
            <TabsTrigger 
              value="positions" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 h-full"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger 
              value="open" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 h-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              Open Orders
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 h-full"
            >
              <History className="w-4 h-4 mr-2" />
              Trade History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="positions" className="p-0 m-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border">
                <TableHead className="text-xs font-bold uppercase">Asset</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Balance</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Avg Price</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Value (USD)</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border bg-accent/10">
                <TableCell className="font-bold">USD</TableCell>
                <TableCell className="text-right font-mono">${portfolio.availableUSD.toLocaleString()}</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right font-mono">${portfolio.availableUSD.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Deposit</Button>
                </TableCell>
              </TableRow>
              {Object.entries(portfolio.assets).filter(([_, data]) => data.amount > 0).map(([symbol, data]) => {
                const asset = assets.find(a => a.symbol === symbol);
                const currentValue = (asset?.price || 0) * data.amount;
                return (
                  <TableRow key={symbol} className="border-border hover:bg-muted/20">
                    <TableCell className="font-bold">{symbol}</TableCell>
                    <TableCell className="text-right font-mono">{data.amount.toFixed(4)}</TableCell>
                    <TableCell className="text-right font-mono">${data.avgPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono">${currentValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Trade</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {Object.keys(portfolio.assets).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No active assets. Start trading to see your portfolio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="open" className="p-0 m-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border">
                <TableHead className="text-xs font-bold uppercase">Time</TableHead>
                <TableHead className="text-xs font-bold uppercase">Pair</TableHead>
                <TableHead className="text-xs font-bold uppercase">Side</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Price</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Amount</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.filter(o => o.status === 'open').map((order) => (
                <TableRow key={order.id} className="border-border">
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="font-bold">{order.pair}/USD</TableCell>
                  <TableCell>
                    <span className={order.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {order.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">${order.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono">{order.amount.toFixed(4)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={() => cancelOrder(order.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {orders.filter(o => o.status === 'open').length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No open orders.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="history" className="p-0 m-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border">
                <TableHead className="text-xs font-bold uppercase">Time</TableHead>
                <TableHead className="text-xs font-bold uppercase">Pair</TableHead>
                <TableHead className="text-xs font-bold uppercase">Type</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Price</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Amount</TableHead>
                <TableHead className="text-xs font-bold uppercase text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-border">
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {new Date(order.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="font-bold">{order.pair}/USD</TableCell>
                  <TableCell>
                    <span className={order.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {order.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">${order.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono">{order.amount.toFixed(4)}</TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(order.status)}
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No trade history yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};