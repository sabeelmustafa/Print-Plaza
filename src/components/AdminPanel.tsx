import React, { useEffect, useState } from 'react';
import {
  Boxes,
  CheckCircle,
  Image as ImageIcon,
  ExternalLink,
  ArrowLeft,
  Monitor,
  ReceiptText,
  TrendingUp,
  CreditCard,
  LayoutDashboard,
  ListTree,
  LogOut,
  Palette,
  Plus,
  Save,
  Settings,
  ShoppingBag,
  Trash2,
  Users,
  X,
  Search,
  Filter,
  Clock,
  Printer,
  FileText,
  CheckCircle2,
  Kanban,
  List,
  ChevronRight,
  Copy,
  Download,
  AlertCircle,
  DollarSign,
  Sliders,
  Eye,
  RefreshCw,
  Sparkles,
  MessageSquare,
  ArrowUpRight,
  Phone,
  Mail
} from 'lucide-react';
import { DataService } from '../lib/dataService';
import { MediaAsset, NavMenuItem, Order, OrderItem, Product, ProductOption, ServiceCategory, SiteSettings } from '../types';
import Hero from './Hero';
import ProductCard from './ProductCard';
import ServiceGrid from './ServiceGrid';

type AdminTab = 'dashboard' | 'quotations' | 'orders' | 'products' | 'categories' | 'customers' | 'business' | 'media' | 'site';
type WebsiteSection = 'header' | 'hero' | 'products' | 'services' | 'footer' | 'theme';

const fieldTypes: ProductOption['type'][] = ['text', 'textarea', 'number', 'select', 'checkbox', 'file'];

const blankProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  unit: 'pcs',
  image: '',
  categoryId: '',
  maxQuantity: undefined,
  options: [],
  active: true,
  sortOrder: 0,
};

const blankCategory: Partial<ServiceCategory> = {
  id: '',
  title: '',
  description: '',
  icon: 'Package',
  active: true,
  sortOrder: 0,
};

