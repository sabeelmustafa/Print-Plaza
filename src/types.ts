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
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  products: Product[];
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
  options: Record<string, string | number | boolean>;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
