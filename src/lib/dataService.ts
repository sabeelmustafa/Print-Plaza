import { Product, Order } from '../types';
import { SERVICES as INITIAL_SERVICES } from '../constants';

const PRODUCTS_KEY = 'plaza_studio_products';
const ORDERS_KEY = 'plaza_studio_orders';

export const DataService = {
  // Products
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const initialProducts = INITIAL_SERVICES.flatMap(s => s.products);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  },

  saveProduct: (product: Partial<Product>) => {
    const products = DataService.getProducts();
    let updatedProducts;

    if (product.id) {
      updatedProducts = products.map(p => p.id === product.id ? { ...p, ...product } : p);
    } else {
      const newProduct = {
        ...product,
        id: Math.random().toString(36).slice(2, 9),
        createdAt: new Date().toISOString()
      } as Product;
      updatedProducts = [...products, newProduct];
    }

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
    return updatedProducts;
  },

  deleteProduct: (id: string) => {
    const products = DataService.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // Orders
  getOrders: (userId?: string): Order[] => {
    const stored = localStorage.getItem(ORDERS_KEY);
    const allOrders: Order[] = stored ? JSON.parse(stored) : [];
    if (userId) {
      return allOrders.filter(o => o.userId === userId);
    }
    return allOrders;
  },

  saveOrder: (order: Partial<Order>) => {
    const orders = DataService.getOrders();
    const newOrder = {
      ...order,
      id: Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    } as Order;

    const updated = [newOrder, ...orders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  },

  updateOrderStatus: (orderId: string, status: string) => {
    const orders = DataService.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  }
};
