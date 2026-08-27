/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const BUSINESS_INFO = {
  name: 'Print Plaza',
  legalName: 'Print Plaza Printing & Packaging',
  url: 'https://printplaza.net',
  logo: 'https://printplaza.net/brand/print-plaza-logo.png',
  phone: '+923125747610',
  displayPhone: '+92 312 5747610',
  email: 'sales@printplaza.net',
  address: {
    streetAddress: 'Main Talagang Road',
    addressLocality: 'Chakwal',
    addressRegion: 'Punjab',
    postalCode: '48800',
    addressCountry: 'PK',
  },
  formattedAddress: 'Main Talagang Road, Chakwal 48800, Punjab, Pakistan',
  openingHours: 'Mo-Sa 09:00-19:00',
};

const ALL_SEO_ROUTES = {
  '/': {
    metaTitle: 'Print Plaza | High Quality Printing, Packaging, Labels & Business Print Services',
    description: 'Print Plaza provides high quality printing services for custom packaging, product labels, brochures, flyers, business cards, posters, banners, signage, and branded print production.',
    canonical: 'https://printplaza.net/',
    h1: 'Print Plaza - High Quality Commercial Printing & Packaging',
    bodySummary: `
      <h2>Industrial Commercial Print Studio</h2>
      <p>Print Plaza provides custom packaging boxes, waterproof product labels, brochures, flyers, business cards, posters, banners, signage, offset lithography, digital printing, and branded print production.</p>
      <ul>
        <li><a href="/custom-packaging-printing">Custom Packaging Printing</a></li>
        <li><a href="/product-label-printing">Product Label Printing</a></li>
        <li><a href="/business-card-printing">Business Card Printing</a></li>
        <li><a href="/brochure-printing">Brochure Printing</a></li>
        <li><a href="/flyer-printing">Flyer Printing</a></li>
        <li><a href="/poster-printing">Poster Printing</a></li>
        <li><a href="/banner-printing">Banner Printing</a></li>
        <li><a href="/signage-printing">Signage Printing</a></li>
        <li><a href="/offset-printing">Offset Printing</a></li>
        <li><a href="/digital-printing">Digital Printing</a></li>
        <li><a href="/sticker-printing">Sticker Printing</a></li>
      </ul>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'PrintingService'],
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
      logo: BUSINESS_INFO.logo,
      image: BUSINESS_INFO.logo,
      telephone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      address: {
        '@type': 'PostalAddress',
        ...BUSINESS_INFO.address,
      },
    },
  },
  '/custom-packaging-printing': {
    metaTitle: 'Custom Packaging Printing & Custom Boxes | Print Plaza',
    description: 'Bespoke custom boxes, folding cartons, mailer boxes, and product sleeves. Engineered cardboard and kraft packaging with vibrant CMYK and Pantone offset printing.',
    canonical: 'https://printplaza.net/custom-packaging-printing',
    h1: 'Custom Packaging Printing & Custom Box Manufacturing',
    bodySummary: `
      <h2>Industrial Folding Cartons & Corrugated Packaging</h2>
      <p>Bespoke custom boxes, folding cartons, mailer boxes, and product sleeves engineered for retail shelf appeal and e-commerce protection. SBS bleached boards, natural kraft, and rigid gift boxes printed with Heidelberg offset lithography.</p>
      <h3>What It's For</h3>
      <p>Cosmetics, food & beverage packaging, electronics boxes, subscription mailers, luxury presentation sets, and apparel packaging.</p>
      <h3>Why Choose Print Plaza</h3>
      <p>Micron-accurate vector dielines, Pantone spot color reproduction, soft-touch velvet lamination, raised spot UV, foil stamping, and scalable batch sizes from 250 to 250,000+ units.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Custom Packaging Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/custom-packaging-printing',
    },
  },
  '/product-label-printing': {
    metaTitle: 'Custom Product Label Printing & Roll Labels | Print Plaza',
    description: 'Waterproof product labels and roll stickers for cosmetics, food, bottles, and packaging. High-adhesion BOPP, vinyl, foil stamping, and gloss or matte lamination.',
    canonical: 'https://printplaza.net/product-label-printing',
    h1: 'Custom Product Label Printing & Roll Stickers',
    bodySummary: `
      <h2>High-Adhesion Roll & Sheet Labels</h2>
      <p>Waterproof product labels engineered for glass, plastic, cans, and flexible pouches. Available on white, clear, and metallic BOPP polypropylene film with permanent freezer and pantry-grade adhesives.</p>
      <h3>What It's For</h3>
      <p>Cosmetic and essential oil bottles, food jars, beverages, cold-brew cans, squeeze bottles, candle jars, and shipping box seals.</p>
      <h3>Why Choose Print Plaza</h3>
      <p>1200 DPI high-definition printing, dispenser-ready roll cores (25mm, 40mm, 76mm), thermal UV laminations, cold foil embellishments, and scratch resistance.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Product Label Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/product-label-printing',
    },
  },
  '/business-card-printing': {
    metaTitle: 'Luxury Business Card Printing | Print Plaza',
    description: 'Premium business card printing with ultra-thick cardstock (350–700 gsm), soft-touch velvet lamination, raised spot UV, metallic foil, and custom die-cuts.',
    canonical: 'https://printplaza.net/business-card-printing',
    h1: 'Luxury Business Card Printing & Executive Stationery',
    bodySummary: `
      <h2>Heavyweight Artisan Business Cards</h2>
      <p>Make a lasting impression with ultra-thick 350gsm to 700gsm duplexed cardstocks. Features velvety soft-touch lamination, dimensional raised 3D spot UV gloss, hot metallic foil stamping, and colored edge gilding.</p>
      <h3>What It's For</h3>
      <p>Executive cards, corporate identity stationery, luxury boutique loyalty cards, VIP member passes, and appointment reminder cards.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Business Card Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/business-card-printing',
    },
  },
  '/brochure-printing': {
    metaTitle: 'Brochure Printing & Company Catalogs | Print Plaza',
    description: 'Bi-fold, tri-fold, multi-page booklet, and catalog printing on premium gloss and matte art paper. Vibrant color reproduction and crisp scoring.',
    canonical: 'https://printplaza.net/brochure-printing',
    h1: 'Corporate Brochure & Catalog Printing',
    bodySummary: `
      <h2>Bi-Fold, Tri-Fold & Multi-Page Catalogs</h2>
      <p>High-fidelity corporate brochures, sales pamphlets, product catalogs, and presentation folders. Printed on premium 130gsm to 300gsm gloss and silk art papers with anti-cracking mechanical scoring.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Brochure Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/brochure-printing',
    },
  },
  '/flyer-printing': {
    metaTitle: 'Bulk Flyer Printing & Promotional Leaflets | Print Plaza',
    description: 'Affordable, high-speed flyer printing for marketing campaigns, direct mail, and event promotions. Available in A5, A4, DL, and custom dimensions.',
    canonical: 'https://printplaza.net/flyer-printing',
    h1: 'Bulk Flyer & Promotional Leaflet Printing',
    bodySummary: `
      <h2>High-Volume Marketing Leaflets</h2>
      <p>Cost-effective single and double-sided promotional flyers in A6, A5, A4, and DL dimensions. Fast turnaround, vibrant full-color CMYK reproduction, and volume tier pricing.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Flyer Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/flyer-printing',
    },
  },
  '/poster-printing': {
    metaTitle: 'Large Format Poster Printing & Wall Art | Print Plaza',
    description: 'High-resolution photo and marketing poster printing in standard A3, A2, A1, A0, and custom sizes. Heavyweight satin, gloss, and museum-grade matte substrates.',
    canonical: 'https://printplaza.net/poster-printing',
    h1: 'Large Format Poster Printing & Fine Art Media',
    bodySummary: `
      <h2>Vibrant High-Resolution Display Posters</h2>
      <p>Photographic and marketing posters in standard A3, A2, A1, A0, and custom oversized dimensions. Printed with 12-color archival pigment inks on 200–230gsm photo satin and backlit film.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Poster Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/poster-printing',
    },
  },
  '/banner-printing': {
    metaTitle: 'Vinyl Banner Printing & Pull-Up Displays | Print Plaza',
    description: 'Weatherproof heavy-duty 510gsm vinyl banners, mesh outdoor banners, and retractable roll-up display stands with brass eyelets and reinforced hems.',
    canonical: 'https://printplaza.net/banner-printing',
    h1: 'Heavy-Duty Vinyl Banners & Roll-Up Display Stands',
    bodySummary: `
      <h2>Weatherproof Outdoor & Exhibition Banners</h2>
      <p>510gsm reinforced PVC vinyl banners, breathable windproof mesh banners, and aluminum retractable roll-up stands with high-frequency welded hems and brass eyelets.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Banner Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/banner-printing',
    },
  },
  '/signage-printing': {
    metaTitle: 'Rigid Signage & Direct UV Flatbed Printing | Print Plaza',
    description: 'Direct UV flatbed printing on rigid substrates: Acrylic, Aluminum Composite (Dibond), Foam PVC, and Correx boards for storefront and architectural signage.',
    canonical: 'https://printplaza.net/signage-printing',
    h1: 'Rigid Signage & Direct UV Flatbed Printing',
    bodySummary: `
      <h2>Storefront & Architectural Signage</h2>
      <p>Direct UV flatbed printing on 3mm Aluminum Composite Panels (Dibond), cast acrylic plaques, rigid Foam PVC (Foamex), and fluted Correx site boards with CNC shape routing.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Signage Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/signage-printing',
    },
  },
  '/offset-printing': {
    metaTitle: 'Commercial Offset Printing Services | Print Plaza',
    description: 'Industrial Heidelberg offset lithography for large volume print runs. Unrivaled unit economy, exact Pantone spot color matching, and consistent quality.',
    canonical: 'https://printplaza.net/offset-printing',
    h1: 'Commercial Offset Lithography Services',
    bodySummary: `
      <h2>High-Volume Offset Printing Press</h2>
      <p>Industrial Heidelberg offset presses for large production runs with exact Pantone PMS spot colors, crisp halftone screening, and unmatched unit economy for commercial packaging, books, and marketing collateral.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Commercial Offset Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/offset-printing',
    },
  },
  '/digital-printing': {
    metaTitle: 'On-Demand Digital Printing & Quick Turnaround | Print Plaza',
    description: 'Fast on-demand digital press printing for short runs, variable data printing, proofing, and tight turnaround deadlines without plate setup costs.',
    canonical: 'https://printplaza.net/digital-printing',
    h1: 'On-Demand Digital Printing Services',
    bodySummary: `
      <h2>Short-Run Fast-Turnaround Digital Press</h2>
      <p>Zero plate setup costs, rapid 24-48 hour turnaround, variable data personalization, and short-run production for cards, stickers, documents, and packaging mockups.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Digital Printing Services',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/digital-printing',
    },
  },
  '/sticker-printing': {
    metaTitle: 'Custom Sticker Printing & Die-Cut Decals | Print Plaza',
    description: 'Precision die-cut stickers, kiss-cut sheets, and durable vinyl decals. UV cured, weatherproof, scratch-resistant coatings for branding and packaging.',
    canonical: 'https://printplaza.net/sticker-printing',
    h1: 'Custom Die-Cut Sticker Printing & Vinyl Decals',
    bodySummary: `
      <h2>Custom Die-Cut Vinyl Stickers</h2>
      <p>Weatherproof vinyl decals, kiss-cut sticker sheets, holographic stickers, and packaging seal labels with glossy, matte, or transparent finishes.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Sticker Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/sticker-printing',
    },
  },
  '/about': {
    metaTitle: 'About Print Plaza | Commercial Print & Packaging Manufacturing Studio',
    description: 'Learn about Print Plaza, our industrial printing machinery, color management standards, sustainable substrates, and commitment to print excellence in Chakwal.',
    canonical: 'https://printplaza.net/about',
    h1: 'About Print Plaza - Commercial Print & Packaging Studio',
    bodySummary: `
      <h2>Our Story & Manufacturing Capabilities</h2>
      <p>Print Plaza is a high-grade commercial printing and custom packaging studio located on Main Talagang Road, Chakwal, Punjab. We combine German Heidelberg offset presses with wide-format digital UV technologies to deliver tactile, color-calibrated print products.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Print Plaza',
      url: 'https://printplaza.net/about',
    },
  },
  '/contact': {
    metaTitle: 'Contact Print Plaza | Request a Quote & Studio Location',
    description: 'Get in touch with Print Plaza for custom quotation requests, paper sample kits, artwork guidelines, or visit our printing studio on Main Talagang Road, Chakwal.',
    canonical: 'https://printplaza.net/contact',
    h1: 'Contact Print Plaza - Production Desk & Quotations',
    bodySummary: `
      <h2>Studio & Production Inquiries</h2>
      <p>Address: Main Talagang Road, Chakwal 48800, Punjab, Pakistan</p>
      <p>Phone / WhatsApp: +92 312 5747610</p>
      <p>Email: sales@printplaza.net</p>
      <p>Hours: Monday - Saturday: 9:00 AM - 7:00 PM</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Print Plaza',
      url: 'https://printplaza.net/contact',
    },
  },
  '/privacy-policy': {
    metaTitle: 'Privacy Policy | Print Plaza',
    description: 'Privacy policy and data protection standards for Print Plaza clients, customer accounts, artwork files, and order processing records.',
    canonical: 'https://printplaza.net/privacy-policy',
    h1: 'Print Plaza Privacy Policy',
    bodySummary: `
      <h2>Data Protection & Client File Confidentiality</h2>
      <p>Print Plaza guarantees strict client confidentiality for all uploaded artwork files, customer credentials, and project records.</p>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy',
      url: 'https://printplaza.net/privacy-policy',
    },
  },
};

function renderRouteHtml(templateHtml, routePath) {
  const normalizedPath = (routePath || '/').replace(/\/$/, '') || '/';
  const routeData = ALL_SEO_ROUTES[normalizedPath] || ALL_SEO_ROUTES['/'];

  let html = templateHtml;

  // 1. Replace <title>
  if (/<title>.*?<\/title>/i.test(html)) {
    html = html.replace(/<title>.*?<\/title>/i, `<title>${routeData.metaTitle}</title>`);
  }

  // 2. Replace <meta name="description">
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${routeData.description.replace(/"/g, '&quot;')}" />`
    );
  }

  // 3. Replace <link rel="canonical">
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${routeData.canonical}" />`
    );
  }

  // 4. Inject JSON-LD Schema
  const schemaHtml = `<script type="application/ld+json" id="plaza-ssr-schema">${JSON.stringify(routeData.schema)}</script>`;
  html = html.replace('</head>', `${schemaHtml}\n  </head>`);

  // 5. Inject Semantic pre-rendered body inside noscript for crawlers
  const noscriptHtml = `
    <noscript>
      <main style="max-width: 960px; margin: 40px auto; padding: 20px; font-family: sans-serif; line-height: 1.6; color: #111;">
        <h1>${routeData.h1}</h1>
        <p>${routeData.description}</p>
        <hr style="margin: 24px 0; border: 0; border-top: 1px solid #ddd;" />
        ${routeData.bodySummary}
        <hr style="margin: 24px 0; border: 0; border-top: 1px solid #ddd;" />
        <p><strong>Studio Address:</strong> ${BUSINESS_INFO.formattedAddress}</p>
        <p><strong>Phone:</strong> ${BUSINESS_INFO.displayPhone} | <strong>Email:</strong> ${BUSINESS_INFO.email}</p>
      </main>
    </noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${noscriptHtml}`);

  return html;
}

module.exports = {
  BUSINESS_INFO,
  ALL_SEO_ROUTES,
  renderRouteHtml,
};
