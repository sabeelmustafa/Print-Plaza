/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServicePageData {
  path: string;
  metaTitle: string;
  description: string;
  canonicalUrl: string;
  heading: string;
  subheading: string;
  serviceCategory: string;
  badge: string;
  heroImage: string;
  whatItsFor: {
    title: string;
    description: string;
    points: string[];
  };
  whyPrintPlaza: {
    title: string;
    description: string;
    features: { title: string; desc: string }[];
  };
  materialsAndFinishing: {
    materials: string[];
    finishing: string[];
    technicalSpecs: { label: string; value: string }[];
  };
  useCases: string[];
  faqs: { question: string; answer: string }[];
  schema: Record<string, any>;
}

export const BUSINESS_INFO = {
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

export const ALL_SEO_ROUTES: Record<string, { metaTitle: string; description: string; canonical: string; schema: any }> = {
  '/': {
    metaTitle: 'Print Plaza | High Quality Printing, Packaging, Labels & Business Print Services',
    description: 'Print Plaza provides high quality printing services for custom packaging, product labels, brochures, flyers, business cards, posters, banners, signage, and branded print production.',
    canonical: 'https://printplaza.net/',
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
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy',
      url: 'https://printplaza.net/privacy-policy',
    },
  },
};

export const SERVICE_PAGES_DATA: ServicePageData[] = [
  {
    path: '/custom-packaging-printing',
    metaTitle: 'Custom Packaging Printing & Custom Boxes | Print Plaza',
    description: 'Bespoke custom boxes, folding cartons, mailer boxes, and product sleeves. Engineered cardboard and kraft packaging with vibrant CMYK and Pantone offset printing.',
    canonicalUrl: 'https://printplaza.net/custom-packaging-printing',
    heading: 'Custom Packaging Printing',
    subheading: 'Industrial-grade folding cartons, corrugated mailers, and custom retail packaging engineered for maximum shelf impact and product protection.',
    serviceCategory: 'Packaging & Cartons',
    badge: 'DEPARTMENT_01 // PACKAGING',
    heroImage: 'https://images.unsplash.com/photo-1542319630-55fb7f7c944a?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'Engineered For Modern Brands & Retail Shelves',
      description: 'Custom packaging is the most critical touchpoint between your product and your customer. Print Plaza manufactures bespoke folding cartons, rigid luxury gift boxes, corrugated shipping mailers, and paperboard sleeves tailored precisely to your product dimensions.',
      points: [
        'Cosmetic & Skincare Boxes: High-density SBS paperboards with soft-touch coating and internal partitions.',
        'E-Commerce Corrugated Mailers: Robust E-flute and B-flute cardboard with double adhesive tamper-evident tear strips.',
        'Food & Beverage Packaging: FDA-compliant food-grade barrier boards resistant to oils and moisture.',
        'Pharmaceutical & Supplement Cartons: Precise dieline tolerances with Braille embossing and serial batch coding.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Custom Boxes',
      description: 'We combine structural engineering expertise with precision Heidelberg offset lithography. Every dieline is verified for structural integrity, easy assembly, and tight locking tabs before volume production begins.',
      features: [
        { title: 'Zero Structural Guesswork', desc: 'Complimentary digital 3D dieline proofs and physical unprinted structural prototypes.' },
        { title: 'Pantone Color Accuracy', desc: 'Closed-loop spectrophotometer calibration guarantees exact brand color matching across multiple runs.' },
        { title: 'Premium Embellishments', desc: 'In-house hot foil stamping, selective raised spot UV, embossing, debossing, and matte/gloss lamination.' },
        { title: 'Scalable Batch Sizes', desc: 'Flexible minimum order quantities from 250 prototype units to 250,000+ commercial production batches.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['SBS Bleached Board (250–450 gsm)', 'Natural Unbleached Kraft Board', 'E-Flute / B-Flute Corrugated Cardboard', 'Rigid Greyboard (1.5mm–3.0mm) for Luxury Boxes', 'Metallized Silver/Gold Polyboard'],
      finishing: ['Soft-Touch Velvet Matte Lamination', 'High-Gloss UV Protective Coating', 'Precision Foil Stamping (Gold, Silver, Copper, Holographic)', 'Selective Raised 3D Spot UV', 'Multi-Level Embossing / Debossing', 'Custom Window Die-Cutting with Clear PET'],
      technicalSpecs: [
        { label: 'Minimum Order Quantity', value: '250 Units' },
        { label: 'Standard Production Lead Time', value: '7 to 10 Business Days' },
        { label: 'Color Reproduction', value: 'CMYK + Up to 4 Pantone Spot Colors (PMS)' },
        { label: 'Dieline Delivery', value: 'Supplied in Adobe Illustrator (.AI), PDF, DXF' },
        { label: 'Sample Turnaround', value: '3 Business Days for Physical Mockup' },
      ],
    },
    useCases: [
      'Retail shelf packaging for consumer electronics, perfumes, apparel, and hardware.',
      'Subscription e-commerce unboxing experiences with vibrant dual-side interior printing.',
      'Promotional corporate gift hampers and luxury presentation box sets.',
      'Food-grade takeaway boxes, bakery cartons, and sleeve wrap bands.',
    ],
    faqs: [
      { question: 'Can I get a custom dieline for my product dimensions?', answer: 'Yes. Our structural packaging team creates custom vector dielines matching your product height, width, and depth free of charge upon quote approval.' },
      { question: 'Do you offer foil stamping and spot UV on packaging?', answer: 'Yes, we specialize in high-end tactile finishes including metallic hot foil, raised spot UV gloss, soft-touch velvet coating, and multi-level embossing.' },
      { question: 'What is the standard turnaround time for custom boxes?', answer: 'Production generally takes 7-10 business days following proof approval. Expedited rush production is available upon request.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Custom Packaging Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/custom-packaging-printing',
    },
  },
  {
    path: '/product-label-printing',
    metaTitle: 'Custom Product Label Printing & Roll Labels | Print Plaza',
    description: 'Waterproof product labels and roll stickers for cosmetics, food, bottles, and packaging. High-adhesion BOPP, vinyl, foil stamping, and gloss or matte lamination.',
    canonicalUrl: 'https://printplaza.net/product-label-printing',
    heading: 'Product Label Printing',
    subheading: 'High-adhesion roll labels, sheet stickers, and waterproof packaging labels engineered for automatic dispensers and hand application.',
    serviceCategory: 'Labels & Stickers',
    badge: 'DEPARTMENT_02 // LABELS',
    heroImage: 'https://images.unsplash.com/photo-1626015270271-e73792040f7b?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'Engineered For Glass, Plastic, Cans & Pouches',
      description: 'Product labels must withstand refrigeration, moisture, oils, and physical abrasion while projecting luxury brand appeal. Print Plaza supplies roll and sheet labels printed with waterproof UV inks on premium synthetic and textured paper stocks.',
      points: [
        'Cosmetic & Essential Oil Labels: Oil-resistant white and clear BOPP with matte lamination.',
        'Beverage & Bottle Labels: Wet-strength wine paper and waterproof vinyl for chilled glass and aluminum cans.',
        'Food & Jar Labels: Food-safe permanent acrylic adhesives for freezer and pantry conditions.',
        'Barcode & Variable Data Labels: Crisp vector printing for QR codes, EAN-13 barcodes, and serial batch numbers.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Product Labels',
      description: 'Whether you need 500 labels for artisan test batches or 100,000 labels wound on 76mm cores for automatic high-speed bottling lines, we deliver micron-accurate die-cutting and clean matrix stripping.',
      features: [
        { title: 'Dispenser Ready Rolls', desc: 'Custom core sizes (25mm, 40mm, 76mm) and selectable unwind directions (top-off, bottom-off).' },
        { title: 'Water & Chemical Resistant', desc: 'BOPP and vinyl substrates protected with thermal UV laminations that never smudge or peel.' },
        { title: 'Foil & Tactile Embellishments', desc: 'Cold foil stamping and spot varnishing for premium shelf differentiation.' },
        { title: 'Fast Vector Pre-Flight', desc: 'Free inspection of bleeds, cutlines, and barcode scannability prior to press run.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['White Gloss / Matte BOPP (Polypropylene)', 'Crystal Clear Transparent BOPP with White Underprint', 'Silver Metallic Foil BOPP', 'Textured Uncoated Estate Wine Paper', 'High-Tack Vinyl for Industrial Equipment'],
      finishing: ['UV Gloss Varnishing', 'Silky Matte Anti-Scuff Lamination', 'Cold Foil Metallic Stamping', 'Custom Shape Digital Contour Die-Cutting', 'Thermal Transfer Printable Topcoat'],
      technicalSpecs: [
        { label: 'Core Diameter', value: '25mm (1"), 40mm (1.5"), 76mm (3")' },
        { label: 'Format', value: 'Supplied on Rolls or Die-Cut Individual Sheets' },
        { label: 'Adhesive Types', value: 'Permanent Acrylic, Removable, Freezer Grade' },
        { label: 'Print Resolution', value: '1200 x 1200 DPI High-Definition Digital & Flexo' },
        { label: 'Minimum Order', value: '500 Labels' },
      ],
    },
    useCases: [
      'Skincare bottles, lotion pumps, cosmetic jars, and dropper bottles.',
      'Squeezable sauce bottles, honey jars, and gourmet dry food packaging.',
      'Cold brew coffee, craft beer bottles, wine labeling, and canned beverages.',
      'Shipping boxes, branded mailer envelope seals, and tamper-evident security labels.',
    ],
    faqs: [
      { question: 'Are your labels waterproof and oil resistant?', answer: 'Yes. Our white and clear BOPP labels with matte or gloss lamination are 100% waterproof, smudge-proof, and resistant to essential oils and chemicals.' },
      { question: 'Can I print labels on clear transparent film?', answer: 'Yes. We print a white ink underlayer beneath your design on clear BOPP so colors stay fully vibrant on dark and transparent bottles.' },
      { question: 'Can you supply labels on rolls for machine application?', answer: 'Yes, we supply labels on standard 76mm (3-inch) cores configured to your required unwind orientation.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Product Label Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/product-label-printing',
    },
  },
  {
    path: '/business-card-printing',
    metaTitle: 'Luxury Business Card Printing | Print Plaza',
    description: 'Premium business card printing with ultra-thick cardstock (350–700 gsm), soft-touch velvet lamination, raised spot UV, metallic foil, and custom die-cuts.',
    canonicalUrl: 'https://printplaza.net/business-card-printing',
    heading: 'Luxury Business Card Printing',
    subheading: 'Heavyweight artisan cardstocks, tactile soft-touch velvet lamination, metallic hot foils, and dimensional raised spot UV.',
    serviceCategory: 'Corporate Print',
    badge: 'DEPARTMENT_03 // BUSINESS CARDS',
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'Make An Unforgettable First Impression',
      description: 'Your business card represents your professional standard in your client\'s hands. We manufacture executive business cards using rigid 350gsm to 700gsm duplexed boards with razor-sharp vector typography, deep color saturation, and tactile finishing.',
      points: [
        'Executive & C-Suite Cards: 600gsm duplexed cotton boards with painted edge foiling.',
        'Creative Agency Cards: Soft-touch velvet lamination paired with high-gloss raised 3D spot UV.',
        'Retail & Service Cards: Durable 350gsm silk artboard with protective matte lamination.',
        'QR-Enabled Networking Cards: High-contrast digital scannable vCard and URL codes.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Business Cards',
      description: 'We do not produce flimsy or faded cards. Our production desk utilizes commercial guillotine cutters for chip-free edges and Heidelberg presses for dense, consistent black and Pantone backgrounds.',
      features: [
        { title: 'Substantial Paper Stocks', desc: 'Never bend or crease easily; available up to 700gsm ultra-thick duplex boards.' },
        { title: 'Edge Gilding & Foil', desc: 'Metallic gold, silver, copper, and rose gold foil stamping on edges and faces.' },
        { title: 'Velvet Soft-Touch', desc: 'Silky tactile coating that eliminates fingerprints while enhancing rich dark colors.' },
        { title: 'Rapid Corporate Reorders', desc: 'Saved digital plates for instant re-runs across multiple team members.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['350gsm Premium Silk Artboard', '400gsm Extra-Thick Heavy Board', '600gsm Duplexed Multi-Layer Card', '300gsm Gesso & Cotton Textured Stocks', '300gsm Unbleached Natural Kraft Card'],
      finishing: ['Soft-Touch Velvet Lamination', 'Selective Raised 3D Spot UV Gloss', 'Hot Foil Stamping (Gold, Silver, Rose Gold, Holographic)', 'Debossing / Letterpress Impression', 'Custom Rounded Corners (3mm or 6mm radius)', 'Painted Color Edge Gilding'],
      technicalSpecs: [
        { label: 'Standard Dimensions', value: '85 x 55 mm (UK/EU), 90 x 50 mm, 3.5 x 2.0 inch (US)' },
        { label: 'Card Thickness', value: '350 gsm up to 700 gsm Duplex' },
        { label: 'Color Profile', value: 'CMYK High-Density Litho + Pantone Metallics' },
        { label: 'Minimum Batch', value: '100 Cards per Name / Artwork' },
        { label: 'Turnaround', value: '3 to 5 Business Days' },
      ],
    },
    useCases: [
      'Executive, partner, and founder business cards.',
      'Luxury retail VIP membership cards and boutique loyalty cards.',
      'High-end appointment reminder cards for medical and aesthetic clinics.',
      'Artist calling cards, portfolio mini-cards, and promotional vouchers.',
    ],
    faqs: [
      { question: 'What is the thickest cardstock available?', answer: 'We produce duplexed sandwich cards up to 700gsm with optional colored paper core inserts.' },
      { question: 'What is the difference between spot UV and raised spot UV?', answer: 'Standard spot UV is a flat gloss finish, whereas raised 3D spot UV creates a tactile embossed texture you can feel with your fingers.' },
      { question: 'Can I order multiple names in one order?', answer: 'Yes! We offer corporate batch pricing for multi-employee orders.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Luxury Business Card Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/business-card-printing',
    },
  },
  {
    path: '/brochure-printing',
    metaTitle: 'Brochure Printing & Company Catalogs | Print Plaza',
    description: 'Bi-fold, tri-fold, multi-page booklet, and catalog printing on premium gloss and matte art paper. Vibrant color reproduction and crisp scoring.',
    canonicalUrl: 'https://printplaza.net/brochure-printing',
    heading: 'Brochure & Catalog Printing',
    subheading: 'Corporate brochures, bi-folds, tri-folds, saddle-stitched product catalogs, and presentation folders with clean mechanical scoring.',
    serviceCategory: 'Commercial Print',
    badge: 'DEPARTMENT_04 // BROCHURES',
    heroImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'Showcase Your Brand, Services & Products In Detail',
      description: 'When digital ads are forgotten, a tactile physical brochure stays on your client\'s desk. We engineer multi-panel folded brochures, stapled company profiles, and square-back catalogs with vivid photo reproduction and crisp typographic legibility.',
      points: [
        'Corporate Profiles & Annual Reports: Heavyweight covers with matte lamination and perfect binding.',
        'Sales & Product Catalogs: Multi-page saddle-stitched booklets on 130–170gsm silk text paper.',
        'Marketing Tri-Fold & Z-Fold Pamphlets: Precision automated scoring preventing cracking along spine folds.',
        'Presentation Folders: Die-cut interior pockets with business card slits for proposals and contracts.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Brochures',
      description: 'We manage every step from pre-flight proofing to automated folding, stitching, and trimming. Our precision bindery equipment ensures neat, flush alignment across all pages.',
      features: [
        { title: 'Anti-Cracking Mechanical Creasing', desc: 'Pre-scored folds ensure no paper fiber splitting along heavy ink coverage areas.' },
        { title: 'Wide Selection of Text & Cover Stocks', desc: 'Mix 300gsm heavy covers with lightweight 130gsm or 170gsm interior pages.' },
        { title: 'Multiple Binding Options', desc: 'Saddle-stitch (stapled), wire-o spiral, and perfect PUR spine binding.' },
        { title: 'Vibrant CMYK Fidelity', desc: 'Rich photo gradients and sharp technical schematics.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['130gsm Gloss / Silk Artpaper', '170gsm Premium Heavy Text Paper', '250gsm Medium Cover Card', '300gsm Heavy Silk Cardstock for Covers', '100% Recycled Uncoated Bond Paper'],
      finishing: ['Bi-Fold (Single Crease 4 Pages)', 'Tri-Fold / Letter Fold (6 Pages)', 'Z-Fold / Accordion Fold (6–8 Pages)', 'Saddle Stitching (Stapled Spine)', 'Cover Spot UV & Velvet Lamination', 'Die-Cut Internal Pockets for Folders'],
      technicalSpecs: [
        { label: 'Folded Formats', value: 'A4, A5, DL (99x210mm), Custom Squares' },
        { label: 'Page Counts (Booklets)', value: '8, 12, 16, 24, 32 up to 64 Pages' },
        { label: 'Color Mode', value: 'Full Color Process (CMYK) Front & Back' },
        { label: 'Binding Styles', value: 'Folded, Saddle-Stitched, Wire-O, Perfect Bound' },
        { label: 'Turnaround', value: '4 to 7 Business Days' },
      ],
    },
    useCases: [
      'Real estate development presentations and floorplan showcase booklets.',
      'Industrial machinery catalogs, technical spec sheets, and user manuals.',
      'Medical clinic service menus, travel itineraries, and tourist brochures.',
      'Corporate conference agendas, event programs, and educational prospectuses.',
    ],
    faqs: [
      { question: 'What fold options do you offer for brochures?', answer: 'We provide Half-fold (bi-fold), Tri-fold (C-fold), Z-fold, Gate-fold, and multi-page saddle-stitched booklet options.' },
      { question: 'How do you prevent cracking on thick paper folds?', answer: 'We mechanically pre-crease/score every fold line before folding, ensuring zero paper fiber tearing even on heavy 300gsm stocks.' },
      { question: 'Can I add a business card slot to presentation folders?', answer: 'Yes! Our custom folder dielines feature standard die-cut horizontal or vertical business card slits in the inner pocket.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Brochure Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/brochure-printing',
    },
  },
  {
    path: '/flyer-printing',
    metaTitle: 'Bulk Flyer Printing & Promotional Leaflets | Print Plaza',
    description: 'Affordable, high-speed flyer printing for marketing campaigns, direct mail, and event promotions. Available in A5, A4, DL, and custom dimensions.',
    canonicalUrl: 'https://printplaza.net/flyer-printing',
    heading: 'Flyer & Leaflet Printing',
    subheading: 'High-speed, cost-effective flyer printing for marketing blitzes, event distributions, inserts, and direct mail campaigns.',
    serviceCategory: 'Offset & Digital Print',
    badge: 'DEPARTMENT_05 // FLYERS',
    heroImage: 'https://images.unsplash.com/photo-1644342939989-1065672049e6?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'High-Volume Impact At Unbeatable Unit Economy',
      description: 'Flyers remain the most cost-effective offline advertising channel for generating immediate local sales and brand awareness. We print crisp single and double-sided flyers on lightweight to heavyweight gloss and silk stocks with ultra-fast turnaround.',
      points: [
        'Direct Mail & Door-to-Door Drops: Lightweight 115–130gsm gloss artpaper for economic bulk postal distribution.',
        'Handout Leaflets & Event Flyers: Sturdy 170gsm silk stock that resists creasing and feels substantial in hands.',
        'Premium Promotional Cards: Heavyweight 250–300gsm cards for discount vouchers and retail store launches.',
        'Package Inserts & Unboxing Cards: Custom mini flyers designed to fit neatly inside customer shipment packages.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Flyers',
      description: 'With modern high-capacity offset presses, we provide the lowest per-unit costs for quantities from 1,000 to 500,000+ units, backed by automated inline drying that prevents ink setoff.',
      features: [
        { title: 'Ultra-Sharp Offset & Digital Output', desc: 'No washed-out colors or fuzzy text; razor sharp 2400 DPI vector clarity.' },
        { title: 'Aggressive Volume Pricing', desc: 'Steep discounts on bulk production tiers for agencies and distributors.' },
        { title: 'Standard & Custom Sizing', desc: 'A6, A5, A4, DL (envelope size), and square formats cut with millimeter precision.' },
        { title: 'Rush Dispatch Options', desc: 'Digital express fast-track printing available for time-sensitive marketing events.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['115gsm Economy Gloss Artpaper', '130gsm Standard Value Silk / Gloss', '170gsm Premium Heavy Leaflet Stock', '250gsm Rigid Promo Cardstock', '300gsm Ultra-Heavyweight Postcard Stock'],
      finishing: ['Single-Sided (4/0 CMYK)', 'Double-Sided (4/4 CMYK)', 'All-Over Gloss Machine Varnishing', 'Matte Anti-Reflective Lamination', 'Perforated Tear-Off Voucher Strips', 'Custom Contour Die-Cut Shapes'],
      technicalSpecs: [
        { label: 'Common Sizes', value: 'A6 (105x148mm), A5 (148x210mm), A4 (210x297mm), DL (99x210mm)' },
        { label: 'Paper Finish', value: 'Gloss, Silk, or Uncoated Natural Bond' },
        { label: 'Minimum Order', value: '250 Units (Digital) / 1,000 Units (Offset)' },
        { label: 'Bleed Requirements', value: '3mm Bleed on all edges with 300 DPI Artwork' },
        { label: 'Standard Lead Time', value: '2 to 4 Business Days' },
      ],
    },
    useCases: [
      'Restaurant menus, takeaway leaflets, and seasonal promotional promotions.',
      'Gym, fitness studio, and real estate marketing neighborhood mailings.',
      'Trade show handouts, exhibition booth promotions, and retail store grand openings.',
      'E-commerce unboxing discount vouchers and warranty registration cards.',
    ],
    faqs: [
      { question: 'What paper weight is best for flyers?', answer: '130gsm gloss is the industry standard for mass leaflet drops, while 170gsm or 250gsm is recommended for high-end boutique promotions.' },
      { question: 'Can you print double-sided flyers?', answer: 'Yes, all our flyer sizes are available in both single-sided (4/0) and double-sided (4/4) full color.' },
      { question: 'Can I add a perforated tear-off coupon to my flyer?', answer: 'Yes! We can add a perforated line to allow customers to easily detach a discount coupon or ticket stub.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Flyer Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/flyer-printing',
    },
  },
  {
    path: '/poster-printing',
    metaTitle: 'Large Format Poster Printing & Wall Art | Print Plaza',
    description: 'High-resolution photo and marketing poster printing in standard A3, A2, A1, A0, and custom sizes. Heavyweight satin, gloss, and museum-grade matte substrates.',
    canonicalUrl: 'https://printplaza.net/poster-printing',
    heading: 'Large Format Poster Printing',
    subheading: 'Vibrant, high-resolution photographic and promotional posters on heavyweight satin, high-gloss, and museum matte media.',
    serviceCategory: 'Large Format',
    badge: 'DEPARTMENT_06 // POSTERS',
    heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'Maximum Visual Visibility Across Any Space',
      description: 'From retail storefront window graphics and movie posters to exhibition scientific charts and interior decorative art, our large-format poster printers deliver brilliant color saturation, rich deep blacks, and smooth tonal gradients.',
      points: [
        'Retail Window Posters: UV-stable inks that resist sunlight fading for shopfront lightboxes and snap frames.',
        'Exhibition & Research Posters: High-density fine line rendering for scientific diagrams and architectural CAD drawings.',
        'Art Prints & Photo Reproductions: Heavyweight 230gsm photo satin paper with 10-color archival pigment inks.',
        'Waterproof Outdoor Posters: Polypropylene tear-resistant media designed for outdoor billboard frames.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Posters',
      description: 'We utilize state-of-the-art 12-color archival pigment printers and high-speed UV wide-format machines. Whether you need a single custom photo poster or 5,000 retail campaign sets, our color calibration ensures consistent saturation.',
      features: [
        { title: 'Wide Spectrum Archival Inks', desc: 'Expanded color gamut covering vibrant oranges, deep cyans, and smooth monochrome gradients.' },
        { title: 'Tear & Water Resistant Media', desc: 'Synthetic synthetic substrates available for damp or high-humidity display environments.' },
        { title: 'Rigid Mounting Options', desc: 'Optional pre-mounting onto 5mm lightweight Foam PVC (Foamex) or Kapa boards.' },
        { title: 'Protective Laminations', desc: 'Anti-glare matte, high-gloss, and anti-graffiti lamination coatings available.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['200gsm Premium Satin Photo Paper', '230gsm High-Gloss Photographic Paper', '180gsm Heavyweight Matte Graphic Paper', '200 Micron Waterproof Polypropylene Film', 'Backlit Film for LED Lightbox Displays'],
      finishing: ['UV Gloss / Matte Protective Lamination', 'Mounting to 3mm or 5mm Foam PVC Board', 'Snap Frame Edge Trimming', 'Encapsulation (Sealed Edge Waterproof Lamination)'],
      technicalSpecs: [
        { label: 'Standard Poster Dimensions', value: 'A3 (297x420mm), A2 (420x594mm), A1 (594x841mm), A0 (841x1189mm)' },
        { label: 'Custom Widths', value: 'Up to 1,500mm wide by any continuous length' },
        { label: 'Resolution', value: '1440 x 2880 DPI Fine Art Micro-Piezo Output' },
        { label: 'Lightfastness', value: 'Indoor 50+ Years (Pigment) / Outdoor 2+ Years (UV)' },
        { label: 'Turnaround', value: '24 to 48 Hours for Short Runs' },
      ],
    },
    useCases: [
      'Cinema, theater, and music festival promotional display posters.',
      'Retail fashion lookbooks, seasonal sale window posters, and in-store displays.',
      'Academic research conference posters and architectural blueprint presentations.',
      'Hospitality menus, drink boards, and decorative interior framed wall art.',
    ],
    faqs: [
      { question: 'What is the best poster paper for indoor lightboxes?', answer: 'We recommend our Backlit Translucent Polyester Film, which diffuses LED lighting evenly across the entire artwork with no hot spots.' },
      { question: 'Can you mount posters directly onto rigid boards?', answer: 'Yes! We can mount posters directly onto 3mm or 5mm rigid foam PVC boards, ready to hang.' },
      { question: 'What file resolution should I submit for A0 or A1 posters?', answer: 'We recommend 300 DPI at 100% scale for best results, or a minimum of 150 DPI for very large viewing distances.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Poster Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/poster-printing',
    },
  },
  {
    path: '/banner-printing',
    metaTitle: 'Vinyl Banner Printing & Pull-Up Displays | Print Plaza',
    description: 'Weatherproof heavy-duty 510gsm vinyl banners, mesh outdoor banners, and retractable roll-up display stands with brass eyelets and reinforced hems.',
    canonicalUrl: 'https://printplaza.net/banner-printing',
    heading: 'Vinyl Banners & Roll-Up Displays',
    subheading: 'Weather-resistant heavy duty PVC banners, windproof mesh media, and premium aluminum pull-up stands for outdoor and event branding.',
    serviceCategory: 'Large Format & Displays',
    badge: 'DEPARTMENT_07 // BANNERS',
    heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'High-Impact Outdoor & Event Visibility',
      description: 'Whether announcing a grand opening, dressing a construction scaffold, or dominating an exhibition hall, our wide-format vinyl banners and retractable pull-up stands are built to withstand tough weather conditions while displaying bold, vivid colors.',
      points: [
        'Outdoor Heavy-Duty PVC Banners: 510gsm reinforced frontlit scrim vinyl with welded hems and nickel eyelets.',
        'Windproof Mesh Banners: Micro-perforated airflow mesh for fence wraps, scaffolding, and high-wind zones.',
        'Retractable Roll-Up Banner Stands: Aluminum cassette mechanisms with no-curl greyback graphic film.',
        'Step & Repeat Media Backdrops: Matte anti-glare fabric backdrops for photography and red carpet events.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Banners',
      description: 'We don\'t use weak tape hems that tear in the wind. All outdoor banners are constructed with high-frequency heat-welded hems and heavy brass eyelets spaced every 50cm for maximum longevity.',
      features: [
        { title: 'High-Frequency Welded Perimeter', desc: 'Reinforced dual-layer hemmed edges that resist wind shear and tension tearing.' },
        { title: 'UV & Rain Resistant Inks', desc: 'Industrial eco-solvent and UV curable inks that resist water, UV rays, and abrasion.' },
        { title: 'Premium Non-Curling Roll-Ups', desc: 'Lightweight, durable aluminum cassette bases with padded zip carry bags.' },
        { title: 'Seamless Oversized Printing', desc: 'Seamless output up to 3.2 meters wide by 50 meters in continuous length.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['510gsm Heavy-Duty Reinforced PVC Vinyl', '340gsm Breathable Perforated Airflow Mesh', '440gsm Standard Event Frontlit Banner', '220 Micron Anti-Curl Greyback Polyester Film (Roll-Ups)', '260gsm Wrinkle-Free Tension Fabric'],
      finishing: ['High-Frequency Heat Welded Edge Hems', 'Rust-Proof Nickel/Brass Eyelets Spaced Every 50cm', 'Pole Pockets (Top & Bottom for Scaffold Poles)', 'Reinforced Corner Patches for Heavy Wind Areas'],
      technicalSpecs: [
        { label: 'Maximum Seamless Width', value: '3,200 mm (10.5 ft) by up to 50 meters length' },
        { label: 'Standard Roll-Up Size', value: '850 x 2000 mm, 1000 x 2000 mm, 1200 x 2000 mm' },
        { label: 'Outdoor Durability', value: 'Up to 3–5 Years in Direct Weather' },
        { label: 'Hardware Included', value: 'Heavy Duty Anodized Aluminum Stand + Padded Carry Case' },
        { label: 'Turnaround', value: '24 to 48 Hours' },
      ],
    },
    useCases: [
      'Retail storefront promotional banners, building wraps, and construction fence branding.',
      'Trade exhibition booths, conference halls, and corporate sponsor backdrops.',
      'Sports tournaments, marathon route signage, and festival perimeter banners.',
      'Directional outdoor signage, seasonal sale promotions, and school celebration banners.',
    ],
    faqs: [
      { question: 'How do you reinforce banners for high wind areas?', answer: 'We use breathable perforated mesh vinyl which lets 37% of air flow directly through, paired with heat-welded hems and corner reinforcements.' },
      { question: 'Do roll-up banner stands come with the carrying bag?', answer: 'Yes, all our roll-up stands include the printed no-curl graphic banner pre-fitted inside a premium aluminum cassette, complete with a padded travel bag.' },
      { question: 'How far apart are the eyelets placed?', answer: 'Our standard eyelet spacing is every 500mm (0.5m) around the entire perimeter, but we can customize spacing upon request.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Banner Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/banner-printing',
    },
  },
  {
    path: '/signage-printing',
    metaTitle: 'Rigid Signage & Direct UV Flatbed Printing | Print Plaza',
    description: 'Direct UV flatbed printing on rigid substrates: Acrylic, Aluminum Composite (Dibond), Foam PVC, and Correx boards for storefront and architectural signage.',
    canonicalUrl: 'https://printplaza.net/signage-printing',
    heading: 'Rigid Signage & UV Flatbed Printing',
    subheading: 'Direct UV flatbed printing on architectural acrylic, aluminum composite (Dibond), rigid foam PVC, and fluted Correx boards.',
    serviceCategory: 'Signage & Displays',
    badge: 'DEPARTMENT_08 // SIGNAGE',
    heroImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=85&w=1600&h=900',
    whatItsFor: {
      title: 'Architectural, Storefront & Directional Signage',
      description: 'Direct-to-substrate UV flatbed printing eliminates bubbling vinyl adhesives by curing UV inks directly onto rigid panels. We manufacture permanent exterior shopfront fascias, corporate reception plaques, directional wayfinding signs, and temporary estate boards.',
      points: [
        'Exterior Aluminum Composite Signs (Dibond 3mm): Unmatched rigidity and weather resistance for outdoor shopfronts.',
        'Clear & Frosted Acrylic Reception Plaques: Luxurious floating glass aesthetic with standoff stainless steel wall fixings.',
        'Rigid Foam PVC (Foamex 3mm–10mm): Smooth, lightweight boards for indoor retail displays and exhibition stands.',
        'Corrugated Plastic (Correx 4mm): Cost-effective weatherproof fluted plastic for estate agency boards and site signs.',
      ],
    },
    whyPrintPlaza: {
      title: 'Why Choose Print Plaza For Rigid Signage',
      description: 'Our industrial flatbed printers feature white ink channel printing and spot gloss varnish, enabling vibrant graphics on transparent acrylic, brushed metallic silver, and black composite boards.',
      features: [
        { title: 'Direct UV Curing', desc: 'No bubbling or peeling vinyl layers; ink is chemically bonded directly to the panel surface.' },
        { title: 'White Ink Underprinting', desc: 'Enables rich, opaque full color on transparent acrylic and dark brushed aluminum.' },
        { title: 'Precision CNC Router Cutting', desc: 'Custom 2D contour shapes, pre-drilled fixing holes, and rounded corner beveling.' },
        { title: 'Full Mounting Hardware Available', desc: 'Supplied with stainless steel standoffs, adhesive backing, or drill holes.' },
      ],
    },
    materialsAndFinishing: {
      materials: ['3mm Aluminum Composite Panel (Dibond / ACP)', '5mm & 10mm Cast Clear Acrylic (Perspex)', '3mm, 5mm, 10mm Rigid Foam PVC (Foamex)', '4mm Fluted Corrugated Plastic (Correx)', 'Brushed Silver / Gold Metallic Composite'],
      finishing: ['Direct UV Flatbed Print + White Underbase', 'Selective High-Gloss Spot UV Varnish', 'CNC Shape Routing & Profile Contouring', 'Pre-Drilled Corner Holes for Standoff Spacers', 'Flame Polished Acrylic Edges'],
      technicalSpecs: [
        { label: 'Maximum Panel Size', value: '2,440 x 1,220 mm (8 x 4 ft) in a single sheet' },
        { label: 'Substrate Thickness', value: '1 mm up to 50 mm thick' },
        { label: 'Outdoor Durability', value: '5+ Years Exterior Life (Aluminum Composite)' },
        { label: 'Cutting Tolerances', value: '± 0.5 mm CNC router accuracy' },
        { label: 'Turnaround', value: '3 to 5 Business Days' },
      ],
    },
    useCases: [
      'Exterior retail storefront fascias, building directory boards, and entrance signage.',
      'Corporate reception desk acrylic logo plaques with polished standoffs.',
      'Construction site safety boards, hoarding graphics, and OSHA compliance signs.',
      'Real estate for-sale boards, parking signs, and directional wayfinding arrows.',
    ],
    faqs: [
      { question: 'What is the most durable material for outdoor shop signs?', answer: '3mm Aluminum Composite (Dibond) is the industry standard for outdoor signs, offering zero warping, rust-proof properties, and 5+ years of exterior durability.' },
      { question: 'How do you mount acrylic office signs?', answer: 'We supply custom acrylic signs with pre-drilled corner holes and brushed stainless steel standoff fixings that hold the sign 20mm off the wall.' },
      { question: 'Can you cut signage into custom brand shapes?', answer: 'Yes! Our automated CNC flatbed router cuts rigid boards into any custom logo outline, rounded shape, or letter form.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Signage Printing',
      provider: { '@type': 'LocalBusiness', name: 'Print Plaza', telephone: BUSINESS_INFO.phone, email: BUSINESS_INFO.email },
      url: 'https://printplaza.net/signage-printing',
    },
  },
];
