/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, ChevronRight, Upload, CheckCircle2, FileText, Sparkles, Phone, Mail, User, Building, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../lib/AuthContext';
import { DataService } from '../lib/dataService';

interface OrderModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  onLoginRequest: () => void;
}

export default function OrderModal({ product, onClose, onSubmit, onLoginRequest }: OrderModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState<number>(500);
  const [productType, setProductType] = useState(product?.name || '');
  const [options, setOptions] = useState<Record<string, string | number | boolean>>({});
  const [specifications, setSpecifications] = useState('');
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  if (!product) return null;

  const estimatedTotalPrice = product.price * quantity;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      let artworkUrl = '';
      if (artworkFile) {
        try {
          artworkUrl = await DataService.uploadImage(artworkFile, artworkFile.name);
        } catch (_fileErr) {
          artworkUrl = artworkFile.name;
        }
      }

      const orderData = {
        userId: user?.uid || `guest_${Date.now()}`,
        userEmail: email,
        userName: fullName || email.split('@')[0],
        productId: product.id,
        productName: productType || product.name,
        quantity: Number(quantity) || 1,
        options: {
          ...options,
          phone,
          companyName,
          specifications,
          artworkFile: artworkUrl || undefined,
        },
        totalPrice: estimatedTotalPrice,
        sellPrice: estimatedTotalPrice,
        costPrice: estimatedTotalPrice * 0.5,
        status: 'pending' as const,
        paymentStatus: 'unpaid' as const,
      };

      await DataService.saveOrder(orderData);
      onSubmit(orderData);
      setIsSuccess(true);
    } catch (_err) {
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <motion.div
        key="quote-modal"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200/80 z-10 my-auto max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="w-full p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-5 bg-white">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Quote Request Submitted!
            </h3>

            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Thank you, <strong className="text-slate-900">{fullName || 'Valued Customer'}</strong>! Our print & packaging team has received your custom quote request for{' '}
              <strong className="text-slate-900">{product.name} ({quantity} {product.unit}s)</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 font-mono space-y-1">
              <p>Confirmation sent to: <strong className="text-slate-800">{email}</strong></p>
              <p>Estimated Response Time: <strong className="text-emerald-700">1 - 2 Hours</strong></p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Back to Products Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Left Panel: Visual Product Showcase */}
            <div className="md:w-[38%] bg-[#0F172A] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
              {/* Background ambient lighting */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Print Plaza Studio // Quote Desk
                </div>

                {/* Product Image Card */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-xl group aspect-4/3 sm:aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-300 border border-slate-700/80 uppercase tracking-wider">
                      {product.unit} Production
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg text-[10px] font-mono font-bold">
                      ${product.price.toFixed(2)} / {product.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight font-display">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Bottom Quote Range Summary */}
              <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Estimated Quote Price Range
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    ${estimatedTotalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">USD</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  *Final quotation verified by our press team. No payment required until quote approval.
                </p>
              </div>
            </div>

            {/* Right Panel: BoxNovo Style Multi-Column Form */}
            <div className="md:w-[62%] bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Header */}
                <div className="pr-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
                    Get A Custom Packaging Quote
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Tell us what you need and our packaging team will get back to you with a custom quote.
                  </p>
                </div>

                {/* Row 1: Contact Details (3 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Business Email *</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Quantity, Product Type & Company Name (3 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estimated Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 1000"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Product Type *</label>
                    <input
                      type="text"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="Company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: Dynamic Product Specifications (2 Columns Grid) */}
                {product.options && product.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {product.options.map((opt) => (
                      <div key={opt.id}>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">{opt.label}</label>
                        {opt.type === 'select' ? (
                          <select
                            value={String(options[opt.id] || '')}
                            onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                          >
                            <option value="">—Please choose an option—</option>
                            {opt.values?.map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={opt.placeholder || `Enter ${opt.label}`}
                            value={String(options[opt.id] || '')}
                            onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Row 4: Packaging & Specifications Textarea */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Packaging Specifications</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your box style, dimensions, material, printing, finish, or other requirements..."
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl p-3 text-xs font-medium text-slate-800 outline-none transition-all resize-y placeholder:text-slate-400"
                  />
                </div>

                {/* Row 5: Upload Artwork or Reference Images */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Upload Artwork or Reference Images</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between gap-3">
                    <label className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-slate-500" /> Choose File
                      <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                    <span className="text-xs text-slate-500 font-mono truncate flex-1">
                      {artworkFile ? artworkFile.name : 'No file chosen'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Optional &bull; JPG, PNG, PDF, AI, EPS or ZIP &bull; Max 10MB
                  </span>
                </div>

                {/* Row 6: Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-6 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                        <span>Sending Custom Quote Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Quote Request</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center mt-2.5 font-medium">
                    Review completed in 1-2h &bull; Zero obligation until quote confirmation
                  </p>
                </div>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
