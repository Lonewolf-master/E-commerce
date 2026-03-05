'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductStage from '../components/3d/ProductStage';
import AetherConcierge from '../components/AetherConcierge';

const GADGET_HEROES = [
  {
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop',
    title: 'Aether Intelligence',
    subtitle: 'The first e-commerce platform that knows you better than you do.',
  },
  {
    url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=2000&auto=format&fit=crop',
    title: 'NeuralBook Pro',
    subtitle: 'Processing at the speed of thought. Powered by Aether AI.',
  },
];

const REVIEWS = [
  { name: 'Alex Rivera', role: 'Tech Enthusiast', content: 'The AI recommendations are scarily accurate. Best shopping experience ever.', rating: 5 },
  { name: 'Sarah Chen', role: 'Designer', content: 'Aether defines the future of minimalist tech. The design is just breathtaking.', rating: 5 },
  { name: 'Marcus Thorne', role: 'Software Engineer', content: 'Finally, a platform that respects performance and aesthetics equally.', rating: 5 },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: 'error' as 'error' | 'success' });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) fetchUser(token);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % GADGET_HEROES.length);
    }, 6000);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
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
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: '', type: 'error' });

    const endpoint = authMode === 'login' ? 'login' : 'register';
    const body = authMode === 'login' ? { email, password } : { email, password, name };

    try {
      const response = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Operation failed');

      if (authMode === 'login') {
        localStorage.setItem('token', data.token);
        setStatusMsg({ text: 'Access Granted. Welcome to the Aether.', type: 'success' });
        await fetchUser(data.token);
        setTimeout(() => setShowAuth(false), 1200);
      } else {
        setAuthMode('login');
        setStatusMsg({ text: 'Identity created. Please authenticate.', type: 'success' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-blue-100 dark:selection:bg-blue-900/20">
      
      {/* Apple-Style Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${isScrolled || showAuth ? 'bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-zinc-200/40 dark:border-zinc-800/40' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[64px] px-8">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
            AETHER
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 text-[12px] font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
            <Link href="#store" className="hover:text-black dark:hover:text-white transition-colors">Store</Link>
            <Link href="#about" className="hover:text-black dark:hover:text-white transition-colors">Innovations</Link>
            <Link href="#reviews" className="hover:text-black dark:hover:text-white transition-colors">Philosophy</Link>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 tracking-tight uppercase">Elite Member</span>
                  <span className="text-xs font-semibold">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all">Sign Out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuth(true); setAuthMode('login'); }} className="text-xs font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen w-full overflow-hidden">
        {GADGET_HEROES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10" />
            <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-8">
              <h2 className="text-6xl md:text-[120px] font-bold tracking-tight text-white leading-none mb-8 drop-shadow-2xl">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-zinc-100 max-w-2xl font-medium tracking-tight opacity-90">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </header>

      {/* About Section */}
      <section id="about" className="py-40 px-8 bg-zinc-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative h-[600px] w-full">
            {mounted ? <ProductStage /> : <div className="w-full h-full bg-zinc-900 rounded-[3rem] animate-pulse" />}
          </div>
          <div className="space-y-8">
            <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-zinc-900 dark:text-white">Where Silicon meets Soul.</h3>
            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Aether uses neural-matching to curate the world's most advanced technology specifically for your workflow. No searching. Just discovery.
            </p>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section id="store" className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h3 className="text-5xl md:text-8xl font-bold tracking-tight">Current Inventory.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'AetherBook M3', price: '$2,499', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
              { name: 'AetherPhone 15', price: '$1,199', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9' },
              { name: 'Aether Lens Pro', price: '$3,499', img: 'https://images.unsplash.com/photo-1478416402414-f41e53fc264e' }
            ].map((prod, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-[40px] bg-zinc-100 dark:bg-zinc-900 mb-8">
                  <img src={prod.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={prod.name} />
                </div>
                <h4 className="text-xl font-bold mb-1">{prod.name}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">{prod.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-40 px-8 bg-zinc-50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="space-y-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full" />)}
              </div>
              <p className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-white">"{rev.content}"</p>
              <div>
                <h5 className="font-bold text-sm uppercase tracking-widest">{rev.name}</h5>
                <p className="text-xs text-zinc-400 font-medium">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ethereal Auth Overlay */}
      <div className={`fixed inset-0 z-[200] transition-all duration-1000 ${showAuth ? 'visible' : 'invisible'}`}>
        <div 
          onClick={() => setShowAuth(false)} 
          className={`absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[80px] transition-opacity duration-1000 ${showAuth ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${showAuth ? 'opacity-100 translate-y-[-50%]' : 'opacity-0 translate-y-[-40%]'}`}>
          <div className="bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-2xl rounded-[40px] border border-zinc-200/50 dark:border-zinc-800/50 p-12 shadow-[0_32px_128px_rgba(0,0,0,0.1)]">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight mb-3 text-zinc-900 dark:text-white">
                {authMode === 'login' ? 'Sign In' : 'Create ID'}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-tight">
                Use your Aether Neural ID to continue.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authMode === 'register' && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[56px] px-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-transparent focus:border-blue-500/50 transition-all outline-none text-base font-medium text-zinc-900 dark:text-white"
                  placeholder="Full Name"
                  required
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[56px] px-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-transparent focus:border-blue-500/50 transition-all outline-none text-base font-medium text-zinc-900 dark:text-white"
                placeholder="Email address"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[56px] px-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-transparent focus:border-blue-500/50 transition-all outline-none text-base font-medium text-zinc-900 dark:text-white"
                placeholder="Password"
                required
              />

              {statusMsg.text && (
                <div className={`p-4 rounded-xl text-xs font-bold text-center tracking-tight ${statusMsg.type === 'success' ? 'text-green-600 bg-green-50 dark:bg-green-900/10' : 'text-red-600 bg-red-50 dark:bg-red-900/10'}`}>
                  {statusMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-widest rounded-2xl hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-30"
              >
                {loading ? 'Authenticating...' : authMode === 'login' ? 'Continue' : 'Create Identity'}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200/30 dark:border-zinc-800/30" /></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400"><span className="bg-transparent px-4">Social Access</span></div>
            </div>

            <div className="flex gap-4 mb-10">
               <button className="flex-1 h-[50px] rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Google</span>
               </button>
               <button className="flex-1 h-[50px] rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Apple</span>
               </button>
            </div>

            <p className="text-center text-xs font-medium text-zinc-500">
              {authMode === 'login' ? "Don't have an ID?" : "Already have an ID?"}{' '}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
              >
                {authMode === 'login' ? 'Create yours now.' : 'Sign in.'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-24 px-12 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-20">
          <div className="max-w-xs">
            <h4 className="text-xl font-bold mb-6 tracking-tight text-zinc-900 dark:text-white">AETHER</h4>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">Designing the future of interaction through the lens of artificial intelligence. Based in Cupertino, available everywhere.</p>
          </div>
          <div className="flex gap-24">
            <div className="space-y-6">
              <h5 className="font-bold text-[10px] tracking-[0.2em] uppercase text-zinc-500">Legal</h5>
              <ul className="space-y-4 text-xs font-semibold text-zinc-400">
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900 text-[10px] font-bold text-zinc-400 tracking-widest text-center">
           © 2026 AETHER SYSTEMS. ALL RIGHTS RESERVED.
        </div>
      </footer>

      <AetherConcierge />

      <style jsx global>{`
        @font-face {
          font-family: 'SF Pro Display';
          src: url('https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-regular-webfont.woff2');
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
}
