/**
 * Server-side SEO Registry and HTML Prerender Engine for Print Plaza (printplaza.net)
 */

const BUSINESS_INFO = {
  name: 'Print Plaza',
  legalName: 'Print Plaza Printing & Packaging',
  url: 'https://printplaza.net',
  logo: 'https://printplaza.net/brand/print-plaza-logo.png',
  image: 'https://printplaza.net/brand/print-plaza-logo.png',
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
  formattedAddress: 'Main Talagang Road, Chakwal, Punjab, Pakistan',
  openingHours: 'Mo,Tu,We,Th,Fr,Sa 09:00-19:00',
  priceRange: '$$',
  areaServed: [
    'Chakwal',
    'Rawalpindi',
    'Islamabad',
    'Lahore',
    'Faisalabad',
    'Pakistan Nationwide',
    'International Worldwide',
  ],
};

const ROUTES = {
  '/': {
    title: 'Print Plaza | High Quality Printing, Packaging, Labels & Business Print Services',
    metaTitle: 'Print Plaza | High Quality Printing, Packaging, Labels & Business Print Services',
    description:
      'Print Plaza is a commercial printing and packaging company. Custom packaging, product labels, business cards, brochures, flyers, posters, banners, signage, offset, and digital printing.',
    canonical: 'https://printplaza.net/',
    heading: 'Industrial Print Production & Custom Packaging',
    subheading: 'Chromatic precision, premium substrates, and reliable manufacturing from small batches to bulk enterprise print runs.',
    paragraphs: [
      'Print Plaza is a full-service commercial print production and packaging manufacturing company based in Chakwal, Pakistan, serving clients nationwide and internationally. We bridge the gap between creative visual design and industrial manufacturing excellence, delivering tactile print products that command attention.',
      'Our facility combines next-generation multi-color offset lithography presses, high-speed digital production units, grand-format UV flatbed printers, automated CNC die-cutters, and specialty embellishment machinery. Whether your enterprise requires 50 custom prototype packaging boxes or 100,000 corporate brochures, our team enforces uncompromising quality standards at every stage.',
      'We offer an extensive selection of sustainable paperboards, heavy luxury cardstocks, waterproof synthetic films, and rigid display media, enhanced by finishes such as soft-touch lamination, raised 3D spot UV, hot foil stamping, and precision contour cutting.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'PrintingService', 'ProfessionalService'],
      name: BUSINESS_INFO.name,
      legalName: BUSINESS_INFO.legalName,
      url: BUSINESS_INFO.url,
      logo: BUSINESS_INFO.logo,
      image: BUSINESS_INFO.image,
      description:
        'Print Plaza offers high quality printing services including custom packaging, product labels, brochures, flyers, business cards, posters, banners, signage, offset printing, and digital printing.',
      telephone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS_INFO.address.streetAddress,
        addressLocality: BUSINESS_INFO.address.addressLocality,
        addressRegion: BUSINESS_INFO.address.addressRegion,
        postalCode: BUSINESS_INFO.address.postalCode,
        addressCountry: BUSINESS_INFO.address.addressCountry,
      },
      priceRange: BUSINESS_INFO.priceRange,
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '19:00',
        },
      ],
      areaServed: [
        { '@type': 'Country', name: 'Pakistan' },
        { '@type': 'Place', name: 'Chakwal' },
        { '@type': 'Place', name: 'Rawalpindi' },
        { '@type': 'Place', name: 'Islamabad' },
        { '@type': 'Place', name: 'Lahore' },
        { '@type': 'Place', name: 'Worldwide International Customers' },
      ],
      sameAs: [],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Print Plaza Commercial Printing Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom Packaging Printing',
              description: 'Custom boxes, folding cartons, mailers, sleeves, and retail packaging.',
              url: 'https://printplaza.net/custom-packaging-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Product Label Printing',
              description: 'Waterproof adhesive labels in custom shapes, rolls, and sheets.',
              url: 'https://printplaza.net/product-label-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Business Card Printing',
              description: 'Luxury cardstocks (350-700gsm), soft-touch, spot UV, and foil stamping.',
              url: 'https://printplaza.net/business-card-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Brochure Printing',
              description: 'Bi-fold, tri-fold, catalogs, and company profiles with clean folding.',
              url: 'https://printplaza.net/brochure-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Flyer Printing',
              description: 'Bulk promotional flyers and leaflets on single and double-sided art paper.',
              url: 'https://printplaza.net/flyer-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Poster Printing',
              description: 'High-resolution display posters in A3, A2, A1, A0, and custom sizes.',
              url: 'https://printplaza.net/poster-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Banner Printing',
              description: 'Heavy-duty vinyl banners, mesh outdoor media, and roll-up display stands.',
              url: 'https://printplaza.net/banner-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Signage Printing',
              description: 'Direct UV flatbed printing on acrylic, aluminum composite, and foam boards.',
              url: 'https://printplaza.net/signage-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Offset Printing',
              description: 'High-volume commercial lithography with exact Pantone PMS color matching.',
              url: 'https://printplaza.net/offset-printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Digital Printing',
              description: 'On-demand short-run digital printing with fast 24-48 hour turnaround.',
              url: 'https://printplaza.net/digital-printing',
            },
          },
        ],
      },
    },
  },

  '/custom-packaging-printing': {
    title: 'Custom Packaging Printing | Custom Boxes & Cartons | Print Plaza',
    metaTitle: 'Custom Packaging Printing | Custom Boxes & Cartons | Print Plaza',
    description:
      'Custom packaging printing for boxes, folding cartons, mailers, sleeves, and retail packaging. Premium paperboards, kraft, and luxury finishes with fast quotation.',
    canonical: 'https://printplaza.net/custom-packaging-printing',
    heading: 'Custom Packaging Printing',
    subheading: 'Engineered boxes and branded packaging manufactured to exact product specifications.',
    paragraphs: [
      'Custom packaging serves as the physical ambassador of your brand. In today’s competitive e-commerce and retail landscape, the unboxing experience directly shapes customer perception, loyalty, and perceived product value. At Print Plaza, we manufacture custom packaging solutions engineered for both physical durability and visual prestige.',
      'We offer an extensive selection of substrates to match your functional and aesthetic requirements. Choose from bleached SBS paperboard (250gsm to 450gsm) for razor-sharp retail graphics, unbleached rustic kraft board for eco-friendly organic branding, or rigid corrugated flute boards (E-flute, B-flute, and micro-flute) for secure e-commerce shipping boxes.',
      'Our end-to-end production workflow includes complimentary pre-press artwork checks, digital 3D proofing, automated dieline generation, and fast prototyping. We accommodate both short-run experimental batches and large-scale industrial runs with seamless scalability, transparent quotation, and reliable delivery across Pakistan and internationally.',
    ],
    materials: [
      'Solid Bleached Sulfate (SBS) Paperboard (250–450 gsm)',
      'Natural Eco-Friendly Kraft Cardstock',
      'Corrugated Flute Board (E-Flute, B-Flute Mailers)',
      'Rigid Greyboard with Wrapped Art Liners',
      'Food-Grade Grease-Resistant Boards',
    ],
    finishes: [
      'Matte & Gloss Film Lamination',
      'Velvet Soft-Touch Luxury Coating',
      'Raised 3D Spot UV Varnish',
      'Metallic Hot Foil Stamping (Gold, Silver, Holographic)',
      'Embossing & Debossing',
    ],
    faqs: [
      { question: 'Can Print Plaza create custom dielines for my product dimensions?', answer: 'Yes. Simply share your item length, width, height, and weight, and our packaging engineers will generate custom vector dielines with tuck-end, auto-lock bottom, or mailer box geometries.' },
      { question: 'What is the minimum order quantity (MOQ) for custom boxes?', answer: 'We support short runs starting at 50 to 100 boxes using our digital packaging press, as well as industrial offset runs of 1,000 to 50,000+ units for maximum cost efficiency.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Custom Packaging Printing',
      description: 'Custom packaging printing for boxes, folding cartons, mailers, sleeves, and retail packaging with premium finishes and reliable production support.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Main Talagang Road',
          addressLocality: 'Chakwal',
          addressRegion: 'Punjab',
          addressCountry: 'PK',
        },
      },
      areaServed: 'Worldwide',
      serviceType: 'Packaging Printing',
      url: 'https://printplaza.net/custom-packaging-printing',
    },
  },

  '/product-label-printing': {
    title: 'Product Label Printing | Waterproof Roll & Sheet Stickers | Print Plaza',
    metaTitle: 'Product Label Printing | Waterproof Roll & Sheet Stickers | Print Plaza',
    description:
      'High-quality product label printing for bottles, jars, pouches, boxes, and cosmetics. Waterproof BOPP, paper, and vinyl labels in custom shapes and finishes.',
    canonical: 'https://printplaza.net/product-label-printing',
    heading: 'Product Label Printing',
    subheading: 'High-adhesion, waterproof, and custom-shaped labels for commercial and retail packaging.',
    paragraphs: [
      'A product label must convey vital regulatory information, communicate brand prestige, and withstand extreme environmental stresses like moisture, refrigeration, oil, and continuous friction. Print Plaza produces commercial product labels that adhere firmly to glass, plastic, metal, cardboard, and flexible packaging substrates.',
      'We offer an extensive range of premium label stocks including white gloss BOPP (Biaxially Oriented Polypropylene), clear transparent film for the no-label look, textured silver/gold metallics, rustic uncoated estate paper for wine and artisanal goods, and heavy-duty outdoor vinyl.',
      'Choose from protective gloss lamination for vibrant shine, velvety matte for a sophisticated muted appearance, or tactile spot UV and metallic hot foil stamping for luxury appeal. Every order is inspected for die-cut precision, peel strength, and consistent edge-to-edge registration.',
    ],
    materials: [
      'White Gloss & Matte BOPP (Waterproof & Oil-Resistant)',
      'Clear Transparent BOPP (No-Label Look)',
      'Metallic Silver & Gold Foil Substrates',
      'Textured Uncoated Estate Paper',
      'Permanent, Removable & Freezer-Grade Adhesives',
    ],
    faqs: [
      { question: 'Are Print Plaza labels completely waterproof?', answer: 'Yes. Our White BOPP and Clear BOPP synthetic materials combined with protective film lamination are 100% waterproof, oil-resistant, and suitable for refrigeration.' },
      { question: 'Can I print labels with transparent backgrounds?', answer: 'Yes. Our Clear BOPP film provides a seamless no-label look with an opaque white ink backing layer beneath your graphics.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Product Label Printing',
      description: 'High quality product label printing for bottles, jars, boxes, bags, cosmetics, food packaging, and retail products.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Label Printing',
      url: 'https://printplaza.net/product-label-printing',
    },
  },

  '/business-card-printing': {
    title: 'Business Card Printing | Luxury Stocks & Custom Finishes | Print Plaza',
    metaTitle: 'Business Card Printing | Luxury Stocks & Custom Finishes | Print Plaza',
    description:
      'Premium business card printing with ultra-thick cardstocks (350–700gsm), velvet soft-touch, spot UV, hot foil stamping, and painted edges.',
    canonical: 'https://printplaza.net/business-card-printing',
    heading: 'Business Card Printing',
    subheading: 'Premium card stocks, tactile laminations, and luxury foil finishes for standout professional identity.',
    paragraphs: [
      'In a digital-first business environment, a physical business card has evolved from a simple contact tool into a tangible statement of credibility, professionalism, and design caliber. Handing over a substantial, beautifully finished card establishes trust within seconds.',
      'We provide an unrivaled selection of papers, from standard 350gsm silk artboard to ultra-thick 600gsm and 700gsm duplex/triplex laminated boards with colored core inserts. Enhance your identity with velvet soft-touch lamination, raised 3D spot UV gloss highlights, precision metallic foil stamping, and painted edges.',
      'Whether you are ordering 100 cards for an entrepreneur or coordinating unified multi-employee batches for an entire enterprise, our automated color calibration guarantees razor-sharp typography and exact corporate Pantone matching.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Business Card Printing',
      description: 'Premium business card printing with clean typography, strong paper stocks, and professional finishing options.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Business Card Printing',
      url: 'https://printplaza.net/business-card-printing',
    },
  },

  '/brochure-printing': {
    title: 'Brochure Printing | Bi-Fold, Tri-Fold & Company Catalogs | Print Plaza',
    metaTitle: 'Brochure Printing | Bi-Fold, Tri-Fold & Company Catalogs | Print Plaza',
    description:
      'Commercial brochure printing for company profiles, catalogs, bi-folds, tri-folds, and multi-page booklets. Sharp colors, premium paper stocks, and clean folds.',
    canonical: 'https://printplaza.net/brochure-printing',
    heading: 'Brochure Printing Services',
    subheading: 'High-fidelity folded brochures, multi-page company profiles, and product catalogs.',
    paragraphs: [
      'A professionally printed brochure remains one of the most effective sales tools for conveying detailed product specifications, showcasing corporate capability, and presenting brand narratives. Print Plaza prints commercial brochures that combine rich photographic imagery, legible typography, and precision scoring.',
      'We offer an extensive catalog of folding formats including standard bi-fold, tri-fold letter-fold, z-fold, accordion fold, double parallel fold, and gate fold. For more extensive publications, we provide multi-page saddle-stitched booklets and perfect-bound corporate catalogs.',
      'With automated in-line color densitometers and computer-to-plate (CTP) offset technology, we deliver consistent corporate branding across short marketing runs and hundred-thousand unit catalog distributions.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Brochure Printing',
      description: 'Brochure printing for company profiles, menus, catalogs, flyers, and promotional handouts with professional print finishing.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Brochure Printing',
      url: 'https://printplaza.net/brochure-printing',
    },
  },

  '/flyer-printing': {
    title: 'Flyer Printing | Bulk Promotional Leaflets & Handouts | Print Plaza',
    metaTitle: 'Flyer Printing | Bulk Promotional Leaflets & Handouts | Print Plaza',
    description:
      'Cost-effective flyer printing for marketing campaigns, events, retail sales, menus, and product launches. Vibrant color on single and double-sided sheets.',
    canonical: 'https://printplaza.net/flyer-printing',
    heading: 'Flyer & Leaflet Printing',
    subheading: 'High-speed, cost-effective flyer printing engineered for maximum promotional visibility.',
    paragraphs: [
      'Flyers represent one of the highest ROI marketing tools available for local outreach, event promotions, store openings, restaurant launches, and trade shows. Print Plaza prints commercial flyers with punchy color saturation, sharp typography, and durable paper stocks.',
      'We offer popular paper sizes including A4, A5, A6, DL (envelope size), and custom square dimensions. Choose from 100gsm economy paper for mass direct mail drops, 130gsm–170gsm gloss art paper for standard marketing distribution, or 250gsm–300gsm cardstock for premium retail handouts.',
      'Our facility supports both rapid-turnaround short-run digital printing (available within 24–48 hours) and large-scale multi-thousand offset batch production designed to minimize your per-unit cost.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Flyer Printing',
      description: 'Flyer printing for promotions, events, product launches, menus, and local marketing campaigns.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Flyer Printing',
      url: 'https://printplaza.net/flyer-printing',
    },
  },

  '/poster-printing': {
    title: 'Poster Printing | High-Resolution Wall & Display Prints | Print Plaza',
    metaTitle: 'Poster Printing | High-Resolution Wall & Display Prints | Print Plaza',
    description:
      'Custom poster printing in standard A3, A2, A1, A0, and bespoke dimensions. High-density photographic colors on satin, gloss, and matte display media.',
    canonical: 'https://printplaza.net/poster-printing',
    heading: 'Poster Printing Services',
    subheading: 'Gallery-grade resolution and vibrant color rendering on premium indoor and outdoor poster media.',
    paragraphs: [
      'Whether you need a single fine art photographic poster for an office lobby or a thousand promotional posters for a nationwide product rollout, Print Plaza delivers exceptional visual impact. Our large format digital and offset poster printing systems achieve high color gamut fidelity.',
      'We print on an array of premium papers including 170gsm satin silk, 200gsm high-gloss photo paper, and heavy 250gsm matte art board. For outdoor street promotions or illuminated backlit lightboxes, we provide water-resistant synthetic polypropylene and backlit translucent films.',
      'Add protective matte or gloss film lamination to safeguard your posters against UV fading, scuffs, fingerprints, and humidity.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Poster Printing',
      description: 'Poster printing for events, shops, campaigns, product displays, wall graphics, and high impact promotional visuals.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Poster Printing',
      url: 'https://printplaza.net/poster-printing',
    },
  },

  '/banner-printing': {
    title: 'Banner Printing | Vinyl, Mesh & Roll-Up Display Stands | Print Plaza',
    metaTitle: 'Banner Printing | Vinyl, Mesh & Roll-Up Display Stands | Print Plaza',
    description:
      'Heavy-duty PVC vinyl banners, outdoor mesh banners, and roll-up pull-up exhibition stands. Welded reinforced hems, nickel eyelets, and UV-resistant inks.',
    canonical: 'https://printplaza.net/banner-printing',
    heading: 'Banner Printing Services',
    subheading: 'Durable vinyl banners, mesh outdoor media, and portable roll-up display stands for maximum visibility.',
    paragraphs: [
      'Large format banners provide high-visibility advertising for events, construction hoardings, sports facilities, shopfronts, and exhibition halls. Print Plaza engineers commercial banners that withstand wind, rain, and intense solar exposure.',
      'Our banners are printed on reinforced 440gsm to 510gsm frontlit PVC vinyl, perforated wind-permeable mesh (ideal for windy fences and scaffolding), and scratch-resistant satin polyester for indoor pop-up displays.',
      'We also supply complete portable pull-up / roll-up banner stands with anodized aluminum cassette bases, telescopic support poles, and padded canvas travel carry bags.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Banner Printing',
      description: 'Banner printing for events, shops, promotions, exhibitions, signage, and large format advertising.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Banner Printing',
      url: 'https://printplaza.net/banner-printing',
    },
  },

  '/signage-printing': {
    title: 'Signage Printing | Acrylic, Foam Board & Aluminum Signs | Print Plaza',
    metaTitle: 'Signage Printing | Acrylic, Foam Board & Aluminum Signs | Print Plaza',
    description:
      'Rigid architectural and retail signage printed on acrylic, PVC forex foam board, aluminum composite (ACP), and correx. Custom CNC contour routing.',
    canonical: 'https://printplaza.net/signage-printing',
    heading: 'Commercial Signage & Display Printing',
    subheading: 'Direct-to-substrate UV flatbed printing on acrylic, aluminum composite, PVC foam boards, and correx.',
    paragraphs: [
      'High quality signage directs foot traffic, identifies facilities, and creates an authoritative brand impression for customers visiting your physical premises. Print Plaza provides comprehensive commercial signage production using advanced flatbed UV printing technology.',
      'We work with crystal-clear and frosted acrylic panels (3mm to 10mm), lightweight PVC Forex foam boards (3mm to 10mm), heavy-duty aluminum composite panels (ACP / Dibond), and fluted polypropylene (Correx).',
      'Our computerized CNC routing system allows for custom contour shape cutting, polished bevel edges, counter-sunk mounting holes, and stand-off stainless steel wall spacers.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Signage Printing',
      description: 'Commercial signage printing on acrylic, aluminum composite, PVC foam boards, and correx with custom CNC routing.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Signage Printing',
      url: 'https://printplaza.net/signage-printing',
    },
  },

  '/offset-printing': {
    title: 'Offset Printing Services | High-Volume Commercial Lithography | Print Plaza',
    metaTitle: 'Offset Printing Services | High-Volume Commercial Lithography | Print Plaza',
    description:
      'Industrial offset printing for high-volume packaging, brochures, catalogs, magazines, and commercial stationery. Pantone color matching and lowest per-unit cost.',
    canonical: 'https://printplaza.net/offset-printing',
    heading: 'Offset Printing Services',
    subheading: 'Industrial multi-color offset lithography delivering maximum cost-efficiency and chromatic fidelity on high-volume runs.',
    paragraphs: [
      'When your organization requires thousands or tens of thousands of printed pieces, offset lithography remains the unmatched gold standard of the commercial print industry. Offset printing delivers the sharpest half-tone screens, smoothest solid ink coverage, and the lowest cost-per-impression.',
      'Our facility features automated Computer-to-Plate (CTP) thermal imaging systems that transfer microscopic vector details onto aluminum litho plates. Inked by multi-roller printing units, the image is transferred onto rubber blanket cylinders and pressed onto paper sheets with exact hydraulic pressure.',
      'We specialize in custom Pantone Matching System (PMS) spot colors, metallic gold and silver litho inks, and high-speed in-line aqueous coating with complete in-house bindery.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Offset Printing',
      description: 'High-volume, high-quality offset lithographic printing for brochures, packaging, flyers, and commercial print.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Offset Printing',
      url: 'https://printplaza.net/offset-printing',
    },
  },

  '/digital-printing': {
    title: 'Digital Printing Services | Short-Run & Fast Turnaround | Print Plaza',
    metaTitle: 'Digital Printing Services | Short-Run & Fast Turnaround | Print Plaza',
    description:
      'On-demand digital printing for business cards, short-run brochures, posters, invites, and variable data printing. Fast turnaround with zero plate costs.',
    canonical: 'https://printplaza.net/digital-printing',
    heading: 'Digital Printing Services',
    subheading: 'High-speed, on-demand digital printing with zero plate setup costs and fast turnaround times.',
    paragraphs: [
      'Modern digital printing technology has revolutionized the commercial print sector by eliminating the need for physical printing plates and extended make-ready times. Print Plaza utilizes cutting-edge digital production presses that deliver crisp text, rich photographic color gradients, and seamless on-demand flexibility.',
      'Digital printing is the ideal solution for short-run projects where you need 50 to 500 copies without paying for plate setup. It also enables Variable Data Printing (VDP) with unique names, sequential numbering, or localized barcodes.',
      'Our digital presses handle heavy cardstocks up to 350gsm, synthetic water-resistant papers, clear films, and textured specialty papers.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Digital Printing',
      description: 'Short-run on-demand digital printing for business cards, posters, booklets, and marketing materials.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Digital Printing',
      url: 'https://printplaza.net/digital-printing',
    },
  },

  '/sticker-printing': {
    title: 'Sticker Printing | Custom Die-Cut Vinyl Stickers & Seals | Print Plaza',
    metaTitle: 'Sticker Printing | Custom Die-Cut Vinyl Stickers & Seals | Print Plaza',
    description:
      'Custom sticker printing for branding, packaging seals, die-cut vinyl stickers, and kiss-cut sheets. Waterproof, scratch-resistant, and vibrant colors.',
    canonical: 'https://printplaza.net/sticker-printing',
    heading: 'Custom Sticker Printing Services',
    subheading: 'High-adhesion vinyl stickers, die-cut brand decals, and packaging seals with protective lamination.',
    paragraphs: [
      'Custom stickers are one of the most versatile and cost-effective branding assets available. From packaging seal stickers that guarantee product integrity to custom die-cut vinyl stickers distributed as brand merchandise, Print Plaza manufactures premium stickers that stick reliably to virtually any surface.',
      'We print on heavy-duty outdoor-rated vinyl, gloss paper sticker stock, clear transparent film, and specialty holographic substrates. Every sticker can be individually die-cut to the exact contour of your artwork or arranged onto kiss-cut sheets.',
      'Our stickers are finished with a tough UV and scratch-resistant laminate that prevents color fading and protects against moisture, sunlight, and daily handling.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Sticker Printing',
      description: 'Custom sticker printing for packaging, branding, promotions, product seals, and labels in different shapes and finishes.',
      provider: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
      },
      areaServed: 'Worldwide',
      serviceType: 'Sticker Printing',
      url: 'https://printplaza.net/sticker-printing',
    },
  },

  '/about': {
    title: 'About Us | Print Plaza Commercial Printing Studio',
    metaTitle: 'About Us | Print Plaza Commercial Printing Studio',
    description:
      'Learn about Print Plaza: our industrial print equipment, prepress engineering, sustainable materials, quality assurance, and mission in commercial print and packaging.',
    canonical: 'https://printplaza.net/about',
    heading: 'About Print Plaza',
    subheading: 'Industrial print manufacturing driven by craftsmanship, material excellence, and chromatic precision.',
    paragraphs: [
      'Founded with a dedication to print craftsmanship and technical precision, Print Plaza has grown into a versatile commercial printing and packaging hub headquartered on Main Talagang Road, Chakwal. We believe that printed media remains the most powerful physical extension of any modern brand.',
      'Our facility integrates traditional heavy lithographic printing presses with modern digital toner systems and grand-format UV flatbeds. This hybrid infrastructure allows us to handle single-piece prototypes, short-run boutique packaging, and massive commercial print runs exceeding hundreds of thousands of impressions.',
      'Quality control is at the core of our operations. From pre-press file pre-flight checks and automated dieline generation to spectrophotometric in-line color monitoring and rigorous manual bindery inspection, our team ensures your printed output matches your digital vision.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Print Plaza',
      url: 'https://printplaza.net/about',
      description: 'Learn about Print Plaza printing facility, machinery, quality assurance, and commercial printing services.',
      mainEntity: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Main Talagang Road',
          addressLocality: 'Chakwal',
          addressRegion: 'Punjab',
          addressCountry: 'PK',
        },
      },
    },
  },

  '/contact': {
    title: 'Contact Us | Print Plaza Quotations & Customer Support',
    metaTitle: 'Contact Us | Print Plaza Quotations & Customer Support',
    description:
      'Contact Print Plaza for custom print quotations, sample kits, and order inquiries. Phone: +923125747610, Email: sales@printplaza.net, Main Talagang Road, Chakwal.',
    canonical: 'https://printplaza.net/contact',
    heading: 'Contact Print Plaza',
    subheading: 'Speak directly with our print production desk or request a custom quotation for your upcoming project.',
    paragraphs: [
      'Whether you are preparing to launch a new product line with bespoke packaging, ordering multi-employee business card batches, or planning a nationwide billboard and brochure marketing campaign, our production desk is here to assist you.',
      'Our print engineers review artwork files, recommend optimal substrates and cost-effective print processes, and provide clear itemized quotations with turnaround estimates before any project begins.',
      'Reach out to us via direct phone call, WhatsApp, email, or through the quote request form on our website. Visitors are also welcome to visit our studio on Main Talagang Road, Chakwal during business hours (Monday–Saturday, 9:00 AM – 7:00 PM).',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Print Plaza',
      url: 'https://printplaza.net/contact',
      description: 'Contact details and location information for Print Plaza commercial printing.',
      mainEntity: {
        '@type': 'LocalBusiness',
        name: 'Print Plaza',
        telephone: '+923125747610',
        email: 'sales@printplaza.net',
        url: 'https://printplaza.net/',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Main Talagang Road',
          addressLocality: 'Chakwal',
          addressRegion: 'Punjab',
          addressCountry: 'PK',
        },
        openingHours: 'Mo,Tu,We,Th,Fr,Sa 09:00-19:00',
      },
    },
  },

  '/privacy-policy': {
    title: 'Privacy Policy | Print Plaza',
    metaTitle: 'Privacy Policy | Print Plaza',
    description:
      'Read the Print Plaza privacy policy regarding Google sign-in, quotation requests, client orders, invoices, analytics, and account data handling.',
    canonical: 'https://printplaza.net/privacy-policy',
    heading: 'Privacy Policy',
    subheading: 'Plain-language, business-first disclosure of how Print Plaza handles client account data, quotes, and order records.',
    paragraphs: [
      'Print Plaza respects your privacy and is committed to handling personal information responsibly. When you use our website, request a quote, create a client account via Google authentication, or place a production order, we collect only the necessary data required to fulfill your printing requirements and provide secure access to your client dashboard.',
      'We do not sell, rent, or monetize your contact or business data. Information such as your name, email, phone number, shipping address, uploaded artwork files, and order history is used strictly for quotation preparation, invoice generation, production communication, and order fulfillment.',
      'All authentication is handled securely through Firebase Authentication with encrypted token management. You may request account modification or data deletion at any time by contacting our support team at sales@printplaza.net.',
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      name: 'Print Plaza Privacy Policy',
      url: 'https://printplaza.net/privacy-policy',
      description: 'Privacy policy for Print Plaza website and client portal.',
      publisher: {
        '@type': 'Organization',
        name: 'Print Plaza',
        url: 'https://printplaza.net/',
      },
    },
  },
};

