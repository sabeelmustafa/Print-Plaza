/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { X, Upload, CheckCircle2, ArrowRight, Package, Layers, Sparkles } from 'lucide-react';
import { Product, ServiceCategory } from '../types';
import { useAuth } from '../lib/AuthContext';
import { DataService } from '../lib/dataService';
import { useCatalogProducts } from '../lib/useCatalogProducts';

export interface OrderModalProps {
  product?: Product | null;
  initialServiceName?: string | null;
  products?: Product[];
  categories?: ServiceCategory[];
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  onLoginRequest?: () => void;
}

export default function OrderModal({
  product,
  initialServiceName,
  products = [],
  categories = [],
  onClose,
  onSubmit,
  onLoginRequest,
}: OrderModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { products: allAvailableProducts, loading: catalogLoading, error: catalogError, retry: retryCatalog } = useCatalogProducts();
  const [selectedProductId, setSelectedProductId] = useState(product?.id || '');
  useEffect(() => {
    if (!allAvailableProducts.length) return;
    setSelectedProductId(previous => {
      if (allAvailableProducts.some(item => item.id === previous)) return previous;
      return allAvailableProducts.find(item => item.id === product?.id || item.name.toLowerCase() === initialServiceName?.toLowerCase())?.id || '';
    });
  }, [allAvailableProducts, product?.id, initialServiceName]);
  const currentProduct = allAvailableProducts.find(item => item.id === selectedProductId) || null;
  const productType = currentProduct?.name || '';

  // Form State
  const [fullName, setFullName] = useState(user?.name || user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState<number>(500);
  const [options, setOptions] = useState<Record<string, string | number | boolean>>({});
  const [specifications, setSpecifications] = useState('');
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  // Sync user credentials if auth arrives
  useEffect(() => {
    if ((user?.name || user?.displayName) && !fullName) setFullName(user.name || user.displayName);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
    setOptions({});
  };
  useEffect(() => {
    setOptions(Object.fromEntries((currentProduct?.options || []).filter(option => option.defaultValue !== undefined).map(option => [option.id, option.defaultValue!])));
  }, [currentProduct?.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtworkFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !fullName) {
      alert('Please fill in your name and email address.');
      return;
    }

    if (!currentProduct || catalogLoading || catalogError) { alert('Select a listed product before requesting a quotation.'); return; }
    if (!Number.isSafeInteger(quantity) || quantity < 1 || (currentProduct.maxQuantity && quantity > currentProduct.maxQuantity)) { alert('Enter a valid quantity within the product limit.'); return; }
    const finalProductName = currentProduct.name;

    setIsSubmitting(true);
    try {
      const artwork = artworkFile ? await DataService.prepareArtwork(artworkFile) : undefined;

      await DataService.submitQuoteRequest({
        userId: user?.uid || undefined,
        userName: fullName || email.split('@')[0],
        userEmail: email,
        phone: phone || undefined,
        companyName: companyName || undefined,
        productId: currentProduct?.id || selectedProductId || 'custom-quote',
        productName: finalProductName,
        quantity: Number(quantity) || 1,
        quotedPrice: 0,
        options: { ...options },
        finishingSpecs: {},
        notes: specifications || undefined,
        artwork,
      });

      onSubmit({ userEmail: email, userName: fullName, productName: finalProductName });
      setIsSuccess(true);
    } catch (_err) {
      console.error('[OrderModal] submitQuoteRequest failed:', _err);
      alert(_err instanceof Error ? _err.message : 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Visual header elements
  const displayImage = currentProduct?.image || '/brand/print-plaza-logo.png';
  const displayTitle = currentProduct?.name || (productType ? productType : 'Custom Print Production');
  const displayDescription =
    currentProduct?.description ||
    'Custom print manufacturing tailored to your exact specifications. Select any service, substrate, and volume tier for itemized pricing.';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#14262C]/80 backdrop-blur-md"
      />

      <motion.div
        key="quote-modal"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#14262C]/20 z-10 my-auto max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-[#14262C] text-white hover:bg-[#2D545E] hover:scale-105 flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="w-full p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-5 bg-[#FDFCFB]">
            <div className="w-16 h-16 rounded-full bg-[#2D545E]/10 text-[#2D545E] flex items-center justify-center border border-[#2D545E]/20 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-black text-[#14262C] tracking-tight uppercase">
              Quote Request Submitted!
            </h3>

            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Thank you, <strong className="text-[#14262C]">{fullName || 'Valued Customer'}</strong>! Our print engineering team has received your custom quote inquiry for{' '}
              <strong className="text-[#2D545E]">{productType || currentProduct?.name || 'Custom Print Job'} ({quantity} pcs)</strong>.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 font-mono space-y-1 shadow-xs">
              <p>Confirmation sent to: <strong className="text-slate-800">{email}</strong></p>
              <p>Estimated Response Time: <strong className="text-[#2D545E] font-bold">1 - 2 Hours (Business Days)</strong></p>
            </div>

            <button
              onClick={onClose}
              className="mt-4 px-7 py-3.5 bg-[#2D545E] hover:bg-[#1E373F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Left Panel: Visual Product Showcase */}
            <div className="md:w-[38%] bg-[#14262C] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-[#1E373F]">
              {/* Background ambient lighting */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#2D545E]/30 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#E17055]/20 blur-[90px] rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#E17055] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#E17055] animate-pulse" />
                  Print Plaza Studio // Quote Desk
                </div>

                {/* Product Image Card */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#1E373F] shadow-xl group aspect-4/3 sm:aspect-square flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#E17055] z-20" />
                  <img
                    src={displayImage}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14262C]/95 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-[#14262C]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-200 border border-white/10 uppercase tracking-wider">
                      Custom Production
                    </span>
                    <span className="bg-[#E17055] text-white px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shadow-xs">
                      Direct Press Quote
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight font-display">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-[#EDEBE7]/80 mt-2 line-clamp-3 leading-relaxed font-sans">
                    {displayDescription}
                  </p>
                </div>
              </div>

              {/* Bottom Quote Summary */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#EDEBE7]/60 block font-mono">
                  Custom Volume & Specs
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#E17055] font-display tracking-tight uppercase">
                    Tailored Quote
                  </span>
                </div>
                <p className="text-[10px] text-[#EDEBE7]/70 leading-normal">
                  *Engineered pricing calculated per sizes, substrates & batch volume. No upfront payment required.
                </p>
              </div>
            </div>

            {/* Right Panel: BoxNovo Style Multi-Column Form */}
            <div className="md:w-[62%] bg-[#FDFCFB] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto relative">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Header */}
                <div className="pr-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#14262C] tracking-tight font-display">
                    Get A Custom Print Quote
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {currentProduct?.name ? (
                      <>Tell us what you need for <strong className="text-[#2D545E]">{currentProduct.name}</strong> and our team will get back to you with an itemized quote.</>
                    ) : (
                      <>Select your product or service below to receive an itemized manufacturing estimate.</>
                    )}
                  </p>
                </div>

                {/* Product / Service Selector (Dropdown) */}
                <div className="bg-[#2D545E]/5 border border-[#2D545E]/15 rounded-2xl p-4 space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2D545E] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#E17055]" />
                      Product / Item *
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono lowercase">
                      choose or change below
                    </span>
                  </label>

                  <select
                    aria-label="Product / Item"
                    disabled={catalogLoading || !!catalogError}
                    value={selectedProductId}
                    onChange={handleProductSelect}
                    className="w-full bg-white border border-slate-300 focus:border-[#2D545E] focus:ring-2 focus:ring-[#2D545E]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none transition-all shadow-xs cursor-pointer"
                    required
                  >
                    <option value="">{catalogLoading ? 'Loading products…' : 'Choose a product / item'}</option>
                    {allAvailableProducts.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  {catalogError && <p role="alert" className="text-xs text-red-700">{catalogError} <button type="button" className="underline" onClick={retryCatalog}>Retry</button></p>}
                  {!catalogLoading && !catalogError && !allAvailableProducts.length && <p className="text-xs text-slate-500">No products are currently available.</p>}
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
                      className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
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
                      className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+92 312 5747610"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Quantity & Company Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Estimated Quantity (Units) *</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 500"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      placeholder="Company name (optional)"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Row 3: Dynamic Product Specifications (If available) */}
                {currentProduct?.options && currentProduct.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {currentProduct.options.map((opt) => (
                      <div key={opt.id}>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">{opt.label}</label>
                        {opt.type === 'select' ? (
                          <select
                            value={String(options[opt.id] || '')}
                            onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                            className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
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
                            className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Row 4: Packaging & Specifications Textarea */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Print & Production Specifications</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your required dimensions (W x H x D), paper stock/material, pantone/CMYK colors, finishing options (matte, gloss, foil, spot UV), or special custom requirements..."
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#2D545E] focus:ring-1 focus:ring-[#2D545E]/20 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none transition-all resize-y placeholder:text-slate-400"
                  />
                </div>

                {/* Row 5: Upload Artwork or Reference Images */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Upload Artwork or Reference Images</label>
                  <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between gap-3">
                    <label className="bg-[#2D545E]/5 border border-[#2D545E]/20 hover:bg-[#2D545E]/10 text-[#2D545E] text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-[#2D545E]" /> Choose File
                      <input type="file" onChange={handleFileChange} className="hidden" accept="image/png,image/jpeg,image/jpg,.pdf,.ai,.eps,.zip" />
                    </label>
                    <span className="text-xs text-slate-500 font-mono truncate flex-1">
                      {artworkFile ? artworkFile.name : 'No file chosen'}
                    </span>
                  </div>
                  <div className="bg-[#2D545E]/5 border border-[#2D545E]/15 rounded-xl p-3 mt-2 space-y-1">
                    <span className="text-[11px] text-[#2D545E] font-bold flex items-center gap-1.5">
                      📁 Artwork File Guidelines:
                    </span>
                    <span className="text-[10px] text-slate-600 leading-normal block">
                      Please upload a <strong>JPG, PNG or PDF preview</strong> above. For vector CAD / prepress files (AI, EPS, CDR, ZIP), you may also email them to <strong className="font-mono text-[#2D545E]">sales@printplaza.net</strong> with your reference.
                    </span>
                  </div>
                </div>

                {/* Row 6: Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || catalogLoading || !!catalogError || !currentProduct}
                    className="w-full bg-[#2D545E] hover:bg-[#1E373F] text-white py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md shadow-[#2D545E]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                        <span>Sending Custom Quote Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Quote Request</span>
                        <ArrowRight className="w-4 h-4 text-[#E17055] group-hover:translate-x-1 transition-transform" />
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
