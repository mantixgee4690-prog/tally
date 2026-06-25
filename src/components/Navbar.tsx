import React from 'react';
import { useMarket } from '../MarketContext';
import { 
  BarChart3, 
  Bell, 
  Settings, 
  User, 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export const Navbar: React.FC = () => {
  const { portfolio } = useMarket();

  return (
    <nav className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/a58bcb21-faef-42be-bf3f-3be29d7f6178/platform-logo-c4323398-1779455460376.webp" 
              alt="CryptoX Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight leading-none">CRYPTO<span className="text-primary font-black">X</span></span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">Exchange Pro</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Trade</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
            Markets <Badge variant="secondary" className="text-[9px] h-4 px-1 ml-1 bg-green-500/10 text-green-500 border-none">LIVE</Badge>
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Derivatives</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">NFTs</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Learn</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end border-r border-border pr-4 mr-2">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Balance</span>
          <span className="text-sm font-mono font-bold flex items-center gap-1">
            <Wallet className="w-3 h-3 text-primary" />
            ${portfolio.availableUSD.toLocaleString()}
            <ArrowUpRight className="w-3 h-3 text-green-500" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Zap className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-border bg-muted/50">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-4 border-b border-border mb-2">
                <p className="text-sm font-bold">Pro Trader</p>
                <p className="text-xs text-muted-foreground">trader@example.com</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-green-500">
                  <ShieldCheck className="w-3 h-3" /> KYC Verified
                </div>
              </div>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="hidden sm:flex bg-primary hover:bg-primary/90">
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};