function renderRouteHtml(templateHtml, reqPath) {
  const normalizedPath = reqPath.replace(/\/$/, '') || '/';
  const data = ROUTES[normalizedPath] || ROUTES['/'];

  let html = templateHtml;

  // 1. Replace Title Tag
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${data.title}</title>`);

  // 2. Replace Meta Description
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${data.description.replace(/"/g, '&quot;')}" />`
  );

  // 3. Replace Canonical Link
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
    `<link rel="canonical" href="${data.canonical}" />`
  );

  // 4. Replace Open Graph Tags
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${data.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${data.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${data.canonical}" />`
  );

  // 5. Replace Twitter Card Tags
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${data.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${data.description.replace(/"/g, '&quot;')}" />`
  );

  // 6. Replace Schema JSON-LD
  const schemaJson = JSON.stringify(data.schema, null, 2);
  html = html.replace(
    /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${schemaJson}\n    </script>`
  );

  // 7. Inject Substantial Pre-rendered Semantic HTML Body inside <noscript> and fallback content
  const renderedParagraphs = (data.paragraphs || []).map((p) => `<p>${p}</p>`).join('\n        ');
  const renderedMaterials = data.materials
    ? `\n        <h3>Supported Materials & Substrates</h3>\n        <ul>\n          ${data.materials.map((m) => `<li>${m}</li>`).join('\n          ')}\n        </ul>`
    : '';
  const renderedFaqs = data.faqs
    ? `\n        <h3>Frequently Asked Questions</h3>\n        <dl>\n          ${data.faqs.map((f) => `<dt><strong>${f.question}</strong></dt>\n          <dd>${f.answer}</dd>`).join('\n          ')}\n        </dl>`
    : '';

  const preRenderedContent = `
    <noscript>
      <main style="max-width: 1000px; margin: 40px auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #111;">
        <h1>${data.heading}</h1>
        ${data.subheading ? `<p><strong>${data.subheading}</strong></p>` : ''}
        ${renderedParagraphs}
        ${renderedMaterials}
        ${renderedFaqs}
        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ddd;" />
        <section>
          <h2>Print Plaza - Contact & Quotations</h2>
          <p><strong>Address:</strong> ${BUSINESS_INFO.formattedAddress}</p>
          <p><strong>Phone / WhatsApp:</strong> <a href="tel:${BUSINESS_INFO.phone}">${BUSINESS_INFO.displayPhone}</a></p>
          <p><strong>Email:</strong> <a href="mailto:${BUSINESS_INFO.email}">${BUSINESS_INFO.email}</a></p>
          <p><strong>Hours:</strong> ${BUSINESS_INFO.openingHours}</p>
        </section>
      </main>
    </noscript>`;

  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, preRenderedContent);

  return html;
}

module.exports = {
  BUSINESS_INFO,
  ROUTES,
  renderRouteHtml,
};
