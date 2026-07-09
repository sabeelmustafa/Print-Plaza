/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductOption {
  id: string;
  label: string;
  type: 'select' | 'number' | 'text' | 'textarea' | 'checkbox' | 'file';
  values?: string[];
  placeholder?: string;
  defaultValue?: string | number | boolean;
  required?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  categoryId: string;
  maxQuantity?: number;
  options: ProductOption[];
  active?: boolean;
  sortOrder?: number;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  products: Product[];
  active?: boolean;
  sortOrder?: number;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  alt_text?: string;
  altText?: string;
}

export interface NavMenuItem {
  id: string;
  label: string;
  url: string;
  openInNewTab?: boolean;
}

export interface SiteSettings {
  header?: {
    logoText?: string;
    logoImage?: string;
    logoImageDark?: string;
    logoImageLight?: string;
    logoSize?: number;
    tagline?: string;
    servicesLabel?: string;
    productsLabel?: string;
    loginLabel?: string;
    navItems?: NavMenuItem[];
    navMenuFontSize?: number;
    buttonText?: string;
    buttonUrl?: string;
  };
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  homepage?: {
    heroTitle?: string;
    heroSubtitle?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    heroImage?: string;
  };
  footer?: {
    brandText?: string;
    tagline?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  documents?: {
    invoiceLogo?: string;
    companyName?: string;
    tagline?: string;
    accentColor?: string;
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  options: Record<string, string | number | boolean>;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail: string;
  productId: string;
  productName: string;
  quantity: number;
  items?: OrderItem[];
  options: Record<string, string | number | boolean>;
  totalPrice: number;
  currency?: string;
  costPrice?: number;
  sellPrice?: number;
  paidAmount?: number;
  balanceDue?: number;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  invoiceNotes?: string;
  paymentDueDate?: string;
  payments?: PaymentRecord[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  paidAt: string;
  createdAt?: string;
}
