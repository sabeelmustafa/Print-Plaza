/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, LogOut, Terminal, Lock, Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { logOut } from '../lib/firebase';
import { useEffect, useState } from 'react';
import type React from 'react';
import { NavMenuItem, SiteSettings } from '../types';
import { SERVICE_PAGES } from './SeoPages';

interface NavbarProps {
  onLogin: () => void;
  onViewDashboard: () => void;
  settings?: SiteSettings['header'];
}

export default function Navbar({ onLogin, onViewDashboard, settings }: NavbarProps) {
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const useTransparentHeader = settings?.useTransparentHeader !== false;
  const normalLogo = settings?.logoImageDark || settings?.logoImage || '/brand/print-plaza-logo.png';
  const heroLogo = settings?.logoImageLight || normalLogo;
  const logoImage = !useTransparentHeader || isScrolled || isMenuOpen ? normalLogo : heroLogo;
  const logoSize = Math.min(Math.max(Number(settings?.logoSize || 36), 24), 96);
  const navFontSize = Math.min(Math.max(Number(settings?.navMenuFontSize || 10), 9), 16);
  const navItems: NavMenuItem[] = settings?.navItems?.length
    ? settings.navItems
    : [
        { id: 'services', label: settings?.servicesLabel || 'Services', url: '#services' },
        { id: 'products', label: settings?.productsLabel || 'Production', url: '#products' },
      ];
  const actionUrl = settings?.buttonUrl || '#products';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const headerIsTransparent = useTransparentHeader && !isScrolled && !isMenuOpen;
  const isServicesItem = (item: NavMenuItem) => {
    const label = (item.label || '').toLowerCase();
    const url = (item.url || '').toLowerCase();
    return item.id === 'services' || label.includes('service') || url === '#services';
  };
  const navigateHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    history.pushState(null, '', '/');
    window.dispatchEvent(new Event('plaza:navigate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
    setIsMegaOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      onMouseLeave={() => setIsMegaOpen(false)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        headerIsTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'glass-morphism border-b border-black/10 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.45)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          <a href="/" className="flex items-center gap-4 group cursor-pointer" onClick={navigateHome}>
            {logoImage ? (
              <img
                src={logoImage}
                alt={settings?.logoText || 'Print Plaza'}
                className="w-auto object-contain"
                style={{ height: `${logoSize}px`, maxWidth: `${Math.max(160, logoSize * 5)}px` }}
              />
            ) : <div className="flex gap-1.5 relative">
                <div className="w-2.5 h-7 bg-[#2D545E] transform -skew-x-12 group-hover:rotate-6 transition-all duration-300" />
                <div className="w-2.5 h-7 bg-[#E17055] transform -skew-x-12 group-hover:-rotate-6 transition-all duration-300" />
              </div>}
            {!logoImage && (
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tighter leading-none">{settings?.logoText || 'PRINT PLAZA'}</span>
                <span className="text-[9px] uppercase tracking-[0.4em] font-extrabold mt-0.5 text-[#2D545E]">{settings?.tagline || 'Industrial Print Production'}</span>
              </div>
            )}
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => {
              if (isServicesItem(item)) {
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setIsMegaOpen(true)}
                  >
                    <a
                      href={item.url || '#services'}
                      target={item.openInNewTab ? '_blank' : undefined}
                      rel={item.openInNewTab ? 'noreferrer' : undefined}
                      onFocus={() => setIsMegaOpen(true)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setIsMegaOpen(false);
                      }}
                      className={`flex items-center gap-2 font-bold uppercase tracking-[0.2em] transition-colors ${
                        headerIsTransparent ? 'text-white/72 hover:text-white' : 'text-black/60 hover:text-[#2D545E]'
                      }`}
                      style={{ fontSize: `${navFontSize}px` }}
                      aria-expanded={isMegaOpen}
                    >
                      {item.label || 'Services'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaOpen ? 'rotate-180' : ''}`} />
                    </a>
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.url || '#'}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noreferrer' : undefined}
                  onMouseEnter={() => setIsMegaOpen(false)}
                  className={`font-bold uppercase tracking-[0.2em] transition-colors ${
                    headerIsTransparent ? 'text-white/72 hover:text-white' : 'text-black/60 hover:text-[#2D545E]'
                  }`}
                  style={{ fontSize: `${navFontSize}px` }}
                >
                  {item.label || 'Menu item'}
                </a>
              );
            })}
            
            <div className={`h-4 w-px ${headerIsTransparent ? 'bg-white/20' : 'bg-black/10'}`} />

            {user ? (
              <div className="flex items-center gap-6">
                <button 
                  onClick={onViewDashboard}
                  onMouseEnter={() => setIsMegaOpen(false)}
                  className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                    headerIsTransparent ? 'text-white/78 hover:text-white' : 'text-[#2D545E] hover:text-black'
                  }`}
                >
                  {isAdmin ? <Terminal className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  {isAdmin ? 'System Panel' : 'Client Area'}
                </button>
                <button 
                  onClick={() => logOut()}
                  className={`p-2 transition-colors ${headerIsTransparent ? 'text-white/45 hover:text-white' : 'text-black/20 hover:text-red-500'}`}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                onMouseEnter={() => setIsMegaOpen(false)}
                className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                  headerIsTransparent ? 'text-white/62 hover:text-white' : 'text-black/40 hover:text-black'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                {settings?.loginLabel || 'Auth Registry'}
              </button>
            )}

            <a href={actionUrl} onMouseEnter={() => setIsMegaOpen(false)} className={`btn-studio px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              headerIsTransparent
                ? 'bg-white text-black hover:bg-[#E17055] hover:text-white'
                : 'bg-black text-white hover:bg-[#2D545E] hover:shadow-[0_10px_20px_-5px_rgba(45,84,94,0.4)]'
            }`}>
              {settings?.buttonText || 'Start Project'}
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className={`p-2 transition-transform hover:scale-110 active:scale-95 ${headerIsTransparent ? 'text-white' : 'text-black'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMegaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            onMouseEnter={() => setIsMegaOpen(true)}
            onMouseLeave={() => setIsMegaOpen(false)}
            className="hidden md:block border-t border-black/10 bg-[#FDFCFB]/98 backdrop-blur-xl shadow-[0_30px_70px_-40px_rgba(0,0,0,0.75)]"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5">
              <div className="grid grid-cols-[0.56fr_1.44fr] gap-6">
                <a
                  href="/custom-packaging-printing"
                  onClick={() => setIsMegaOpen(false)}
                  className="group relative min-h-[260px] overflow-hidden bg-black text-white p-7 flex flex-col justify-between"
                >
                  <div className="absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_20%_20%,#2D545E_0,transparent_34%),radial-gradient(circle_at_82%_80%,#E17055_0,transparent_28%)]" />
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0,transparent_31%,#fff_32%,transparent_33%,transparent_64%,#fff_65%,transparent_66%)]" />
                  <div className="relative">
                    <div className="flex gap-2 mb-7">
                      <span className="h-2 w-9 bg-[#2D545E]" />
                      <span className="h-2 w-9 bg-[#E17055]" />
                      <span className="h-2 w-9 bg-white" />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.34em] text-white/50 mb-4">Production Desk</div>
                    <h3 className="font-display font-black uppercase tracking-tight text-4xl leading-[0.86]">
                      Print Services.
                    </h3>
                  </div>
                  <div className="relative flex items-center justify-between gap-6">
                    <p className="text-xs leading-6 font-semibold text-white/62 max-w-xs">
                      Packaging, labels, cards, brochures, flyers, posters, banners, and sticker production pages.
                    </p>
                    <ArrowUpRight className="w-7 h-7 text-[#E17055] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </a>

                <div className="grid grid-cols-2 gap-px bg-black/10 border border-black/10">
                  {SERVICE_PAGES.map((service, index) => (
                    <a
                      key={service.path}
                      href={service.path}
                      onClick={() => setIsMegaOpen(false)}
                      className="group bg-[#FDFCFB] p-5 min-h-[98px] flex items-start justify-between gap-5 hover:bg-[#F6F5F2] transition-colors"
                    >
                      <div className="min-w-0">
                        <div>
                          <div className="text-[8px] font-black uppercase tracking-[0.28em] text-[#E17055] mb-3 truncate">
                            0{index + 1} / {service.eyebrow}
                          </div>
                          <h4 className="font-display font-black uppercase tracking-tight text-2xl leading-[0.94] group-hover:text-[#2D545E] transition-colors">
                            {service.title}
                          </h4>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 mt-1 shrink-0 text-black/20 group-hover:text-[#E17055] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-black/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navItems.map(item => (
                <div key={item.id}>
                  <a
                    href={item.url || '#'}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noreferrer' : undefined}
                    onClick={closeMenu}
                    className="block font-black uppercase tracking-[0.3em] text-black/60 py-2"
                    style={{ fontSize: `${Math.max(12, navFontSize)}px` }}
                  >
                    {item.label || 'Menu item'}
                  </a>
                  {isServicesItem(item) && (
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {SERVICE_PAGES.map(service => (
                        <a
                          key={service.path}
                          href={service.path}
                          onClick={closeMenu}
                          className="border border-black/10 bg-[#F6F5F2] p-4 text-[11px] font-black uppercase tracking-[0.18em] text-black/70"
                        >
                          {service.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="h-px w-full bg-black/5" />

              {user ? (
                <>
                  <button 
                    onClick={() => {
                      onViewDashboard();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.3em] text-[#2D545E] py-2"
                  >
                    {isAdmin ? <Terminal className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    {isAdmin ? 'System Panel' : 'Client Area'}
                  </button>
                  <button 
                    onClick={() => {
                      logOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.3em] text-red-500 py-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    onLogin();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.3em] text-black/60 py-2"
                >
                  <Lock className="w-5 h-5" />
                  {settings?.loginLabel || 'Auth Registry'}
                </button>
              )}

              <a href={actionUrl} onClick={closeMenu} className="w-full bg-black text-white py-5 text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#2D545E] text-center">
                {settings?.buttonText || 'Start Project'}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
