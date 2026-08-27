/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck2,
  HelpCircle,
  Layers,
  Mail,
  MapPin,
  Phone,
  Printer,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ALL_SEO_ROUTES,
  BUSINESS_INFO,
  HOMEPAGE_CORE_SERVICES,
  SERVICE_SEO_PAGES,
  SeoRouteData,
} from '../seoData';

export const SERVICE_PAGES = SERVICE_SEO_PAGES;

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

export function useSeo(
  title: string,
  description: string,
  path: string,
  jsonLd?: Record<string, unknown>
) {
  useEffect(() => {
    const canonical = `https://printplaza.net${path === '/' ? '' : path}`;
    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    const scriptId = 'printplaza-page-jsonld';
    document.getElementById(scriptId)?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, jsonLd]);
}

export function ServiceLinksSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#F6F5F2] border-y border-black/8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-12">
          <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-5 flex items-center gap-3">
            <span className="w-8 h-px bg-[#2D545E]/40" />
            Printing Services Catalog
          </div>
          <h2 className="font-display font-black uppercase tracking-tight text-4xl sm:text-6xl leading-[0.9]">
            Detailed Service Specs & Guides.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
          {SERVICE_SEO_PAGES.map((page) => (
            <a
              key={page.path}
              href={page.path}
              className="group bg-[#FDFCFB] p-7 min-h-[220px] flex flex-col justify-between hover:bg-black hover:text-white transition-colors"
            >
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.28em] text-[#E17055] mb-5">
                  {page.eyebrow}
                </div>
                <h3 className="font-display font-black uppercase tracking-tight text-2xl leading-[0.95] mb-3">
                  {page.heading}
                </h3>
                <p className="text-xs text-black/60 group-hover:text-white/70 line-clamp-2">
                  {page.description}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-black/35 group-hover:text-[#E17055] pt-4">
                View Full Specs &rarr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicePage({ page }: { page: SeoRouteData }) {
  useSeo(page.metaTitle, page.description, page.path, page.schema);

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-24 pb-24 sm:pb-32 text-black overflow-hidden">
      {/* Top Banner Line */}
      <div className="absolute top-0 left-0 w-full h-2 flex z-40">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-12 sm:mb-16 flex flex-wrap items-center justify-between gap-6 border-b border-black/5 pb-8">
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
            <span className="text-[#2D545E]">SERVICES</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black uppercase">{page.heading}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20 sm:mb-28 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-4">
              <span className="h-[2px] w-12 bg-[#2D545E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D545E] font-mono">
                PRODUCTION UNIT // {page.path.replace(/\//g, '').slice(0, 18).toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight leading-[0.88] uppercase text-black">
              {page.heading}
            </h1>

            {page.subheading && (
              <p className="text-sm font-mono font-bold text-[#E17055] uppercase tracking-wider">
                {page.subheading}
              </p>
            )}

            <div className="space-y-4 text-base sm:text-lg font-medium leading-relaxed text-black/75 font-sans max-w-2xl border-l-4 border-[#2D545E] pl-6">
              {page.contentParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/#products"
                className="bg-black text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-center hover:bg-[#2D545E] transition-colors shadow-lg"
              >
                Request Custom Quote
              </a>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="border border-black/20 px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-center hover:border-black transition-colors"
              >
                Call {BUSINESS_INFO.displayPhone}
              </a>
            </div>
          </div>

          {/* Quick Specifications Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#181818] text-white p-8 sm:p-10 border border-black/10 shadow-2xl relative">
              <div className="absolute top-0 right-0 h-2 w-28 bg-[#E17055]" />
              <div className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-6">
                PRODUCTION BENCHMARK
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#E17055] mb-1">
                    Equipment & Workflow
                  </h4>
                  <p className="text-sm font-medium text-white/90">
                    {page.specs?.equipment || 'Offset & Digital Production Systems'}
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#66A0AA] mb-1">
                    Color Modes & Resolution
                  </h4>
                  <p className="text-sm font-medium text-white/90">
                    {page.specs?.resolution || '2400 DPI Vector & Half-Tone Precision'}
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1">
                    Turnaround Timeline
                  </h4>
                  <p className="text-sm font-medium text-white/90">
                    {page.specs?.turnaround || '2–5 Business Days'}
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-1">
                    Minimum Order Quantity (MOQ)
                  </h4>
                  <p className="text-sm font-medium text-white/90">
                    {page.specs?.minimumOrder || 'Short Runs & Industrial Bulk Orders'}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href={`mailto:${BUSINESS_INFO.email}?subject=Quote Request: ${encodeURIComponent(page.heading)}`}
                  className="w-full inline-block bg-[#E17055] text-white text-center py-4 text-[10px] font-black uppercase tracking-[0.24em] hover:bg-white hover:text-black transition-colors"
                >
                  Email Design for Free Pre-Flight
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Substrates & Finishes */}
        {(page.materials || page.finishes) && (
          <section className="mb-20 sm:mb-28">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D545E] mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-[#2D545E]/40" /> Material & Finishing Options
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {page.materials && (
                <div className="bg-[#F8F7F4] border border-black/10 p-8 sm:p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2D545E] text-white flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-xl uppercase tracking-tight text-black">
                        Supported Substrates & Media
                      </h3>
                      <p className="text-xs text-black/50">Engineered for durability and print holdout</p>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {page.materials.map((mat) => (
                      <li key={mat} className="flex items-start gap-3 text-sm font-medium text-black/80">
                        <span className="w-2 h-2 rounded-full bg-[#E17055] mt-1.5 shrink-0" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {page.finishes && (
                <div className="bg-[#F8F7F4] border border-black/10 p-8 sm:p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E17055] text-white flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-xl uppercase tracking-tight text-black">
                        Tactile Embellishments & Coatings
                      </h3>
                      <p className="text-xs text-black/50">Luxury finishes for enhanced brand prestige</p>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {page.finishes.map((finish) => (
                      <li key={finish} className="flex items-start gap-3 text-sm font-medium text-black/80">
                        <span className="w-2 h-2 rounded-full bg-[#2D545E] mt-1.5 shrink-0" />
                        <span>{finish}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Typical Use Cases */}
        {page.useCases && (
          <section className="mb-20 sm:mb-28">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E17055] mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-[#E17055]/40" /> Common Industry Applications
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
              {page.useCases.map((useCase, index) => (
                <div key={useCase} className="bg-[#FDFCFB] p-8 flex flex-col justify-between min-h-[160px] group hover:bg-black hover:text-white transition-colors">
                  <span className="text-[10px] font-mono font-bold text-black/30 group-hover:text-white/40">
                    APP_{String(index + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-xl font-display font-black uppercase tracking-tight leading-snug">
                    {useCase}
                  </h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Operational Workflow */}
        {page.workflow && (
          <section className="mb-20 sm:mb-28 p-8 sm:p-12 md:p-16 bg-black text-white relative overflow-hidden">
            <div className="relative z-10 space-y-12">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#E17055] block mb-3">
                  PRODUCTION PROTOCOL
                </span>
                <h3 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase">
                  Manufacturing Process
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {page.workflow.map((item, index) => (
                  <div key={item.step} className="space-y-4">
                    <div className="w-12 h-12 bg-[#1E1E1E] border border-white/20 flex items-center justify-center font-display font-black text-lg text-[#E17055]">
                      0{index + 1}
                    </div>
                    <h5 className="text-xs uppercase tracking-wider font-black text-white">
                      {item.step}
                    </h5>
                    <p className="text-xs leading-relaxed text-white/60">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Frequently Asked Questions */}
        {page.faqs && (
          <section className="mb-20 sm:mb-28">
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-[#2D545E]/40" /> Technical & Ordering FAQ
            </div>

            <div className="divide-y divide-black/10 border-y border-black/10">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="py-8 grid md:grid-cols-[0.4fr_1fr] gap-6">
                  <h4 className="font-display font-black uppercase tracking-tight text-xl sm:text-2xl text-black">
                    {faq.question}
                  </h4>
                  <p className="text-base leading-relaxed text-black/70 font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action Bar */}
        <section className="bg-[#2D545E] text-white p-8 sm:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">
              Ready to Manufacture?
            </h3>
            <p className="text-sm text-white/80">
              Get an itemized quote with free pre-flight artwork checks and fast dispatch across Pakistan and internationally.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#products"
              className="bg-[#E17055] text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:bg-white hover:text-black transition-colors"
            >
              Request Quote
            </a>
            <a
              href="/contact"
              className="border border-white/40 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:border-white transition-colors"
            >
              Contact Studio
            </a>
          </div>
        </section>
      </div>
    </main>
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
            Company Background & Mission
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tight leading-[0.85] uppercase text-black mb-8 max-w-4xl">
            About Print Plaza.
          </h1>
          <p className="text-xl sm:text-2xl font-medium leading-relaxed text-black/70 max-w-3xl border-l-4 border-[#2D545E] pl-6">
            An advanced commercial print manufacturing studio based in Chakwal, Pakistan, dedicated to chromatic precision, material excellence, and industrial scale.
          </p>
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20 sm:mb-28 items-start">
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg leading-relaxed text-black/75 font-medium">
            <h2 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-black">
              Craftsmanship Meets Industrial Precision
            </h2>
            <p>
              Print Plaza was established to solve a fundamental challenge faced by modern brands: bridging the gap between delicate digital design and robust physical print production. Located on Main Talagang Road in Chakwal, our facility operates high-speed multi-color offset lithography presses, digital micro-toner production engines, and grand-format UV flatbed machines.
            </p>
            <p>
              We believe that packaging and printed collateral are the most tactile representations of brand quality. When a customer opens a custom mailer box, feels the velvet soft-touch coating of an executive business card, or inspects a sharp waterproof product label, their opinion of the brand is forged instantly.
            </p>
            <p>
              Our print engineers work directly with creative agencies, e-commerce brands, pharmaceutical companies, retailers, and corporate institutions to deliver consistent Pantone spot color accuracy, sharp micro-type down to 5 points, and structurally sound custom dielines.
            </p>
          </div>

          <div className="lg:col-span-5 bg-black text-white p-8 sm:p-10 space-y-6">
            <div className="text-[10px] font-mono font-bold text-[#E17055] uppercase tracking-widest">
              FACILITY HIGHLIGHTS
            </div>
            <div className="space-y-4 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E17055] shrink-0 mt-0.5" />
                <span>Multi-color sheetfed offset presses for large-scale runs</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E17055] shrink-0 mt-0.5" />
                <span>On-demand digital toner presses for same-day & short runs</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E17055] shrink-0 mt-0.5" />
                <span>Grand-format UV flatbeds for acrylic, forex & metal signage</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E17055] shrink-0 mt-0.5" />
                <span>Automated CNC shape routing, die-cutting & bindery</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#E17055] shrink-0 mt-0.5" />
                <span>Specialty embellishments: 3D Spot UV, hot foil & soft-touch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="mb-20 sm:mb-28">
          <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-8 flex items-center gap-4">
            <span className="w-8 h-px bg-[#2D545E]/40" /> Manufacturing Standards
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 border border-black/10">
            <div className="bg-[#FDFCFB] p-8 sm:p-10 space-y-4">
              <div className="w-12 h-12 bg-[#2D545E]/10 flex items-center justify-center text-[#2D545E]">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                Prepress Pre-Flight
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Every incoming PDF is inspected for vector bleed margins, 300 DPI resolution, font embedding, and ink limit overprint before plating.
              </p>
            </div>

            <div className="bg-[#FDFCFB] p-8 sm:p-10 space-y-4">
              <div className="w-12 h-12 bg-[#E17055]/10 flex items-center justify-center text-[#E17055]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                Color Uniformity
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Using calibrated spectrophotometers and true Pantone PMS ink mixes, we ensure color matches perfectly across repeat production orders.
              </p>
            </div>

            <div className="bg-[#FDFCFB] p-8 sm:p-10 space-y-4">
              <div className="w-12 h-12 bg-[#2D545E]/10 flex items-center justify-center text-[#2D545E]">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                Reliable Delivery
              </h3>
              <p className="text-sm text-black/70 leading-relaxed font-medium">
                Fast courier dispatch across Chakwal, Rawalpindi, Islamabad, Lahore, and all cities across Pakistan, plus international shipping.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Banner */}
        <section className="bg-black text-white p-8 sm:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">
              Work With Print Plaza
            </h3>
            <p className="text-sm text-white/80">
              Speak with our production desk or schedule a visit to our Chakwal facility.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/contact"
              className="bg-[#E17055] text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:bg-white hover:text-black transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/#products"
              className="border border-white/40 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:border-white transition-colors"
            >
              Browse Products
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export function ContactPage() {
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
              <a
                href="/#products"
                className="flex-1 bg-[#E17055] text-white py-4 px-6 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:bg-white hover:text-black transition-colors"
              >
                Browse Catalog & Quote
              </a>
              <a
                href={`https://wa.me/923125747610`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border border-white/40 text-white py-4 px-6 text-[10px] font-black uppercase tracking-[0.24em] text-center hover:border-white transition-colors"
              >
                WhatsApp Inquiry
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

  const sections = [
    {
      title: 'Information we collect',
      body: 'When you sign in with Google, Firebase Authentication may provide your name, email address, profile image, and a secure account identifier. When you request a quote or place an order, we store contact details, product requirements, uploaded files, order history, invoice records, payment status, and communication notes needed to complete the work.',
    },
    {
      title: 'How we use information',
      body: 'We use this information to manage quotation requests, prepare invoices, show client order history, track payments, communicate about production, improve the website, and keep your client area connected to the correct email address.',
    },
    {
      title: 'Google sign-in and Firebase',
      body: 'Print Plaza uses Google sign-in through Firebase Authentication. Google handles the sign-in process and provides authentication data to our website so you can access your client area securely.',
    },
    {
      title: 'Analytics',
      body: 'We use Google Analytics to understand website traffic, popular pages, and general visitor behavior. Analytics helps us improve the website and measure marketing performance.',
    },
    {
      title: 'Sharing information',
      body: 'We do not sell personal information. We may share necessary order details with trusted production, delivery, or technical service providers only when needed to complete printing, support the website, or maintain business records.',
    },
    {
      title: 'Your choices',
      body: 'You can contact Print Plaza to request help with account information, quote records, invoices, or order history connected to your email address. You can also sign out of the client area at any time.',
    },
    {
      title: 'Data security',
      body: 'We use reasonable technical and business safeguards to protect account, quote, and order data. No online system is perfect, but we work to keep access limited and records handled responsibly.',
    },
    {
      title: 'Updates',
      body: 'We may update this privacy policy as the website, client area, or business tools change. The latest version will be available on this page.',
    },
  ];

  return (
    <main className="bg-[#FDFCFB] text-black overflow-hidden">
      <section className="relative pt-36 sm:pt-44 pb-16 sm:pb-24 border-b border-black/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F6F5F2] hidden lg:block" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-[0.95fr_0.65fr] gap-12 lg:gap-20 items-end">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-7">
              Client Access / Google Login / Orders
            </div>
            <h1 className="font-display font-black uppercase tracking-tight text-[3.6rem] sm:text-[6.5rem] lg:text-[7.6rem] leading-[0.78] mb-10">
              Privacy Policy.
            </h1>
            <p className="text-lg sm:text-xl leading-[1.75] font-semibold text-black/65 max-w-3xl">
              This policy explains how Print Plaza handles information when visitors use the website, request quotations, sign in with Google, view client orders, and download invoices.
            </p>
          </div>
          <aside className="bg-black text-white p-8 sm:p-10 relative">
            <div className="absolute top-0 right-0 h-3 w-32 bg-[#E17055]" />
            <div className="flex gap-2 mb-10">
              <span className="h-3 w-8 bg-[#2D545E]" />
              <span className="h-3 w-8 bg-[#E17055]" />
              <span className="h-3 w-8 bg-white" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-white/42 mb-4">
              Effective date
            </div>
            <p className="font-display font-black uppercase tracking-tight text-4xl leading-none">
              August 27, 2026
            </p>
            <p className="mt-8 text-sm leading-7 font-semibold text-white/58">
              Written for Google sign-in, quote requests, client records, invoices, and website analytics.
            </p>
          </aside>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-[0.35fr_1fr] gap-12 lg:gap-16">
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#E17055] mb-6">
              Data Handling
            </div>
            <h2 className="font-display font-black uppercase tracking-tight text-4xl sm:text-5xl leading-none">
              Plain language, business first.
            </h2>
          </div>
          <div className="border-t border-black/10">
            {sections.map((section) => (
              <div key={section.title} className="grid md:grid-cols-[0.7fr_1.3fr] gap-8 border-b border-black/10 py-9">
                <h2 className="font-display font-black uppercase tracking-tight text-2xl sm:text-3xl leading-none">
                  {section.title}
                </h2>
                <p className="text-base leading-8 font-medium text-black/64">
                  {section.body}
                </p>
              </div>
            ))}
            <div className="mt-14 bg-[#F6F5F2] border border-black/10 p-8 sm:p-10">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E17055] mb-5">
                Contact
              </div>
              <p className="text-base leading-8 font-semibold text-black/65">
                For privacy questions, order data questions, or client account help, contact Print Plaza at{' '}
                <a href={`mailto:${BUSINESS_INFO.email}`} className="text-[#2D545E] underline">
                  {BUSINESS_INFO.email}
                </a>{' '}
                or phone{' '}
                <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[#2D545E] underline">
                  {BUSINESS_INFO.displayPhone}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
