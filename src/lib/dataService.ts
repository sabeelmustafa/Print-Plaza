import { Product, Order, ServiceCategory, SiteSettings, MediaAsset, ProductionJob, ProductionSpecs } from '../types';
import { SERVICES as INITIAL_SERVICES } from '../constants';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    signal: options.signal || AbortSignal.timeout(20000),
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    let detail = message;
    try { detail = JSON.parse(message).error || message; } catch { /* Non-JSON server response. */ }
    throw new Error(detail);
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

type StorefrontData = { products: Product[]; categories: Omit<ServiceCategory, 'products'>[]; settings: SiteSettings };
let storefrontRequest: Promise<StorefrontData> | undefined;

export const DataService = {
  getCachedStorefront: (): { products: Product[]; categories: Omit<ServiceCategory, 'products'>[]; settings: SiteSettings } | null => {
    try {
      const cached = JSON.parse(localStorage.getItem('plaza_public_storefront') || 'null');
      return cached && Array.isArray(cached.products) && Array.isArray(cached.categories) && cached.settings ? cached : null;
    } catch { return null; }
  },
  getStorefront: (): Promise<StorefrontData> => {
    if (!storefrontRequest) storefrontRequest = request<StorefrontData>('/api/storefront').then(data => {
      try { localStorage.setItem('plaza_public_storefront', JSON.stringify(data)); } catch { /* Storage may be disabled. */ }
      return data;
    }).finally(() => { storefrontRequest = undefined; });
    return storefrontRequest;
  },
  getCategories: async (strict = false): Promise<ServiceCategory[]> => {
    try {
      const categories = await request<Omit<ServiceCategory, 'products'>[]>(strict ? '/api/categories?all=true' : '/api/categories');
      return categories.map(category => ({ ...category, products: [] }));
    } catch (_error) {
      if (strict) throw _error;
      return INITIAL_SERVICES;
    }
  },

  saveCategory: async (category: Partial<ServiceCategory>) => {
    await request('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    return DataService.getCategories(true);
  },

  getProducts: async (strict = false): Promise<Product[]> => {
    try {
      return await request<Product[]>(strict ? '/api/products?all=true' : '/api/products');
    } catch (_error) {
      if (strict) throw _error;
      return INITIAL_SERVICES.flatMap(s => s.products);
    }
  },

  saveProduct: async (product: Partial<Product>) => { await request('/api/admin/products', { method: 'POST', body: JSON.stringify(product) }); return DataService.getProducts(true); },

  deleteProduct: async (id: string) => { await request(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' }); return DataService.getProducts(true); },

  getOrders: async (userId?: string, userEmail?: string | null): Promise<Order[]> => { const params = new URLSearchParams(); if (userId) params.set('userId', userId); if (userEmail) params.set('userEmail', userEmail); return request<Order[]>(`/api/orders?${params}`); },

  saveOrder: async (order: Partial<Order>) => { await request('/api/orders', { method: 'POST', body: JSON.stringify(order) }); return DataService.getOrders(order.userId); },

  submitQuoteRequest: async (data: {
    userId?: string;
    userName: string;
    userEmail: string;
    phone?: string;
    companyName?: string;
    productId: string;
    productName: string;
    quantity: number;
    quotedPrice?: number;
    finishingSpecs?: Record<string, string | number | boolean>;
    options?: Record<string, string | number | boolean>;
    notes?: string;
    artworkUrl?: string;
    artwork?: { fileName: string; data: string };
  }) => {
    const payload = {
      ...data,
      quoteStatus: 'new',
      options: {
        ...(data.options || {}),
        artworkFile: data.artworkUrl || undefined,
      },
      finishingSpecs: data.finishingSpecs || {},
      notes: [data.notes, data.artworkUrl ? `Artwork: ${data.artworkUrl}` : ''].filter(Boolean).join('\n'),
    };
    return request<{ id: string; quoteNumber: string; status: string }>('/api/quotations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  createAdminOrder: async (order: Partial<Order>) => {
    await request('/api/admin/orders', { method: 'POST', body: JSON.stringify(order) });
    return DataService.getOrders();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    await request(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    });
    return DataService.getOrders();
  },

  updateOrderFinance: async (orderId: string, details: { costPrice: number; sellPrice: number; currency?: string; invoiceNotes?: string; paymentDueDate?: string; finishingSpecs?: any; quoteStatus?: any }) => { await request(`/api/admin/orders/${encodeURIComponent(orderId)}/finance`, { method: 'PATCH', body: JSON.stringify(details) }); return DataService.getOrders(); },

  addPayment: async (orderId: string, payment: {
    amount: number;
    currency?: string;
    pkrAmount?: number;
    exchangeRate?: number;
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

  getSiteSettings: async (strict = false): Promise<SiteSettings> => {
    try {
      return await request<SiteSettings>('/api/site-settings');
    } catch (_error) {
      if (strict) throw _error;
      return {};
    }
  },

  saveSiteSetting: async <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    await request(`/api/admin/site-settings/${String(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
    return;
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

  prepareArtwork: async (file: File) => {
    if (!/\.(png|jpe?g|pdf|ai|eps|zip)$/i.test(file.name)) throw new Error('Choose a PNG, JPG, PDF, AI, EPS or ZIP artwork file.');
    if (!file.size || file.size > 8 * 1024 * 1024) throw new Error('Artwork must be smaller than 8 MB and cannot be empty.');
    const dataUrl = await readFileAsDataUrl(file);
    return { fileName: file.name, data: dataUrl.split(',')[1] };
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

  getQuotations: (): Promise<any[]> => request<any[]>('/api/quotations'),

  saveQuotation: async (quote: any) => { return request('/api/quotations', { method: 'POST', body: JSON.stringify(quote) }); },

  updateQuotation: async (quoteId: string, updates: any) => request<{ ok: boolean; emailSent: boolean; emailError?: string }>(`/api/quotations/${encodeURIComponent(quoteId)}`, { method: 'PATCH', body: JSON.stringify(updates) }),

  confirmQuotation: async (quoteId: string, data: any, legacy = false) => {
    if (legacy) {
      return request(`/api/admin/orders/${encodeURIComponent(quoteId)}/finance`, {
        method: 'PATCH', body: JSON.stringify({ ...data, isQuotation: false, quoteStatus: 'converted' }),
      });
    }
    return request(`/api/quotations/${encodeURIComponent(quoteId)}/convert`, {
      method: 'POST', body: JSON.stringify(data),
    });
  },

  getProductionJobs: () => request<ProductionJob[]>('/api/admin/production-jobs'),
  saveProductionSpecs: (id: string, data: { title: string; orderIds: string[]; specs: ProductionSpecs }) =>
    request(`/api/admin/production-jobs/${encodeURIComponent(id)}/specs`, { method: 'PUT', body: JSON.stringify(data) }),
  createProductionJob: (data: { title: string; orderIds: string[]; specs: ProductionSpecs }) =>
    request('/api/admin/production-jobs', { method: 'POST', body: JSON.stringify(data) }),
  updateProductionJob: (id: string, status: ProductionJob['status']) =>
    request(`/api/admin/production-jobs/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  getCustomers: (): Promise<any[]> => request<any[]>('/api/admin/customers'),

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
