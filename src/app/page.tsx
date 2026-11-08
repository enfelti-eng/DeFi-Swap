"use client";

import { useState, useMemo } from "react";

type Token = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  type: "crypto" | "stable" | "stock";
  icon: string;
  balance: number;
};

const TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", price: 3245.8, change24h: 2.4, type: "crypto", icon: "Ξ", balance: 1.245 },
  { symbol: "BTC", name: "Bitcoin", price: 68420, change24h: -0.8, type: "crypto", icon: "₿", balance: 0.032 },
  { symbol: "SOL", name: "Solana", price: 178.5, change24h: 5.1, type: "crypto", icon: "◎", balance: 12.5 },
  { symbol: "USDT", name: "Tether", price: 1.0, change24h: 0.01, type: "stable", icon: "₮", balance: 2450 },
  { symbol: "USDC", name: "USD Coin", price: 1.0, change24h: 0.0, type: "stable", icon: "$", balance: 890 },
  { symbol: "TSLA", name: "Tesla", price: 248.3, change24h: 1.8, type: "stock", icon: "T", balance: 4.2 },
  { symbol: "AAPL", name: "Apple", price: 189.7, change24h: -0.4, type: "stock", icon: "A", balance: 8.0 },
  { symbol: "NVDA", name: "NVIDIA", price: 875.2, change24h: 3.2, type: "stock", icon: "N", balance: 1.1 },
];

type Tab = "swap" | "liquidity" | "portfolio";

