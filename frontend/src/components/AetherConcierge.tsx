'use client';

import { useState } from 'react';

export default function AetherConcierge() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ recommendation: string, productName: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-10 left-10 z-[150] transition-all duration-1000 ${open ? 'w-[400px]' : 'w-16'}`}>
      {!open ? (
        <button 
          onClick={() => setOpen(true)}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all group"
        >
          <div className="w-6 h-6 border-2 border-white rounded-full animate-pulse group-hover:scale-125 transition-transform" />
        </button>
      ) : (
        <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-3xl rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_32px_128px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Aether Concierge</h3>
            </div>
            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-black dark:hover:text-white font-bold text-sm">✕</button>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            {!result ? (
              <>
                <h4 className="text-2xl font-bold tracking-tight mb-6">How can I assist your discovery today?</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. I need a laptop for professional 3D rendering..."
                    className="w-full h-14 px-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none text-sm font-medium"
                  />
                  <button 
                    disabled={loading || !query}
                    className="w-full h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-30"
                  >
                    {loading ? 'Consulting Aether...' : 'Ask AI'}
                  </button>
                </form>
              </>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Recommended Selection</span>
                  <h4 className="text-3xl font-bold tracking-tight leading-none">{result.productName}</h4>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-medium italic">
                  "{result.recommendation}"
                </p>
                <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest">View Details</button>
                  <button onClick={() => setResult(null)} className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl font-bold text-[10px] uppercase tracking-widest">Reset</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
