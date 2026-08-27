/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Mail,
  Phone,
  Printer,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { HOMEPAGE_CORE_SERVICES, BUSINESS_INFO } from '../seoData';

export function HomeCoreServicesSection() {
  return (
    <section id="core-services" className="py-24 sm:py-36 bg-[#F6F5F2] border-y border-black/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-24 gap-8">
          <div className="max-w-3xl">
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-[#2D545E]/40" />
              Full Production Spectrum
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight uppercase leading-[0.88] text-black">
              Industrial Print Services <br />
              <span className="text-black/15 font-serif italic lowercase">& Manufacturing.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base font-medium leading-relaxed text-black/60 max-w-md font-sans">
            Explore our specialized manufacturing departments. Every category is backed by dedicated pre-press engineering, automated color control, and precision finishing.
          </p>
        </div>

        {/* 8 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {HOMEPAGE_CORE_SERVICES.map((service, index) => (
            <article
              key={service.id}
              className="bg-[#FDFCFB] border border-black/10 p-8 sm:p-10 flex flex-col justify-between group hover:border-black transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] relative"
            >
              <div className="space-y-6">
                {/* Top Badge */}
                <div className="flex items-center justify-between border-b border-black/8 pb-6">
                  <span className="text-[10px] font-mono font-bold text-[#E17055] uppercase tracking-widest">
                    DEPT_{String(index + 1).padStart(2, '0')} // {service.id.toUpperCase().replace(/-/g, '_')}
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-[#EBEAE8] px-3 py-1 text-black/60 uppercase">
                    Commercial Grade
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-black group-hover:text-[#2D545E] transition-colors leading-tight mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs font-mono font-bold text-[#E17055] uppercase tracking-wider">
                    {service.tagline}
                  </p>
                </div>

                {/* Detailed 100-150 word Description (What it is, Who it's for, Why choose Print Plaza) */}
                <p className="text-sm leading-relaxed text-black/70 font-medium font-sans">
                  {service.summary}
                </p>

                <div className="bg-[#F8F7F4] p-4 border-l-2 border-[#2D545E] space-y-2 text-xs text-black/75">
                  <p>
                    <strong className="text-black font-semibold">Who it is for: </strong>
                    {service.whoItsFor}
                  </p>
                  <p>
                    <strong className="text-black font-semibold">Why Print Plaza: </strong>
                    {service.whyChooseUs}
                  </p>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {service.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="text-[9px] font-mono font-bold bg-[#EFEFEF] border border-black/5 text-black/70 py-1.5 px-3 uppercase tracking-wider"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-8 border-t border-black/8 flex items-center justify-between">
                <a
                  href={service.slug}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-black group-hover:text-[#2D545E] transition-colors"
                >
                  Explore Dedicated Specs & Pricing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </a>
                <a
                  href="/#products"
                  className="text-[9px] font-mono font-bold uppercase tracking-wider text-black/40 hover:text-black transition-colors"
                >
                  Request Quote &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeAboutSection() {
  return (
    <section id="about" className="py-24 sm:py-36 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grainy opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-4">
              <span className="w-12 h-1 bg-[#E17055]" />
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.36em] text-[#E17055]">
                Production Facility // Studio Background
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight uppercase leading-[0.88]">
              Engineered for <br />
              <span className="text-white/20 font-serif italic lowercase">Tactile Excellence.</span>
            </h2>

            <div className="space-y-5 text-base sm:text-lg leading-relaxed text-white/70 font-medium font-sans">
              <p>
                Headquartered on Main Talagang Road in Chakwal, <strong>Print Plaza</strong> is a full-service industrial print production and packaging manufacturing company. We engineer custom folding cartons, durable waterproof labels, luxury business stationery, wide-format architectural signage, and high-volume commercial offset print collateral.
              </p>
              <p>
                Our manufacturing studio bridges the gap between digital creative vision and physical substrate execution. By combining multi-color sheetfed offset lithography, high-resolution digital micro-toner presses, and direct-to-substrate UV flatbed technology, we serve clients ranging from regional retail pioneers to international corporate brands.
              </p>
              <p>
                Every project passing through Print Plaza undergoes strict pre-press file pre-flighting, computerized color densitometer verification, and detailed post-print bindery inspection. We ensure zero misalignment, sharp typography down to 5pt, and exact Pantone spot color fidelity.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#E17055]">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Quality First</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Complimentary digital pre-flight checks and 3D dieline proofing before production starts.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#66A0AA]">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Dual Speed</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  On-demand digital printing for urgent 24h needs alongside high-volume bulk offset runs.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#E17055]">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Luxury Finishes</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Velvet soft-touch, raised 3D spot UV, metallic hot foil stamping, and custom CNC die-cuts.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/about"
                className="inline-flex items-center gap-3 bg-[#E17055] text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors"
              >
                Read Full Company Profile & Equipment Specs
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column / Visual Matrix */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141414] border border-white/12 p-8 sm:p-10 space-y-6 relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                  PRODUCTION METRICS
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-3xl sm:text-4xl font-display font-black text-white">2400 DPI</div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-wider mt-1">
                    Micro-Dot Laser & CTP Resolution
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <div className="text-3xl sm:text-4xl font-display font-black text-[#E17055]">100% PMS</div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-wider mt-1">
                    Pantone Spot Color Matching Accuracy
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <div className="text-3xl sm:text-4xl font-display font-black text-[#66A0AA]">700 GSM</div>
                  <div className="text-xs font-mono text-white/50 uppercase tracking-wider mt-1">
                    Maximum Supported Substrate & Cardstock Weight
                  </div>
                </div>
              </div>

              <div className="pt-4 bg-white/5 p-4 border border-white/10 text-xs text-white/70 space-y-2">
                <div className="font-bold text-white uppercase text-[10px] tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Facility Location & Dispatch
                </div>
                <p>
                  Main Talagang Road, Chakwal, Punjab, Pakistan. Serving businesses locally, nationwide, and globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-36 bg-[#FDFCFB] border-b border-black/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-6 flex items-center gap-4">
                <span className="w-8 h-px bg-[#2D545E]/40" />
                Direct Desk & Consultations
              </div>
              <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight uppercase leading-[0.9] text-black">
                Start Your Next <br />
                <span className="text-black/20 font-serif italic lowercase">Print Project.</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-black/70 font-medium">
              Have questions about packaging dielines, paper stocks, or large-volume offset quotations? Connect directly with our Chakwal production team for immediate estimates, sample requests, and technical assistance.
            </p>

            <div className="space-y-6 pt-4">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-start gap-5 p-6 bg-[#F6F5F2] border border-black/10 hover:border-black transition-colors group"
              >
                <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center shrink-0 group-hover:bg-[#E17055] transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block mb-1">
                    Phone & WhatsApp Direct
                  </span>
                  <span className="text-xl font-display font-black text-black">
                    {BUSINESS_INFO.displayPhone}
                  </span>
                  <p className="text-xs text-black/60 mt-1">Available Mon–Sat, 9:00 AM – 7:00 PM</p>
                </div>
              </a>

              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="flex items-start gap-5 p-6 bg-[#F6F5F2] border border-black/10 hover:border-black transition-colors group"
              >
                <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center shrink-0 group-hover:bg-[#E17055] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block mb-1">
                    Sales & Quotations Email
                  </span>
                  <span className="text-xl font-display font-black text-black">
                    {BUSINESS_INFO.email}
                  </span>
                  <p className="text-xs text-black/60 mt-1">Send PDF designs & dielines for fast quotes</p>
                </div>
              </a>

              <div className="flex items-start gap-5 p-6 bg-[#F6F5F2] border border-black/10">
                <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block mb-1">
                    Production Studio & Office
                  </span>
                  <span className="text-lg font-display font-bold text-black leading-snug">
                    {BUSINESS_INFO.formattedAddress}
                  </span>
                  <p className="text-xs text-black/60 mt-1">Chakwal 48800, Punjab, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Quote Prompt Box */}
          <div className="lg:col-span-6 bg-black text-white p-8 sm:p-12 relative">
            <div className="absolute top-0 right-0 h-3 w-32 bg-[#E17055]" />
            <div className="space-y-6">
              <div className="text-[10px] font-mono font-black uppercase tracking-[0.36em] text-[#E17055]">
                Quotation Request
              </div>
              <h3 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">
                Request an Itemized Estimate
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                Tell us your product type (Packaging, Labels, Business Cards, Brochures, Banners, or Custom), required quantity, dimensions, and preferred finishing options. Our production desk will prepare an itemized quote.
              </p>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#E17055]" />
                  <span>Free artwork pre-flight check on all files</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#E17055]" />
                  <span>Fast digital 3D proofing before production starts</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#E17055]" />
                  <span>Secure nationwide shipping and international air cargo</span>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <a
                  href="/#products"
                  className="flex-1 bg-[#E17055] text-white py-4 px-6 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:bg-white hover:text-black transition-colors"
                >
                  Select Product & Quote
                </a>
                <a
                  href={`https://wa.me/923125747610`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-white/30 text-white py-4 px-6 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:border-white transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
