import { Product, Order, ServiceCategory, SiteSettings, MediaAsset } from '../types';
import { SERVICES as INITIAL_SERVICES } from '../constants';

const PRODUCTS_KEY = 'plaza_studio_products';
const ORDERS_KEY = 'plaza_studio_orders';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

function getLocalProducts(): Product[] {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) return JSON.parse(stored);

  const initialProducts = INITIAL_SERVICES.flatMap(s => s.products);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  return initialProducts;
}

function saveLocalProduct(product: Partial<Product>) {
  const products = getLocalProducts();
  const updatedProducts = product.id
    ? products.map(p => p.id === product.id ? { ...p, ...product } : p)
    : [
        ...products,
        {
          ...product,
          id: Math.random().toString(36).slice(2, 9),
          createdAt: new Date().toISOString()
        } as Product
      ];

  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  return updatedProducts;
}

function getLocalOrders(userId?: string): Order[] {
  const stored = localStorage.getItem(ORDERS_KEY);
  const allOrders: Order[] = stored ? JSON.parse(stored) : [];
  return userId ? allOrders.filter(o => o.userId === userId) : allOrders;
}

export const DataService = {
  getCategories: async (): Promise<ServiceCategory[]> => {
    try {
      const categories = await request<Omit<ServiceCategory, 'products'>[]>('/api/categories');
      return categories.map(category => ({ ...category, products: [] }));
    } catch (_error) {
      return INITIAL_SERVICES;
    }
  },

  saveCategory: async (category: Partial<ServiceCategory>) => {
    await request('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    return DataService.getCategories();
  },

  getProducts: async (): Promise<Product[]> => {
    try {
      return await request<Product[]>('/api/products');
    } catch (_error) {
      return getLocalProducts();
    }
  },

  saveProduct: async (product: Partial<Product>) => {
    try {
      await request('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      return DataService.getProducts();
    } catch (_error) {
      return saveLocalProduct(product);
    }
  },

  deleteProduct: async (id: string) => {
    try {
      await request(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return DataService.getProducts();
    } catch (_error) {
      const updated = getLocalProducts().filter(p => p.id !== id);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
      return updated;
    }
  },

  getOrders: async (userId?: string): Promise<Order[]> => {
    try {
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      return await request<Order[]>(`/api/orders${query}`);
    } catch (_error) {
      return getLocalOrders(userId);
    }
  },

  saveOrder: async (order: Partial<Order>) => {
    try {
      await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      });
      return DataService.getOrders(order.userId);
    } catch (_error) {
      const orders = getLocalOrders();
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
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      await request(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return DataService.getOrders();
    } catch (_error) {
      const updated = getLocalOrders().map(o =>
        o.id === orderId ? { ...o, status: status as Order['status'], updatedAt: new Date().toISOString() } : o
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      return updated;
    }
  },

  getSiteSettings: async (): Promise<SiteSettings> => {
    try {
      return await request<SiteSettings>('/api/site-settings');
    } catch (_error) {
      return {};
    }
  },

  saveSiteSetting: async <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    await request(`/api/admin/site-settings/${String(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
    return DataService.getSiteSettings();
  },

  getMedia: async (): Promise<MediaAsset[]> => {
    try {
      return await request<MediaAsset[]>('/api/media');
    } catch (_error) {
      return [];
    }
  },

  saveMedia: async (asset: Partial<MediaAsset>) => {
    await request('/api/admin/media', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
    return DataService.getMedia();
  }
};
