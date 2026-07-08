/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, LogOut, Terminal, Lock, Menu, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { logOut } from '../lib/firebase';
import { useState } from 'react';
import { NavMenuItem, SiteSettings } from '../types';

interface NavbarProps {
  onLogin: () => void;
  onViewDashboard: () => void;
  settings?: SiteSettings['header'];
}

export default function Navbar({ onLogin, onViewDashboard, settings }: NavbarProps) {
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoImage = settings?.logoImage || '/brand/print-plaza-logo.png';
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMenuOpen(false);
          }}>
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
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <a
                key={item.id}
                href={item.url || '#'}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noreferrer' : undefined}
                className="font-bold uppercase tracking-[0.2em] text-black/60 hover:text-[#2D545E] transition-colors"
                style={{ fontSize: `${navFontSize}px` }}
              >
                {item.label || 'Menu item'}
              </a>
            ))}
            
            <div className="h-4 w-px bg-black/10" />

            {user ? (
              <div className="flex items-center gap-6">
                <button 
                  onClick={onViewDashboard}
                  className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#2D545E] hover:text-black transition-colors"
                >
                  {isAdmin ? <Terminal className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  {isAdmin ? 'System Panel' : 'Archive'}
                </button>
                <button 
                  onClick={() => logOut()}
                  className="p-2 text-black/20 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                {settings?.loginLabel || 'Auth Registry'}
              </button>
            )}

            <a href={actionUrl} className="btn-studio bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2D545E] hover:shadow-[0_10px_20px_-5px_rgba(45,84,94,0.4)] transition-all">
              {settings?.buttonText || 'Start Project'}
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-black transition-transform hover:scale-110 active:scale-95"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

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
                <a
                  key={item.id}
                  href={item.url || '#'}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noreferrer' : undefined}
                  onClick={closeMenu}
                  className="font-black uppercase tracking-[0.3em] text-black/60 py-2"
                  style={{ fontSize: `${Math.max(12, navFontSize)}px` }}
                >
                  {item.label || 'Menu item'}
                </a>
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
                    {isAdmin ? 'System Panel' : 'My Archive'}
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
