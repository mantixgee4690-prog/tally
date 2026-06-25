import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Wallet, User, LogOut, ShieldCheck, TrendingUp, ChevronUp, ChevronDown, Activity } from 'lucide-react';

// ============================================================================
// 1. GLOBAL MARKET CONTEXT (State Management System)
// ============================================================================

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, username } or null
  const [wallet, setWallet] = useState({
    connected: false,
    address: null,
    type: null, // 'binance' | 'okx' | 'bitget'
    balance: '0.00'
  });
  const [currentPrice, setCurrentPrice] = useState(0);

  // EIP-1193 multi-wallet extension interface simulation
  const connectWallet = async (walletType) => {
    try {
      // Latency buffer simulation to match wallet connection handshake
      await new Promise(resolve => setTimeout(resolve, 600));

      const mockAddresses = {
        binance: '0x34B...89Ef',
        okx: '0x91C...22Ab',
        bitget: '0x7EA...55Cd'
      };

      const mockBalances = {
        binance: '4,250.80',
        okx: '1,890.20',
        bitget: '612.10'
      };

      setWallet({
        connected: true,
        address: mockAddresses[walletType] || '0x000...0000',
        type: walletType,
        balance: mockBalances[walletType] || '0.00'
      });
    } catch (error) {
      console.error("Wallet injection connection failed", error);
    }
  };

  const disconnectWallet = () => {
    setWallet({ connected: false, address: null, type: null, balance: '0.00' });
  };

  const registerUser = (email) => {
    setUser({ email, username: email.split('@')[0] });
  };

  const logoutUser = () => setUser(null);

  return (
    <MarketContext.Provider value={{
      user,
      wallet,
      currentPrice,
      setCurrentPrice,
      connectWallet,
      disconnectWallet,
      registerUser,
      logoutUser
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => useContext(MarketContext);


// ============================================================================
// 2. NAVBAR COMPONENT (Auth & Web3 Wallet Portal)
// ============================================================================

export const Navbar = () => {
  const { user, wallet, registerUser, logoutUser, connectWallet, disconnectWallet } = useMarket();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (email && password) {
      registerUser(email);
      setShowAuthModal(false);
      setEmail(''); setPassword('');
    }
  };

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-4 py-3 flex justify-between items-center z-30 relative">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white tracking-tighter">Ω</div>
        <span className="font-bold text-white text-lg tracking-wide">NEXUS<span className="text-indigo-500">DEX</span></span>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile State Management Button */}
        {user ? (
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-sm">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="text-neutral-200 font-mono text-xs">{user.username}</span>
            <button onClick={logoutUser} className="ml-1 text-neutral-500 hover:text-rose-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowAuthModal(true)}
            className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-200 px-3.5 py-1.5 rounded-lg hover:bg-neutral-800 transition-all font-medium"
          >
            Sign Up / Register
          </button>
        )}

        {/* Web3 Exchange Wallet Connection Gateway */}
        {wallet.connected ? (
          <button 
            onClick={disconnectWallet}
            className="text-xs bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 px-3.5 py-1.5 rounded-lg hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all font-mono"
          >
            {wallet.address} ({wallet.type.toUpperCase()})
          </button>
        ) : (
          <button 
            onClick={() => setShowWalletModal(true)}
            className="text-xs bg-indigo-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-indigo-500 transition-all font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Wallet className="w-4 h-4" /> Connect Wallet
          </button>
        )}
      </div>

      {/* Account Signup Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-white mb-1">Create Exchange Profile</h3>
            <p className="text-xs text-neutral-400 mb-4">Register your local node instance to allow transaction sequencing.</p>
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <input 
                type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <input 
                type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button type="submit" className="bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-indigo-500 mt-2 transition-all">
                Initialize Profile
              </button>
            </form>
            <button onClick={() => setShowAuthModal(false)} className="text-xs text-neutral-500 hover:text-neutral-300 mx-auto block mt-4 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Multi-Wallet Aggregator Portal Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Select Exchange Wallet</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">Connect securely through your choice of ecosystem client interfaces.</p>
            <div className="flex flex-col gap-2">
              {[
                { id: 'binance', name: 'Binance Web3 Wallet', label: 'BNB Chain Ecosystem' },
                { id: 'okx', name: 'OKX Wallet Link', label: 'OKC native provider' },
                { id: 'bitget', name: 'Bitget Wallet System', label: 'Injected provider' }
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    connectWallet(w.id);
                    setShowWalletModal(false);
                  }}
                  className="w-full text-left p-3 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-indigo-500/50 hover:bg-neutral-900 transition-all flex justify-between items-center group"
                >
                  <div>
                    <div className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">{w.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">{w.label}</div>
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">Injected</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowWalletModal(false)} className="text-xs text-neutral-500 hover:text-neutral-300 mx-auto block mt-4 transition-colors">Cancel Connection</button>
          </div>
        </div>
      )}
    </nav>
  );
};


// ============================================================================
// 3. TRADING CHART COMPONENT (Live Binance Websocket Feed + HTML5 Canvas)
// ============================================================================

export const TradingChart = () => {
  const { setCurrentPrice } = useMarket();
  const [candles, setCandles] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Open stream to Binance Public Spot Websocket Feed
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const kline = data.k;
      if (!kline) return;

      const price = parseFloat(kline.c);
      setCurrentPrice(price); // Mirror live asset price globally

      const newCandle = {
        time: kline.t,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: price
      };

      setCandles((prev) => {
        if (prev.length === 0) return [newCandle];
        const lastCandle = prev[prev.length - 1];
        
        if (lastCandle.time === newCandle.time) {
          const updated = [...prev];
          updated[updated.length - 1] = newCandle;
          return updated.slice(-40); // Lock window bounds max length
        } else {
          return [...prev, newCandle].slice(-40);
        }
      });
    };

    return () => ws.close();
  }, [setCurrentPrice]);

  // High-performance canvas charting pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const maxVal = Math.max(...highs) * 1.0001;
    const minVal = Math.min(...lows) * 0.9999;
    const range = maxVal - minVal;

    const barSpacing = width / 40;
    const candleWidth = barSpacing - 5;

    // Draw horizontal grid lines
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      const yGrid = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, yGrid);
      ctx.lineTo(width, yGrid);
      ctx.stroke();
    }

    candles.forEach((candle, idx) => {
      const x = idx * barSpacing + 2;
      
      const yOpen = height - ((candle.open - minVal) / range) * height;
      const yClose = height - ((candle.close - minVal) / range) * height;
      const yHigh = height - ((candle.high - minVal) / range) * height;
      const yLow = height - ((candle.low - minVal) / range) * height;

      const isBullish = candle.close >= candle.open;
      const themeColor = isBullish ? '#10B981' : '#EF4444';

      // Draw shadow wicks
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, yHigh);
      ctx.lineTo(x + candleWidth / 2, yLow);
      ctx.stroke();

      // Draw candle structural blocks
      ctx.fillStyle = themeColor;
      const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1);
      ctx.fillRect(x, Math.min(yOpen, yClose), candleWidth, bodyHeight);
    });
  }, [candles]);

  const latestCandle = candles[candles.length - 1];

  return (
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 flex flex-col backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-wider text-white">BTC/USDT</span>
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
            <Activity className="w-3 h-3" /> Live Feed
          </span>
        </div>
        <div className="text-xs text-neutral-400 flex gap-4 font-mono">
          <span>Index: <span className="text-neutral-200 font-bold">${latestCandle ? latestCandle.close.toLocaleString(undefined, {minimumFractionDigits:2}) : '0.00'}</span></span>
        </div>
      </div>
      <div className="flex-1 h-[320px] relative">
        <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
      </div>
    </div>
  );
};


// ============================================================================
// 4. TRADE PANEL COMPONENT (Order Placement Engine)
// ============================================================================

export const TradePanel = () => {
  const { wallet, user, currentPrice } = useMarket();
  const [side, setSide] = useState('buy'); // 'buy' | 'sell'
  const [amount, setAmount] = useState('');

  const totalValue = amount && currentPrice ? (parseFloat(amount) * currentPrice).toFixed(2) : '0.00';

  return (
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 backdrop-blur-md">
      <div className="grid grid-cols-2 gap-2 mb-4 bg-neutral-950 p-1 rounded-lg border border-neutral-850">
        <button 
          onClick={() => setSide('buy')}
          className={`py-1.5 text-xs font-bold rounded-md transition-all ${side === 'buy' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10' : 'text-neutral-400 hover:text-white'}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setSide('sell')}
          className={`py-1.5 text-xs font-bold rounded-md transition-all ${side === 'sell' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10' : 'text-neutral-400 hover:text-white'}`}
        >
          SELL
        </button>
      </div>

      <div className="flex justify-between items-center text-xs text-neutral-400 mb-3 font-mono">
        <span>Available Depth:</span>
        <span className="text-neutral-200">{wallet.connected ? `${wallet.balance} USDT` : '--'}</span>
      </div>

      <div className="flex flex-col gap-3.5">
        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-bold block mb-1 tracking-wider">Tick Price</label>
          <div className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2.5 text-xs text-neutral-300 font-mono">
            {currentPrice ? `$${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}` : 'Awaiting data link...'}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-bold block mb-1 tracking-wider">Order Volume (BTC)</label>
          <input 
            type="number" step="0.001" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-850 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="border-t border-neutral-850 my-1"></div>

        <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
          <span>Est. Total Outlay:</span>
          <span className="text-white text-sm font-bold">${totalValue}</span>
        </div>

        {!user ? (
          <div className="text-center p-2.5 bg-neutral-950/80 border border-neutral-850 rounded-lg text-[11px] text-neutral-500 font-medium">
            🔒 Profile System Registration Required
          </div>
        ) : !wallet.connected ? (
          <div className="text-center p-2.5 bg-neutral-950/80 border border-neutral-850 rounded-lg text-[11px] text-neutral-500 font-medium">
            🔌 Connect Gateway Wallet to Transact
          </div>
        ) : (
          <button className={`w-full py-2.5 rounded-lg font-bold text-xs tracking-wider text-white transition-all shadow-lg ${side === 'buy' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/10'}`}>
            EXECUTE {side.toUpperCase()} ORDER
          </button>
        )}
      </div>
    </div>
  );
};


// ============================================================================
// 5. ORDER BOOK COMPONENT (Dynamic Real-Time Depth Matrix)
// ============================================================================

export const OrderBook = () => {
  const { currentPrice } = useMarket();
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    if (!currentPrice) return;

    // Simulate high-frequency liquidity fluctuations locked to the live ticking feed
    const scaleSyntheticLiquidity = () => {
      const generatedAsks = Array.from({ length: 5 }, (_, i) => ({
        price: currentPrice + (i + 1) * (0.3 + Math.random() * 0.4),
        size: Math.random() * 1.5 + 0.05
      })).reverse();

      const generatedBids = Array.from({ length: 5 }, (_, i) => ({
        price: currentPrice - (i + 1) * (0.3 + Math.random() * 0.4),
        size: Math.random() * 1.5 + 0.05
      }));

      setAsks(generatedAsks);
      setBids(generatedBids);
    };

    scaleSyntheticLiquidity();
    const interval = setInterval(scaleSyntheticLiquidity, 1000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 backdrop-blur-md font-mono text-[11px]">
      <h4 className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-2">Order Depth Matrix</h4>
      
      <div className="grid grid-cols-2 text-neutral-500 font-semibold mb-1 pb-1 border-b border-neutral-850">
        <span>Price (USDT)</span>
        <span className="text-right">Size (BTC)</span>
      </div>

      {/* Asks (Sells) */}
      <div className="flex flex-col gap-0.5 mb-2">
        {asks.map((ask, i) => (
          <div key={i} className="grid grid-cols-2 text-rose-400 bg-rose-500/[0.01] py-0.5">
            <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3 text-rose-500/50" /> {ask.price.toFixed(2)}</span>
            <span className="text-right text-neutral-300">{ask.size.toFixed(4)}</span>
          </div>
        ))}
      </div>

      {/* Spreads Anchor */}
      <div className="py-1 px-2 bg-neutral-950 border border-neutral-850 rounded text-center font-bold text-xs text-neutral-300">
        {currentPrice ? `$${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '--'}
      </div>

      {/* Bids (Buys) */}
      <div className="flex flex-col gap-0.5 mt-2">
        {bids.map((bid, i) => (
          <div key={i} className="grid grid-cols-2 text-emerald-400 bg-emerald-500/[0.01] py-0.5">
            <span className="flex items-center gap-1"><ChevronDown className="w-3 h-3 text-emerald-500/50" /> {bid.price.toFixed(2)}</span>
            <span className="text-right text-neutral-300">{bid.size.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


// ============================================================================
// 6. SUPPORTING SIDEBAR & POSITION FOOTER COMPONENTS
// ============================================================================

export const MarketSidebar = () => {
  const assets = [
    { name: 'BTC/USDT', change: '+2.41%', active: true },
    { name: 'ETH/USDT', change: '-0.85%', active: false },
    { name: 'SOL/USDT', change: '+8.12%', active: false },
    { name: 'LINK/USDT', change: '+0.15%', active: false }
  ];

  return (
    <div className="w-full md:w-60 bg-neutral-900/40 md:bg-neutral-900/20 p-4 flex flex-col gap-2 backdrop-blur-md h-full">
      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-neutral-400" /> Active Instruments
      </span>
      {assets.map((asset, i) => (
        <div key={i} className={`p-2.5 rounded-lg flex justify-between items-center text-xs font-mono cursor-pointer transition-all ${asset.active ? 'bg-indigo-600/10 border border-indigo-500/30 text-white' : 'border border-transparent text-neutral-400 hover:bg-neutral-900/40'}`}>
          <span className="font-semibold">{asset.name}</span>
          <span className={asset.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>{asset.change}</span>
        </div>
      ))}
    </div>
  );
};

export const UserStats = () => {
  return (
    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 backdrop-blur-md">
      <div className="flex border-b border-neutral-850 text-xs font-semibold text-neutral-400 gap-4 pb-2 mb-3">
        <span className="text-white border-b-2 border-indigo-500 pb-2 -mb-2.5 cursor-pointer">Active Positions (0)</span>
        <span className="hover:text-neutral-200 cursor-pointer transition-colors">Pending Orders</span>
        <span className="hover:text-neutral-200 cursor-pointer transition-colors">Execution Logs</span>
      </div>
      <div className="py-6 text-center text-xs text-neutral-500 font-mono">
        No active structural routing positions discovered.
      </div>
    </div>
  );
};


// ============================================================================
// 7. ROOT ASSEMBLY CORE
// ============================================================================

function App() {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col font-sans relative overflow-hidden">
        
        {/* Underlay Dashboard Background Layout Graphic */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none mix-blend-color-dodge">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/a58bcb21-faef-42be-bf3f-3be29d7f6178/dashboard-background-ad6583b6-1779455461524.webp" 
            alt="" 
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        
        <Navbar />

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden z-10">
          {/* Desktop Left-Rail Workspace Navigation */}
          <div className="hidden md:block border-r border-neutral-900 h-full">
            <MarketSidebar />
          </div>
          
          {/* Main Workspace Frame */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 md:p-4 flex flex-col gap-4 max-w-[1600px] mx-auto">
              
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Visual Workspace Matrix Core */}
                <div className="xl:col-span-8 flex flex-col gap-4">
                  <TradingChart />
                  <div className="block md:hidden">
                    <MarketSidebar />
                  </div>
                  <UserStats />
                </div>
                
                {/* Transaction Controls Column */}
                <div className="xl:col-span-4 flex flex-col gap-4">
                  <TradePanel />
                  <OrderBook />
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </MarketProvider>
  );
}

export default App;