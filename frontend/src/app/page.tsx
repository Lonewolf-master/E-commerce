'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import AetherConcierge from '../components/AetherConcierge';
import { useCart } from '../context/CartContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HERO_DATA = {
  title: "AETHER",
  subtitle: "INTELLIGENCE",
  desc: "The operating system for your lifestyle. Curated tech, powered by neural networks.",
  img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070"
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { addToCart, totalItems } = useCart();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  
  // Refs
  const mainRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser(token);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Initial Load Animation
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
      });
      
      gsap.from(".glass-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".grid-section",
          start: "top 80%"
        }
      });
    }, mainRef);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFlyToCart = (e: React.MouseEvent, imgUrl: string) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    
    // Create fly element
    const fly = document.createElement('div');
    fly.className = 'fixed z-[999] rounded-full border border-white/50 shadow-[0_0_20px_rgba(37,99,235,0.5)] bg-cover';
    fly.style.width = '40px';
    fly.style.height = '40px';
    fly.style.left = `${rect.left}px`;
    fly.style.top = `${rect.top}px`;
    fly.style.backgroundImage = `url(${imgUrl})`;
    document.body.appendChild(fly);

    // Target (Cart Icon)
    const cartTarget = document.getElementById('cart-icon');
    const cartRect = cartTarget?.getBoundingClientRect();

    if (cartRect) {
      gsap.to(fly, {
        left: cartRect.left,
        top: cartRect.top,
        scale: 0.1,
        opacity: 0,
        duration: 0.8,
        ease: "expo.inOut",
        onComplete: () => {
          document.body.removeChild(fly);
          gsap.fromTo(cartTarget, { scale: 1.5 }, { scale: 1, duration: 0.3 });
        }
      });
    }
  };

  return (
    <div ref={mainRef} className="min-h-screen text-white font-sans overflow-x-hidden selection:bg-blue-600">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-black/50 backdrop-blur-xl border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_#2563eb]" />
            AETHER
          </Link>
          
          <div className="flex items-center gap-8">
            <Link href="/cart" id="cart-icon" className="relative group">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Bag</span>
              {totalItems > 0 && <span className="absolute -top-2 -right-3 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[8px] font-bold">{totalItems}</span>}
            </Link>
            {user ? (
              <span className="text-xs font-bold bg-white/10 px-4 py-2 rounded-full border border-white/5">{user.name}</span>
            ) : (
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black" />
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="hero-text inline-block mb-4 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            System Online • v4.0
          </div>
          <h1 className="hero-text text-8xl md:text-[120px] font-black tracking-tighter leading-[0.8] mb-6">
            {HERO_DATA.title}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{HERO_DATA.subtitle}</span>
          </h1>
          <p className="hero-text text-xl text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
            {HERO_DATA.desc}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid-section py-32 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Deployment Ready.</h2>
          <span className="text-xs font-mono text-zinc-500">SECURE INVENTORY ACCESS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'AetherBook M3', price: 3499, img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9' },
            { name: 'AetherPhone 15', price: 1199, img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab' },
            { name: 'Aether Lens', price: 3499, img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03' },
            { name: 'Aether Watch', price: 799, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
            { name: 'Aether Pad', price: 999, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0' },
            { name: 'Aether Pods', price: 249, img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df' },
          ].map((prod, i) => (
            <div key={i} className="glass-card group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500">
              <div className="aspect-square relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img src={prod.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" alt={prod.name} />
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{prod.name}</h3>
                    <p className="text-zinc-500 text-xs font-mono mt-1">SERIES {i + 1}</p>
                  </div>
                  <span className="text-lg font-bold">${prod.price}</span>
                </div>
                
                <button 
                  onClick={(e) => {
                    handleFlyToCart(e, prod.img);
                    addToCart({ id: i + 100, name: prod.name, price: prod.price, image: prod.img });
                  }}
                  className="w-full py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                >
                  Acquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-24 px-6 text-center">
        <h3 className="text-2xl font-bold tracking-tight mb-4">AETHER INDUSTRIES</h3>
        <p className="text-zinc-500 text-xs uppercase tracking-widest">Designed for the next century.</p>
      </footer>

      <AetherConcierge />
    </div>
  );
}
