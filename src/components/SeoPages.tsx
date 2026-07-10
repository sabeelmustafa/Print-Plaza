/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';

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

  return (
    <main className="bg-[#FDFCFB] text-black">
      <section className="pt-36 sm:pt-44 pb-20 sm:pb-28 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-end">
          <div>
            <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-7">
              <span className="h-1 w-12 bg-[#E17055]" />
              {page.eyebrow}
            </div>
            <h1 className="font-display font-black uppercase tracking-tight text-[3.3rem] sm:text-[5.8rem] lg:text-[7rem] leading-[0.82] max-w-5xl">
              {page.title}.
            </h1>
          </div>
          <div className="lg:pb-3">
            <p className="text-lg sm:text-xl leading-[1.75] font-semibold text-black/68 max-w-xl">{page.intro}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="/#products" className="bg-black text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-center hover:bg-[#2D545E] transition-colors">Request Quote</a>
              <a href="/" className="border border-black/20 px-8 py-5 text-[10px] font-black uppercase tracking-[0.28em] text-center hover:border-black transition-colors">Back Home</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
          <div className="bg-[#F6F5F2] p-8 sm:p-10">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E17055] mb-6">Production</div>
            <h2 className="font-display font-black uppercase tracking-tight text-4xl leading-none">What we make</h2>
          </div>
          {page.highlights.map((item) => (
            <div key={item} className="bg-white p-8 sm:p-10 min-h-[170px] flex items-end">
              <p className="font-black uppercase tracking-tight text-2xl leading-[1.02]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-20">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-6">Use Cases</div>
            <h2 className="font-display font-black uppercase tracking-tight text-4xl sm:text-5xl leading-none">Built for brand output.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {page.uses.map((item) => (
              <div key={item} className="border border-black/10 bg-[#F6F5F2] p-6 text-sm font-black uppercase tracking-[0.16em]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="border-t border-black/10">
            {page.faq.map((item) => (
              <div key={item.question} className="grid md:grid-cols-[0.85fr_1.15fr] gap-6 border-b border-black/10 py-8">
                <h3 className="font-display font-black uppercase tracking-tight text-2xl leading-none">{item.question}</h3>
                <p className="text-base leading-8 font-medium text-black/62">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
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
    <main className="bg-[#FDFCFB] text-black">
      <section className="pt-36 sm:pt-44 pb-16 sm:pb-24 border-b border-black/10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-[10px] font-black uppercase tracking-[0.34em] text-[#2D545E] mb-7">Client Access / Google Login / Orders</div>
          <h1 className="font-display font-black uppercase tracking-tight text-[3.6rem] sm:text-[6.2rem] leading-[0.84] mb-10">Privacy Policy.</h1>
          <p className="text-lg sm:text-xl leading-[1.75] font-semibold text-black/65 max-w-3xl">
            This policy explains how Print Plaza handles information when visitors use the website, request quotations, sign in with Google, view client orders, and download invoices.
          </p>
          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.28em] text-black/35">Effective date: July 10, 2026</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="border-t border-black/10">
            {sections.map((section) => (
              <div key={section.title} className="grid md:grid-cols-[0.7fr_1.3fr] gap-8 border-b border-black/10 py-9">
                <h2 className="font-display font-black uppercase tracking-tight text-2xl sm:text-3xl leading-none">{section.title}</h2>
                <p className="text-base leading-8 font-medium text-black/64">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 bg-black text-white p-8 sm:p-10">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E17055] mb-5">Contact</div>
            <p className="text-base leading-8 font-semibold text-white/75">
              For privacy questions, order data questions, or client account help, contact Print Plaza using the email, phone, or address shown on this website.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
