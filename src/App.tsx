import { MarketProvider } from './MarketContext';
import { Navbar } from './components/Navbar';
import { MarketSidebar } from './components/MarketSidebar';
import { TradingChart } from './components/TradingChart';
import { OrderBook } from './components/OrderBook';
import { TradePanel } from './components/TradePanel';
import { UserStats } from './components/UserStats';
import { Toaster } from 'sonner';

function App() {
  return (
    <MarketProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
        {/* Subtle Background Image */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/a58bcb21-faef-42be-bf3f-3be29d7f6178/dashboard-background-ad6583b6-1779455461524.webp" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>

        <Navbar />
        
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden z-10">
          {/* Sidebar - Visible on Desktop */}
          <div className="hidden md:block">
            <MarketSidebar />
          </div>
          
          {/* Main Trading Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
            <div className="p-2 md:p-4 flex flex-col gap-4 max-w-[1600px] mx-auto">
              
              {/* Top Section: Chart & Side Panel */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-8 flex flex-col gap-4">
                  <TradingChart />
                  <div className="block md:hidden">
                    <MarketSidebar />
                  </div>
                  <UserStats />
                </div>
                
                <div className="xl:col-span-4 flex flex-col gap-4">
                  <TradePanel />
                  <OrderBook />
                </div>
              </div>

            </div>
          </div>
        </main>

        <Toaster position="top-right" theme="dark" />
      </div>
    </MarketProvider>
  );
}

export default App;