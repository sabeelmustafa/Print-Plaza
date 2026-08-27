/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Layers,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ALL_SEO_ROUTES,
  BUSINESS_INFO,
  SERVICE_PAGES_DATA,
  ServicePageData,
} from '../seoData';

export const SERVICE_PAGES = SERVICE_PAGES_DATA;

export function useSeo(
  title: string,
  description: string,
  canonicalPath: string,
  schemaJson?: Record<string, any>
) {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Meta OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // 4. Canonical link
    const origin = 'https://printplaza.net';
    const canonicalUrl = `${origin}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 5. Schema JSON-LD
    let scriptSchema = document.getElementById('plaza-dynamic-schema') as HTMLScriptElement;
    if (!scriptSchema) {
      scriptSchema = document.createElement('script');
      scriptSchema.id = 'plaza-dynamic-schema';
      scriptSchema.type = 'application/ld+json';
      document.head.appendChild(scriptSchema);
    }
    if (schemaJson) {
      scriptSchema.textContent = JSON.stringify(schemaJson);
    }

    // Scroll top
    window.scrollTo(0, 0);
  }, [title, description, canonicalPath, schemaJson]);
}

export function ServicePage({
  page,
  onRequestQuote,
}: {
  page: ServicePageData;
  onRequestQuote?: (serviceName?: string) => void;
}) {
  useSeo(page.metaTitle, page.description, page.path, page.schema);

  return (
    <article className="min-h-screen bg-[#FDFCFB] text-black overflow-hidden pt-24 pb-24 sm:pb-32">
      {/* Top Duo Banner */}
      <div className="absolute top-0 left-0 w-full h-2 flex z-40">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 sm:mb-16 flex items-center justify-between border-b border-black/5 pb-8">
          <a
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/50 hover:text-white transition-all group py-3 px-6 bg-black/5 hover:bg-black"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            Back to Home
          </a>

          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/30">
            <a href="/" className="hover:text-black">PRINT PLAZA</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black uppercase">{page.serviceCategory}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="mb-20 sm:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#2D545E]/10 border border-[#2D545E]/20 text-[#2D545E] text-[10px] font-mono font-black uppercase tracking-[0.28em]">
                <span className="w-2 h-2 rounded-full bg-[#E17055] animate-pulse" />
                {page.badge}
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-[0.88] uppercase text-black">
                {page.heading}
              </h1>

              <p className="text-lg sm:text-xl font-medium leading-relaxed text-black/70 border-l-4 border-[#2D545E] pl-6">
                {page.subheading}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => {
                    if (onRequestQuote) {
                      onRequestQuote(page.heading);
                    } else {
                      window.location.href = '/#products';
                    }
                  }}
                  className="bg-[#2D545E] text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] hover:bg-[#E17055] transition-colors flex items-center gap-3 cursor-pointer"
                >
                  Request Dedicated Quote
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#specs"
                  className="border border-black/20 text-black px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] hover:border-black transition-colors"
                >
                  View Material Specs
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative border border-black/10 overflow-hidden shadow-2xl group">
                <img
                  src={page.heroImage}
                  alt={page.heading}
                  className="w-full h-[400px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                  <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase text-[#E17055] mb-1">
                    Quality Assured
                  </span>
                  <span className="text-lg font-display font-bold uppercase tracking-tight">
                    Chakwal Press Facility Output
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: What It's For */}
        <section className="mb-20 sm:mb-28 bg-[#F8F7F4] border border-black/10 p-8 sm:p-14">
          <div className="max-w-3xl mb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#2D545E] mb-3">
              Application & Scope
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight mb-4">
              {page.whatItsFor.title}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-black/70">
              {page.whatItsFor.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-black/10">
            {page.whatItsFor.points.map((point, index) => {
              const [strongPart, rest] = point.split(':');
              return (
                <div key={index} className="flex items-start gap-4 p-5 bg-white border border-black/5">
                  <div className="w-8 h-8 rounded-full bg-[#2D545E]/10 text-[#2D545E] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2D545E]" />
                  </div>
                  <p className="text-sm leading-relaxed text-black/80">
                    <strong className="text-black block mb-1">{strongPart}</strong>
                    {rest || strongPart}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Why Print Plaza */}
        <section className="mb-20 sm:mb-28">
          <div className="max-w-3xl mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#E17055] mb-3">
              Engineering Advantage
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight mb-4">
              {page.whyPrintPlaza.title}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-black/70">
              {page.whyPrintPlaza.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.whyPrintPlaza.features.map((feat, index) => (
              <div key={index} className="border border-black/10 p-7 bg-white flex flex-col justify-between hover:border-black transition-colors group">
                <div>
                  <span className="text-[9px] font-mono font-bold text-black/30 group-hover:text-[#E17055] transition-colors block mb-4">
                    ADVANTAGE // 0{index + 1}
                  </span>
                  <h3 className="text-xl font-display font-black uppercase tracking-tight mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-black/65">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-black/5 flex justify-end">
                  <Sparkles className="w-4 h-4 text-black/20 group-hover:text-[#2D545E] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Materials, Finishing & Specs Grid */}
        <section id="specs" className="mb-20 sm:mb-28 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Materials & Finishing */}
          <div className="lg:col-span-7 bg-[#202425] text-white p-8 sm:p-12 space-y-10">
            <div>
              <div className="text-[10px] font-mono font-black uppercase tracking-[0.36em] text-[#E17055] mb-3">
                Substrate & Finishing Guide
              </div>
              <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-6">
                Material Engineering Options
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#E17055]" />
                  Supported Substrates
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/80">
                  {page.materialsAndFinishing.materials.map((mat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#E17055] rounded-full" />
                      {mat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white/50 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#66A0AA]" />
                  Embellishments & Finishes
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/80">
                  {page.materialsAndFinishing.finishing.map((fin, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#66A0AA] rounded-full" />
                      {fin}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Specs Table */}
          <div className="lg:col-span-5 bg-white border border-black/10 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-black uppercase tracking-[0.36em] text-[#2D545E] mb-3">
                Production Tolerances
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-6">
                Technical Specifications
              </h3>

              <dl className="divide-y divide-black/10 text-sm">
                {page.materialsAndFinishing.technicalSpecs.map((spec, i) => (
                  <div key={i} className="py-4 flex justify-between gap-4">
                    <dt className="font-bold text-black/60">{spec.label}</dt>
                    <dd className="font-mono font-bold text-black text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10">
              <p className="text-xs text-black/50 leading-relaxed font-mono">
                * Tolerances aligned with ISO 12647-2 international commercial press standardization.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Industry Use Cases */}
        <section className="mb-20 sm:mb-28">
          <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#2D545E] mb-3">
            Commercial Deployment
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight mb-8">
            Primary Industry Applications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.useCases.map((useCase, index) => (
              <div key={index} className="bg-[#F8F7F4] border border-black/5 p-6 space-y-3">
                <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono text-xs font-bold">
                  0{index + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed text-black/80">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Technical FAQ */}
        <section className="mb-20 sm:mb-28 bg-white border border-black/10 p-8 sm:p-14">
          <div className="max-w-3xl mb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.36em] text-[#E17055] mb-3">
              Client Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">
              Frequently Asked Technical Questions
            </h2>
          </div>

          <div className="space-y-6 divide-y divide-black/10">
            {page.faqs.map((faq, index) => (
              <div key={index} className="pt-6 first:pt-0">
                <h3 className="text-lg font-display font-black uppercase tracking-tight text-black mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-black/70">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Block */}
        <section className="bg-black text-white p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.36em] text-[#E17055] mb-2">
              Ready for Production?
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight mb-4">
              Request Your Itemized Quote.
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Submit your project specifications or speak directly with our print engineers in Chakwal. Free artwork pre-flight checks on all orders.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (onRequestQuote) {
                  onRequestQuote(page.heading);
                } else {
                  window.location.href = '/#products';
                }
              }}
              className="bg-[#E17055] text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              Request Quote
            </button>
            <a
              href="/contact"
              className="border border-white/40 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:border-white transition-colors"
            >
              Contact Studio
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}

export function AboutPage() {
  const pageData = ALL_SEO_ROUTES['/about'];
  useSeo(pageData.metaTitle, pageData.description, '/about', pageData.schema);

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-black overflow-hidden pt-24 pb-24 sm:pb-32">
      {/* Top Banner Line */}
      <div className="absolute top-0 left-0 w-full h-2 flex z-40">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 sm:mb-16 flex items-center justify-between border-b border-black/5 pb-8">
          <a
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/50 hover:text-white transition-all group py-3 px-6 bg-black/5 hover:bg-black"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            Back to Home
          </a>

          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/30">
            <a href="/" className="hover:text-black">PRINT PLAZA</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black uppercase">ABOUT US</span>
          </div>
        </div>

        {/* Hero */}
        <section className="mb-20 sm:mb-28">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D545E] mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-[#2D545E]/40" />
            Industrial Print Studio Profile
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tight leading-[0.85] uppercase text-black mb-8 max-w-4xl">
            About Print Plaza.
          </h1>
          <p className="text-xl sm:text-2xl font-medium leading-relaxed text-black/70 max-w-3xl border-l-4 border-[#2D545E] pl-6">
            We are an industrial commercial printing studio based in Chakwal, Punjab. Combining traditional German offset lithography with modern digital UV precision, we manufacture custom packaging, product labels, marketing collateral, and large format signage for ambitious businesses worldwide.
          </p>
        </section>

        {/* Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 sm:mb-28">
          <div className="bg-[#F8F7F4] border border-black/10 p-8 sm:p-10 space-y-4">
            <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-black uppercase tracking-tight">
              Industrial Machinery
            </h2>
            <p className="text-sm leading-relaxed text-black/70">
              Heidelberg multi-color offset presses, high-definition digital presses, and automated CNC flatbed cutters guarantee micron-accurate registration and repeatable color fidelity.
            </p>
          </div>

          <div className="bg-[#F8F7F4] border border-black/10 p-8 sm:p-10 space-y-4">
            <div className="w-12 h-12 bg-[#E17055] text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-black uppercase tracking-tight">
              Color Precision
            </h2>
            <p className="text-sm leading-relaxed text-black/70">
              Closed-loop spectrophotometer calibration ensures your brand&apos;s exact Pantone Spot Colors (PMS) and CMYK values remain identical across boxes, cards, and labels.
            </p>
          </div>

          <div className="bg-[#F8F7F4] border border-black/10 p-8 sm:p-10 space-y-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-black uppercase tracking-tight">
              End-to-End Craft
            </h2>
            <p className="text-sm leading-relaxed text-black/70">
              From free digital dieline structural reviews and unprinted mockups to custom embossing, foil stamping, and nationwide dispatch, we handle every stage under one roof.
            </p>
          </div>
        </section>

        {/* Facility Info */}
        <section className="bg-black text-white p-8 sm:p-14 mb-20 sm:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="text-[10px] font-mono font-black uppercase tracking-[0.36em] text-[#E17055]">
                FACILITY LOCATION
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">
                Our Production Desk in Chakwal
              </h2>
              <p className="text-sm leading-relaxed text-white/70">
                Conveniently located on Main Talagang Road in Chakwal, Punjab, our printing facility is equipped to handle both rapid local runs and high-volume commercial shipments across Pakistan and international destinations.
              </p>
              <div className="space-y-2 text-xs font-mono text-white/80">
                <p><strong>Address:</strong> {BUSINESS_INFO.formattedAddress}</p>
                <p><strong>Operating Hours:</strong> Monday – Saturday: 9:00 AM – 7:00 PM</p>
                <p><strong>Email:</strong> {BUSINESS_INFO.email}</p>
                <p><strong>Phone / WhatsApp:</strong> {BUSINESS_INFO.displayPhone}</p>
              </div>
            </div>

            <div className="border border-white/20 p-8 space-y-4 bg-white/5">
              <h3 className="text-xl font-display font-bold uppercase tracking-tight text-white">
                Request a Physical Sample Kit
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Evaluating papers and finishes before placing a large volume order? Contact us to receive sample swatches of our SBS cardboard, kraft boards, velvet lamination, foil stampings, and BOPP labels.
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#E17055] text-white text-[10px] font-black uppercase tracking-[0.24em] px-6 py-4 hover:bg-white hover:text-black transition-colors"
              >
                Request Paper Samples &rarr;
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function ContactPage({
  onRequestQuote,
}: {
  onRequestQuote?: () => void;
}) {
  const pageData = ALL_SEO_ROUTES['/contact'];
  useSeo(pageData.metaTitle, pageData.description, '/contact', pageData.schema);

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-black overflow-hidden pt-24 pb-24 sm:pb-32">
      {/* Top Banner Line */}
      <div className="absolute top-0 left-0 w-full h-2 flex z-40">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 sm:mb-16 flex items-center justify-between border-b border-black/5 pb-8">
          <a
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/50 hover:text-white transition-all group py-3 px-6 bg-black/5 hover:bg-black"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            Back to Home
          </a>

          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/30">
            <a href="/" className="hover:text-black">PRINT PLAZA</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black uppercase">CONTACT</span>
          </div>
        </div>

        {/* Hero */}
        <section className="mb-16 sm:mb-20">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D545E] mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-[#2D545E]/40" />
            Production Desk & Consultations
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tight leading-[0.85] uppercase text-black mb-8 max-w-4xl">
            Contact Us.
          </h1>
          <p className="text-xl sm:text-2xl font-medium leading-relaxed text-black/70 max-w-3xl border-l-4 border-[#2D545E] pl-6">
            Get in touch with our team for custom quotations, paper sample requests, artwork dielines, or production inquiries.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 sm:mb-28">
          {/* Left: Contact Information Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#F8F7F4] border border-black/10 p-8 sm:p-10 space-y-6">
              <h2 className="text-2xl font-display font-black uppercase tracking-tight text-black">
                Direct Communication Channels
              </h2>

              <div className="space-y-6">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="flex items-start gap-4 p-5 bg-white border border-black/10 hover:border-black transition-colors group"
                >
                  <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center shrink-0 group-hover:bg-[#E17055] transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block mb-1">
                      Phone & WhatsApp
                    </span>
                    <span className="text-xl font-display font-black text-black">
                      {BUSINESS_INFO.displayPhone}
                    </span>
                    <p className="text-xs text-black/60 mt-1">Available Mon–Sat: 9:00 AM – 7:00 PM</p>
                  </div>
                </a>

                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="flex items-start gap-4 p-5 bg-white border border-black/10 hover:border-black transition-colors group"
                >
                  <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center shrink-0 group-hover:bg-[#E17055] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block mb-1">
                      Email Address
                    </span>
                    <span className="text-xl font-display font-black text-black">
                      {BUSINESS_INFO.email}
                    </span>
                    <p className="text-xs text-black/60 mt-1">Send PDF files for free pre-flight checks</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-white border border-black/10">
                  <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block mb-1">
                      Studio Address
                    </span>
                    <span className="text-base font-display font-bold text-black leading-snug">
                      {BUSINESS_INFO.formattedAddress}
                    </span>
                    <p className="text-xs text-black/60 mt-1">Chakwal 48800, Punjab, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white border border-black/10">
                  <div className="w-12 h-12 bg-[#2D545E] text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest block mb-1">
                      Operating Hours
                    </span>
                    <span className="text-base font-display font-bold text-black">
                      Monday to Saturday: 9:00 AM – 7:00 PM
                    </span>
                    <p className="text-xs text-black/60 mt-1">Sunday: Closed for maintenance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: How to Request a Quote */}
          <div className="lg:col-span-6 bg-black text-white p-8 sm:p-12 space-y-6 relative">
            <div className="absolute top-0 right-0 h-3 w-32 bg-[#E17055]" />
            <div className="text-[10px] font-mono font-black uppercase tracking-[0.36em] text-[#E17055]">
              QUOTATION GUIDE
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">
              How to Get Fast Itemized Pricing
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              To receive an accurate and timely quotation, please include as much of the following information as possible:
            </p>

            <ul className="space-y-4 pt-2 border-t border-white/10 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E17055] mt-2 shrink-0" />
                <span><strong>Product Type:</strong> Custom Boxes, Labels, Business Cards, Brochures, Banners, Signage, or Offset Printing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E17055] mt-2 shrink-0" />
                <span><strong>Quantity:</strong> Required number of units or batch tiers (e.g. 500, 1,000, 5,000).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E17055] mt-2 shrink-0" />
                <span><strong>Dimensions:</strong> Width x Height x Depth in millimeters, centimeters, or inches.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E17055] mt-2 shrink-0" />
                <span><strong>Material & Finishing:</strong> Kraft, artboard, vinyl, BOPP; matte/gloss lamination, foil stamping, or spot UV.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E17055] mt-2 shrink-0" />
                <span><strong>Artwork:</strong> Attach your design or request dieline setup assistance.</span>
              </li>
            </ul>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  if (onRequestQuote) {
                    onRequestQuote();
                  } else {
                    window.location.href = '/#products';
                  }
                }}
                className="flex-1 bg-[#E17055] text-white py-4 px-6 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Open Quote Form
              </button>
              <a
                href={`https://wa.me/923125747610`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 border border-white/30 text-white py-4 px-6 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:border-white transition-colors"
              >
                WhatsApp Direct
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export function PrivacyPolicyPage() {
  const pageData = ALL_SEO_ROUTES['/privacy-policy'];
  useSeo(pageData.metaTitle, pageData.description, '/privacy-policy', pageData.schema);

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-black overflow-hidden pt-24 pb-24 sm:pb-32">
      {/* Top Banner Line */}
      <div className="absolute top-0 left-0 w-full h-2 flex z-40">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 sm:mb-16 flex items-center justify-between border-b border-black/5 pb-8">
          <a
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/50 hover:text-white transition-all group py-3 px-6 bg-black/5 hover:bg-black"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            Back to Home
          </a>

          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/30">
            <a href="/" className="hover:text-black">PRINT PLAZA</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black uppercase">PRIVACY POLICY</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight mb-8">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono uppercase text-black/40 mb-12 tracking-widest">
          LAST UPDATED: AUGUST 2026 // VERSION 2.1
        </p>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-black/80">
          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-black">
              1. Information We Collect
            </h2>
            <p>
              When you submit a quotation request, create a client portal account, or upload artwork files to Print Plaza, we collect necessary contact information (such as your name, business email address, phone number, company name, and physical delivery address) as well as the technical specifications and digital artwork files related to your print jobs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-black">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is used strictly for generating itemized quotes, performing pre-flight vector artwork verification, printing and delivering orders, processing accounting invoices, and sending project milestone notifications. We do not sell, rent, or lease customer data to any third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-black">
              3. Artwork Confidentiality & IP Protection
            </h2>
            <p>
              All proprietary artwork, dielines, logos, and custom packaging designs uploaded to Print Plaza remain the exclusive intellectual property of the client. We do not reuse, reproduce, or share your proprietary design files without explicit written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-black">
              4. Contact Regarding Privacy
            </h2>
            <p>
              If you have any questions or wish to request data updates, please contact our data desk at <strong>sales@printplaza.net</strong> or write to <strong>Print Plaza, Main Talagang Road, Chakwal 48800, Punjab, Pakistan</strong>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
