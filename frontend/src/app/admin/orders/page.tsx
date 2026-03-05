'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders(token);
  }, []);

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders(token!);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-12">
      <header className="max-w-7xl mx-auto flex justify-between items-end mb-16">
        <div>
          <Link href="/admin/dashboard" className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-4 block">← Back to Overview</Link>
          <h1 className="text-6xl font-bold tracking-tight">Synchronizations.</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-900/30 backdrop-blur-2xl border border-white/5 rounded-[40px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-8">Order ID</th>
                <th className="px-10 py-8">User ID</th>
                <th className="px-10 py-8">Total Amount</th>
                <th className="px-10 py-8">Status</th>
                <th className="px-10 py-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">No active synchronizations found.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-10 py-8 font-bold text-lg">#{o.id}</td>
                    <td className="px-10 py-8 font-medium text-zinc-400">User {o.userId}</td>
                    <td className="px-10 py-8 font-bold">${o.totalAmount}</td>
                    <td className="px-10 py-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        o.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                        o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <select 
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        value={o.status}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
