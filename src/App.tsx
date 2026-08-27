/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceGrid from './components/ServiceGrid';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import AuthModal from './components/AuthModal';
import AdminPanel, { WebsiteEditorPage } from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  ServicePage,
  SERVICE_PAGES,
  useSeo,
} from './components/SeoPages';
import {
  HomeCoreServicesSection,
  HomeAboutSection,
  HomeContactSection,
} from './components/HomeSeoSections';
import { SERVICES as CONSTANT_SERVICES } from './constants';
import { ALL_SEO_ROUTES, BUSINESS_INFO } from './seoData';
import { ServiceCategory, Product, SiteSettings } from './types';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { DataService } from './lib/dataService';

function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setError('Invalid system security credentials.');
      return;
    }

    setAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-wider uppercase">Loading PlazaHQ...</span>
      </div>
    );
  }

  if (authenticated) {
    return window.location.pathname.startsWith('/admin/editor') ? (
      <WebsiteEditorPage />
    ) : (
      <AdminPanel />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold font-mono text-lg shadow-lg shadow-emerald-500/20">
            P
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">PlazaHQ ERP</h1>
            <p className="text-xs text-slate-400 font-medium">Print Press Production System</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Administrator Access Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-white text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-600 font-mono"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            Launch Command Center &rarr;
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Print Plaza Enterprise</span>
          <span className="font-mono text-[10px] bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded">
            v2.4.0
          </span>
        </div>
      </div>
    </div>
  );
}