export default function Home() {
  const [tab, setTab] = useState<Tab>("swap");
  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[3]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  // Liquidity state
  const [liqTokenA, setLiqTokenA] = useState<Token>(TOKENS[0]);
  const [liqTokenB, setLiqTokenB] = useState<Token>(TOKENS[3]);
  const [liqAmountA, setLiqAmountA] = useState("");
  const [liqAmountB, setLiqAmountB] = useState("");

  const rate = useMemo(() => {
    if (!fromToken || !toToken) return 0;
    return fromToken.price / toToken.price;
  }, [fromToken, toToken]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value === "" || isNaN(Number(value))) {
      setToAmount("");
      return;
    }
    const num = parseFloat(value);
    setToAmount((num * rate).toFixed(6));
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (value === "" || isNaN(Number(value))) {
      setFromAmount("");
      return;
    }
    const num = parseFloat(value);
    setFromAmount((num / rate).toFixed(6));
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const selectFromToken = (token: Token) => {
    if (token.symbol === toToken.symbol) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setShowFromModal(false);
    if (fromAmount) {
      const newRate = token.price / toToken.price;
      setToAmount((parseFloat(fromAmount) * newRate).toFixed(6));
    }
  };

  const selectToToken = (token: Token) => {
    if (token.symbol === fromToken.symbol) {
      setFromToken(toToken);
    }
    setToToken(token);
    setShowToModal(false);
    if (fromAmount) {
      const newRate = fromToken.price / token.price;
      setToAmount((parseFloat(fromAmount) * newRate).toFixed(6));
    }
  };

  const TokenButton = ({ token, onClick }: { token: Token; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#00ff41]/40 rounded-xl px-3 py-2 transition-all"
    >
      <div className="w-7 h-7 rounded-full bg-[#00ff41]/15 border border-[#00ff41]/40 flex items-center justify-center text-sm font-bold text-[#00ff41]">
        {token.icon}
      </div>
      <span className="font-semibold text-sm">{token.symbol}</span>
      <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  const TokenModal = ({
    open,
    onClose,
    onSelect,
    exclude,
  }: {
    open: boolean;
    onClose: () => void;
    onSelect: (t: Token) => void;
    exclude?: string;
  }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
        <div
          className="bg-[#0c0c0c] border border-[#222] rounded-2xl w-full max-w-md mx-4 max-h-[70vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-[#222] flex items-center justify-between">
            <h3 className="font-semibold text-lg">Selecionar token</h3>
            <button onClick={onClose} className="text-zinc-500 hover:text-white text-xl">×</button>
          </div>
          <div className="p-2 overflow-y-auto max-h-[55vh]">
            {TOKENS.filter((t) => t.symbol !== exclude).map((token) => (
              <button
                key={token.symbol}
                onClick={() => onSelect(token)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#00ff41]/15 border border-[#00ff41]/40 flex items-center justify-center text-lg font-bold text-[#00ff41]">
                  {token.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{token.symbol}</div>
                  <div className="text-xs text-zinc-500">{token.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">${token.price.toLocaleString()}</div>
                  <div className={`text-xs ${token.change24h >= 0 ? "text-[#00ff41]" : "text-red-400"}`}>
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#080808]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00ff41] flex items-center justify-center">
              <span className="text-black font-black text-lg">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              Neon<span className="text-[#00ff41]">Swap</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-[#111] rounded-xl p-1 border border-[#222]">
            {(["swap", "liquidity", "portfolio"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-[#00ff41] text-black shadow-[0_0_12px_rgba(0,255,65,0.4)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {t === "swap" ? "Swap" : t === "liquidity" ? "Liquidez" : "Portfólio"}
              </button>
            ))}
          </nav>

          <button className="bg-[#00ff41] hover:bg-[#00e639] text-black font-semibold px-5 py-2 rounded-xl text-sm transition-all glow-neon-sm">
            Conectar Carteira
          </button>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="md:hidden flex justify-center gap-1 p-3 bg-[#080808] border-b border-[#1a1a1a]">
        {(["swap", "liquidity", "portfolio"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              tab === t ? "bg-[#00ff41] text-black" : "text-zinc-400"
            }`}
          >
            {t === "swap" ? "Swap" : t === "liquidity" ? "Liquidez" : "Portfólio"}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        {tab === "swap" && (
          <div className="w-full max-w-md">
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">Swap</h2>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>Slippage: {slippage}%</span>
                  <button
                    onClick={() => setSlippage(slippage === 0.5 ? 1 : 0.5)}
                    className="text-[#00ff41] hover:underline"
                  >
                    ⚙️
                  </button>
                </div>
              </div>

              {/* From */}
              <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-2">
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                  <span>Você paga</span>
                  <span>Saldo: {fromToken.balance}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="flex-1 bg-transparent text-3xl font-medium outline-none placeholder:text-zinc-700"
                  />
                  <TokenButton token={fromToken} onClick={() => setShowFromModal(true)} />
                </div>
                <div className="text-right text-xs text-zinc-500 mt-1">
                  ≈ ${fromAmount ? (parseFloat(fromAmount) * fromToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
                </div>
              </div>

              {/* Switch button */}
              <div className="flex justify-center -my-3 relative z-10">
                <button
                  onClick={switchTokens}
                  className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#333] hover:border-[#00ff41] flex items-center justify-center transition-all hover:bg-[#222]"
                >
                  <svg className="w-5 h-5 text-[#00ff41]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To */}
              <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mt-2">
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                  <span>Você recebe</span>
                  <span>Saldo: {toToken.balance}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={toAmount}
                    onChange={(e) => handleToAmountChange(e.target.value)}
                    className="flex-1 bg-transparent text-3xl font-medium outline-none placeholder:text-zinc-700"
                  />
                  <TokenButton token={toToken} onClick={() => setShowToModal(true)} />
                </div>
                <div className="text-right text-xs text-zinc-500 mt-1">
                  ≈ ${toAmount ? (parseFloat(toAmount) * toToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
                </div>
              </div>

              {/* Rate info */}
              {fromAmount && (
                <div className="mt-4 p-3 bg-[#0f0f0f] rounded-xl text-sm space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>Taxa</span>
                    <span>1 {fromToken.symbol} = {rate.toFixed(6)} {toToken.symbol}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Taxa de swap</span>
                    <span className="text-[#00ff41]">0.3%</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Impacto no preço</span>
                    <span className="text-[#00ff41]">&lt;0.01%</span>
                  </div>
                </div>
              )}

              <button
                className="w-full mt-5 bg-[#00ff41] hover:bg-[#00e639] disabled:bg-[#1a1a1a] disabled:text-zinc-600 text-black font-bold py-4 rounded-2xl text-lg transition-all glow-neon"
                disabled={!fromAmount || parseFloat(fromAmount) <= 0}
              >
                {fromAmount ? "Trocar" : "Insira um valor"}
              </button>
            </div>

            <p className="text-center text-xs text-zinc-600 mt-4">
              Interface protótipo • Sem conexão blockchain real ainda
            </p>
          </div>
        )}

        {tab === "liquidity" && (
          <div className="w-full max-w-md">
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-5 shadow-2xl">
              <h2 className="text-lg font-semibold mb-5">Adicionar Liquidez</h2>

              <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-3">
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                  <span>Token A</span>
                  <span>Saldo: {liqTokenA.balance}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={liqAmountA}
                    onChange={(e) => setLiqAmountA(e.target.value)}
                    className="flex-1 bg-transparent text-2xl font-medium outline-none placeholder:text-zinc-700"
                  />
                  <TokenButton token={liqTokenA} onClick={() => {}} />
                </div>
              </div>

              <div className="flex justify-center my-1">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#00ff41] text-lg">
                  +
                </div>
              </div>

              <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                  <span>Token B</span>
                  <span>Saldo: {liqTokenB.balance}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={liqAmountB}
                    onChange={(e) => setLiqAmountB(e.target.value)}
                    className="flex-1 bg-transparent text-2xl font-medium outline-none placeholder:text-zinc-700"
                  />
                  <TokenButton token={liqTokenB} onClick={() => {}} />
                </div>
              </div>

              <div className="p-3 bg-[#0f0f0f] rounded-xl text-sm space-y-2 mb-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Participação no pool</span>
                  <span className="text-[#00ff41]">~0.12%</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Taxas estimadas (24h)</span>
                  <span className="text-[#00ff41]">+$4.20</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>APR estimado</span>
                  <span className="text-[#00ff41]">18.4%</span>
                </div>
              </div>

              <button className="w-full bg-[#00ff41] hover:bg-[#00e639] text-black font-bold py-4 rounded-2xl text-lg transition-all glow-neon">
                Fornecer Liquidez
              </button>
            </div>

            <div className="mt-6 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Seus pools</h3>
              <div className="text-center text-zinc-600 text-sm py-6">
                Nenhum pool ativo ainda
              </div>
            </div>
          </div>
        )}

        {tab === "portfolio" && (
          <div className="w-full max-w-2xl">
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold mb-1">Portfólio</h2>
              <p className="text-3xl font-bold text-[#00ff41] mb-6">
                $12.847,32
                <span className="text-sm text-zinc-500 font-normal ml-2">(+2.4% hoje)</span>
              </p>

              <div className="space-y-2">
                {TOKENS.filter((t) => t.balance > 0).map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#00ff41]/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00ff41]/15 border border-[#00ff41]/40 flex items-center justify-center text-lg font-bold text-[#00ff41]">
                      {token.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-xs text-zinc-500">{token.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{token.balance}</div>
                      <div className="text-xs text-zinc-500">
                        ${(token.balance * token.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${token.change24h >= 0 ? "text-[#00ff41]" : "text-red-400"}`}>
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Token selection modals */}
      <TokenModal
        open={showFromModal}
        onClose={() => setShowFromModal(false)}
        onSelect={selectFromToken}
        exclude={toToken.symbol}
      />
      <TokenModal
        open={showToModal}
        onClose={() => setShowToModal(false)}
        onSelect={selectToToken}
        exclude={fromToken.symbol}
      />

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 text-center text-xs text-zinc-600">
        NeonSwap © 2026 • Protótipo DeFi • Preços simulados
      </footer>
    </div>
  );
}