const defaultSettings: SiteSettings = {
  header: {
    logoText: 'PRINT PLAZA',
    logoImage: '/brand/print-plaza-logo.png',
    logoImageDark: '/brand/print-plaza-logo.png',
    logoImageLight: '/brand/print-plaza-logo.png',
    logoSize: 36,
    useTransparentHeader: true,
    tagline: 'Industrial Print Production',
    servicesLabel: 'Services',
    productsLabel: 'Production',
    loginLabel: 'Auth Registry',
    navItems: [
      { id: 'services', label: 'Services', url: '#services' },
      { id: 'products', label: 'Production', url: '#products' },
    ],
    navMenuFontSize: 10,
    buttonText: 'Start Project',
    buttonUrl: '#products',
  },
  theme: {
    primaryColor: '#2D545E',
    accentColor: '#E17055',
    backgroundColor: '#FDFCFB',
    textColor: '#000000',
  },
  homepage: {
    heroTitle: 'INDUSTRIAL PRINT PRODUCTION.',
    heroSubtitle: 'High-fidelity manufacturing for the modern brand. From offset lithography to large-scale signage, we deliver chromatic precision and material excellence.',
    primaryButtonText: 'Launch Production',
    secondaryButtonText: 'Substrate Catalog',
    heroImage: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1920&h=1080',
  },
  footer: {
    brandText: 'Print Plaza.',
    tagline: 'Creative Production Studio',
    description: 'Refined creative production with a focus on tactile excellence and tonal precision.',
    email: 'hi@print.plaza',
    phone: '+1 212 555 7788',
    address: 'Studio Block A, Creative District, NY 10001',
  },
  documents: {
    invoiceLogo: '/brand/print-plaza-logo.png',
    companyName: 'Print Plaza',
    tagline: 'Industrial Print Production',
    accentColor: '#E17055',
  },
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Drawers
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<ServiceCategory> | null>(null);
  const [editingMedia, setEditingMedia] = useState<Partial<MediaAsset>>({ title: '', url: '', altText: '' });
  const [businessOrder, setBusinessOrder] = useState<Order | null>(null);
  const [activeQuotation, setActiveQuotation] = useState<Order | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [creatingQuotation, setCreatingQuotation] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  
  const [quotations, setQuotations] = useState<any[]>([]);
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAll(true);
    const interval = setInterval(() => {
      loadAll(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadAll = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    setError('');
    try {
      const [nextProducts, nextCategories, nextOrders, nextQuotations, nextCustomers, nextSettings, nextMedia] = await Promise.all([
        DataService.getProducts(),
        DataService.getCategories(),
        DataService.getOrders(),
        DataService.getQuotations(),
        DataService.getCustomers(),
        DataService.getSiteSettings(),
        DataService.getMedia(),
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      setOrders(nextOrders);
      setQuotations(nextQuotations);
      setCustomerList(nextCustomers);
      setSettings({
        header: { ...defaultSettings.header, ...nextSettings.header },
        theme: { ...defaultSettings.theme, ...nextSettings.theme },
        homepage: { ...defaultSettings.homepage, ...nextSettings.homepage },
        footer: { ...defaultSettings.footer, ...nextSettings.footer },
        documents: { ...defaultSettings.documents, ...nextSettings.documents },
      });
      setMedia(nextMedia);
    } catch (caught) {
      if (showSpinner) setError(caught instanceof Error ? caught.message : 'Could not load admin data.');
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3000);
  };

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingProduct) return;
    await DataService.saveProduct(editingProduct);
    setEditingProduct(null);
    await loadAll();
    flash('Product saved successfully.');
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingCategory) return;
    await DataService.saveCategory({
      ...editingCategory,
      id: editingCategory.id?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    });
    setEditingCategory(null);
    await loadAll();
    flash('Category saved successfully.');
  };

  const saveMedia = async (event: React.FormEvent) => {
    event.preventDefault();
    await DataService.saveMedia(editingMedia);
    setEditingMedia({ title: '', url: '', altText: '' });
    await loadAll();
    flash('Media saved successfully.');
  };

  const updateOption = (index: number, updates: Partial<ProductOption>) => {
    if (!editingProduct) return;
    const options = [...(editingProduct.options || [])];
    options[index] = { ...options[index], ...updates };
    setEditingProduct({ ...editingProduct, options });
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/admin';
  };

  // Filtered Lists for Workflow Separation (Quotations Desk vs Production Pipeline)
  const pendingQuotations = [
    ...quotations.filter(q => q.quoteStatus !== 'converted'),
    ...orders.filter(o => Boolean(o.isQuotation) && o.quoteStatus !== 'converted' && !quotations.some(q => q.id === o.id)),
  ];
  const confirmedPjos = orders.filter(o => !o.isQuotation || o.quoteStatus === 'converted');

  // Metrics (Exclude cancelled orders from revenue and balance due)
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.sellPrice || o.totalPrice || 0), 0);
  const activeJobs = confirmedPjos.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const pendingPayments = orders
    .filter(o => o.status !== 'cancelled' && o.paymentStatus !== 'paid')
    .reduce((sum, o) => sum + (o.balanceDue ?? Math.max(0, (o.sellPrice || o.totalPrice || 0) - (o.paidAmount || 0))), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased">
      {/* PlazaHQ Sidebar Navigation */}
      <aside className="w-64 bg-[#14262C] text-slate-300 flex flex-col border-r border-[#223E47] shrink-0">
        {/* Brand Header with Dual Diagonal Slash Accents matching logo */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-[#223E47]">
          <div className="w-9 h-9 rounded-xl bg-[#1E373F] border border-[#2D545E] flex items-center justify-center p-1.5 shadow-md">
            <div className="flex items-center gap-1.5 h-full">
              <div className="w-2 h-full bg-[#2D545E] -skew-x-12 rounded-xs" />
              <div className="w-2 h-full bg-[#E17055] -skew-x-12 rounded-xs" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-white tracking-tight text-base leading-none block">PlazaHQ <span className="text-[#E17055]">ERP</span></span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5 block">Print Press Management</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operations</div>
          <SidebarNav tab="dashboard" activeTab={activeTab} onClick={setActiveTab} icon={<LayoutDashboard />} label="Dashboard" />
          <SidebarNav tab="quotations" activeTab={activeTab} onClick={setActiveTab} icon={<FileText />} label="Quotations Desk" badge={pendingQuotations.length ? String(pendingQuotations.length) : undefined} badgeColor="bg-[#E17055] text-white" />
          <SidebarNav tab="orders" activeTab={activeTab} onClick={setActiveTab} icon={<ShoppingBag />} label="Print Job Pipeline" badge={activeJobs ? String(activeJobs) : undefined} badgeColor="bg-[#2D545E] text-white" />
          <SidebarNav tab="customers" activeTab={activeTab} onClick={setActiveTab} icon={<Users />} label="Customer Directory" badge={String(new Set(orders.map(o => o.userEmail)).size)} />
          <SidebarNav tab="business" activeTab={activeTab} onClick={setActiveTab} icon={<ReceiptText />} label="Invoices & Finance" badge={pendingPayments > 0 ? `$${Math.round(pendingPayments)} due` : undefined} badgeColor="bg-[#E17055]/20 text-[#E17055]" />

          <div className="pt-4 px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalog & Content</div>
          <SidebarNav tab="products" activeTab={activeTab} onClick={setActiveTab} icon={<Boxes />} label="Products & Stocks" badge={String(products.length)} />
          <SidebarNav tab="categories" activeTab={activeTab} onClick={setActiveTab} icon={<ListTree />} label="Service Categories" />
          <SidebarNav tab="media" activeTab={activeTab} onClick={setActiveTab} icon={<ImageIcon />} label="Media Library" />
          <SidebarNav tab="site" activeTab={activeTab} onClick={setActiveTab} icon={<Monitor />} label="Storefront Editor" />
        </div>

        {/* Quick Action Button in Brand Coral Accent */}
        <div className="p-3 border-t border-[#223E47]">
          <button
            onClick={() => setCreatingOrder(true)}
            className="w-full bg-[#E17055] hover:bg-[#D45F44] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E17055]/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Print Job Order
          </button>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[#223E47] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#2D545E] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              AD
            </div>
            <div className="truncate max-w-[110px]">
              <span className="text-xs font-medium text-slate-200 block truncate">Administrator</span>
              <span className="text-[10px] text-slate-400 block truncate">Press Manager</span>
            </div>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#223E47] transition-colors" title="Log Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-900 capitalize tracking-tight">
              {activeTab === 'dashboard' && 'Operations Dashboard'}
              {activeTab === 'quotations' && 'Storefront Quotations Desk'}
              {activeTab === 'orders' && 'Print Job Pipeline (PJOs)'}
              {activeTab === 'products' && 'Product & Substrates Manager'}
              {activeTab === 'categories' && 'Service Category Manager'}
              {activeTab === 'customers' && 'Customer Ledger'}
              {activeTab === 'business' && 'Invoicing & Financial Ledger'}
              {activeTab === 'media' && 'Digital Media Bank'}
              {activeTab === 'site' && 'Storefront Visual Editor'}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Systems Online
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden lg:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, quotes, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            {/* Refresh Button */}
            <button onClick={() => loadAll(true)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" title="Refresh Data">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Live Storefront Button */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Storefront
            </a>
          </div>
        </header>

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {notice && (
            <div className="mb-6 flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl text-xs font-medium animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{notice}</span>
              </div>
              <button onClick={() => setNotice('')} className="text-emerald-600 hover:text-emerald-900"><X className="w-4 h-4" /></button>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-800 border border-red-200 px-4 py-3 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              <span className="text-xs font-medium">Loading PlazaHQ Data...</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  orders={confirmedPjos}
                  quotations={pendingQuotations}
                  products={products}
                  totalRevenue={totalRevenue}
                  activeJobs={activeJobs}
                  pendingPayments={pendingPayments}
                  onNewJob={() => setCreatingOrder(true)}
                  onManageJob={setBusinessOrder}
                  onManageQuotation={setActiveQuotation}
                  onViewOrders={() => setActiveTab('orders')}
                  onViewQuotations={() => setActiveTab('quotations')}
                />
              )}

              {activeTab === 'quotations' && (
                <QuotationsEditor
                  quotations={pendingQuotations}
                  searchQuery={searchQuery}
                  onCreateQuotation={() => setCreatingQuotation(true)}
                  onManageQuotation={setActiveQuotation}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersEditor
                  orders={confirmedPjos}
                  searchQuery={searchQuery}
                  onCreate={() => setCreatingOrder(true)}
                  onManage={setBusinessOrder}
                  onStatus={async (id, status) => {
                    await DataService.updateOrderStatus(id, status);
                    await loadAll();
                    flash(`Job Order status updated to ${status}.`);
                  }}
                />
              )}

              {activeTab === 'products' && (
                <ProductsEditor
                  products={products}
                  categories={categories}
                  searchQuery={searchQuery}
                  onEdit={setEditingProduct}
                  onCreate={() => setEditingProduct({ ...blankProduct, categoryId: categories[0]?.id || '' })}
                  onDelete={async id => {
                    if (!confirm('Delete this product from the storefront catalog?')) return;
                    await DataService.deleteProduct(id);
                    await loadAll();
                    flash('Product removed.');
                  }}
                />
              )}

              {activeTab === 'categories' && (
                <CategoriesEditor
                  categories={categories}
                  onCreate={() => setEditingCategory(blankCategory)}
                  onEdit={setEditingCategory}
                />
              )}

              {activeTab === 'customers' && (
                <CustomersEditor
                  orders={orders}
                  customerList={customerList}
                  searchQuery={searchQuery}
                  onCreateCustomer={() => setCreatingCustomer(true)}
                  onManageOrder={setBusinessOrder}
                />
              )}

              {activeTab === 'business' && (
                <BusinessEditor orders={orders} settings={settings} searchQuery={searchQuery} onManage={setBusinessOrder} />
              )}

              {activeTab === 'media' && (
                <MediaEditor media={media} editingMedia={editingMedia} setEditingMedia={setEditingMedia} onSave={saveMedia} />
              )}

              {activeTab === 'site' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-3xl">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Live Storefront Page Customizer</h2>
                  <p className="text-xs text-slate-500 mb-6">Customize hero text, product showcase grid, theme accents, and footer contact links in real-time.</p>
                  <button onClick={() => window.open('/admin/editor', '_blank')} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                    <ExternalLink className="w-4 h-4" /> Open Storefront Customizer Mode
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          setProduct={setEditingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={saveProduct}
          updateOption={updateOption}
        />
      )}

      {/* Category Edit Modal */}
      {editingCategory && (
        <CategoryModal
          category={editingCategory}
          setCategory={setEditingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={saveCategory}
        />
      )}

      {/* Interactive Quotation & Finishing Specs Builder Drawer */}
      {activeQuotation && (
        <QuotationDrawer
          quotation={activeQuotation}
          onClose={() => setActiveQuotation(null)}
          onConverted={async () => {
            await loadAll();
            setActiveQuotation(null);
            setActiveTab('orders');
            flash('Quotation finalized & converted into a Print Job Order (PJO)!');
          }}
        />
      )}

      {/* PJO Management & Job Ticket Drawer */}
      {businessOrder && (
        <BusinessOrderModal
          order={businessOrder}
          settings={settings}
          onDocumentSettingsChange={async documents => {
            const nextSettings = { ...settings, documents: { ...settings.documents, ...documents } };
            setSettings(nextSettings);
            await DataService.saveSiteSetting('documents', nextSettings.documents);
          }}
          onClose={() => setBusinessOrder(null)}
          onChanged={async () => {
            await loadAll();
            setBusinessOrder(null);
            flash('Business record updated.');
          }}
        />
      )}

      {/* Create Order Modal */}
      {creatingOrder && (
        <CreateOrderModal
          products={products}
          onClose={() => setCreatingOrder(false)}
          onSave={async order => {
            await DataService.createAdminOrder(order);
            setCreatingOrder(false);
            await loadAll();
            flash('New print job created.');
          }}
        />
      )}

      {/* Create Quotation Modal */}
      {creatingQuotation && (
        <CreateQuotationModal
          products={products}
          onClose={() => setCreatingQuotation(false)}
          onSave={async quote => {
            await DataService.saveQuotation(quote);
            setCreatingQuotation(false);
            await loadAll();
            flash('New quotation request created.');
          }}
        />
      )}

      {/* Create Customer Modal */}
      {creatingCustomer && (
        <CreateCustomerModal
          onClose={() => setCreatingCustomer(false)}
          onSave={async data => {
            try {
              await DataService.createCustomer(data);
              setCreatingCustomer(false);
              await loadAll();
              flash('New customer profile registered.');
            } catch (err: any) {
              const msg = typeof err === 'string' ? err : (err?.message || err?.error || 'A customer with this email is already listed.');
              alert(msg);
            }
          }}
        />
      )}
    </div>
  );
}

function SidebarNav({ tab, activeTab, onClick, icon, label, badge, badgeColor }: {
  tab: AdminTab;
  activeTab: AdminTab;
  onClick: (tab: AdminTab) => void;
  icon: React.ReactElement;
  label: string;
  badge?: string;
  badgeColor?: string;
}) {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => onClick(tab)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
        isActive
          ? 'bg-[#2D545E] text-white font-bold shadow-md shadow-[#2D545E]/20'
          : 'text-slate-300 hover:text-white hover:bg-[#1E373F]/70'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {React.cloneElement(icon, { className: `w-4 h-4 ${isActive ? 'text-[#E17055]' : 'text-slate-400'}` } as any)}
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor || (isActive ? 'bg-[#E17055] text-white' : 'bg-[#1E373F] text-slate-300')}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                            DASHBOARD OVERVIEW                              */
/* -------------------------------------------------------------------------- */

function DashboardOverview({
  orders,
  quotations,
  products,
  totalRevenue,
  activeJobs,
  pendingPayments,
  onNewJob,
  onManageJob,
  onManageQuotation,
  onViewOrders,
  onViewQuotations
}: {
  orders: Order[];
  quotations: Order[];
  products: Product[];
  totalRevenue: number;
  activeJobs: number;
  pendingPayments: number;
  onNewJob: () => void;
  onManageJob: (o: Order) => void;
  onManageQuotation: (q: Order) => void;
  onViewOrders: () => void;
  onViewQuotations: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#2D545E]/10 text-[#2D545E] flex items-center justify-center font-bold"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-[#2D545E] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#2D545E]" /> Cumulative earnings
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Quotations</span>
            <div className="w-8 h-8 rounded-lg bg-[#E17055]/10 text-[#E17055] flex items-center justify-center font-bold"><FileText className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{quotations.length}</div>
          <div className="text-[11px] text-[#E17055] font-semibold mt-1 cursor-pointer hover:underline" onClick={onViewQuotations}>
            Incoming customer requests &rarr;
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Press PJOs</span>
            <div className="w-8 h-8 rounded-lg bg-[#2D545E]/10 text-[#2D545E] flex items-center justify-center font-bold"><Printer className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{activeJobs}</div>
          <div className="text-[11px] text-[#2D545E] font-semibold mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Confirmed job orders
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Balance Due</span>
            <div className="w-8 h-8 rounded-lg bg-[#E17055]/10 text-[#E17055] flex items-center justify-center font-bold"><CreditCard className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">${pendingPayments.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Outstanding payments</div>
        </div>
      </div>

      {/* Pending Storefront Quotes Alert Box */}
      {quotations.length > 0 && (
        <div className="bg-gradient-to-r from-[#14262C] to-[#1E373F] text-white p-5 rounded-2xl shadow-md border border-[#223E47] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E17055]/20 text-[#E17055] flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">You have {quotations.length} new customer quote request{quotations.length > 1 ? 's' : ''}</h3>
              <p className="text-xs text-slate-300">Review specs, configure laminations & hot foils, finalize prices, and convert to Print Job Orders (PJOs).</p>
            </div>
          </div>
          <button
            onClick={onViewQuotations}
            className="px-4 py-2 bg-[#E17055] hover:bg-[#D45F44] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
          >
            Open Quotations Desk &rarr;
          </button>
        </div>
      )}

      {/* Main Grid: Recent Activity & Quick Quote Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> Active Print Job Orders (PJOs)
            </h2>
            <button onClick={onViewOrders} className="text-xs text-[#2D545E] hover:text-[#1E373F] font-bold flex items-center gap-1 cursor-pointer">
              View all PJOs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">PJO / ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Stage</th>
                  <th className="pb-3 text-right">Price</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-mono text-slate-900 font-bold">
                      {order.pjoNumber || `#${order.id.slice(0, 8)}`}
                    </td>
                    <td className="py-3 font-semibold text-slate-900">{order.userName || order.userEmail}</td>
                    <td className="py-3 text-slate-600">{order.productName} ({order.quantity} pcs)</td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
                    <td className="py-3 text-right font-semibold text-slate-900">${(order.sellPrice || order.totalPrice).toFixed(2)}</td>
                    <td className="py-3 text-right">
                      <button onClick={() => onManageJob(order)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer">
                        Manage PJO
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No active job orders in pipeline.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Quote Estimator Widget */}
        <QuickQuoteEstimator products={products} onNewJob={onNewJob} />
      </div>
    </div>
  );
}

function QuickQuoteEstimator({ products, onNewJob }: { products: Product[]; onNewJob: () => void }) {
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(500);

  const prod = products.find(p => p.id === selectedProduct) || products[0];
  const unitPrice = prod ? prod.price : 0;
  const estimatedTotal = unitPrice * quantity;
  const estimatedMargin = estimatedTotal * 0.45; // Estimated 45% gross profit margin

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-[#2D545E]" /> Quick Press Estimator
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Substrate / Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-400"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (${p.price}/{p.unit})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Production Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-400"
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Unit Rate:</span>
              <span className="font-semibold text-slate-700">${unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Est. Gross Profit (45%):</span>
              <span className="font-semibold text-[#2D545E]">+${estimatedMargin.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Est. Customer Quote:</span>
              <span className="text-[#E17055] font-extrabold">${estimatedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNewJob}
        className="mt-6 w-full bg-[#14262C] hover:bg-[#1E373F] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
      >
        <Plus className="w-4 h-4 text-[#E17055]" /> Create Work Order
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            QUOTATIONS DESK TAB                             */
/* -------------------------------------------------------------------------- */

function QuotationsEditor({
  quotations,
  searchQuery,
  onCreateQuotation,
  onManageQuotation
}: {
  quotations: Order[];
  searchQuery: string;
  onCreateQuotation: () => void;
  onManageQuotation: (q: Order) => void;
}) {
  const filteredQuotations = quotations.filter((q) => {
    const opts = q.options || {};
    const searchStr = `${q.id} ${q.userEmail} ${q.userName} ${q.productName} ${opts.phone || ''} ${opts.companyName || ''}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Storefront Quotation Desk ({quotations.length} Pending Requests)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review customer requirements, configure finishing options (Laminations, Hot Foils, Spot UV), finalize pricing, and convert into Print Job Orders (PJOs).</p>
        </div>
        <button
          onClick={onCreateQuotation}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Manual Quote Request
        </button>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Quote ID & Date</th>
                <th className="py-3.5 px-4">Customer Contact</th>
                <th className="py-3.5 px-4">Product Requested</th>
                <th className="py-3.5 px-4">Est. Qty</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Est. Total</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredQuotations.map((quote) => {
                const opts = quote.options || {};
                const phoneNum = String(opts.phone || opts.Phone || opts.phoneNumber || '');
                return (
                  <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">#{quote.id.slice(0, 8)}</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(quote.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{quote.userName || 'Customer'}</span>
                      <span className="text-slate-500 text-[11px] font-mono block">{quote.userEmail}</span>
                      {phoneNum ? (
                        <a
                          href={`tel:${phoneNum}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" /> {phoneNum}
                        </a>
                      ) : (
                        <span className="text-amber-600 text-[10px] block italic mt-0.5">No phone provided</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{quote.productName}</span>
                      {opts.companyName && <span className="text-slate-400 text-[10px] block">{String(opts.companyName)}</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {quote.quantity.toLocaleString()} pcs
                    </td>
                    <td className="py-3.5 px-4">
                      <QuoteStatusBadge status={quote.quoteStatus || 'new'} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ${(quote.sellPrice || quote.totalPrice).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onManageQuotation(quote)}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto transition-colors cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Configure Specs & PJO
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredQuotations.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No quote requests pending review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QuoteStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'converted':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">PJO Converted</span>;
    case 'approved':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Price Approved</span>;
    case 'negotiating':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">In Discussion</span>;
    default:
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">New Request</span>;
  }
}

/* -------------------------------------------------------------------------- */
/*             INTERACTIVE QUOTATION & FINISHING SPECS DRAWER                 */
/* -------------------------------------------------------------------------- */

function QuotationDrawer({
  quotation,
  onClose,
  onConverted
}: {
  quotation: Order;
  onClose: () => void;
  onConverted: () => Promise<void>;
}) {
  const opts = quotation.options || {};
  const [costPrice, setCostPrice] = useState(quotation.costPrice || (quotation.totalPrice * 0.5));
  const [sellPrice, setSellPrice] = useState(quotation.sellPrice || quotation.totalPrice || 0);
  const [currency, setCurrency] = useState(quotation.currency || 'USD');
  const [quoteStatus, setQuoteStatus] = useState(quotation.quoteStatus || 'new');

  // Finishing Specs State
  const [lamination, setLamination] = useState(quotation.finishingSpecs?.lamination || 'None');
  const [foiling, setFoiling] = useState(quotation.finishingSpecs?.foiling || 'None');
  const [uv, setUv] = useState(quotation.finishingSpecs?.uv || 'None');
  const [emboss, setEmboss] = useState(quotation.finishingSpecs?.emboss || 'None');
  const [dieCut, setDieCut] = useState(quotation.finishingSpecs?.dieCut || 'Standard Straight Cut');
  const [customNotes, setCustomNotes] = useState(quotation.finishingSpecs?.customNotes || '');
  
  const [submitting, setSubmitting] = useState(false);

  const finishingSpecs = {
    lamination,
    foiling,
    uv,
    emboss,
    dieCut,
    customNotes
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    try {
      await DataService.updateQuotation(quotation.id, {
        quotedPrice: sellPrice,
        currency,
        quoteStatus,
        finishingSpecs,
      });
      alert('Quotation draft saved.');
    } catch (err: any) {
      alert(err?.message || 'Failed to save quote draft.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAndEmail = async () => {
    setSubmitting(true);
    try {
      await DataService.updateQuotation(quotation.id, {
        quotedPrice: sellPrice,
        currency,
        quoteStatus,
        finishingSpecs,
        notifyCustomer: true
      });
      alert(`Quotation #${quotation.id.slice(0, 8)} updated and notification email sent to ${quotation.userEmail}!`);
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Failed to update quote or send email.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToPjo = async () => {
    if (!confirm(`Finalize quote and create Print Job Order (PJO) for ${quotation.userName || quotation.userEmail}?`)) return;
    setSubmitting(true);
    try {
      await DataService.convertQuotationToPjo(quotation.id, {
        sellPrice,
        costPrice,
        finishingSpecs
      });
      await onConverted();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="h-16 px-6 bg-[#14262C] text-white flex items-center justify-between shrink-0 border-b border-[#1E373F]">
          <div>
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#E17055]" /> Quotation Builder #{quotation.id.slice(0, 8)}
            </h2>
            <p className="text-[11px] text-slate-400">{quotation.productName} &bull; {quotation.quantity} pcs</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E373F] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Customer Contact Details */}
          {(() => {
            const phoneNum = String(opts.phone || opts.Phone || opts.phoneNumber || '');
            return (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Contact Info</h3>
                  {phoneNum && (
                    <a
                      href={`tel:${phoneNum}`}
                      className="px-3 py-1 bg-[#E17055] hover:bg-[#D45F44] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Customer ({phoneNum})
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">FULL NAME</span>
                    <span className="font-bold text-slate-900">{quotation.userName || 'Customer'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">EMAIL ADDRESS</span>
                    <span className="font-mono font-semibold text-slate-800">{quotation.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PHONE NUMBER</span>
                    {phoneNum ? (
                      <a href={`tel:${phoneNum}`} className="font-bold text-[#E17055] hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {phoneNum}
                      </a>
                    ) : (
                      <span className="text-amber-600 font-semibold italic">Not provided</span>
                    )}
                  </div>
                  {opts.companyName && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">COMPANY / BRAND</span>
                      <span className="font-semibold text-slate-800">{String(opts.companyName)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Customer Submitted Specifications Card */}
          <div className="bg-[#14262C] text-white p-4.5 rounded-2xl space-y-3 shadow-md border border-[#1E373F]">
            <div className="flex items-center justify-between border-b border-[#1E373F] pb-2">
              <h3 className="text-xs font-bold text-[#E17055] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Customer Submitted Specifications
              </h3>
              <span className="text-[10px] font-mono bg-[#1E373F] text-slate-300 px-2 py-0.5 rounded-full font-bold">
                Website Quote Desk Request
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Product Type</span>
                <span className="font-bold text-white">{quotation.productName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Quantity Requested</span>
                <span className="font-bold text-emerald-400 font-mono">{quotation.quantity?.toLocaleString()} pcs</span>
              </div>
              {opts.material && (
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Material / Paperboard</span>
                  <span className="font-semibold text-slate-200">{String(opts.material)}</span>
                </div>
              )}
              {opts.dimensions && (
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Dimensions (WxHxD)</span>
                  <span className="font-semibold text-slate-200">{String(opts.dimensions)}</span>
                </div>
              )}
              {opts.finish && (
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Requested Finish</span>
                  <span className="font-semibold text-slate-200">{String(opts.finish)}</span>
                </div>
              )}
            </div>

            {opts.specifications && (
              <div className="pt-2 border-t border-[#1E373F] space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Customer Requirements & Notes:</span>
                <p className="text-xs text-slate-300 bg-[#0A1317] p-2.5 rounded-xl border border-[#1E373F] whitespace-pre-wrap leading-relaxed font-mono">
                  {String(opts.specifications)}
                </p>
              </div>
            )}

            {opts.artworkFile && (
              <div className="pt-2 border-t border-[#1E373F] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Submitted Artwork Preview File:</span>
                <a href={String(opts.artworkFile)} target="_blank" rel="noreferrer" className="text-[#E17055] font-bold underline hover:text-[#D45F44] flex items-center gap-1">
                  View File Preview <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Interactive Finishing & Press Specs Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E17055]" /> Press Finishing & Production Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lamination Coating</label>
                <select
                  value={lamination}
                  onChange={(e) => setLamination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="None">None (Uncoated)</option>
                  <option value="Matte Lamination">Matte Lamination</option>
                  <option value="Gloss Lamination">Gloss Lamination</option>
                  <option value="Soft-Touch Velvet">Soft-Touch Velvet</option>
                  <option value="Anti-Scratch Matte">Anti-Scratch Matte</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hot Foil Stamping</label>
                <select
                  value={foiling}
                  onChange={(e) => setFoiling(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="None">None</option>
                  <option value="Gold Foil">Gold Foil</option>
                  <option value="Silver Foil">Silver Foil</option>
                  <option value="Rose Gold Foil">Rose Gold Foil</option>
                  <option value="Holographic Foil">Holographic Foil</option>
                  <option value="Copper Foil">Copper Foil</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Spot UV Coating</label>
                <select
                  value={uv}
                  onChange={(e) => setUv(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="None">None</option>
                  <option value="Flat Spot UV">Flat Spot UV</option>
                  <option value="Raised 3D Spot UV">Raised 3D Spot UV</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Embossing / Debossing</label>
                <select
                  value={emboss}
                  onChange={(e) => setEmboss(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="None">None</option>
                  <option value="Blind Emboss">Blind Emboss</option>
                  <option value="Blind Deboss">Blind Deboss</option>
                  <option value="Foil Emboss">Foil Emboss</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Die-Cutting & Shape Specs</label>
              <input
                type="text"
                placeholder="e.g. Custom die-cut shape with rounded corners"
                value={dieCut}
                onChange={(e) => setDieCut(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Press Production Notes</label>
              <textarea
                rows={2}
                placeholder="Internal notes for prepress & press operators..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Pricing, Currency & Quote Status Finalization */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Costing & Quote Price Finalization
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Quote Status</label>
                <select
                  value={quoteStatus}
                  onChange={(e) => setQuoteStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="new">New Request</option>
                  <option value="negotiating">In Discussion</option>
                  <option value="approved">Price Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Currency Code</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (Rs)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (AED)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Est. Base Cost Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Final Quoted Customer Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2D545E] outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Calculated Profit Margin:</span>
              <span className="font-bold text-[#2D545E] text-sm">${(sellPrice - costPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="p-4 bg-[#14262C] border-t border-[#223E47] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={submitting}
              className="px-3.5 py-2.5 bg-[#1E373F] hover:bg-[#284852] text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={handleSaveAndEmail}
              disabled={submitting}
              className="px-3.5 py-2.5 bg-[#2D545E] hover:bg-[#23424A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-[#E17055]" /> Save & Email Customer
            </button>
          </div>

          <button
            onClick={handleConvertToPjo}
            disabled={submitting}
            className="px-4 py-2.5 bg-[#E17055] hover:bg-[#D45F44] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Create PJO &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            ORDERS & KANBAN PIPELINE                        */
/* -------------------------------------------------------------------------- */

function OrdersEditor({
  orders,
  searchQuery,
  onCreate,
  onManage,
  onStatus
}: {
  orders: Order[];
  searchQuery: string;
  onCreate: () => void;
  onManage: (order: Order) => void;
  onStatus: (id: string, status: string) => Promise<void>;
}) {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [statusFilter, setStatusFilter] = useState<string>('active_pipeline');

  const filteredOrders = orders.filter((o) => {
    const pjo = o.pjoNumber || o.id;
    const matchesSearch =
      pjo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.userName && o.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'active_pipeline') {
      return matchesSearch && o.status !== 'delivered';
    }
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activePipelineCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="active_pipeline">Active Production Pipeline ({activePipelineCount})</option>
            <option value="delivered">📦 Delivered & Job History ({deliveredCount})</option>
            <option value="all">All Stages & History ({orders.length})</option>
            <option value="pending">Proofing / Pre-Press ({orders.filter(o => o.status === 'pending').length})</option>
            <option value="processing">In Production ({orders.filter(o => o.status === 'processing').length})</option>
            <option value="completed">Ready / Completed ({orders.filter(o => o.status === 'completed').length})</option>
            <option value="cancelled">Cancelled ({orders.filter(o => o.status === 'cancelled').length})</option>
          </select>

          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Pipeline Board
            </button>
          </div>
        </div>

        <button
          onClick={onCreate}
          className="w-full sm:w-auto bg-[#E17055] hover:bg-[#D45F44] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E17055]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Print Order
        </button>
      </div>

      {/* Content View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3.5 px-4">PJO Number</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Product Specs</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{order.pjoNumber || `#${order.id.slice(0, 8)}`}</span>
                      <span className="text-[10px] text-slate-400 block">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{order.userName || 'Guest Customer'}</span>
                      <span className="text-slate-500 text-[11px] block font-mono">{order.userEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{order.productName}</span>
                      <span className="text-slate-500 text-[11px]">Qty: {order.quantity}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => onStatus(order.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold outline-none focus:border-slate-400"
                      >
                        <option value="pending">Proofing / Pre-Press</option>
                        <option value="processing">In Production</option>
                        <option value="completed">Ready / Completed</option>
                        <option value="delivered">Delivered (Move to History)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <PaymentBadge status={order.paymentStatus || 'unpaid'} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      ${(order.sellPrice || order.totalPrice).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onManage(order)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Job Ticket
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No print job orders in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <KanbanPipelineBoard orders={filteredOrders} onManage={onManage} onStatus={onStatus} />
      )}
    </div>
  );
}

function KanbanPipelineBoard({
  orders,
  onManage,
  onStatus
}: {
  orders: Order[];
  onManage: (o: Order) => void;
  onStatus: (id: string, status: string) => Promise<void>;
}) {
  const columns = [
    { id: 'pending', title: 'Proofing / Pre-Press', color: 'border-amber-400' },
    { id: 'processing', title: 'In Production', color: 'border-blue-400' },
    { id: 'completed', title: 'Ready / Completed', color: 'border-emerald-400' },
    { id: 'delivered', title: 'Delivered (Job History)', color: 'border-teal-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.id);
        return (
          <div key={col.id} className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[500px]">
            <div className={`pb-3 mb-3 border-b-2 ${col.color} flex items-center justify-between`}>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{col.title}</h3>
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                {colOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {colOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">{order.pjoNumber || `#${order.id.slice(0, 8)}`}</span>
                    <span className="font-bold text-slate-900">${(order.sellPrice || order.totalPrice).toFixed(2)}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{order.productName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Qty: {order.quantity} pcs</p>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{order.userName || order.userEmail}</p>
                  </div>

                  {order.finishingSpecs?.lamination && (
                    <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Finish: {order.finishingSpecs.lamination}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <select
                      value={order.status}
                      onChange={(e) => onStatus(order.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-[10px] font-semibold text-slate-700 outline-none"
                    >
                      <option value="pending">Proofing</option>
                      <option value="processing">In Production</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered & Archived</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => onManage(order)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
                      title="Open Job Ticket"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {colOrders.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                  No jobs in stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'delivered':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">Delivered & Archived</span>;
    case 'completed':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Ready / Completed</span>;
    case 'processing':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">In Production</span>;
    case 'cancelled':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Cancelled</span>;
    default:
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Proofing</span>;
  }
}

function PaymentBadge({ status }: { status: string }) {
  switch (status) {
    case 'paid':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>;
    case 'partial':
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Partial</span>;
    default:
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Unpaid</span>;
  }
}

/* -------------------------------------------------------------------------- */
/*                            PRODUCTS EDITOR                                 */
/* -------------------------------------------------------------------------- */

function ProductsEditor({
  products,
  categories,
  searchQuery,
  onEdit,
  onCreate,
  onDelete
}: {
  products: Product[];
  categories: ServiceCategory[];
  searchQuery: string;
  onEdit: (product: Product) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}) {
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Showing {filteredProducts.length} print products</span>
        <button
          onClick={onCreate}
          className="bg-[#E17055] hover:bg-[#D45F44] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#E17055]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const category = categories.find((c) => c.id === product.categoryId);
          return (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img src={product.image || 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1'} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {category?.title || 'General'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Base Unit Price:</span>
                  <span className="font-bold text-slate-900">${product.price} / {product.unit}</span>
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${product.active !== false ? 'text-[#2D545E]' : 'text-slate-400'}`}>
                  {product.active !== false ? '● Active' : '○ Inactive'}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => onEdit(product)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => onDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            CATEGORIES EDITOR                               */
/* -------------------------------------------------------------------------- */

function CategoriesEditor({
  categories,
  onCreate,
  onEdit
}: {
  categories: ServiceCategory[];
  onCreate: () => void;
  onEdit: (c: ServiceCategory) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Managing {categories.length} service categories</span>
        <button
          onClick={onCreate}
          className="bg-[#2D545E] hover:bg-[#1E373F] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#2D545E]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">ID: {cat.id}</span>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5">{cat.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.description}</p>
            </div>
            <button
              onClick={() => onEdit(cat)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            CUSTOMERS EDITOR                                */
/* -------------------------------------------------------------------------- */

function CustomersEditor({
  orders,
  customerList = [],
  searchQuery,
  onCreateCustomer,
  onManageOrder
}: {
  orders: Order[];
  customerList?: any[];
  searchQuery: string;
  onCreateCustomer: () => void;
  onManageOrder: (o: Order) => void;
}) {
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  // Aggregate customer statistics
  const customerMap = new Map<string, { id?: string; email: string; name: string; phone: string; company: string; totalOrders: number; totalSpent: number; lastOrder: string; orderList: Order[] }>();

  // 1. Seed customerMap from dedicated customers table
  customerList.forEach((c) => {
    const key = (c.email || c.userEmail || '').toLowerCase().trim();
    if (!key) return;
    customerMap.set(key, {
      id: c.id,
      email: c.email || c.userEmail,
      name: c.name || c.userName || 'Customer',
      phone: c.phone || '',
      company: c.company || c.companyName || '',
      totalOrders: Number(c.totalOrders || 0),
      totalSpent: Number(c.totalSpent || 0),
      lastOrder: c.lastOrder || c.createdAt || new Date().toISOString(),
      orderList: []
    });
  });

  // 2. Merge order history and metrics
  orders.forEach((o) => {
    const key = (o.userEmail || o.userName || o.userId || '').toLowerCase().trim();
    if (!key) return;

    const opts = o.options || {};
    const phone = String(opts.phone || opts.Phone || opts.phoneNumber || '');
    const company = String(opts.companyName || '');
    const existing = customerMap.get(key);
    
    // Quotations and cancelled jobs DO NOT count towards orders count or lifetime spend
    const isQuotation = Boolean(o.isQuotation || opts.isQuotation || o.quoteStatus);
    const isCancelled = o.status === 'cancelled';
    const isConfirmedPaidOrder = !isQuotation && !isCancelled;
    const amount = isConfirmedPaidOrder ? (o.sellPrice || o.totalPrice || 0) : 0;

    if (existing) {
      existing.orderList.push(o);
      if (!customerList.length) {
        if (isConfirmedPaidOrder) {
          existing.totalOrders += 1;
          existing.totalSpent += amount;
        }
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.createdAt;
        }
      }
      if (phone && !existing.phone) existing.phone = phone;
      if (company && !existing.company) existing.company = company;
    } else {
      customerMap.set(key, {
        email: o.userEmail || key,
        name: o.userName || 'Customer',
        phone,
        company,
        totalOrders: isConfirmedPaidOrder ? 1 : 0,
        totalSpent: amount,
        lastOrder: o.createdAt || new Date().toISOString(),
        orderList: [o]
      });
    }
  });

  const customers = Array.from(customerMap.values()).filter(c =>
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendWelcomeEmail = async (cust: { id?: string; email: string }) => {
    const targetIdOrEmail = cust.id || cust.email;
    setSendingEmail(cust.email);
    try {
      const res = await DataService.sendWelcomeEmail(targetIdOrEmail);
      alert(res?.message || `Welcome credentials email sent to ${cust.email}!`);
    } catch (err: any) {
      alert(err?.message || 'Failed to dispatch welcome email.');
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Directory Ledger ({customers.length} Accounts)</h2>
        <button
          onClick={onCreateCustomer}
          className="bg-[#E17055] hover:bg-[#D45F44] text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#E17055]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <th className="py-3.5 px-4">Customer Name & Company</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Orders</th>
              <th className="py-3.5 px-4">Last Activity</th>
              <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {customers.map((cust) => (
              <tr key={cust.email} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 block">{cust.name}</span>
                  {cust.company && <span className="text-[11px] text-slate-500 block">{cust.company}</span>}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-600 font-mono text-[11px] block">{cust.email}</span>
                  {cust.phone && (
                    <a href={`tel:${cust.phone}`} className="text-[11px] font-bold text-[#E17055] hover:underline flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {cust.phone}
                    </a>
                  )}
                </td>
                <td className="py-3.5 px-4"><span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800">{cust.totalOrders}</span></td>
                <td className="py-3.5 px-4 text-slate-500">{new Date(cust.lastOrder).toLocaleDateString()}</td>
                <td className="py-3.5 px-4 text-right font-bold text-[#2D545E]">${cust.totalSpent.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => handleSendWelcomeEmail(cust)}
                    disabled={sendingEmail === cust.email}
                    className="px-3 py-1.5 bg-[#2D545E] hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Mail className="w-3 h-3" /> {sendingEmail === cust.email ? 'Sending...' : 'Send Welcome Email'}
                  </button>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">No customer records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            BUSINESS & FINANCIALS                           */
/* -------------------------------------------------------------------------- */

function BusinessEditor({
  orders,
  settings,
  searchQuery,
  onManage
}: {
  orders: Order[];
  settings: SiteSettings;
  searchQuery: string;
  onManage: (o: Order) => void;
}) {
  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-2">Financial Ledger & Invoicing</h2>
        <p className="text-xs text-slate-500">Manage client payments, record partial deposits, track due balances, and generate print invoices.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Invoice / Job #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Balance Due</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.map((order) => {
                const isCancelled = order.status === 'cancelled';
                const total = order.sellPrice || order.totalPrice || 0;
                const paid = order.paidAmount || (order.paymentStatus === 'paid' ? total : 0);
                const due = isCancelled ? 0 : (order.balanceDue ?? Math.max(0, total - paid));

                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {order.pjoNumber || `INV-#${order.id.slice(0, 8)}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{order.userEmail}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${total.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-semibold">${paid.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold">
                      {isCancelled ? (
                        <span className="text-slate-400 text-xs">$0.00 <span className="text-[10px] italic">(Cancelled)</span></span>
                      ) : (
                        <span className="text-rose-600">${due.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isCancelled ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Cancelled Order</span>
                      ) : (
                        <PaymentBadge status={order.paymentStatus || 'unpaid'} />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onManage(order)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Invoice & Payments
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            MEDIA LIBRARY                                   */
/* -------------------------------------------------------------------------- */

function MediaEditor({
  media,
  editingMedia,
  setEditingMedia,
  onSave
}: {
  media: MediaAsset[];
  editingMedia: Partial<MediaAsset>;
  setEditingMedia: React.Dispatch<React.SetStateAction<Partial<MediaAsset>>>;
  onSave: (e: React.FormEvent) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await DataService.uploadImage(file, file.name);
      setEditingMedia({ title: file.name, url, altText: file.name });
    } catch (_err) {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Add Media Asset</h2>
        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Asset Title</label>
            <input
              type="text"
              placeholder="e.g. Hero Banner"
              value={editingMedia.title || ''}
              onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Image File or URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://..."
                value={editingMedia.url || ''}
                onChange={(e) => setEditingMedia({ ...editingMedia, url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400"
                required
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shrink-0 flex items-center justify-center">
                {uploading ? '...' : 'Browse'}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-xs">
              Save Asset
            </button>
          </div>
        </form>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((asset) => (
          <div key={asset.id} className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs group">
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2 relative">
              <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
              <button
                onClick={() => navigator.clipboard.writeText(asset.url)}
                className="absolute inset-0 bg-slate-900/60 text-white text-xs font-medium flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-3.5 h-3.5" /> Copy URL
              </button>
            </div>
            <span className="text-xs font-semibold text-slate-800 truncate block">{asset.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            PRODUCT MODAL                                   */
/* -------------------------------------------------------------------------- */

function ProductModal({
  product,
  categories,
  setProduct,
  onClose,
  onSave,
  updateOption
}: {
  product: Partial<Product>;
  categories: ServiceCategory[];
  setProduct: React.Dispatch<React.SetStateAction<Partial<Product> | null>>;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  updateOption: (idx: number, opt: Partial<ProductOption>) => void;
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">{product.id ? 'Edit Product' : 'Add New Print Product'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Product Title</label>
            <input
              type="text"
              value={product.name || ''}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={product.categoryId || ''}
                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Base Price / Unit</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={product.price || 0}
                  onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
                  required
                />
                <input
                  type="text"
                  placeholder="unit (pcs/box)"
                  value={product.unit || 'pcs'}
                  onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                  className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
            <input
              type="text"
              value={product.image || ''}
              onChange={(e) => setProduct({ ...product, image: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea
              value={product.description || ''}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-slate-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Custom Options (Paper Stock, Finish, Size)</span>
              <button
                type="button"
                onClick={() => {
                  const opts = [...(product.options || [])];
                  opts.push({ id: `opt_${Date.now()}`, label: 'Option Title', type: 'select', values: ['Choice A', 'Choice B'] });
                  setProduct({ ...product, options: opts });
                }}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                + Add Option
              </button>
            </div>

            <div className="space-y-2">
              {(product.options || []).map((opt, idx) => (
                <div key={opt.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => updateOption(idx, { label: e.target.value })}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Choices (comma separated)"
                    value={(opt.values || []).join(', ')}
                    onChange={(e) => updateOption(idx, { values: e.target.value.split(',').map(s => s.trim()) })}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const opts = product.options?.filter((_, i) => i !== idx);
                      setProduct({ ...product, options: opts });
                    }}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs">
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            CATEGORY MODAL                                  */
/* -------------------------------------------------------------------------- */

function CategoryModal({
  category,
  setCategory,
  onClose,
  onSave
}: {
  category: Partial<ServiceCategory>;
  setCategory: React.Dispatch<React.SetStateAction<Partial<ServiceCategory> | null>>;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">{category.id ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category Title</label>
            <input
              type="text"
              value={category.title || ''}
              onChange={(e) => setCategory({ ...category, title: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea
              value={category.description || ''}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs">
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       JOB TICKET & BUSINESS ORDER DRAWER                   */
/* -------------------------------------------------------------------------- */

function BusinessOrderModal({
  order,
  settings,
  onDocumentSettingsChange,
  onClose,
  onChanged
}: {
  order: Order;
  settings: SiteSettings;
  onDocumentSettingsChange: (doc: any) => Promise<void>;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [costPrice, setCostPrice] = useState(order.costPrice || 0);
  const [sellPrice, setSellPrice] = useState(order.sellPrice || order.totalPrice || 0);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer');
  const [loading, setLoading] = useState(false);

  const isCancelled = order.status === 'cancelled';
  const total = sellPrice;
  const paid = order.paidAmount || (order.paymentStatus === 'paid' ? total : 0);
  const balance = isCancelled ? 0 : (order.balanceDue ?? Math.max(0, total - paid));

  const handleUpdateFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await DataService.updateOrderFinance(order.id, { costPrice, sellPrice });
      await onChanged();
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;
    setLoading(true);
    try {
      await DataService.addPayment(order.id, { amount: paymentAmount, paymentMethod });
      setPaymentAmount(0);
      await onChanged();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Drawer Header */}
        <div className="h-16 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-sm">Print Job Ticket {order.pjoNumber || `#${order.id.slice(0, 8)}`}</h2>
            <p className="text-[11px] text-slate-400">{order.productName} &bull; {order.quantity} pcs</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Job Ticket
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div id="printable-job-sheet" className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Customer Card */}
          {(() => {
            const opts = order.options || {};
            const phoneNum = String(opts.phone || opts.Phone || opts.phoneNumber || '');
            return (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Contact Information</h3>
                  {phoneNum && (
                    <a
                      href={`tel:${phoneNum}`}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call {phoneNum}
                    </a>
                  )}
                </div>
                <div className="text-xs text-slate-800 space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{order.userName || 'Guest Customer'}</p>
                  <p className="font-mono text-slate-600">{order.userEmail}</p>
                  {phoneNum && (
                    <p className="font-bold text-emerald-600 flex items-center gap-1 text-xs">
                      <Phone className="w-3.5 h-3.5" /> {phoneNum}
                    </p>
                  )}
                  <p className="text-slate-400 text-[10px]">PJO Created: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            );
          })()}

          {/* Specifications & Finishing Options */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Print & Finishing Specifications</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Substrate / Product:</span>
                <span className="font-bold text-slate-900">{order.productName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Production Quantity:</span>
                <span className="font-bold text-slate-900">{order.quantity} pcs</span>
              </div>

              {order.finishingSpecs?.lamination && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Lamination:</span>
                  <span className="font-bold text-emerald-700">{order.finishingSpecs.lamination}</span>
                </div>
              )}
              {order.finishingSpecs?.foiling && order.finishingSpecs.foiling !== 'None' && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Hot Foil Stamping:</span>
                  <span className="font-bold text-amber-600">{order.finishingSpecs.foiling}</span>
                </div>
              )}
              {order.finishingSpecs?.uv && order.finishingSpecs.uv !== 'None' && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Spot UV Coating:</span>
                  <span className="font-bold text-cyan-700">{order.finishingSpecs.uv}</span>
                </div>
              )}
              {order.finishingSpecs?.emboss && order.finishingSpecs.emboss !== 'None' && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Embossing:</span>
                  <span className="font-bold text-purple-700">{order.finishingSpecs.emboss}</span>
                </div>
              )}
              {order.finishingSpecs?.dieCut && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Die-Cutting:</span>
                  <span className="font-semibold text-slate-900">{order.finishingSpecs.dieCut}</span>
                </div>
              )}

              {Object.entries(order.options || {})
                .filter(([key]) => !['phone', 'Phone', 'phoneNumber', 'companyName', 'specifications', 'artworkFile'].includes(key))
                .map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 capitalize">{key}:</span>
                    <span className="font-semibold text-slate-900">{String(val)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Costing & Profit Margins</h3>
            <form onSubmit={handleUpdateFinance} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Estimated Cost Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Customer Sell Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
                />
              </div>

              <div className="col-span-2 flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-medium">Estimated Profit Margin: <strong className="text-[#2D545E]">${(sellPrice - costPrice).toFixed(2)}</strong></span>
                <button type="submit" disabled={loading} className="px-3 py-1.5 bg-[#2D545E] text-white rounded-lg text-xs font-semibold cursor-pointer">
                  Update Margin
                </button>
              </div>
            </form>
          </div>

          {/* Payment History */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Record Payment</h3>
              <span className="text-xs font-bold text-slate-900">Balance: <span className="text-rose-600">${balance.toFixed(2)}</span></span>
            </div>

            <form onSubmit={handleAddPayment} className="flex gap-2">
              <input
                type="number"
                step="0.01"
                placeholder="Amount ($)"
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cheque">Cheque</option>
              </select>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[#2D545E] hover:bg-[#1E373F] text-white font-bold rounded-xl text-xs cursor-pointer">
                Record
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            CREATE MANUAL ORDER MODAL                       */
/* -------------------------------------------------------------------------- */

function CreateOrderModal({
  products,
  onClose,
  onSave
}: {
  products: Product[];
  onClose: () => void;
  onSave: (order: Partial<Order>) => Promise<void>;
}) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !userEmail) return;
    setLoading(true);
    try {
      const totalPrice = customPrice ?? (product.price * quantity);
      const pjoNumber = `PJO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await onSave({
        productId: product.id,
        productName: product.name,
        quantity,
        userEmail,
        userName: userName || userEmail,
        totalPrice,
        sellPrice: totalPrice,
        costPrice: totalPrice * 0.5,
        options: {},
        status: 'pending',
        paymentStatus: 'unpaid',
        isQuotation: false,
        pjoNumber,
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Create New Print Work Order (PJO)</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Email</label>
            <input
              type="email"
              placeholder="client@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name (Optional)</label>
            <input
              type="text"
              placeholder="Acme Corp / John Doe"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (${p.price}/{p.unit})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder={product ? String(product.price * quantity) : 'Auto'}
                value={customPrice !== undefined ? customPrice : ''}
                onChange={(e) => setCustomPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-[#E17055] hover:bg-[#D45F44] text-white rounded-xl text-xs font-bold shadow-md shadow-[#E17055]/20">
              Create PJO Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         CREATE MANUAL QUOTATION MODAL                      */
/* -------------------------------------------------------------------------- */

function CreateQuotationModal({
  products,
  onClose,
  onSave
}: {
  products: Product[];
  onClose: () => void;
  onSave: (quote: any) => Promise<void>;
}) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState(500);
  const [specifications, setSpecifications] = useState('');
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !userEmail) return;
    setLoading(true);
    try {
      const quotedPrice = customPrice ?? (product.price * quantity);
      await onSave({
        userId: `cust_${Date.now()}`,
        productId: product.id,
        productName: product.name,
        quantity,
        userEmail,
        userName: userName || userEmail,
        phone,
        companyName,
        quotedPrice,
        totalPrice: quotedPrice,
        sellPrice: quotedPrice,
        options: {
          phone,
          companyName,
          specifications,
        },
        notes: specifications,
        quoteStatus: 'new',
        isQuotation: true,
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Create Manual Quote Request</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Email *</label>
            <input
              type="email"
              placeholder="client@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Company / Brand Name</label>
            <input
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Product / Substrate *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (${p.price}/{p.unit})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Est. Quote Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder={product ? String(product.price * quantity) : 'Auto'}
                value={customPrice !== undefined ? customPrice : ''}
                onChange={(e) => setCustomPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Specifications & Requirements</label>
            <textarea
              rows={3}
              placeholder="Dimensions, stock, colors, custom finish..."
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-slate-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-xs">
              Save Quotation Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         CREATE MANUAL CUSTOMER MODAL                       */
/* -------------------------------------------------------------------------- */

function CreateCustomerModal({
  onClose,
  onSave
}: {
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;
    setLoading(true);
    try {
      await onSave({
        userEmail,
        userName: userName || userEmail,
        phone,
        companyName,
        notes,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Add New Customer Profile</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Email *</label>
            <input
              type="email"
              placeholder="client@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Company / Brand Name</label>
            <input
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Address</label>
            <textarea
              rows={2}
              placeholder="Customer notes or address..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-slate-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-[#2D545E] hover:bg-[#1E373F] text-white rounded-xl text-xs font-bold shadow-md shadow-[#2D545E]/20">
              Save Customer Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            LIVE STOREFRONT EDITOR                          */
/* -------------------------------------------------------------------------- */

export function WebsiteEditorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<ServiceCategory> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const loadEditor = async () => {
    const [nextProducts, nextCategories, nextSettings] = await Promise.all([
      DataService.getProducts(),
      DataService.getCategories(),
      DataService.getSiteSettings(),
    ]);
    setProducts(nextProducts);
    setCategories(nextCategories);
    setSettings({
      header: { ...defaultSettings.header, ...nextSettings.header },
      theme: { ...defaultSettings.theme, ...nextSettings.theme },
      homepage: { ...defaultSettings.homepage, ...nextSettings.homepage },
      footer: { ...defaultSettings.footer, ...nextSettings.footer },
      documents: { ...defaultSettings.documents, ...nextSettings.documents },
    });
    setLoading(false);
  };

  useEffect(() => {
    loadEditor().catch(() => setLoading(false));
  }, []);

  const saveWebsite = async () => {
    await Promise.all([
      DataService.saveSiteSetting('header', settings.header),
      DataService.saveSiteSetting('homepage', settings.homepage),
      DataService.saveSiteSetting('theme', settings.theme),
      DataService.saveSiteSetting('footer', settings.footer),
      DataService.saveSiteSetting('documents', settings.documents),
    ]);
    setNotice('Saved');
    setTimeout(() => setNotice(''), 2200);
  };

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingProduct) return;
    await DataService.saveProduct(editingProduct);
    setEditingProduct(null);
    await loadEditor();
  };

  const updateOption = (index: number, updates: Partial<ProductOption>) => {
    if (!editingProduct) return;
    const options = [...(editingProduct.options || [])];
    options[index] = { ...options[index], ...updates };
    setEditingProduct({ ...editingProduct, options });
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingCategory) return;
    await DataService.saveCategory({
      ...editingCategory,
      id: editingCategory.id?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    });
    setEditingCategory(null);
    await loadEditor();
  };

  if (loading) {
    return <div className="h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-mono"><div className="w-8 h-8 border-2 border-slate-700 border-t-emerald-500 rounded-full animate-spin mr-3" /> Loading Live Editor...</div>;
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <LiveWebsiteEditor
        settings={settings}
        setSettings={setSettings}
        products={products}
        categories={categories}
        onEditProduct={setEditingProduct}
        onCreateProduct={() => setEditingProduct({ ...blankProduct, categoryId: categories[0]?.id || '' })}
        onEditCategory={setEditingCategory}
        onCreateCategory={() => setEditingCategory({ ...blankCategory })}
        onSave={saveWebsite}
        notice={notice}
      />
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          setProduct={setEditingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={saveProduct}
          updateOption={updateOption}
        />
      )}
      {editingCategory && (
        <CategoryModal
          category={editingCategory}
          setCategory={setEditingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={saveCategory}
        />
      )}
    </div>
  );
}

function LiveWebsiteEditor({
  settings,
  setSettings,
  products,
  categories,
  onEditProduct,
  onCreateProduct,
  onEditCategory,
  onCreateCategory,
  onSave,
  notice,
}: {
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  products: Product[];
  categories: ServiceCategory[];
  onEditProduct: (product: Product) => void;
  onCreateProduct: () => void;
  onEditCategory: (category: ServiceCategory) => void;
  onCreateCategory: () => void;
  onSave: () => void;
  notice?: string;
}) {
  const [selectedSection, setSelectedSection] = useState<WebsiteSection>('header');
  const previewCategories = categories.map(category => ({
    ...category,
    products: products.filter(product => product.categoryId === category.id),
  }));

  return (
    <div className="h-screen grid grid-cols-[260px_minmax(480px,1fr)_340px] grid-rows-[60px_minmax(0,1fr)]">
      <header className="col-span-3 bg-slate-900 text-white px-5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => { window.close(); window.location.href = '/admin'; }} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center" title="Back to PlazaHQ ERP"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="font-bold text-sm">PlazaHQ Live Editor</div>
            <div className="text-[10px] text-slate-400 font-mono">Storefront Page Customizer</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="h-9 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 text-xs font-semibold"><ExternalLink className="w-3.5 h-3.5" /> View site</a>
          <button onClick={onSave} className="h-9 bg-[#E17055] hover:bg-[#D45F44] text-white px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#E17055]/20 cursor-pointer"><Save className="w-3.5 h-3.5" /> {notice || 'Publish Changes'}</button>
        </div>
      </header>

      <aside className="bg-white border-r border-slate-200 min-h-0 overflow-y-auto">
        <div className="px-4 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website Layout Sections</div>
        <div className="p-2 space-y-1">
          {([
            ['header', 'Header Navigation'],
            ['hero', 'Hero Banner'],
            ['products', 'Product Catalog'],
            ['services', 'Services Grid'],
            ['footer', 'Footer & Contacts'],
            ['theme', 'Theme Styling'],
          ] as [WebsiteSection, string][]).map(([section, label]) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                selectedSection === section ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0 min-h-0 p-4 bg-slate-100 overflow-y-auto">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
          <div className="h-8 bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-slate-400 ml-2">https://printplaza.com (Live Preview)</span>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#FDFCFB]">
            <Hero settings={settings.homepage} />
            <ServiceGrid categories={previewCategories} onSelect={() => {}} />
          </div>
        </div>
      </div>

      <aside className="bg-white border-l border-slate-200 min-h-0 overflow-y-auto p-4 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          Editing Section: {selectedSection}
        </h3>

        {selectedSection === 'hero' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Hero Title</label>
              <input
                type="text"
                value={settings.homepage?.heroTitle || ''}
                onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, heroTitle: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Hero Subtitle</label>
              <textarea
                value={settings.homepage?.heroSubtitle || ''}
                onChange={(e) => setSettings({ ...settings, homepage: { ...settings.homepage, heroSubtitle: e.target.value } })}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>
        )}

        {selectedSection === 'header' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Brand Logo Text</label>
              <input
                type="text"
                value={settings.header?.logoText || ''}
                onChange={(e) => setSettings({ ...settings, header: { ...settings.header, logoText: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
              />
            </div>
          </div>
        )}

        {selectedSection === 'footer' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={settings.footer?.email || ''}
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, email: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Studio Address</label>
              <input
                type="text"
                value={settings.footer?.address || ''}
                onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, address: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
