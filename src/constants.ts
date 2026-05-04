/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceCategory } from './types';

export const SERVICES: ServiceCategory[] = [
  {
    id: 'packaging',
    title: 'Packaging & Labels',
    description: 'Custom boxes and labeling solutions for your brand.',
    icon: 'Package',
    products: [
      {
        id: 'custom-boxes',
        name: 'Custom Product Boxes',
        description: 'Premium folding cartons for retail and e-commerce.',
        price: 1.50,
        unit: 'per box',
        image: 'https://images.unsplash.com/photo-1542319630-55fb7f7c944a?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'packaging',
        maxQuantity: 10000,
        options: [
          { id: 'material', label: 'Material', type: 'select', values: ['Kraft Paper', 'White Cardboard', 'Corrugated'] },
          { id: 'dimensions', label: 'Dimensions (WxHxD)', type: 'text', placeholder: 'e.g., 10x10x5 cm' },
          { id: 'finish', label: 'Finish', type: 'select', values: ['Matte', 'Glossy', 'UV Coated'] }
        ]
      },
      {
        id: 'product-labels',
        name: 'Product Labels',
        description: 'High-quality adhesive labels in various shapes.',
        price: 0.05,
        unit: 'per label',
        image: 'https://images.unsplash.com/photo-1626015270271-e73792040f7b?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'packaging',
        maxQuantity: 50000,
        options: [
          { id: 'shape', label: 'Shape', type: 'select', values: ['Rectangle', 'Circle', 'Oval', 'Custom Die-cut'] },
          { id: 'finish', label: 'Finish', type: 'select', values: ['Matte', 'Glossy', 'Clear'] }
        ]
      }
    ]
  },
  {
    id: 'offset',
    title: 'Offset Printing',
    description: 'High-volume, high-quality printing for brochures and flyers.',
    icon: 'Printer',
    products: [
      {
        id: 'bulk-flyers',
        name: 'Bulk Flyers',
        description: 'Cost-effective flyers for large-scale marketing.',
        price: 45.00,
        unit: 'per 1000',
        image: 'https://images.unsplash.com/photo-1644342939989-1065672049e6?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'offset',
        maxQuantity: 50,
        options: [
          { id: 'paper-weight', label: 'Paper Weight', type: 'select', values: ['130gsm', '170gsm', '250gsm'] },
          { id: 'sides', label: 'Printing Sides', type: 'select', values: ['Single Sided', 'Double Sided'] },
          { id: 'finish', label: 'Finish', type: 'select', values: ['None', 'Matte Lamination', 'Gloss Lamination'] }
        ]
      },
      {
        id: 'brochures',
        name: 'Brochures',
        description: 'Professional trifold or bifold brochures.',
        price: 85.00,
        unit: 'per 500',
        image: 'https://images.unsplash.com/photo-1544476915-ed1370594142?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'offset',
        maxQuantity: 20,
        options: [
          { id: 'fold', label: 'Fold Type', type: 'select', values: ['Trifold', 'Bifold', 'Z-Fold'] },
          { id: 'paper', label: 'Paper', type: 'select', values: ['150gsm Silk', '170gsm Gloss'] }
        ]
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital Printing',
    description: 'Short-run printing for cards, posters and more.',
    icon: 'Layers',
    products: [
      {
        id: 'business-cards',
        name: 'Premium Business Cards',
        description: 'Make a great first impression.',
        price: 25.00,
        unit: 'per 100',
        image: 'https://images.unsplash.com/photo-1589330694653-96b653457a41?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'digital',
        maxQuantity: 50,
        options: [
          { id: 'corners', label: 'Corners', type: 'select', values: ['Standard', 'Rounded'] },
          { id: 'finish', label: 'Premium Finish', type: 'select', values: ['Soft Touch', 'Spot UV', 'Gold Foil'] }
        ]
      },
      {
        id: 'posters',
        name: 'High-Res Posters',
        description: 'Vibrant indoor posters in various sizes.',
        price: 12.00,
        unit: 'per poster',
        image: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'digital',
        maxQuantity: 100,
        options: [
          { id: 'size', label: 'Size', type: 'select', values: ['A3', 'A2', 'A1', 'A0'] },
          { id: 'paper', label: 'Paper', type: 'select', values: ['Satin', 'Gloss', 'Matte Photography'] }
        ]
      }
    ]
  },
  {
    id: 'signage',
    title: 'Signage & Displays',
    description: 'Large scale banners and exhibition stands.',
    icon: 'Maximize',
    products: [
      {
        id: 'vinyl-banners',
        name: 'Vinyl Banners',
        description: 'Durable outdoor banners with eyelets.',
        price: 25.00,
        unit: 'per sqm',
        image: 'https://images.unsplash.com/photo-1496162294208-99445100018b?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'signage',
        maxQuantity: 50,
        options: [
          { id: 'eyelets', label: 'Eyelets', type: 'select', values: ['Every 50cm', 'Corners Only', 'None'] },
          { id: 'wind-slits', label: 'Wind Slits', type: 'select', values: ['Yes', 'No'] }
        ]
      }
    ]
  },
  {
    id: 'gifts',
    title: 'Gift Packs & Giveaways',
    description: 'Branded merchandise for your team and clients.',
    icon: 'Gift',
    products: [
      {
        id: 'branded-pens',
        name: 'Premium Metal Pens',
        description: 'Laser engraved or screen printed.',
        price: 2.50,
        unit: 'per pen',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800&h=600',
        categoryId: 'gifts',
        maxQuantity: 1000,
        options: [
          { id: 'color', label: 'Pen Color', type: 'select', values: ['Black', 'Silver', 'Navy Blue'] },
          { id: 'ink', label: 'Ink Color', type: 'select', values: ['Black', 'Blue'] }
        ]
      }
    ]
  }
];
