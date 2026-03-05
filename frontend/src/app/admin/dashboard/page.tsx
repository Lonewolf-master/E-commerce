'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchStats(token);
  }, []);

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        // Not an admin or invalid token
        router.push('/');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      
      {/* iOS Translucent Sidebar */}
      <aside className="w-72 h-screen bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col p-8 sticky top-0">
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-full shadow-inner" />
            </div>
            COMMAND
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 ml-1">Aether Systems OS</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin/dashboard" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all bg-white text-black shadow-2xl">
            <span className="text-xl">◇</span> Dashboard
          </Link>
          <Link href="/admin/inventory" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-white/5 hover:text-white transition-all">
            <span className="text-xl">▢</span> Inventory
          </Link>
          <Link href="/admin/orders" className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-white/5 hover:text-white transition-all">
            <span className="text-xl">○</span> Orders
          </Link>
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-white/5 hover:text-white transition-all">
            <span className="text-xl">◉</span> Intelligence
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-white/5 hover:text-white transition-all">
            <span className="text-xl">⚙</span> Settings
          </button>
        </nav>

        <div className="pt-8 border-t border-white/5">
          <button onClick={() => { localStorage.removeItem('token'); router.push('/'); }} className="w-full px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-4">
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="flex-1 h-screen overflow-y-auto p-12 scrollbar-hide">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-6xl font-bold tracking-tight mb-2">Systems Overview.</h1>
            <p className="text-zinc-500 font-medium text-xl">Operational integrity: <span className="text-green-500">OPTIMAL</span></p>
          </div>
          <div className="flex gap-4">
             <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-full flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Live Sync Active</span>
             </div>
          </div>
        </header>

        {/* Live Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Net Revenue', value: `$${Number(stats.revenue).toLocaleString()}`, delta: '+12.5%', color: 'text-blue-500' },
            { label: 'Active Orders', value: stats.orders, delta: 'Live', color: 'text-white' },
            { label: 'Rig Inventory', value: stats.products, delta: 'Stable', color: 'text-zinc-400' },
          ].map((tile, i) => (
            <div key={i} className="bg-zinc-900/30 backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] shadow-2xl hover:border-white/10 transition-all group cursor-default">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 block">{tile.label}</span>
              <div className="flex items-baseline justify-between">
                <h3 className={`text-5xl font-bold tracking-tight ${tile.color}`}>{tile.value}</h3>
                <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-full text-zinc-400">{tile.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity / Graph Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white/5 backdrop-blur-md rounded-[40px] border border-white/5 p-10 h-[400px] flex flex-col justify-between">
              <h4 className="text-xl font-bold tracking-tight">Sales Trajectory</h4>
              <div className="flex-1 flex items-end gap-2 px-4 pb-4">
                 {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                   <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-full opacity-80 hover:opacity-100 transition-opacity" />
                 ))}
              </div>
           </div>

           <div className="bg-zinc-900/30 backdrop-blur-md rounded-[40px] border border-white/5 p-10 overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-bold tracking-tight">Recent Synchronizations</h4>
                <Link href="#" className="text-xs font-bold text-blue-500 uppercase tracking-widest">View All</Link>
              </div>
              <div className="space-y-6">
                 {[1, 2, 3, 4].map((item) => (
                   <div key={item} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-zinc-800 rounded-2xl" />
                         <div>
                            <p className="font-bold text-sm">Order #882{item}</p>
                            <p className="text-xs text-zinc-500 font-medium">Processing • 2m ago</p>
                         </div>
                      </div>
                      <span className="font-bold text-sm">+$1,299.00</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
