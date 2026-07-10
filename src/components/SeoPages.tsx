/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArrowLeft, ChevronRight, Clock, FileCheck2, Layers, Settings, ShieldCheck } from 'lucide-react';

export interface ServiceSeoPage {
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  highlights: string[];
  uses: string[];
  faq: Array<{ question: string; answer: string }>;
}

export const SERVICE_PAGES: ServiceSeoPage[] = [
  {
    path: '/custom-packaging-printing',
    title: 'Custom Packaging Printing',
    metaTitle: 'Custom Packaging Printing | Print Plaza',
    description: 'Custom packaging printing for boxes, cartons, sleeves, inserts, and retail packaging with premium finishes and reliable production support.',
    eyebrow: 'Packaging / Boxes / Retail',
    intro: 'Print Plaza produces custom packaging for brands that need packaging to feel sharp, durable, and ready for sale. We help with printed boxes, sleeves, inserts, cartons, and short-run or bulk packaging requirements.',
    highlights: ['Custom product boxes', 'Retail cartons and sleeves', 'Matte, gloss, soft-touch, and spot UV options', 'Packaging for ecommerce, cosmetics, food, apparel, and gifts'],
    uses: ['Retail packaging', 'Ecommerce shipping inserts', 'Product launch boxes', 'Gift packaging', 'Brand presentation kits'],
    faq: [
      { question: 'Can Print Plaza make custom box sizes?', answer: 'Yes. We can prepare custom packaging dimensions based on your product, quantity, and finishing needs.' },
      { question: 'Can I request a quote before production starts?', answer: 'Yes. Quote requests are reviewed first, then production starts only after the quotation and order details are approved.' },
    ],
  },
  {
    path: '/product-label-printing',
    title: 'Product Label Printing',
    metaTitle: 'Product Label Printing | Print Plaza',
    description: 'High quality product label printing for bottles, jars, boxes, bags, cosmetics, food packaging, and retail products.',
    eyebrow: 'Labels / Stickers / Branding',
    intro: 'Product labels carry the first impression of your brand. Print Plaza prints clean, durable labels for bottles, jars, boxes, pouches, cosmetics, food products, and retail packaging.',
    highlights: ['Bottle and jar labels', 'Waterproof and durable label options', 'Matte and gloss finishing', 'Custom shapes and sizes'],
    uses: ['Cosmetic labels', 'Food labels', 'Bottle labels', 'Jar labels', 'Retail product labels'],
    faq: [
      { question: 'Can labels be made in custom shapes?', answer: 'Yes. Labels can be produced in custom dimensions and shapes depending on the material and finishing selected.' },
      { question: 'Do you print waterproof labels?', answer: 'Water-resistant and durable label options can be quoted for products that need extra handling strength.' },
    ],
  },
  {
    path: '/business-card-printing',
    title: 'Business Card Printing',
    metaTitle: 'Business Card Printing | Print Plaza',
    description: 'Premium business card printing with clean typography, strong paper stocks, and professional finishing options.',
    eyebrow: 'Cards / Identity / Sales',
    intro: 'A business card should feel intentional the moment it is handed over. Print Plaza prints professional business cards with crisp detail, premium stocks, and finish options for a polished brand impression.',
    highlights: ['Standard and premium cards', 'Thick card stock options', 'Matte, gloss, and soft-touch finish', 'Cards for teams, agencies, shops, and personal brands'],
    uses: ['Business cards', 'Appointment cards', 'Loyalty cards', 'Thank you cards', 'Brand cards'],
    faq: [
      { question: 'Can I print cards for my whole team?', answer: 'Yes. You can request multiple names, roles, phone numbers, or designs in one quote request.' },
      { question: 'Can you print double-sided business cards?', answer: 'Yes. Single-sided and double-sided business card printing can be quoted.' },
    ],
  },
  {
    path: '/brochure-printing',
    title: 'Brochure Printing',
    metaTitle: 'Brochure Printing | Print Plaza',
    description: 'Brochure printing for company profiles, menus, catalogs, flyers, and promotional handouts with professional print finishing.',
    eyebrow: 'Brochures / Catalogs / Profiles',
    intro: 'Print Plaza prints brochures for brands that need clear information, strong color, and a professional finish. Use brochures for company profiles, product catalogs, menus, and campaign material.',
    highlights: ['Bi-fold and tri-fold brochures', 'Company profiles and catalogs', 'Menu and product guide printing', 'Sharp color and clean folding'],
    uses: ['Company brochures', 'Restaurant menus', 'Product catalogs', 'Event handouts', 'Sales presentations'],
    faq: [
      { question: 'Can brochures be folded?', answer: 'Yes. Folding options can be quoted based on size, stock, and layout.' },
      { question: 'Can I request brochure design and printing together?', answer: 'You can include design requirements in the quote request so the team can review the full scope.' },
    ],
  },
  {
    path: '/flyer-printing',
    title: 'Flyer Printing',
    metaTitle: 'Flyer Printing | Print Plaza',
    description: 'Flyer printing for promotions, events, product launches, menus, and local marketing campaigns.',
    eyebrow: 'Flyers / Promotions / Events',
    intro: 'Flyers are built for fast attention. Print Plaza prints promotional flyers for launches, campaigns, events, offers, menus, and local marketing with clean production quality.',
    highlights: ['Single-sided and double-sided flyers', 'Multiple sizes and paper options', 'Event and campaign printing', 'Small batch and bulk order support'],
    uses: ['Promotional flyers', 'Event flyers', 'Offer sheets', 'Menu flyers', 'Local campaign handouts'],
    faq: [
      { question: 'Can I print flyers in bulk?', answer: 'Yes. Bulk flyer quantities can be quoted with the best production method for your timeline.' },
      { question: 'Can flyers be printed double-sided?', answer: 'Yes. Double-sided flyer printing is available depending on your artwork and paper selection.' },
    ],
  },
  {
    path: '/poster-printing',
    title: 'Poster Printing',
    metaTitle: 'Poster Printing | Print Plaza',
    description: 'Poster printing for events, shops, campaigns, product displays, wall graphics, and high impact promotional visuals.',
    eyebrow: 'Posters / Large Visuals / Display',
    intro: 'Print Plaza creates posters for promotional campaigns, retail displays, events, and interiors. Posters can be produced for clean color, readable type, and strong visual impact.',
    highlights: ['Event and promotional posters', 'Retail display posters', 'Multiple poster sizes', 'High resolution color output'],
    uses: ['Event posters', 'Shop posters', 'Campaign posters', 'Wall display prints', 'Product posters'],
    faq: [
      { question: 'Can you print large posters?', answer: 'Yes. Large format poster sizes can be quoted based on your artwork and material requirements.' },
      { question: 'Can posters be used indoors and outdoors?', answer: 'Indoor and outdoor use should be mentioned in the quote request so the right material can be recommended.' },
    ],
  },
  {
    path: '/banner-printing',
    title: 'Banner Printing',
    metaTitle: 'Banner Printing | Print Plaza',
    description: 'Banner printing for events, shops, promotions, exhibitions, signage, and large format advertising.',
    eyebrow: 'Banners / Signage / Large Format',
    intro: 'Print Plaza supports banner printing for shops, exhibitions, events, promotions, and large format advertising. We focus on readable layouts, durable material choices, and production clarity.',
    highlights: ['Indoor and outdoor banners', 'Event and exhibition signage', 'Shopfront promotional banners', 'Large format print production'],
    uses: ['Event banners', 'Exhibition banners', 'Shop banners', 'Sale banners', 'Outdoor promotions'],
    faq: [
      { question: 'Can banners be made for outdoor use?', answer: 'Yes. Outdoor use can be quoted with suitable material and finishing options.' },
      { question: 'Can I choose custom banner sizes?', answer: 'Yes. Custom banner sizes can be requested with width, height, quantity, and installation needs.' },
    ],
  },
  {
    path: '/sticker-printing',
    title: 'Sticker Printing',
    metaTitle: 'Sticker Printing | Print Plaza',
    description: 'Custom sticker printing for packaging, branding, promotions, product seals, and labels in different shapes and finishes.',
    eyebrow: 'Stickers / Labels / Seals',
    intro: 'Custom stickers are useful for packaging, promotions, sealing, branding, and product presentation. Print Plaza prints stickers in different shapes, materials, and finish options.',
    highlights: ['Custom shape stickers', 'Packaging seals', 'Brand stickers and decals', 'Matte and gloss sticker finishes'],
    uses: ['Packaging stickers', 'Brand decals', 'Product seals', 'Promotional stickers', 'Retail stickers'],
    faq: [
      { question: 'Can stickers be cut into custom shapes?', answer: 'Yes. Custom die-cut or shape-based sticker options can be quoted.' },
      { question: 'Are stickers different from labels?', answer: 'They can overlap, but stickers are often used for promotion or sealing while labels usually carry product information. We can quote either format.' },
    ],
  },
];

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function useSeo(title: string, description: string, path: string, jsonLd?: Record<string, unknown>) {
  useEffect(() => {
    const canonical = `https://printplaza.net${path}`;
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
          <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-5">Printing Services</div>
          <h2 className="font-display font-black uppercase tracking-tight text-4xl sm:text-6xl leading-[0.9]">
            Service guides for serious print production.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
          {SERVICE_PAGES.map((page) => (
            <a key={page.path} href={page.path} className="group bg-[#FDFCFB] p-7 min-h-[190px] flex flex-col justify-between hover:bg-black hover:text-white transition-colors">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.28em] text-[#E17055] mb-5">{page.eyebrow}</div>
                <h3 className="font-display font-black uppercase tracking-tight text-2xl leading-[0.95]">{page.title}</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-black/35 group-hover:text-white/60">Read Service Page</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function getServiceSpecs(page: ServiceSeoPage) {
  const materialMap: Record<string, string[]> = {
    '/custom-packaging-printing': ['Cardboard stocks', 'Kraft and art card', 'Corrugated options'],
    '/product-label-printing': ['Paper labels', 'Synthetic label stock', 'Water-resistant options'],
    '/business-card-printing': ['Premium card stock', 'Textured paper', 'Matte and gloss stocks'],
    '/brochure-printing': ['Silk paper', 'Gloss art paper', 'Uncoated paper'],
    '/flyer-printing': ['Economy paper', 'Premium art paper', 'Gloss or matte finish'],
    '/poster-printing': ['Poster paper', 'Photo paper', 'Indoor display stock'],
    '/banner-printing': ['Flex banner', 'Vinyl media', 'Indoor and outdoor stock'],
    '/sticker-printing': ['Sticker vinyl', 'Paper sticker stock', 'Custom cut media'],
  };

  return {
    equipment: 'Digital, offset, and large format production workflow',
    resolution: 'Artwork reviewed for sharp output, clean color, and print-safe sizing',
    materials: materialMap[page.path] || ['Premium paper', 'Specialty media', 'Custom substrates'],
    workflow: ['Quote review', 'Artwork check', 'Material selection', 'Print production', 'Finish and dispatch'],
    capabilities: page.highlights.slice(0, 4),
  };
}

function splitServiceTitle(title: string) {
  const parts = title.split(' ');
  return {
    lead: parts[0],
    rest: parts.slice(1).join(' ') || 'Production',
  };
}

export function ServicePage({ page }: { page: ServiceSeoPage }) {
  useSeo(page.metaTitle, page.description, page.path, {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.description,
    provider: {
      '@type': 'Organization',
      name: 'Print Plaza',
      url: 'https://printplaza.net/',
    },
    areaServed: 'Worldwide',
    serviceType: page.title,
    url: `https://printplaza.net${page.path}`,
  });

  const specs = getServiceSpecs(page);
  const titleParts = splitServiceTitle(page.title);

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-24 pb-24 sm:pb-32 text-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 flex z-40">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-12 sm:mb-20 flex flex-wrap items-center justify-between gap-6 border-b border-black/5 pb-8">
          <a
            href="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-black/50 hover:text-white transition-all group py-3 px-6 bg-black/5 hover:bg-black"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            Back to Home
          </a>

          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/30">
            <span>PRINT PLAZA</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#2D545E]">SERVICES</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-black uppercase">{page.title}</span>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-20 sm:mb-32 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-4">
              <span className="h-[2px] w-12 bg-[#2D545E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D545E] font-mono">
                PRODUCTION UNIT // {page.path.replace(/\//g, '').slice(0, 14).toUpperCase()}
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tight leading-[0.85] uppercase text-black">
              {titleParts.lead} <br />
              <span className="text-black/10 italic font-serif lowercase">{titleParts.rest}</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium leading-relaxed text-black/60 font-sans max-w-2xl border-l-4 border-[#2D545E]/20 pl-6">
              {page.intro}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {specs.capabilities.map((capability) => (
                <span key={capability} className="text-[9px] font-mono font-bold bg-[#EBEAE8] border border-black/10 text-black/70 py-2.5 px-5 uppercase tracking-widest">
                  {capability}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <a href="/#products" className="bg-black text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-center hover:bg-[#2D545E] transition-colors">
                Request Quote
              </a>
              <a href="#service-products" className="border border-black/20 px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-center hover:border-black transition-colors">
                View Output
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full group">
            <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-neutral-900 border-2 border-black/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden relative">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#111_0%,#1f2930_42%,#121212_100%)]" />
              <div className="absolute inset-0 opacity-55 bg-[radial-gradient(circle_at_24%_20%,#2D545E_0,transparent_30%),radial-gradient(circle_at_76%_80%,#E17055_0,transparent_26%)]" />
              <div className="absolute inset-x-0 h-[1px] bg-white/10 top-1/3 pointer-events-none" />
              <div className="absolute inset-x-0 h-[1px] bg-white/10 top-2/3 pointer-events-none" />
              <div className="absolute inset-y-0 w-[1px] bg-white/10 left-1/3 pointer-events-none" />
              <div className="absolute inset-y-0 w-[1px] bg-white/10 left-2/3 pointer-events-none" />

              <div className="absolute left-8 right-8 bottom-8 top-8 border border-white/15 p-6 flex flex-col justify-between bg-white/[0.03] backdrop-blur-[1px]">
                <div className="flex gap-2">
                  <span className="h-2 w-9 bg-[#2D545E]" />
                  <span className="h-2 w-9 bg-[#E17055]" />
                  <span className="h-2 w-9 bg-white" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-black uppercase tracking-[0.42em] text-white/35 mb-5">Print Service</div>
                  <div className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight leading-[0.86] text-white">
                    {titleParts.lead}<br />{titleParts.rest}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-[#E17055] text-white text-[10px] font-black px-6 py-4 uppercase tracking-[0.2em] shadow-xl rotate-3">
              QUOTE_READY // PP
            </div>
          </div>
        </section>

        <section className="mb-24 sm:mb-36">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E17055] mb-12 flex items-center gap-4">
            <div className="w-8 h-px bg-[#E17055]/30" /> Service Specifications
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 border border-black/10">
            <div className="bg-[#FDFCFB] p-8 md:p-10 space-y-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2D545E]/10 mb-6">
                <Settings className="w-5 h-5 text-[#2D545E]" />
              </div>
              <h4 className="text-xs uppercase tracking-widest font-black text-black/40">Production Setup</h4>
              <p className="text-lg font-display font-black text-black uppercase leading-tight">{specs.equipment}</p>
            </div>

            <div className="bg-[#FDFCFB] p-8 md:p-10 space-y-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2D545E]/10 mb-6">
                <FileCheck2 className="w-5 h-5 text-[#2D545E]" />
              </div>
              <h4 className="text-xs uppercase tracking-widest font-black text-black/40">Artwork Check</h4>
              <p className="text-lg font-display font-black text-black uppercase leading-tight">{specs.resolution}</p>
            </div>

            <div className="bg-[#FDFCFB] p-8 md:p-10 space-y-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2D545E]/10 mb-6">
                <Layers className="w-5 h-5 text-[#2D545E]" />
              </div>
              <h4 className="text-xs uppercase tracking-widest font-black text-black/40">Supported Materials</h4>
              <div className="space-y-2">
                {specs.materials.map((material) => (
                  <div key={material} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#E17055]" />
                    <span className="text-xs font-mono font-bold text-black/75 uppercase">{material}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24 sm:mb-36 p-8 sm:p-12 md:p-16 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grainy opacity-[0.05] pointer-events-none mix-blend-overlay" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#E17055] block mb-4">Production Timeline</span>
                <h3 className="text-3xl sm:text-4xl font-display font-black tracking-tight uppercase">Operational Workflow</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                QUOTE REVIEW BEFORE PRODUCTION
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
              <div className="hidden lg:block absolute top-[28px] left-[40px] right-[40px] h-[1px] bg-white/10" />

              {specs.workflow.map((step, index) => (
                <div key={step} className="relative space-y-4 group">
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-6">
                    <div className="w-14 h-14 bg-[#1C1C1C] border border-white/15 flex items-center justify-center font-display font-black text-lg text-white group-hover:border-[#E17055] group-hover:text-[#E17055] transition-all z-10 shrink-0">
                      0{index + 1}
                    </div>
                    <div className="h-[1px] bg-white/15 flex-1 lg:hidden" />
                  </div>
                  <div className="pt-2">
                    <h5 className="text-[11px] uppercase tracking-[0.2em] font-black text-white mb-2">{step}</h5>
                    <p className="text-[10px] font-medium leading-relaxed text-white/40">Reviewed by the Print Plaza production desk before moving to the next stage.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="service-products" className="mb-24 sm:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-8">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D545E] mb-6 flex items-center gap-4">
                <div className="w-8 h-px bg-[#2D545E]/30" /> Ready Specs
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase">
                Product Lineup
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-black/50 max-w-sm font-sans">
              Choose from common production outputs, then request a custom quote with quantity, material, and finishing details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
            {[...page.highlights, ...page.uses].slice(0, 6).map((item, index) => (
              <div key={item} className="bg-[#FDFCFB] min-h-[260px] p-8 flex flex-col justify-between group hover:bg-[#F6F5F2] transition-colors">
                <div className="flex justify-between items-start gap-6">
                  <span className="text-[10px] font-mono font-black text-black/25">ITEM_{String(index + 1).padStart(2, '0')}</span>
                  <Clock className="w-4 h-4 text-[#E17055]" />
                </div>
                <div>
                  <h3 className="text-3xl font-display font-black uppercase tracking-tight leading-[0.9] mb-5">{item}</h3>
                  <p className="text-sm leading-7 font-medium text-black/52">Available as a custom quote with production details reviewed before final approval.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-[0.72fr_1.28fr] gap-px bg-black/10 border border-black/10">
          <div className="bg-black text-white p-8 sm:p-12">
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#E17055] mb-7">Questions</div>
            <h2 className="font-display font-black uppercase tracking-tight text-4xl sm:text-6xl leading-[0.86]">Before you print.</h2>
            <a href="/#products" className="mt-10 inline-flex bg-white text-black px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] hover:bg-[#E17055] hover:text-white transition-colors">
              Request Quote
            </a>
          </div>
          <div className="bg-[#FDFCFB] divide-y divide-black/10">
            {page.faq.map((item) => (
              <div key={item.question} className="p-8 sm:p-10">
                <h3 className="font-display font-black uppercase tracking-tight text-2xl leading-none mb-4">{item.question}</h3>
                <p className="text-base leading-8 font-medium text-black/62">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export function PrivacyPolicyPage() {
  useSeo(
    'Privacy Policy | Print Plaza',
    'Read the Print Plaza privacy policy for Google sign-in, quote requests, client orders, invoices, analytics, and account information.',
    '/privacy-policy',
    {
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      name: 'Print Plaza Privacy Policy',
      url: 'https://printplaza.net/privacy-policy',
      publisher: {
        '@type': 'Organization',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
      },
    }
  );

  const sections = [
    {
      title: 'Information we collect',
      body: 'When you sign in with Google, Firebase Authentication may provide your name, email address, profile image, and a secure account identifier. When you request a quote or place an order, we may store contact details, product requirements, uploaded files, order history, invoice records, payment status, and communication notes needed to complete the work.',
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
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-7">Client Access / Google Login / Orders</div>
            <h1 className="font-display font-black uppercase tracking-tight text-[3.6rem] sm:text-[6.5rem] lg:text-[7.6rem] leading-[0.78] mb-10">Privacy Policy.</h1>
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
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-white/42 mb-4">Effective date</div>
            <p className="font-display font-black uppercase tracking-tight text-4xl leading-none">July 10, 2026</p>
            <p className="mt-8 text-sm leading-7 font-semibold text-white/58">Written for Google sign-in, quote requests, client records, invoices, and website analytics.</p>
          </aside>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-[0.35fr_1fr] gap-12 lg:gap-16">
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#E17055] mb-6">Data Handling</div>
            <h2 className="font-display font-black uppercase tracking-tight text-4xl sm:text-5xl leading-none">Plain language, business first.</h2>
          </div>
          <div className="border-t border-black/10">
            {sections.map((section) => (
              <div key={section.title} className="grid md:grid-cols-[0.7fr_1.3fr] gap-8 border-b border-black/10 py-9">
                <h2 className="font-display font-black uppercase tracking-tight text-2xl sm:text-3xl leading-none">{section.title}</h2>
                <p className="text-base leading-8 font-medium text-black/64">{section.body}</p>
              </div>
            ))}
            <div className="mt-14 bg-[#F6F5F2] border border-black/10 p-8 sm:p-10">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E17055] mb-5">Contact</div>
              <p className="text-base leading-8 font-semibold text-black/65">
                For privacy questions, order data questions, or client account help, contact Print Plaza using the email, phone, or address shown on this website.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
