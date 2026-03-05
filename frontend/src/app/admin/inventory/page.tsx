'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminInventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewAdd] = useState({ name: '', price: '', category: 'Mac', stock: '10', description: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProducts(token);
  }, []);

  const fetchProducts = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8080/api/admin/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchProducts(token!);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts(token!);
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
          <h1 className="text-6xl font-bold tracking-tight">Inventory.</h1>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
        >
          + New Component
        </button>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-900/30 backdrop-blur-2xl border border-white/5 rounded-[40px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <th className="px-10 py-8">Product</th>
                <th className="px-10 py-8">Category</th>
                <th className="px-10 py-8">Stock</th>
                <th className="px-10 py-8">Price</th>
                <th className="px-10 py-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl" />
                      <span className="font-bold text-lg">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-medium text-zinc-400">{p.category}</td>
                  <td className="px-10 py-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.stock > 5 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-10 py-8 font-bold">${p.price}</td>
                  <td className="px-10 py-8">
                    <button onClick={() => handleDelete(p.id)} className="text-zinc-600 hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity" />
          <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 w-full max-w-xl shadow-[0_32px_128px_rgba(0,0,0,0.5)]">
            <h2 className="text-4xl font-bold tracking-tight mb-8 text-center">Register New Rig.</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <input 
                placeholder="Product Name" 
                className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-blue-500 transition-all outline-none"
                value={newProduct.name}
                onChange={(e) => setNewAdd({...newProduct, name: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Price" 
                  className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-blue-500 transition-all outline-none"
                  value={newProduct.price}
                  onChange={(e) => setNewAdd({...newProduct, price: e.target.value})}
                  required
                />
                <input 
                  placeholder="Stock" 
                  className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/5 focus:border-blue-500 transition-all outline-none"
                  value={newProduct.stock}
                  onChange={(e) => setNewAdd({...newProduct, stock: e.target.value})}
                  required
                />
              </div>
              <textarea 
                placeholder="Technical Description" 
                className="w-full h-32 p-6 rounded-2xl bg-white/5 border border-white/5 focus:border-blue-500 transition-all outline-none resize-none"
                value={newProduct.description}
                onChange={(e) => setNewAdd({...newProduct, description: e.target.value})}
              />
              <button className="w-full h-20 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-700 transition-all">Synchronize to Inventory</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