function SiteFooter({ siteSettings }: { siteSettings: SiteSettings }) {
  return (
    <footer id="footer" className="bg-black text-white pt-24 sm:pt-32 pb-16 relative overflow-hidden bg-grainy/5">
      {/* Duo-tone border top */}
      <div className="absolute top-0 left-0 w-full h-2 flex">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-20">
          <div className="sm:col-span-2">
            <div className="mb-10 sm:mb-12">
              <h6 className="font-display font-black text-4xl sm:text-5xl mb-4 tracking-tight uppercase leading-none">
                {siteSettings.footer?.brandText || 'Print Plaza.'}
              </h6>
              <div className="text-[10px] uppercase tracking-[0.32em] font-black text-[#66A0AA]">
                {siteSettings.footer?.tagline || 'Commercial Print & Packaging Manufacturing Studio'}
              </div>
            </div>
            <p className="text-sm leading-loose opacity-70 max-w-sm font-medium tracking-wide">
              {siteSettings.footer?.description ||
                'High quality commercial printing, custom packaging boxes, product labels, business cards, brochures, posters, banners, and signage with tactile precision.'}
            </p>
          </div>

          <div>
            <h5 className="text-[10px] uppercase tracking-[0.28em] font-black mb-8 sm:mb-10 text-[#E17055]">
              Services & Pages
            </h5>
            <ul className="space-y-3 sm:space-y-4 text-xs font-bold tracking-tight opacity-75">
              <li>
                <a href="/custom-packaging-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Custom Packaging
                </a>
              </li>
              <li>
                <a href="/product-label-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Product Labels
                </a>
              </li>
              <li>
                <a href="/business-card-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Business Cards
                </a>
              </li>
              <li>
                <a href="/brochure-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Brochures
                </a>
              </li>
              <li>
                <a href="/flyer-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Flyers & Leaflets
                </a>
              </li>
              <li>
                <a href="/poster-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Posters & Displays
                </a>
              </li>
              <li>
                <a href="/banner-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Banners & Stands
                </a>
              </li>
              <li>
                <a href="/signage-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Rigid Signage
                </a>
              </li>
              <li>
                <a href="/offset-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Offset Lithography
                </a>
              </li>
              <li>
                <a href="/digital-printing" className="hover:text-[#E17055] transition-colors uppercase">
                  Digital Printing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] uppercase tracking-[0.28em] font-black mb-8 sm:mb-10 text-[#66A0AA]">
              Studio & Contact
            </h5>
            <ul className="space-y-4 sm:space-y-5 text-xs font-medium leading-relaxed opacity-75 font-mono">
              <li>
                <span className="block text-[9px] uppercase tracking-widest text-[#E17055] font-bold">Email</span>
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white">
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li>
                <span className="block text-[9px] uppercase tracking-widest text-[#E17055] font-bold">Phone / WhatsApp</span>
                <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-white">
                  {BUSINESS_INFO.displayPhone}
                </a>
              </li>
              <li>
                <span className="block text-[9px] uppercase tracking-widest text-[#E17055] font-bold">Address</span>
                <span>{BUSINESS_INFO.formattedAddress}</span>
              </li>
              <li>
                <span className="block text-[9px] uppercase tracking-widest text-[#E17055] font-bold">Hours</span>
                <span>Mon–Sat: 9:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 sm:mt-28 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.32em] opacity-60 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Print Plaza. High Quality Commercial Printing & Packaging.</p>
          <div className="flex flex-wrap gap-8 items-center justify-center">
            <a href="/about" className="hover:opacity-100">
              About Us
            </a>
            <a href="/contact" className="hover:opacity-100">
              Contact
            </a>
            <a href="/privacy-policy" className="hover:opacity-100">
              Privacy Policy
            </a>
            <a href="/sitemap.xml" className="hover:opacity-100">
              Sitemap
            </a>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#2D545E]" />
              <div className="w-2 h-2 bg-[#E17055]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname.replace(/\/$/, '') || '/');
  const [services, setServices] = useState<ServiceCategory[]>(CONSTANT_SERVICES);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [view, setView] = useState<'main' | 'dashboard'>('main');

  // Auto-navigate authenticated clients directly to their Client Portal
  useEffect(() => {
    if (user && !isAdmin) {
      setView('dashboard');
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchCmsData();
  }, [view]);

  useEffect(() => {
    const syncRoute = () => setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('plaza:navigate', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('plaza:navigate', syncRoute);
    };
  }, []);

  const fetchCmsData = async () => {
    try {
      const [dbProducts, dbCategories, settings] = await Promise.all([
        DataService.getProducts(),
        DataService.getCategories(),
        DataService.getSiteSettings(),
      ]);
      setSiteSettings(settings);

      if (dbProducts.length > 0) {
        const sourceCategories = dbCategories.length > 0 ? dbCategories : CONSTANT_SERVICES;
        const categories = sourceCategories.map((cat) => ({
          ...cat,
          products: dbProducts.filter((p) => p.categoryId === cat.id),
        }));
        setServices(categories);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Sync homepage SEO when on root
  const homeSeo = ALL_SEO_ROUTES['/'];
  useSeo(
    homeSeo.metaTitle,
    homeSeo.description,
    '/',
    homeSeo.schema
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-16 h-px bg-black animate-pulse" />
      </div>
    );
  }

  if (view === 'dashboard') {
    return isAdmin ? (
      <AdminPanel />
    ) : (
      <UserPanel onBack={() => setView('main')} />
    );
  }

  const handleOrderSubmit = () => {
    setSelectedProduct(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const servicePage = SERVICE_PAGES.find((page) => page.path === currentPath);
  const isPrivacyPolicy = currentPath === '/privacy-policy';
  const isAboutPage = currentPath === '/about';
  const isContactPage = currentPath === '/contact';

  if (servicePage || isPrivacyPolicy || isAboutPage || isContactPage) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] font-sans text-black selection:bg-[#2D545E] selection:text-white relative">
        <div className="fixed inset-0 bg-grainy opacity-[0.03] pointer-events-none z-50 overflow-hidden" />

        <Navbar
          onLogin={() => setShowAuthModal(true)}
          onViewDashboard={() => setView('dashboard')}
          settings={{ ...siteSettings.header, useTransparentHeader: false }}
        />

        {servicePage && <ServicePage page={servicePage} />}
        {isAboutPage && <AboutPage />}
        {isContactPage && <ContactPage />}
        {isPrivacyPolicy && <PrivacyPolicyPage />}

        <SiteFooter siteSettings={siteSettings} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setView('dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-black selection:bg-[#2D545E] selection:text-white relative">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 bg-grainy opacity-[0.03] pointer-events-none z-50 overflow-hidden" />

      <Navbar
        onLogin={() => setShowAuthModal(true)}
        onViewDashboard={() => setView('dashboard')}
        settings={siteSettings.header}
      />

      <main>
        <Hero settings={siteSettings.homepage} theme={siteSettings.theme} />

        {/* 1. Production Unit / Fast Quote Grid */}
        <section id="products" className="py-24 sm:py-36 bg-[#FDFCFB] relative overflow-hidden border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-20 gap-12">
              <div className="max-w-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.32em] text-[#2D545E] mb-6 flex items-center gap-4">
                  <div className="w-8 h-px bg-[#2D545E]/30" /> Core Output
                </div>
                <h2 className="text-[2.8rem] sm:text-[4.8rem] md:text-[6.4rem] font-display font-black tracking-tight leading-[0.84] mb-7 sm:mb-9 uppercase">
                  Production <br />
                  <span className="text-black/10 italic font-serif lowercase">Unit.</span>
                </h2>
                <p className="text-[15px] sm:text-base font-medium leading-[1.8] text-black/62 max-w-lg font-sans">
                  Browse high quality printing services for packaging, labels, brochures, flyers, business cards, posters, banners, and signage. Technical excellence across <span className="text-black/80 font-bold">bespoke print formats.</span>
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-4 overflow-hidden">
                <div className="text-[10px] font-mono font-bold bg-[#EBEAE8] px-4 sm:px-5 py-3 border border-black/10 flex items-center gap-3 sm:gap-4 max-w-full">
                  <div className="w-2 h-2 rounded-full bg-[#E17055] animate-pulse" />
                  <span className="truncate">
                    LIVE_FEED: ACTIVE_JOBS(24) // {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[9px] font-mono opacity-30 uppercase tracking-widest">
                  Chakwal Facility Online
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8 border border-black/8">
              {services.flatMap((s) => s.products).slice(0, 6).map((product) => (
                <div key={product.id} className="bg-[#FDFCFB]">
                  <ProductCard product={product} onOrder={setSelectedProduct} />
                </div>
              ))}
            </div>

            <div className="mt-20 sm:mt-24 flex justify-center">
              <a href="#core-services" className="group flex flex-col items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 group-hover:text-black transition-colors">
                  Explore All 8 Specialized Departments &darr;
                </span>
                <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent group-hover:from-[#2D545E] transition-colors" />
              </a>
            </div>
          </div>
        </section>

        {/* 2. Core 8 Services Deep-Dive Section (100-150 words per service) */}
        <HomeCoreServicesSection />

        {/* 3. Interactive Category Grid */}
        <ServiceGrid categories={services} onSelect={setSelectedCategory} />

        {/* 4. About Print Plaza Section */}
        <HomeAboutSection />

        {/* 5. Direct Contact & Studio Location Section */}
        <HomeContactSection />

        <AnimatePresence>
          {selectedCategory && (
            <motion.section
              id="category-details"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 z-50 bg-[#FDFDFD] overflow-y-auto pt-20"
            >
              <div className="absolute top-0 right-0 w-1/3 h-2 bg-[#E17055]" />

              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-12">
                  <div className="max-w-2xl">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D545E]/40 hover:text-[#E17055] mb-10 flex items-center gap-3 transition-all group py-2.5 px-5 bg-black/5 rounded-full w-fit hover:bg-black hover:text-white"
                    >
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1" /> Close Technical Specs
                    </button>
                    <h2 className="text-4xl sm:text-7xl font-display font-black tracking-tighter leading-none mb-6 uppercase">
                      {selectedCategory.title}
                    </h2>
                    <p className="text-base sm:text-lg font-medium leading-relaxed text-black/60 max-w-lg">
                      {selectedCategory.description}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-bold bg-[#E17055] text-white px-4 py-2 border-2 border-black self-start md:self-end shadow-[6px_6px_0_rgba(0,0,0,0.12)]">
                    BATCH_REF: {selectedCategory.id.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {selectedCategory.products.map((product) => (
                    <div key={product.id} className="h-full">
                      <ProductCard product={product} onOrder={setSelectedProduct} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <SiteFooter siteSettings={siteSettings} />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setView('dashboard')}
      />

      <AnimatePresence>
        {selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSubmit={handleOrderSubmit}
            onLoginRequest={() => setShowAuthModal(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 sm:bottom-12 right-6 sm:right-12 left-6 sm:left-auto z-[70] bg-[#2D545E] text-white px-8 sm:px-10 py-6 sm:py-8 shadow-2xl flex flex-col gap-3 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="bg-black p-2">
                <CheckCircle2 className="w-6 h-6 text-[#E17055]" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em]">Quote Request Sent.</span>
            </div>
            <p className="text-[11px] font-bold text-white/80 tracking-widest leading-relaxed max-w-[240px]">
              We received your quotation request. Our team will review it before any project starts.
            </p>
            <div className="mt-2 flex gap-1">
              <div className="w-full h-1 bg-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-full bg-[#E17055]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminLoginPage />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
