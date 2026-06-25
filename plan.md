# Crypto Trading Platform Implementation Plan

Build a comprehensive frontend-only crypto trading platform interface with real-time simulations and a professional trading UI.

## Scope & Non-Goals
- **Scope**: Trading dashboard, candlestick charts, order book simulation, portfolio management, wallet interface, and currency pair listings.
- **Non-Goals**: Real-world crypto transactions, real-time backend persistence (persistence via `localStorage`), real-money trading, or real user authentication (mocked/simulated).

## Assumptions & Open Questions
- We will use public APIs (like Binance or CoinGecko) for real-time market data where possible, otherwise simulate high-fidelity data.
- User data (orders, portfolio) will be saved in `localStorage`.

## Affected Areas
- **Frontend**: All UI components, state management for "trades" and "balance".
- **Data Layer**: Mocked services for order execution and price feeds.

## Phases

### Phase 1: Foundation & Market Data (Frontend Engineer)
- Set up a data fetching service for crypto prices (using a public API or a high-quality mock).
- Define types for `Ticker`, `Trade`, `Order`, and `Portfolio`.
- Implement a basic `MarketContext` for global price state.

### Phase 2: Core Trading UI (Frontend Engineer)
- Implement the **Candlestick Chart** (using a library like `lightweight-charts` or `recharts`).
- Build the **Order Book** component (showing bid/ask spreads).
- Create the **Trade Form** (Buy/Sell, Limit/Market orders).

### Phase 3: Portfolio & History (Frontend Engineer)
- Build the **Portfolio Overview** (Assets, Balance, P&L).
- Implement the **Trade History** and **Open Orders** tables.
- Add `localStorage` persistence for "User Assets" so the balance persists across refreshes.

### Phase 4: Market Explorer & Polish (Quick Fix Engineer)
- Implement a **Market Sidebar** with search/filter for all currency pairs.
- Add "Ticker Tape" for top-moving coins.
- Refine responsive design for mobile trading.
- Final UI/UX polish and "dark mode" optimization.

## Sequencing
- Phase 1 and 2 are critical path.
- Phase 3 depends on Phase 2's trade form.
- Phase 4 can run concurrently with Phase 3.
