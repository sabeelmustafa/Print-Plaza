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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read selected file.'));
    reader.readAsDataURL(file);
  });
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

  getOrders: async (userId?: string, userEmail?: string | null): Promise<Order[]> => {
    try {
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId);
      if (userEmail) params.set('userEmail', userEmail);
      const query = params.toString() ? `?${params.toString()}` : '';
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

  createAdminOrder: async (order: Partial<Order>) => {
    try {
      await request('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      });
      return DataService.getOrders();
    } catch (_error) {
      const orders = getLocalOrders();
      const newOrder = {
        ...order,
        id: order.id || `order-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: order.status || 'pending'
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

  updateOrderFinance: async (orderId: string, details: {
    costPrice: number;
    sellPrice: number;
    currency?: string;
    invoiceNotes?: string;
    paymentDueDate?: string;
    finishingSpecs?: any;
    quoteStatus?: any;
  }) => {
    try {
      await request(`/api/admin/orders/${encodeURIComponent(orderId)}/finance`, {
        method: 'PATCH',
        body: JSON.stringify(details),
      });
      return DataService.getOrders();
    } catch (_error) {
      const updated = getLocalOrders().map(o =>
        o.id === orderId ? { ...o, ...details, updatedAt: new Date().toISOString() } : o
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      return updated;
    }
  },

  convertToPjo: async (orderId: string, pjoData: {
    sellPrice: number;
    costPrice: number;
    finishingSpecs?: any;
  }) => {
    const pjoNumber = `PJO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatePayload = {
      ...pjoData,
      isQuotation: false,
      quoteStatus: 'converted' as const,
      pjoNumber,
      status: 'pending' as const, // Ready for Pre-Press / Proofing stage in pipeline
      updatedAt: new Date().toISOString()
    };

    try {
      await request(`/api/admin/orders/${encodeURIComponent(orderId)}/finance`, {
        method: 'PATCH',
        body: JSON.stringify(updatePayload),
      });
      return DataService.getOrders();
    } catch (_error) {
      const updated = getLocalOrders().map(o =>
        o.id === orderId ? { ...o, ...updatePayload } : o
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      return updated;
    }
  },

  addPayment: async (orderId: string, payment: {
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
    paidAt?: string;
  }) => {
    await request(`/api/admin/orders/${encodeURIComponent(orderId)}/payments`, {
      method: 'POST',
      body: JSON.stringify(payment),
    });
    return DataService.getOrders();
  },

  deletePayment: async (paymentId: string) => {
    await request(`/api/admin/payments/${encodeURIComponent(paymentId)}`, {
      method: 'DELETE',
    });
    return DataService.getOrders();
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
  },

  uploadImage: async (file: File, title?: string): Promise<string> => {
    const dataUrl = await readFileAsDataUrl(file);
    const [, data = ''] = dataUrl.split(',');
    const result = await request<{ url: string }>('/api/admin/uploads', {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        data,
        title: title || file.name.replace(/\.[^.]+$/, ''),
        altText: title || file.name.replace(/\.[^.]+$/, ''),
      }),
    });
    return result.url;
  },

  getQuotations: async (): Promise<any[]> => {
    try {
      return await request<any[]>('/api/quotations');
    } catch (_error) {
      const stored = localStorage.getItem('plaza_studio_quotations');
      return stored ? JSON.parse(stored) : [];
    }
  },

  saveQuotation: async (quote: any) => {
    try {
      await request('/api/quotations', {
        method: 'POST',
        body: JSON.stringify(quote),
      });
      return DataService.getQuotations();
    } catch (_error) {
      const stored = localStorage.getItem('plaza_studio_quotations');
      const list = stored ? JSON.parse(stored) : [];
      const newQuote = {
        ...quote,
        id: quote.id || `quote-${Math.random().toString(36).slice(2, 7)}`,
        quoteNumber: quote.quoteNumber || `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        quoteStatus: quote.quoteStatus || 'new',
        isQuotation: true,
      };
      const updated = [newQuote, ...list];
      localStorage.setItem('plaza_studio_quotations', JSON.stringify(updated));
      return updated;
    }
  },

  updateQuotation: async (quoteId: string, updates: any) => {
    try {
      await request(`/api/quotations/${encodeURIComponent(quoteId)}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return DataService.getQuotations();
    } catch (_error) {
      const stored = localStorage.getItem('plaza_studio_quotations');
      const list = stored ? JSON.parse(stored) : [];
      const updated = list.map((q: any) => q.id === quoteId ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q);
      localStorage.setItem('plaza_studio_quotations', JSON.stringify(updated));
      return updated;
    }
  },

  convertQuotationToPjo: async (quoteId: string, pjoData: any) => {
    try {
      await request(`/api/quotations/${encodeURIComponent(quoteId)}/convert`, {
        method: 'POST',
        body: JSON.stringify(pjoData),
      });
      await Promise.all([DataService.getOrders(), DataService.getQuotations()]);
      return DataService.getOrders();
    } catch (_error) {
      return DataService.convertToPjo(quoteId, pjoData);
    }
  },

  getCustomers: async (): Promise<any[]> => {
    try {
      return await request<any[]>('/api/admin/customers');
    } catch (_error) {
      return [];
    }
  },

  createCustomer: async (customerData: any) => {
    return await request<any>('/api/admin/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  sendWelcomeEmail: async (customerId: string) => {
    return await request<any>(`/api/admin/customers/${encodeURIComponent(customerId)}/send-welcome-email`, {
      method: 'POST',
    });
  },

  customerLogin: async (credentials: { email: string; password: string }) => {
    return await request<any>('/api/customer/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  customerLogout: async () => {
    return await request<any>('/api/customer/logout', {
      method: 'POST',
    });
  },

  getCustomerSession: async () => {
    try {
      return await request<any>('/api/customer/session');
    } catch (_err) {
      return { authenticated: false };
    }
  }
};
