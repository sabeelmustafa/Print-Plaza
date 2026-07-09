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
} from 'lucide-react';
import { DataService } from '../lib/dataService';
import { MediaAsset, NavMenuItem, Order, OrderItem, Product, ProductOption, ServiceCategory, SiteSettings } from '../types';
import Hero from './Hero';
import ProductCard from './ProductCard';
import ServiceGrid from './ServiceGrid';

type AdminTab = 'site' | 'products' | 'categories' | 'media' | 'orders' | 'customers' | 'business';
type WebsiteSection = 'header' | 'hero' | 'products' | 'services' | 'footer' | 'theme';

const fieldTypes: ProductOption['type'][] = ['text', 'textarea', 'number', 'select', 'checkbox', 'file'];

const blankProduct: Partial<Product> = {
  name: '',
  description: '',
  price: 0,
  unit: '',
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
  const [activeTab, setActiveTab] = useState<AdminTab>('site');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<ServiceCategory> | null>(null);
  const [editingMedia, setEditingMedia] = useState<Partial<MediaAsset>>({ title: '', url: '', altText: '' });
  const [businessOrder, setBusinessOrder] = useState<Order | null>(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextProducts, nextCategories, nextOrders, nextSettings, nextMedia] = await Promise.all([
        DataService.getProducts(),
        DataService.getCategories(),
        DataService.getOrders(),
        DataService.getSiteSettings(),
        DataService.getMedia(),
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      setOrders(nextOrders);
      setSettings({
        header: { ...defaultSettings.header, ...nextSettings.header },
        theme: { ...defaultSettings.theme, ...nextSettings.theme },
        homepage: { ...defaultSettings.homepage, ...nextSettings.homepage },
        footer: { ...defaultSettings.footer, ...nextSettings.footer },
        documents: { ...defaultSettings.documents, ...nextSettings.documents },
      });
      setMedia(nextMedia);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const flash = (message: string) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 2500);
  };

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingProduct) return;
    await DataService.saveProduct(editingProduct);
    setEditingProduct(null);
    await loadAll();
    flash('Product saved.');
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
    flash('Category saved.');
  };

  const saveSite = async () => {
    await Promise.all([
      DataService.saveSiteSetting('header', settings.header),
      DataService.saveSiteSetting('homepage', settings.homepage),
      DataService.saveSiteSetting('theme', settings.theme),
      DataService.saveSiteSetting('footer', settings.footer),
      DataService.saveSiteSetting('documents', settings.documents),
    ]);
    flash('Website settings saved.');
  };

  const saveMedia = async (event: React.FormEvent) => {
    event.preventDefault();
    await DataService.saveMedia(editingMedia);
    setEditingMedia({ title: '', url: '', altText: '' });
    await loadAll();
    flash('Media saved.');
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

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-black flex">
      <aside className="hidden lg:flex w-72 bg-[#101415] text-white p-7 flex-col border-r-4 border-[#2D545E]">
        <div className="mb-10 border-b border-white/10 pb-8">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <span className="w-2.5 h-9 bg-[#2D545E] -skew-x-12" />
              <span className="w-2.5 h-9 bg-[#E17055] -skew-x-12" />
            </div>
            <div>
              <div className="text-3xl font-display font-black tracking-tight leading-none"><span className="text-white">Plaza</span><span className="text-[#E17055]">HQ</span></div>
              <div className="text-[8px] uppercase tracking-[0.32em] text-[#66A0AA] font-black mt-2">Business Command</div>
            </div>
          </div>
        </div>
        <nav className="space-y-3 flex-1">
          <TabButton tab="site" activeTab={activeTab} onClick={setActiveTab} icon={<LayoutDashboard />} label="Website" />
          <TabButton tab="products" activeTab={activeTab} onClick={setActiveTab} icon={<Boxes />} label="Products" />
          <TabButton tab="categories" activeTab={activeTab} onClick={setActiveTab} icon={<ListTree />} label="Categories" />
          <TabButton tab="media" activeTab={activeTab} onClick={setActiveTab} icon={<ImageIcon />} label="Media URLs" />
          <TabButton tab="orders" activeTab={activeTab} onClick={setActiveTab} icon={<ShoppingBag />} label="Orders" />
          <TabButton tab="customers" activeTab={activeTab} onClick={setActiveTab} icon={<Users />} label="Customers" />
          <TabButton tab="business" activeTab={activeTab} onClick={setActiveTab} icon={<ReceiptText />} label="Business" />
        </nav>
        <button onClick={logout} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-[#F6F5F2]/95 backdrop-blur border-b border-black/10 px-6 lg:px-12 py-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
              {activeTab === 'site' && 'Website Editor'}
              {activeTab === 'products' && 'Product Editor'}
              {activeTab === 'categories' && 'Category Editor'}
              {activeTab === 'media' && 'Media Library'}
              {activeTab === 'orders' && 'Order Queue'}
              {activeTab === 'customers' && 'Customer Ledger'}
              {activeTab === 'business' && 'Business Manager'}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#2D545E] font-black mt-2">PlazaHQ / Business operating system</p>
          </div>
          <div className="flex lg:hidden gap-2 overflow-x-auto">
            {(['site', 'products', 'categories', 'media', 'orders', 'customers', 'business'] as AdminTab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border ${activeTab === tab ? 'bg-black text-white' : 'bg-white text-black/50'}`}>
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="p-6 lg:p-12">
          {notice && (
            <div className="mb-6 flex items-center gap-3 bg-green-50 text-green-700 border border-green-200 px-5 py-4 text-[11px] font-black uppercase tracking-widest">
              <CheckCircle className="w-4 h-4" /> {notice}
            </div>
          )}
          {error && <div className="mb-6 bg-red-50 text-red-700 border border-red-200 px-5 py-4 text-sm font-bold">{error}</div>}

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-black/10 border-t-black animate-spin rounded-full" />
            </div>
          ) : (
            <>
              {activeTab === 'site' && (
                <div className="bg-white border border-black/10 p-8 md:p-12 max-w-4xl">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center mb-8"><Monitor className="w-6 h-6" /></div>
                  <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">Edit the live storefront</h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/55 font-medium">Open the visual editor in a dedicated window. Select any storefront section on the left, see the complete page in the center, and change its content on the right.</p>
                  <button onClick={() => window.open('/admin/editor', '_blank', 'noopener,noreferrer')} className="mt-9 bg-black text-white px-7 py-5 text-[10px] font-black uppercase tracking-[0.28em] inline-flex items-center gap-3 hover:bg-[#2D545E]">
                    <ExternalLink className="w-4 h-4" /> Open Website Editor
                  </button>
                </div>
              )}
              {activeTab === 'products' && (
                <ProductsEditor
                  products={products}
                  categories={categories}
                  onEdit={setEditingProduct}
                  onCreate={() => setEditingProduct({ ...blankProduct, categoryId: categories[0]?.id || '' })}
                  onDelete={async id => {
                    if (!confirm('Delete this product from the storefront?')) return;
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
              {activeTab === 'media' && (
                <MediaEditor media={media} editingMedia={editingMedia} setEditingMedia={setEditingMedia} onSave={saveMedia} />
              )}
              {activeTab === 'orders' && (
                <OrdersEditor
                  orders={orders}
                  onCreate={() => setCreatingOrder(true)}
                  onManage={setBusinessOrder}
                  onStatus={async (id, status) => {
                    await DataService.updateOrderStatus(id, status);
                    await loadAll();
                  }}
                />
              )}
              {activeTab === 'business' && (
                <BusinessEditor orders={orders} settings={settings} onManage={setBusinessOrder} />
              )}
              {activeTab === 'customers' && (
                <CustomersEditor orders={orders} settings={settings} onManage={setBusinessOrder} />
              )}
            </>
          )}
        </div>
      </main>

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
            flash('Business records updated.');
          }}
        />
      )}

      {creatingOrder && (
        <CreateOrderModal
          products={products}
          onClose={() => setCreatingOrder(false)}
          onSave={async order => {
            await DataService.createAdminOrder(order);
            setCreatingOrder(false);
            await loadAll();
            flash('Order created.');
          }}
        />
      )}
    </div>
  );
}

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
    return <div className="h-screen bg-[#F6F6F4] flex items-center justify-center"><div className="w-10 h-10 border-2 border-black/15 border-t-black rounded-full animate-spin" /></div>;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#ECECEA]">
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

function TabButton({ tab, activeTab, onClick, icon, label }: { tab: AdminTab; activeTab: AdminTab; onClick: (tab: AdminTab) => void; icon: React.ReactElement; label: string }) {
  return (
    <button onClick={() => onClick(tab)} className={`w-full flex items-center gap-4 px-4 py-4 text-[10px] uppercase tracking-[0.25em] font-black transition-colors ${activeTab === tab ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
      {React.cloneElement(icon, { className: 'w-4 h-4' })} {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-3">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black/35">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full bg-white border border-black/10 px-4 py-3 outline-none focus:border-black font-bold text-sm';
const textareaClass = `${inputClass} min-h-28 resize-y`;

function fallbackNavItems(header: SiteSettings['header'] = {}): NavMenuItem[] {
  return header.navItems?.length
    ? header.navItems
    : [
        { id: 'services', label: header.servicesLabel || 'Services', url: '#services' },
        { id: 'products', label: header.productsLabel || 'Production', url: '#products' },
      ];
}

function createNavItem(): NavMenuItem {
  return {
    id: `menu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: 'New link',
    url: '/',
  };
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
    <div className="h-screen grid grid-cols-[250px_minmax(480px,1fr)_340px] grid-rows-[64px_minmax(0,1fr)]">
      <header className="col-span-3 bg-white border-b border-black/10 px-5 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => { window.close(); window.location.href = '/admin'; }} className="w-10 h-10 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white" title="Back to PlazaHQ"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="font-display font-black text-lg uppercase leading-none">PlazaHQ Editor</div>
            <div className="text-[8px] uppercase tracking-[0.25em] text-black/35 mt-1">Home page</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="h-10 px-4 border border-black/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:border-black"><ExternalLink className="w-3.5 h-3.5" /> View site</a>
          <button onClick={onSave} className="h-10 bg-black text-white px-6 text-[9px] font-black uppercase tracking-[0.22em] flex items-center gap-2 hover:bg-[#2D545E]"><Save className="w-3.5 h-3.5" /> {notice || 'Save'}</button>
        </div>
      </header>

      <aside className="bg-white border-r border-black/10 min-h-0 overflow-y-auto">
        <div className="px-5 py-5 border-b border-black/10">
          <div className="text-[9px] font-black uppercase tracking-[0.28em] text-black/35">Home page</div>
        </div>
        <div className="py-3">
          {([
            ['header', 'Header'],
            ['hero', 'Hero'],
            ['products', 'Products'],
            ['services', 'Services'],
            ['footer', 'Footer'],
            ['theme', 'Theme settings'],
          ] as [WebsiteSection, string][]).map(([section, label]) => (
            <button key={section} onClick={() => setSelectedSection(section)} className={`w-full px-5 py-4 flex items-center gap-3 text-left text-[11px] font-bold transition-colors ${selectedSection === section ? 'bg-[#E8F0FF] text-[#135FCB] border-r-2 border-[#135FCB]' : 'hover:bg-black/5'}`}>
              <span className="w-4 h-4 border border-current/30 flex items-center justify-center"><span className="w-1.5 h-1.5 bg-current" /></span>{label}
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0 min-h-0 p-5 bg-[#ECECEA]">
        <div className="bg-white border border-black/10 overflow-hidden h-full shadow-sm">
          <div className="h-11 border-b border-black/10 px-5 flex items-center justify-between bg-[#F8F7F4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E17055]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4C84A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D545E]" />
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.28em] text-black/35">Live Website Preview</div>
          </div>

          <div className="h-[calc(100%-44px)] overflow-y-auto bg-[#FDFCFB]">
            <EditorFrame label="Header" active={selectedSection === 'header'} onClick={() => setSelectedSection('header')}>
              <HeaderPreview settings={settings.header} />
            </EditorFrame>
            <EditorFrame label="Hero" active={selectedSection === 'hero'} onClick={() => setSelectedSection('hero')}>
              <Hero settings={settings.homepage} theme={settings.theme} />
            </EditorFrame>

            <EditorFrame label="Products" active={selectedSection === 'products'} onClick={() => setSelectedSection('products')}>
              <ProductsPreview products={products} onEdit={onEditProduct} />
            </EditorFrame>

            <EditorFrame label="Services" active={selectedSection === 'services'} onClick={() => setSelectedSection('services')}>
              <ServiceGrid categories={previewCategories} onSelect={() => setSelectedSection('services')} />
            </EditorFrame>

            <EditorFrame label="Footer" active={selectedSection === 'footer'} onClick={() => setSelectedSection('footer')}>
              <FooterPreview settings={settings} />
            </EditorFrame>
          </div>
        </div>
      </div>

      <aside className="bg-white border-l border-black/10 min-h-0 overflow-y-auto">
        <div className="p-5 border-b border-black/10 flex items-center justify-between">
          <div className="text-[9px] font-black uppercase tracking-[0.28em] text-black/35">Section settings</div>
          <Settings className="w-4 h-4 text-black/30" />
        </div>
        <div className="p-5">
          <SectionSettings
            selectedSection={selectedSection}
            settings={settings}
            setSettings={setSettings}
            products={products}
            categories={categories}
            onEditProduct={onEditProduct}
            onCreateProduct={onCreateProduct}
            onEditCategory={onEditCategory}
            onCreateCategory={onCreateCategory}
          />
        </div>
      </aside>
    </div>
  );
}

function HeaderPreview({ settings }: { settings?: SiteSettings['header'] }) {
  const logoSize = Math.min(Math.max(Number(settings?.logoSize || 36), 24), 96);
  const navFontSize = Math.min(Math.max(Number(settings?.navMenuFontSize || 10), 9), 16);
  const navItems = fallbackNavItems(settings);
  const previewLogo = settings?.logoImageDark || settings?.logoImage;

  return (
    <div className="h-20 px-8 flex items-center justify-between border-b border-black/10 bg-white">
      <div className="flex items-center gap-3">
        {previewLogo ? <img src={previewLogo} alt="" className="max-w-52 object-contain" style={{ height: `${logoSize}px` }} /> : <>
          <div className="flex gap-1"><span className="w-2 h-7 bg-[#2D545E] -skew-x-12" /><span className="w-2 h-7 bg-[#E17055] -skew-x-12" /></div>
          <div><div className="font-display font-black text-xl leading-none">{settings?.logoText || 'PRINT PLAZA'}</div><div className="text-[7px] font-black uppercase tracking-[0.3em] text-[#2D545E] mt-1">{settings?.tagline || 'Industrial Print Production'}</div></div>
        </>}
      </div>
      <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest">
        {navItems.map(item => <span key={item.id} style={{ fontSize: `${navFontSize}px` }}>{item.label || 'Menu item'}</span>)}
        <span className="text-black/40" style={{ fontSize: `${navFontSize}px` }}>{settings?.loginLabel || 'Auth Registry'}</span>
        <span className="bg-black text-white px-5 py-3">{settings?.buttonText || 'Start Project'}</span>
      </div>
    </div>
  );
}

function EditorFrame({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <section onClick={onClick} className={`relative cursor-pointer ${active ? 'ring-2 ring-[#E17055] ring-inset' : 'hover:ring-2 hover:ring-black/20 hover:ring-inset'}`}>
      <div className={`sticky top-0 z-20 w-fit px-4 py-2 text-[9px] font-black uppercase tracking-[0.25em] ${active ? 'bg-[#E17055] text-white' : 'bg-black text-white/70'}`}>
        {label}
      </div>
      {children}
    </section>
  );
}

function ProductsPreview({ products, onEdit }: { products: Product[]; onEdit: (product: Product) => void }) {
  return (
    <section className="py-20 bg-[#FDFCFB] border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.32em] text-[#2D545E] mb-6">Core Output</div>
            <h2 className="text-[2.8rem] sm:text-[4.8rem] font-display font-black tracking-tight leading-[0.84] uppercase">Production <br/><span className="text-black/10 italic font-serif lowercase">Unit.</span></h2>
          </div>
          <p className="text-[15px] leading-[1.8] text-black/62 max-w-md font-medium">Browse the production lineup. Select a product card here, then edit details in the product drawer.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-black/8 border border-black/8">
          {products.slice(0, 6).map(product => (
            <div key={product.id} onClick={(event) => { event.stopPropagation(); onEdit(product); }}>
              <ProductCard product={product} onOrder={onEdit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterPreview({ settings }: { settings: SiteSettings }) {
  const footer = settings.footer || {};

  return (
    <footer className="bg-black text-white pt-20 pb-14 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 flex">
        <div className="flex-1 bg-[#2D545E]" />
        <div className="flex-1 bg-[#E17055]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h6 className="font-display font-black text-4xl sm:text-5xl mb-4 tracking-tight uppercase leading-none">{footer.brandText || 'Print Plaza.'}</h6>
          <div className="text-[10px] uppercase tracking-[0.32em] font-black text-[#66A0AA] mb-8">{footer.tagline || 'Creative Production Studio'}</div>
          <p className="text-sm leading-loose opacity-70 max-w-sm font-medium">{footer.description || 'Refined creative production with a focus on tactile excellence and tonal precision.'}</p>
        </div>
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.28em] font-black mb-8 text-[#E17055]">The Archive</h5>
          <ul className="space-y-4 text-sm font-bold opacity-70 uppercase">
            <li>Color History</li>
            <li>Paper Lab</li>
            <li>Digital Unit</li>
            <li>Dispatch</li>
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] uppercase tracking-[0.28em] font-black mb-8 text-[#66A0AA]">Plaza Studio</h5>
          <ul className="space-y-4 text-sm font-medium leading-relaxed opacity-70 font-mono">
            <li>{footer.email || 'hi@print.plaza'}</li>
            <li>{footer.phone || '+1 212 555 7788'}</li>
            <li>{footer.address || 'Studio Block A, Creative District, NY 10001'}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function SectionSettings({
  selectedSection,
  settings,
  setSettings,
  products,
  categories,
  onEditProduct,
  onCreateProduct,
  onEditCategory,
  onCreateCategory,
}: {
  selectedSection: WebsiteSection;
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  products: Product[];
  categories: ServiceCategory[];
  onEditProduct: (product: Product) => void;
  onCreateProduct: () => void;
  onEditCategory: (category: ServiceCategory) => void;
  onCreateCategory: () => void;
}) {
  const homepage = settings.homepage || {};
  const theme = settings.theme || {};
  const footer = settings.footer || {};
  const header = settings.header || {};
  const documents = settings.documents || {};
  const headerNavItems = fallbackNavItems(header);
  const updateHeader = (updates: SiteSettings['header']) => setSettings({ ...settings, header: { ...header, ...updates } });
  const updateDocuments = (updates: SiteSettings['documents']) => setSettings({ ...settings, documents: { ...documents, ...updates } });
  const updateNavItem = (id: string, updates: Partial<NavMenuItem>) => {
    updateHeader({
      navItems: headerNavItems.map(item => item.id === id ? { ...item, ...updates } : item),
    });
  };

  if (selectedSection === 'header') {
    return (
      <div className="space-y-5">
        <PanelTitle title="Header" />
        <ImageUploadField
          label="Logo for light header"
          value={header.logoImageDark || header.logoImage || ''}
          previewTitle="Logo for light header"
          onChange={url => updateHeader({ logoImageDark: url, logoImage: url })}
        />
        <ImageUploadField
          label="Logo for transparent dark header"
          value={header.logoImageLight || header.logoImageDark || header.logoImage || ''}
          previewTitle="Logo for dark hero header"
          onChange={url => updateHeader({ logoImageLight: url })}
        />
        <ImageUploadField
          label="Document logo"
          value={documents.invoiceLogo || header.logoImageDark || header.logoImage || ''}
          previewTitle="Document logo"
          onChange={url => updateDocuments({ invoiceLogo: url })}
        />
        <Field label="Logo size">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="24"
              max="96"
              value={header.logoSize || 36}
              onChange={event => updateHeader({ logoSize: Number(event.target.value) })}
              className="w-full accent-[#2D545E]"
            />
            <input
              type="number"
              min="24"
              max="96"
              className={`${inputClass} w-24`}
              value={header.logoSize || 36}
              onChange={event => updateHeader({ logoSize: Number(event.target.value) })}
            />
          </div>
        </Field>
        <Field label="Logo text"><input className={inputClass} value={header.logoText || ''} onChange={event => updateHeader({ logoText: event.target.value })} /></Field>
        <Field label="Tagline"><input className={inputClass} value={header.tagline || ''} onChange={event => updateHeader({ tagline: event.target.value })} /></Field>

        <div className="border border-black/10 bg-white">
          <div className="p-4 border-b border-black/10 flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-black/35">Navigation menu</div>
              <p className="mt-2 text-xs font-bold text-black/45">Use section links like #products or full links like https://example.com.</p>
            </div>
            <button
              type="button"
              onClick={() => updateHeader({ navItems: [...headerNavItems, createNavItem()] })}
              className="h-10 px-3 bg-black text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="p-4 space-y-4">
            <Field label="Menu text size">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="9"
                  max="16"
                  value={header.navMenuFontSize || 10}
                  onChange={event => updateHeader({ navMenuFontSize: Number(event.target.value) })}
                  className="w-full accent-[#2D545E]"
                />
                <input
                  type="number"
                  min="9"
                  max="16"
                  className={`${inputClass} w-24`}
                  value={header.navMenuFontSize || 10}
                  onChange={event => updateHeader({ navMenuFontSize: Number(event.target.value) })}
                />
              </div>
            </Field>
            {headerNavItems.map((item, index) => (
              <div key={item.id} className="border border-black/10 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.24em] text-[#2D545E]">Menu item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => updateHeader({ navItems: headerNavItems.filter(menuItem => menuItem.id !== item.id) })}
                    className="text-red-500"
                    title="Remove menu item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Field label="Label"><input className={inputClass} value={item.label || ''} onChange={event => updateNavItem(item.id, { label: event.target.value })} /></Field>
                <Field label="Link"><input className={inputClass} value={item.url || ''} onChange={event => updateNavItem(item.id, { url: event.target.value })} placeholder="#products or https://..." /></Field>
                <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-black/50">
                  <input type="checkbox" checked={Boolean(item.openInNewTab)} onChange={event => updateNavItem(item.id, { openInNewTab: event.target.checked })} />
                  Open in new tab
                </label>
              </div>
            ))}
          </div>
        </div>

        <Field label="Login link text"><input className={inputClass} value={header.loginLabel || ''} onChange={event => updateHeader({ loginLabel: event.target.value })} /></Field>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Action button text"><input className={inputClass} value={header.buttonText || ''} onChange={event => updateHeader({ buttonText: event.target.value })} /></Field>
          <Field label="Action button link"><input className={inputClass} value={header.buttonUrl || ''} onChange={event => updateHeader({ buttonUrl: event.target.value })} placeholder="#products" /></Field>
        </div>
      </div>
    );
  }

  if (selectedSection === 'hero') {
    return (
      <div className="space-y-5">
        <PanelTitle title="Hero" />
        <Field label="Hero title"><input className={inputClass} value={homepage.heroTitle || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, heroTitle: event.target.value } })} /></Field>
        <Field label="Hero subtitle"><textarea className={textareaClass} value={homepage.heroSubtitle || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, heroSubtitle: event.target.value } })} /></Field>
        <Field label="Primary button"><input className={inputClass} value={homepage.primaryButtonText || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, primaryButtonText: event.target.value } })} /></Field>
        <Field label="Secondary button"><input className={inputClass} value={homepage.secondaryButtonText || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, secondaryButtonText: event.target.value } })} /></Field>
        <ImageUploadField
          label="Hero image"
          value={homepage.heroImage || ''}
          previewTitle="Hero image"
          onChange={url => setSettings({ ...settings, homepage: { ...homepage, heroImage: url } })}
        />
      </div>
    );
  }

  if (selectedSection === 'products') {
    return (
      <div className="space-y-5">
        <PanelTitle title="Products" />
        <button onClick={onCreateProduct} className="w-full bg-black text-white px-4 py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Plus className="w-3.5 h-3.5" /> Add product</button>
        <p className="text-sm leading-relaxed text-black/55 font-medium">Click any product in the preview or use this list to edit product text, pricing, images, and quote fields.</p>
        <div className="space-y-2">
          {products.map(product => (
            <button key={product.id} onClick={() => onEditProduct(product)} className="w-full text-left border border-black/10 p-4 hover:border-black bg-white">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#2D545E] mb-1">{categories.find(category => category.id === product.categoryId)?.title || product.categoryId}</div>
              <div className="font-display font-black uppercase leading-tight">{product.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedSection === 'services') {
    return (
      <div className="space-y-5">
        <PanelTitle title="Services" />
        <button onClick={onCreateCategory} className="w-full bg-black text-white px-4 py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Plus className="w-3.5 h-3.5" /> Add service</button>
        <p className="text-sm leading-relaxed text-black/55 font-medium">Select a service below to edit its title, description, icon, and position.</p>
        <div className="space-y-2">
          {categories.map(category => (
            <button key={category.id} onClick={() => onEditCategory(category)} className="w-full text-left border border-black/10 p-4 bg-white hover:border-black">
              <div className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-1">{category.id}</div>
              <div className="font-display font-black uppercase leading-tight">{category.title}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (selectedSection === 'theme') {
    return (
      <div className="space-y-5">
        <PanelTitle title="Theme" />
        <div className="grid gap-5">
          {(['primaryColor', 'accentColor', 'backgroundColor', 'textColor'] as const).map(colorKey => (
            <div key={colorKey}>
              <Field label={colorKey.replace('Color', ' color')}>
                <div className="flex gap-2">
                  <input type="color" className="h-12 w-14 border border-black/10" value={theme[colorKey] || '#000000'} onChange={event => setSettings({ ...settings, theme: { ...theme, [colorKey]: event.target.value } })} />
                  <input className={inputClass} value={theme[colorKey] || ''} onChange={event => setSettings({ ...settings, theme: { ...theme, [colorKey]: event.target.value } })} />
                </div>
              </Field>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PanelTitle title="Footer" />
      <Field label="Brand text"><input className={inputClass} value={footer.brandText || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, brandText: event.target.value } })} /></Field>
      <Field label="Tagline"><input className={inputClass} value={footer.tagline || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, tagline: event.target.value } })} /></Field>
      <Field label="Description"><textarea className={textareaClass} value={footer.description || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, description: event.target.value } })} /></Field>
      <Field label="Email"><input className={inputClass} value={footer.email || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, email: event.target.value } })} /></Field>
      <Field label="Phone"><input className={inputClass} value={footer.phone || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, phone: event.target.value } })} /></Field>
      <Field label="Address"><textarea className={textareaClass} value={footer.address || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, address: event.target.value } })} /></Field>
    </div>
  );
}

function PanelTitle({ title }: { title: string }) {
  return (
    <div>
      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#2D545E] mb-2">Edit Section</div>
      <h2 className="text-2xl font-display font-black uppercase tracking-tight">{title}</h2>
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  previewTitle,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  previewTitle: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [mediaLibrary, setMediaLibrary] = useState<MediaAsset[]>([]);
  const [showLibrary, setShowLibrary] = useState(true);

  const loadMediaLibrary = async () => {
    try {
      const assets = await DataService.getMedia();
      setMediaLibrary(assets.filter(asset => Boolean(asset.url)));
    } catch (_error) {
      setMediaLibrary([]);
    }
  };

  useEffect(() => {
    loadMediaLibrary();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const url = await DataService.uploadImage(file, previewTitle);
      onChange(url);
      await loadMediaLibrary();
    } catch (caught) {
      setUploadError(caught instanceof Error ? caught.message : 'Upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Field label={label}>
        <div className="border border-black/10 bg-white p-3">
          <div className="aspect-video bg-black/5 overflow-hidden mb-3 flex items-center justify-center">
            {value ? (
              <img src={value} alt={previewTitle} className="w-full h-full object-cover" />
            ) : (
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-black/25">No image</div>
            )}
          </div>

          {mediaLibrary.length > 0 && (
            <div className="mb-3 border border-black/10 bg-[#F6F5F2]">
              <button
                type="button"
                onClick={() => setShowLibrary(!showLibrary)}
                className="w-full px-3 py-3 text-left text-[9px] font-black uppercase tracking-[0.25em] text-black/55 flex items-center justify-between"
              >
                Uploaded media
                <span>{showLibrary ? 'Hide' : 'Show'}</span>
              </button>
              {showLibrary && (
                <div className="grid grid-cols-3 gap-2 p-3 pt-0 max-h-56 overflow-y-auto">
                  {mediaLibrary.map(asset => {
                    const assetTitle = asset.title || asset.altText || asset.alt_text || 'Media image';
                    const selected = asset.url === value;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => onChange(asset.url)}
                        className={`relative aspect-square overflow-hidden border bg-white ${
                          selected ? 'border-[#E17055] ring-2 ring-[#E17055]/30' : 'border-black/10 hover:border-black'
                        }`}
                        title={assetTitle}
                      >
                        <img src={asset.url} alt={assetTitle} className="w-full h-full object-cover" />
                        {selected && <span className="absolute inset-x-0 bottom-0 bg-[#E17055] text-white text-[8px] font-black uppercase tracking-widest py-1">Selected</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <label className="cursor-pointer bg-black text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#2D545E]">
              {uploading ? 'Uploading...' : 'Upload new'}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <input className={inputClass} value={value} onChange={event => onChange(event.target.value)} placeholder="/uploads/image.jpg" />
          </div>
        </div>
      </Field>
      {uploadError && <p className="text-xs font-bold text-red-600">{uploadError}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-black/10 p-6 md:p-8 space-y-5">
      <h2 className="text-xl font-display font-black uppercase tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function ProductsEditor({ products, categories, onCreate, onEdit, onDelete }: { products: Product[]; categories: ServiceCategory[]; onCreate: () => void; onEdit: (product: Product) => void; onDelete: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <button onClick={onCreate} className="bg-black text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-3"><Plus className="w-4 h-4" /> Add Product</button>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map(product => (
          <article key={product.id} className="bg-white border border-black/10 p-6">
            <div className="aspect-[4/3] bg-black/5 mb-5 overflow-hidden">
              {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-[#2D545E] mb-2">{categories.find(category => category.id === product.categoryId)?.title || product.categoryId}</div>
            <h3 className="text-2xl font-display font-black uppercase leading-none">{product.name}</h3>
            <p className="text-sm text-black/50 mt-3 line-clamp-2">{product.description}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => onEdit(product)} className="flex-1 border border-black/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white">Edit</button>
              <button onClick={() => onDelete(product.id)} className="w-12 border border-black/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProductModal({ product, categories, setProduct, onClose, onSave, updateOption }: { product: Partial<Product>; categories: ServiceCategory[]; setProduct: (product: Partial<Product>) => void; onClose: () => void; onSave: (event: React.FormEvent) => void; updateOption: (index: number, updates: Partial<ProductOption>) => void }) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex justify-end">
      <form onSubmit={onSave} className="bg-white h-full w-full max-w-3xl overflow-y-auto p-8 md:p-10 space-y-7">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-display font-black uppercase">{product.id ? 'Edit Product' : 'New Product'}</h2>
          <button type="button" onClick={onClose}><X className="w-7 h-7" /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Product name"><input required className={inputClass} value={product.name || ''} onChange={event => setProduct({ ...product, name: event.target.value })} /></Field>
          <Field label="Category"><select required className={inputClass} value={product.categoryId || ''} onChange={event => setProduct({ ...product, categoryId: event.target.value })}><option value="">Select category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.title}</option>)}</select></Field>
          <Field label="Price"><input type="number" step="0.01" className={inputClass} value={product.price ?? 0} onChange={event => setProduct({ ...product, price: Number(event.target.value) })} /></Field>
          <Field label="Unit"><input className={inputClass} value={product.unit || ''} onChange={event => setProduct({ ...product, unit: event.target.value })} /></Field>
          <Field label="Max quantity"><input type="number" className={inputClass} value={product.maxQuantity || ''} onChange={event => setProduct({ ...product, maxQuantity: event.target.value ? Number(event.target.value) : undefined })} /></Field>
          <Field label="Sort order"><input type="number" className={inputClass} value={product.sortOrder || 0} onChange={event => setProduct({ ...product, sortOrder: Number(event.target.value) })} /></Field>
        </div>
        <Field label="Description"><textarea className={textareaClass} value={product.description || ''} onChange={event => setProduct({ ...product, description: event.target.value })} /></Field>
        <ImageUploadField
          label="Product image"
          value={product.image || ''}
          previewTitle={product.name || 'Product image'}
          onChange={url => setProduct({ ...product, image: url })}
        />

        <Section title="Custom quote fields">
          <button type="button" onClick={() => setProduct({ ...product, options: [...(product.options || []), { id: `field-${Date.now()}`, label: '', type: 'text', required: true }] })} className="bg-black text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add Field</button>
          <div className="space-y-5">
            {(product.options || []).map((option, index) => (
              <div key={option.id} className="border border-black/10 p-5 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Field label="Label"><input className={inputClass} value={option.label} onChange={event => updateOption(index, { label: event.target.value })} /></Field>
                  <Field label="Type"><select className={inputClass} value={option.type} onChange={event => updateOption(index, { type: event.target.value as ProductOption['type'] })}>{fieldTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></Field>
                  <Field label="Placeholder"><input className={inputClass} value={option.placeholder || ''} onChange={event => updateOption(index, { placeholder: event.target.value })} /></Field>
                </div>
                {option.type === 'select' && <Field label="Dropdown values"><input className={inputClass} value={option.values?.join(', ') || ''} onChange={event => updateOption(index, { values: event.target.value.split(',').map(value => value.trim()).filter(Boolean) })} /></Field>}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-black/50"><input type="checkbox" checked={option.required !== false} onChange={event => updateOption(index, { required: event.target.checked })} /> Required</label>
                  <button type="button" onClick={() => setProduct({ ...product, options: (product.options || []).filter((_, optionIndex) => optionIndex !== index) })} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <button type="submit" className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.35em]">Save Product</button>
      </form>
    </div>
  );
}

function CategoriesEditor({ categories, onCreate, onEdit }: { categories: ServiceCategory[]; onCreate: () => void; onEdit: (category: ServiceCategory) => void }) {
  return (
    <div className="space-y-6">
      <button onClick={onCreate} className="bg-black text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-3"><Plus className="w-4 h-4" /> Add Category</button>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {categories.map(category => (
          <button key={category.id} onClick={() => onEdit(category)} className="text-left bg-white border border-black/10 p-6 hover:border-black">
            <div className="text-[9px] font-black uppercase tracking-widest text-black/30 mb-2">{category.id}</div>
            <h3 className="text-2xl font-display font-black uppercase">{category.title}</h3>
            <p className="text-sm text-black/50 mt-3">{category.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryModal({ category, setCategory, onClose, onSave }: { category: Partial<ServiceCategory>; setCategory: (category: Partial<ServiceCategory>) => void; onClose: () => void; onSave: (event: React.FormEvent) => void }) {
  return (
    <div className="fixed inset-0 z-[80] bg-black/60 flex justify-end">
      <form onSubmit={onSave} className="bg-white h-full w-full max-w-2xl overflow-y-auto p-8 md:p-10 space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-display font-black uppercase">Category</h2>
          <button type="button" onClick={onClose}><X className="w-7 h-7" /></button>
        </div>
        <Field label="Category ID"><input required className={inputClass} value={category.id || ''} onChange={event => setCategory({ ...category, id: event.target.value })} placeholder="packaging" /></Field>
        <Field label="Title"><input required className={inputClass} value={category.title || ''} onChange={event => setCategory({ ...category, title: event.target.value })} /></Field>
        <Field label="Description"><textarea className={textareaClass} value={category.description || ''} onChange={event => setCategory({ ...category, description: event.target.value })} /></Field>
        <Field label="Icon name"><input className={inputClass} value={category.icon || 'Package'} onChange={event => setCategory({ ...category, icon: event.target.value })} /></Field>
        <Field label="Sort order"><input type="number" className={inputClass} value={category.sortOrder || 0} onChange={event => setCategory({ ...category, sortOrder: Number(event.target.value) })} /></Field>
        <button type="submit" className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.35em]">Save Category</button>
      </form>
    </div>
  );
}

function MediaEditor({ media, editingMedia, setEditingMedia, onSave }: { media: MediaAsset[]; editingMedia: Partial<MediaAsset>; setEditingMedia: (asset: Partial<MediaAsset>) => void; onSave: (event: React.FormEvent) => void }) {
  return (
    <div className="space-y-8">
      <form onSubmit={onSave} className="bg-white border border-black/10 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title"><input className={inputClass} value={editingMedia.title || ''} onChange={event => setEditingMedia({ ...editingMedia, title: event.target.value })} /></Field>
          <Field label="Alt text"><input className={inputClass} value={editingMedia.altText || ''} onChange={event => setEditingMedia({ ...editingMedia, altText: event.target.value })} /></Field>
        </div>
        <ImageUploadField
          label="Upload image or paste URL"
          value={editingMedia.url || ''}
          previewTitle={editingMedia.title || 'Media asset'}
          onChange={url => setEditingMedia({ ...editingMedia, url })}
        />
        <button type="submit" className="bg-black text-white h-12 px-5 text-[10px] font-black uppercase tracking-widest">Save Media</button>
      </form>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {media.map(asset => (
          <article key={asset.id} className="bg-white border border-black/10 p-4">
            <div className="aspect-video bg-black/5 overflow-hidden mb-4">
              <img src={asset.url} alt={asset.altText || asset.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-black uppercase">{asset.title || 'Untitled asset'}</h3>
            <button onClick={() => navigator.clipboard?.writeText(asset.url)} className="mt-3 text-[9px] font-black uppercase tracking-widest text-[#2D545E]">Copy URL</button>
          </article>
        ))}
      </div>
    </div>
  );
}

const supportedCurrencies = [
  { code: 'PKR', label: 'PKR - Pakistani Rupee' },
  { code: 'USD', label: 'USD - US Dollar' },
  { code: 'AED', label: 'AED - UAE Dirham' },
  { code: 'SAR', label: 'SAR - Saudi Riyal' },
  { code: 'QAR', label: 'QAR - Qatari Riyal' },
  { code: 'KWD', label: 'KWD - Kuwaiti Dinar' },
  { code: 'BHD', label: 'BHD - Bahraini Dinar' },
  { code: 'OMR', label: 'OMR - Omani Rial' },
  { code: 'GBP', label: 'GBP - British Pound' },
  { code: 'EUR', label: 'EUR - Euro' },
  { code: 'CAD', label: 'CAD - Canadian Dollar' },
  { code: 'AUD', label: 'AUD - Australian Dollar' },
];

function normalizeCurrencyCode(currency?: string) {
  const code = String(currency || 'PKR').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : 'PKR';
}

function money(value: number, currency = 'PKR') {
  const currencyCode = normalizeCurrencyCode(currency);
  try {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0).replace(/\u00a0/g, ' ');
  } catch (_error) {
    return `${currencyCode} ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function summarizeByCurrency(orders: Order[], selector: (order: Order) => number) {
  return orders.reduce<Record<string, number>>((result, order) => {
    const currency = normalizeCurrencyCode(order.currency);
    result[currency] = (result[currency] || 0) + selector(order);
    return result;
  }, {});
}

function formatCurrencySummary(summary: Record<string, number>) {
  const entries = Object.entries(summary).filter(([, value]) => Math.abs(value) > 0.0001);
  if (!entries.length) return money(0);
  return entries.map(([currency, value]) => money(value, currency)).join(' / ');
}

function BusinessEditor({ orders, settings, onManage }: { orders: Order[]; settings: SiteSettings; onManage: (order: Order) => void }) {
  const activeOrders = orders.filter(order => order.status !== 'cancelled');
  const revenue = summarizeByCurrency(activeOrders, order => Number(order.sellPrice ?? order.totalPrice ?? 0));
  const costs = summarizeByCurrency(activeOrders, order => Number(order.costPrice || 0));
  const outstanding = summarizeByCurrency(activeOrders, order => Math.max(0, Number(order.sellPrice ?? order.totalPrice ?? 0) - Number(order.paidAmount || 0)));
  const profit = summarizeByCurrency(activeOrders, order => Number(order.sellPrice ?? order.totalPrice ?? 0) - Number(order.costPrice || 0));
  const metrics = [
    { label: 'Revenue', value: revenue, icon: <ReceiptText /> },
    { label: 'Cost', value: costs, icon: <CreditCard /> },
    { label: 'Gross profit', value: profit, icon: <TrendingUp /> },
    { label: 'Outstanding', value: outstanding, icon: <ShoppingBag /> },
  ];

  return (
    <div className="space-y-7">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <article key={metric.label} className="bg-white border border-black/10 p-6">
            <div className="flex items-center justify-between text-black/35 mb-8">
              <span className="text-[9px] font-black uppercase tracking-[0.25em]">{metric.label}</span>
              {React.cloneElement(metric.icon, { className: 'w-4 h-4' })}
            </div>
            <div className="text-2xl font-display font-black tracking-tight leading-tight">{formatCurrencySummary(metric.value)}</div>
          </article>
        ))}
      </div>

      <div className="bg-white border border-black/10 overflow-x-auto">
        <div className="p-6 border-b border-black/10">
          <h2 className="text-xl font-display font-black uppercase">Order finances</h2>
        </div>
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#F6F5F2] text-[9px] uppercase tracking-[0.2em] text-black/40">
            <tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Sell</th><th className="p-4">Cost</th><th className="p-4">Profit</th><th className="p-4">Payment</th><th className="p-4" /></tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
              const cost = Number(order.costPrice || 0);
              const currency = normalizeCurrencyCode(order.currency);
              return (
                <tr key={order.id} className="border-t border-black/8 text-sm">
                  <td className="p-4"><div className="font-black">{order.productName}</div><div className="text-[9px] text-black/35 mt-1 uppercase tracking-widest">{order.id}</div></td>
                  <td className="p-4"><div className="font-bold">{order.userName || 'Customer'}</div><div className="text-xs text-black/45">{order.userEmail}</div></td>
                  <td className="p-4 font-bold">{money(sell, currency)}</td>
                  <td className="p-4 text-black/55">{money(cost, currency)}</td>
                  <td className={`p-4 font-black ${sell - cost < 0 ? 'text-red-600' : 'text-green-700'}`}>{money(sell - cost, currency)}</td>
                  <td className="p-4"><PaymentBadge status={order.paymentStatus || 'unpaid'} /><div className="text-xs text-black/45 mt-2">{money(order.paidAmount || 0, currency)} paid</div></td>
                  <td className="p-4"><button onClick={() => onManage(order)} className="bg-black text-white px-4 py-3 text-[9px] font-black uppercase tracking-widest">Manage</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CustomersEditor({ orders, settings, onManage }: { orders: Order[]; settings: SiteSettings; onManage: (order: Order) => void }) {
  const [selectedEmail, setSelectedEmail] = useState('');
  const customers = Object.values(orders.reduce<Record<string, {
    email: string;
    name: string;
    orders: Order[];
    invoiced: Record<string, number>;
    paid: Record<string, number>;
    balance: Record<string, number>;
  }>>((result, order) => {
    const email = (order.userEmail || 'unknown-customer').toLowerCase();
    const currency = normalizeCurrencyCode(order.currency);
    if (!result[email]) {
      result[email] = {
        email,
        name: order.userName || 'Customer',
        orders: [],
        invoiced: {},
        paid: {},
        balance: {},
      };
    }
    const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
    const paid = Number(order.paidAmount || 0);
    result[email].orders.push(order);
    result[email].name = order.userName || result[email].name;
    result[email].invoiced[currency] = (result[email].invoiced[currency] || 0) + sell;
    result[email].paid[currency] = (result[email].paid[currency] || 0) + paid;
    result[email].balance[currency] = (result[email].balance[currency] || 0) + Math.max(0, sell - paid);
    return result;
  }, {})).sort((left, right) => right.orders.length - left.orders.length);

  const selected = customers.find(customer => customer.email === selectedEmail) || customers[0];
  const selectedOrders = selected?.orders || [];
  const paymentHistory = selectedOrders.flatMap(order => (order.payments || []).map(payment => ({ ...payment, order })));

  if (!customers.length) {
    return (
      <div className="bg-white border border-black/10 py-20 px-8 text-center">
        <div className="w-14 h-14 bg-[#EAF0F1] text-[#2D545E] mx-auto flex items-center justify-center mb-6"><Users className="w-6 h-6" /></div>
        <h2 className="text-2xl font-display font-black uppercase">No customers yet</h2>
        <p className="text-sm text-black/45 mt-3">Create an order first, then PlazaHQ will build the customer ledger automatically.</p>
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
      <div className="bg-white border border-black/10 overflow-hidden">
        <div className="p-5 border-b border-black/10">
          <h2 className="text-xl font-display font-black uppercase">Customers</h2>
          <p className="text-sm text-black/45 mt-2">Balances are grouped by currency.</p>
        </div>
        <div className="divide-y divide-black/10">
          {customers.map(customer => (
            <button key={customer.email} onClick={() => setSelectedEmail(customer.email)} className={`w-full text-left p-5 hover:bg-[#F6F5F2] ${selected?.email === customer.email ? 'bg-[#EAF0F1]' : 'bg-white'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display font-black uppercase leading-tight">{customer.name}</div>
                  <div className="text-xs text-black/45 mt-1">{customer.email}</div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#2D545E]">{customer.orders.length} orders</span>
              </div>
              <div className="mt-4 text-sm font-black">{formatCurrencySummary(customer.balance)} due</div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="space-y-6">
          <section className="bg-white border border-black/10 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-[#2D545E] mb-2">Customer ledger</div>
                <h2 className="text-3xl font-display font-black uppercase">{selected.name}</h2>
                <p className="text-sm text-black/45 mt-2">{selected.email}</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 min-w-[min(100%,520px)]">
                <LedgerMetric label="Invoiced" value={formatCurrencySummary(selected.invoiced)} />
                <LedgerMetric label="Paid" value={formatCurrencySummary(selected.paid)} />
                <LedgerMetric label="Balance" value={formatCurrencySummary(selected.balance)} tone="strong" />
              </div>
            </div>
          </section>

          <section className="bg-white border border-black/10 overflow-x-auto">
            <div className="p-5 border-b border-black/10">
              <h3 className="text-xl font-display font-black uppercase">Work and invoice history</h3>
            </div>
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-[#F6F5F2] text-[9px] uppercase tracking-[0.2em] text-black/40">
                <tr><th className="p-4">Order</th><th className="p-4">Date</th><th className="p-4">Invoice</th><th className="p-4">Paid</th><th className="p-4">Balance</th><th className="p-4">Status</th><th className="p-4" /></tr>
              </thead>
              <tbody>
                {selectedOrders.map(order => {
                  const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
                  const paid = Number(order.paidAmount || 0);
                  const currency = normalizeCurrencyCode(order.currency);
                  return (
                    <tr key={order.id} className="border-t border-black/8 text-sm">
                      <td className="p-4"><div className="font-black">{order.productName}</div><div className="text-[9px] text-black/35 mt-1 uppercase tracking-widest">{order.id}</div></td>
                      <td className="p-4 text-black/55">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-bold">{money(sell, currency)}</td>
                      <td className="p-4 text-black/55">{money(paid, currency)}</td>
                      <td className="p-4 font-black">{money(Math.max(0, sell - paid), currency)}</td>
                      <td className="p-4"><PaymentBadge status={order.paymentStatus || 'unpaid'} /></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => onManage(order)} className="bg-black text-white px-4 py-3 text-[9px] font-black uppercase tracking-widest">Manage</button>
                          <button onClick={() => printInvoice(order, settings)} className="border border-black/15 px-4 py-3 text-[9px] font-black uppercase tracking-widest">Invoice</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="bg-white border border-black/10 p-6">
            <h3 className="text-xl font-display font-black uppercase mb-5">Payment history</h3>
            <div className="space-y-3">
              {!paymentHistory.length && <p className="text-sm text-black/45">No payments recorded for this customer.</p>}
              {paymentHistory.map(record => (
                <div key={record.id} className="border border-black/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="font-black">{money(record.amount, record.order.currency)}</div>
                    <div className="text-xs text-black/45 mt-1">{record.order.productName} / {record.paymentMethod.replace('_', ' ')} / {new Date(record.paidAt).toLocaleDateString()} {record.reference && `/ ${record.reference}`}</div>
                  </div>
                  <button onClick={() => onManage(record.order)} className="border border-black/15 px-4 py-3 text-[9px] font-black uppercase tracking-widest">Open order</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function LedgerMetric({ label, value, tone }: { label: string; value: string; tone?: 'strong' }) {
  return (
    <div className={`p-4 border ${tone === 'strong' ? 'border-[#2D545E] bg-[#EAF0F1]' : 'border-black/10 bg-[#F6F5F2]'}`}>
      <div className="text-[9px] font-black uppercase tracking-[0.25em] text-black/35">{label}</div>
      <div className="text-base font-display font-black mt-2 leading-tight">{value}</div>
    </div>
  );
}

function PaymentBadge({ status }: { status: 'unpaid' | 'partial' | 'paid' }) {
  const classes = status === 'paid' ? 'bg-green-100 text-green-700' : status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-50 text-red-600';
  return <span className={`inline-flex px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${classes}`}>{status}</span>;
}

function BusinessOrderModal({
  order,
  settings,
  onDocumentSettingsChange,
  onClose,
  onChanged,
}: {
  order: Order;
  settings: SiteSettings;
  onDocumentSettingsChange: (documents: SiteSettings['documents']) => Promise<void>;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [costPrice, setCostPrice] = useState(Number(order.costPrice || 0));
  const [sellPrice, setSellPrice] = useState(Number(order.sellPrice ?? order.totalPrice ?? 0));
  const [currency, setCurrency] = useState(normalizeCurrencyCode(order.currency));
  const [invoiceNotes, setInvoiceNotes] = useState(order.invoiceNotes || '');
  const [paymentDueDate, setPaymentDueDate] = useState(order.paymentDueDate?.slice(0, 10) || '');
  const [payment, setPayment] = useState({ amount: Math.max(0, Number(order.balanceDue || 0)), paymentMethod: 'bank_transfer', reference: '', notes: '', paidAt: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);

  const saveFinance = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await DataService.updateOrderFinance(order.id, { costPrice, sellPrice, currency, invoiceNotes, paymentDueDate });
    await onChanged();
  };

  const addPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await DataService.addPayment(order.id, payment);
    await onChanged();
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/65 flex justify-end">
      <div className="bg-[#F6F5F2] h-full w-full max-w-3xl overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-black/10 p-6 flex items-start justify-between">
          <div><div className="text-[9px] font-black uppercase tracking-[0.25em] text-[#2D545E] mb-2">{order.id}</div><h2 className="text-3xl font-display font-black uppercase">Order finances</h2></div>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </header>
        <div className="p-6 space-y-6">
          <form onSubmit={saveFinance} className="bg-white border border-black/10 p-6 space-y-5">
            <ImageUploadField
              label="Invoice logo"
              value={settings.documents?.invoiceLogo || settings.header?.logoImage || ''}
              previewTitle="Invoice logo"
              onChange={url => onDocumentSettingsChange({ ...settings.documents, invoiceLogo: url })}
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Cost price (internal)"><input type="number" min="0" step="0.01" className={inputClass} value={costPrice} onChange={event => setCostPrice(Number(event.target.value))} /></Field>
              <Field label="Sell price (invoice)"><input type="number" min="0" step="0.01" className={inputClass} value={sellPrice} onChange={event => setSellPrice(Number(event.target.value))} /></Field>
              <Field label="Currency"><select className={inputClass} value={currency} onChange={event => setCurrency(event.target.value)}>{supportedCurrencies.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}</select></Field>
              <Field label="Payment due date"><input type="date" className={inputClass} value={paymentDueDate} onChange={event => setPaymentDueDate(event.target.value)} /></Field>
              <div className="bg-[#F6F5F2] p-4"><div className="text-[9px] font-black uppercase tracking-widest text-black/35">Expected profit</div><div className="text-2xl font-black mt-2">{money(sellPrice - costPrice, currency)}</div></div>
            </div>
            <Field label="Invoice notes"><textarea className={textareaClass} value={invoiceNotes} onChange={event => setInvoiceNotes(event.target.value)} placeholder="Payment terms or customer note" /></Field>
            <div className="flex flex-wrap gap-3">
              <button disabled={saving} className="bg-black text-white px-5 py-4 text-[9px] font-black uppercase tracking-widest">Save finances</button>
              <button type="button" onClick={() => printInvoice({ ...order, sellPrice, currency, invoiceNotes, paymentDueDate }, settings)} className="border border-black/15 px-5 py-4 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><ReceiptText className="w-4 h-4" /> Print invoice</button>
            </div>
          </form>

          <form onSubmit={addPayment} className="bg-white border border-black/10 p-6 space-y-5">
            <h3 className="text-xl font-display font-black uppercase">Record payment</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Amount"><input required type="number" min="0.01" step="0.01" className={inputClass} value={payment.amount} onChange={event => setPayment({ ...payment, amount: Number(event.target.value) })} /></Field>
              <Field label="Method"><select className={inputClass} value={payment.paymentMethod} onChange={event => setPayment({ ...payment, paymentMethod: event.target.value })}><option value="bank_transfer">Bank transfer</option><option value="cash">Cash</option><option value="card">Card</option><option value="cheque">Cheque</option><option value="other">Other</option></select></Field>
              <Field label="Payment date"><input type="date" className={inputClass} value={payment.paidAt} onChange={event => setPayment({ ...payment, paidAt: event.target.value })} /></Field>
              <Field label="Reference"><input className={inputClass} value={payment.reference} onChange={event => setPayment({ ...payment, reference: event.target.value })} /></Field>
            </div>
            <Field label="Notes"><input className={inputClass} value={payment.notes} onChange={event => setPayment({ ...payment, notes: event.target.value })} /></Field>
            <button disabled={saving} className="bg-[#2D545E] text-white px-5 py-4 text-[9px] font-black uppercase tracking-widest">Add payment</button>
          </form>

          <section className="bg-white border border-black/10 p-6">
            <h3 className="text-xl font-display font-black uppercase mb-5">Payment history</h3>
            <div className="space-y-3">
              {(order.payments || []).length === 0 && <p className="text-sm text-black/45">No payments recorded.</p>}
              {(order.payments || []).map(record => (
                <div key={record.id} className="border border-black/10 p-4 flex items-center gap-4">
                  <div className="flex-1"><div className="font-black">{money(record.amount, currency)}</div><div className="text-xs text-black/45 mt-1">{record.paymentMethod.replace('_', ' ')} / {new Date(record.paidAt).toLocaleDateString()} {record.reference && `/ ${record.reference}`}</div></div>
                  <button onClick={async () => { if (!confirm('Delete this payment record?')) return; await DataService.deletePayment(record.id); await onChanged(); }} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function escapeInvoice(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character));
}

function printInvoice(order: Order, settings?: SiteSettings) {
  const invoice = window.open('', '_blank', 'width=900,height=900');
  if (!invoice) return;
  const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
  const currency = normalizeCurrencyCode(order.currency);
  const paid = Number(order.paidAmount || 0);
  const balance = Math.max(0, sell - paid);
  const documentSettings = settings?.documents || {};
  const footer = settings?.footer || {};
  const companyName = documentSettings.companyName || settings?.header?.logoText || 'Print Plaza';
  const tagline = documentSettings.tagline || settings?.header?.tagline || 'Industrial Print Production';
  const logo = documentSettings.invoiceLogo || settings?.header?.logoImage || '/brand/print-plaza-logo.png';
  const logoUrl = logo && logo.startsWith('/') ? `${window.location.origin}${logo}` : logo;
  const accent = documentSettings.accentColor || settings?.theme?.accentColor || '#E17055';
  const primary = settings?.theme?.primaryColor || '#2D545E';
  const invoiceItems = order.items?.length ? order.items : [{
    productId: order.productId,
    productName: order.productName,
    quantity: order.quantity,
    options: order.options || {},
    totalPrice: sell,
  }];
  const rows = invoiceItems.map(item => {
    const lineTotal = Number(item.totalPrice || 0);
    const unitPrice = item.quantity ? lineTotal / item.quantity : lineTotal;
    return `<tr><td><strong>${escapeInvoice(item.productName)}</strong></td><td>${escapeInvoice(item.quantity)}</td><td class="right">${money(unitPrice, currency)}</td><td class="right">${money(lineTotal, currency)}</td></tr>`;
  }).join('');
  invoice.document.write(`<!doctype html><html><head><title>Invoice ${escapeInvoice(order.id)}</title><style>
    *{box-sizing:border-box}
    body{font-family:Arial,Helvetica,sans-serif;color:#171717;margin:0;background:#eee;padding:24px}
    .sheet{max-width:850px;min-height:1100px;margin:0 auto;background:#fff;box-shadow:0 8px 30px rgba(0,0,0,.1)}
    .stripe{height:4px;background:${escapeInvoice(primary)}}
    .inner{padding:46px 52px 36px}
    header{display:grid;grid-template-columns:1fr 245px;gap:36px;align-items:start;padding-bottom:28px;border-bottom:2px solid #222;margin-bottom:30px}
    .brand{display:flex;align-items:flex-start}.logo{width:210px;max-height:72px;object-fit:contain;object-position:left top}
    .brand-text h1{font-size:32px;line-height:1;margin:0;text-transform:uppercase}.tagline{font-size:10px;text-transform:uppercase;color:${escapeInvoice(primary)};font-weight:700;margin-top:8px}
    .invoice-card{text-align:right;border-right:4px solid ${escapeInvoice(accent)};padding:2px 14px 2px 0}.invoice-card h2{margin:0 0 12px;font-size:26px;text-transform:uppercase}.meta{font-size:11px;line-height:1.8;color:#555}.meta strong{color:#111}
    .panels{display:grid;grid-template-columns:1.25fr .75fr;gap:30px;margin-bottom:32px}.panel{padding:0}.panel-title{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:${escapeInvoice(primary)};font-weight:700;margin-bottom:9px}.panel h3{margin:0 0 6px;font-size:17px}.panel p{margin:0;color:#555;font-size:12px;line-height:1.6}
    table{width:100%;border-collapse:collapse;margin-top:8px;border-top:2px solid #222}th{text-align:left;padding:12px 10px;border-bottom:1px solid #999;font-size:9px;text-transform:uppercase;letter-spacing:1.5px}td{padding:15px 10px;border-bottom:1px solid #ddd;font-size:12px}td strong{font-size:13px}.right{text-align:right}
    .summary{display:grid;grid-template-columns:1fr 290px;gap:42px;margin-top:26px;align-items:start}.notes{border-left:3px solid ${escapeInvoice(primary)};padding:3px 0 3px 14px;white-space:pre-wrap;color:#555;font-size:11px;line-height:1.7}.notes strong{display:block;color:#111;text-transform:uppercase;font-size:9px;letter-spacing:1.5px;margin-bottom:8px}
    .totals{border-top:1px solid #999}.total-row{display:flex;justify-content:space-between;gap:20px;padding:10px 4px;border-bottom:1px solid #ddd;font-size:12px}.grand{border-top:2px solid #222;border-bottom:3px double #222;font-size:20px;font-weight:700}.grand span:first-child{font-size:11px;text-transform:uppercase;align-self:center}.balance{color:#111;font-weight:700}
    footer{margin-top:50px;padding-top:17px;border-top:1px solid #bbb;display:grid;grid-template-columns:1fr 1fr;gap:24px;color:#666;font-size:9px;line-height:1.7}.foot-title{font-weight:700;color:#111;text-transform:uppercase;letter-spacing:1.5px;font-size:9px;margin-bottom:5px}.report{font-family:monospace;text-align:right;color:#888}
    @media print{body{background:#fff;padding:0}.sheet{box-shadow:none;max-width:none;min-height:0}.inner{padding:26px 34px}@page{size:A4;margin:0.45in}}
  </style></head><body>
    <main class="sheet">
      <div class="stripe"></div>
      <div class="inner">
        <header>
          <div class="brand">
            ${logoUrl ? `<img class="logo" src="${escapeInvoice(logoUrl)}" alt="${escapeInvoice(companyName)}">` : `<div class="brand-text"><h1>${escapeInvoice(companyName)}</h1><div class="tagline">${escapeInvoice(tagline)}</div></div>`}
          </div>
          <section class="invoice-card">
            <h2>Invoice</h2>
            <div class="meta"><strong># ${escapeInvoice(order.id)}</strong><br>Date: ${new Date(order.createdAt).toLocaleDateString()}<br>Due: ${escapeInvoice(order.paymentDueDate || 'On receipt')}<br>Currency: ${escapeInvoice(currency)}</div>
          </section>
        </header>
        <section class="panels">
          <div class="panel"><div class="panel-title">Bill to</div><h3>${escapeInvoice(order.userName || 'Customer')}</h3><p>${escapeInvoice(order.userEmail)}</p></div>
          <div class="panel"><div class="panel-title">Order status</div><h3>${escapeInvoice(order.status)}</h3><p>${escapeInvoice(invoiceItems.length)} item${invoiceItems.length === 1 ? '' : 's'} / ${escapeInvoice(order.paymentStatus || 'unpaid')}</p></div>
        </section>
        <table><thead><tr><th>Description</th><th>Quantity</th><th class="right">Unit price</th><th class="right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
        <section class="summary">
          <div class="notes"><strong>Notes</strong>${escapeInvoice(order.invoiceNotes || 'Thank you for choosing Print Plaza. Payment is due according to the terms above.')}</div>
          <div class="totals">
            <div class="total-row"><span>Subtotal</span><strong>${money(sell, currency)}</strong></div>
            <div class="total-row"><span>Paid</span><strong>${money(paid, currency)}</strong></div>
            <div class="total-row"><span>Balance due</span><strong class="balance">${money(balance, currency)}</strong></div>
            <div class="total-row grand"><span>Total</span><span>${money(sell, currency)}</span></div>
          </div>
        </section>
        <footer>
          <div><div class="foot-title">${escapeInvoice(companyName)}</div>${escapeInvoice(tagline)}<br>${escapeInvoice(footer.email || 'hi@print.plaza')} ${footer.phone ? ` / ${escapeInvoice(footer.phone)}` : ''}<br>${escapeInvoice(footer.address || '')}</div>
          <div class="report">PLAZAHQ DOCUMENT<br>${escapeInvoice(new Date().toLocaleString())}</div>
        </footer>
      </div>
    </main>
    <script>window.onload=()=>window.print();<\/script></body></html>`);
  invoice.document.close();
}

function CreateOrderModal({ products, onClose, onSave }: { products: Product[]; onClose: () => void; onSave: (order: Partial<Order>) => Promise<void> }) {
  const firstItem: OrderItem = {
    productId: products[0]?.id || 'manual-item',
    productName: products[0]?.name || '',
    quantity: 1,
    options: {},
    totalPrice: products[0]?.price || 0,
  };
  const [order, setOrder] = useState<Partial<Order>>({
    userName: '',
    userEmail: '',
    costPrice: 0,
    currency: 'PKR',
    status: 'pending',
    paymentDueDate: '',
    invoiceNotes: '',
  });
  const [items, setItems] = useState<OrderItem[]>([firstItem]);
  const [saving, setSaving] = useState(false);
  const sellTotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 1;

  const updateItem = (index: number, updates: Partial<OrderItem>) => {
    setItems(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...updates } : item));
  };

  const chooseProduct = (index: number, productId: string) => {
    const product = products.find(item => item.id === productId);
    updateItem(index, {
      productId: productId || 'manual-order',
      productName: product?.name || items[index]?.productName || '',
      totalPrice: product ? Number(product.price) * Number(items[index]?.quantity || 1) : items[index]?.totalPrice || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/65 flex justify-end">
      <form
        onSubmit={async event => {
          event.preventDefault();
          setSaving(true);
          const cleanItems = items.filter(item => item.productName.trim());
          await onSave({
            ...order,
            items: cleanItems,
            productId: cleanItems[0]?.productId || 'manual-order',
            productName: cleanItems.length > 1 ? `${cleanItems[0].productName} + ${cleanItems.length - 1} more` : cleanItems[0]?.productName || 'Custom print order',
            quantity: totalQuantity,
            sellPrice: sellTotal,
            totalPrice: sellTotal,
          });
        }}
        className="bg-white h-full w-full max-w-3xl overflow-y-auto p-7 md:p-10 space-y-6"
      >
        <div className="flex items-start justify-between">
          <div><div className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E17055] mb-2">PlazaHQ Orders</div><h2 className="text-3xl font-display font-black uppercase">Create order</h2></div>
          <button type="button" onClick={onClose}><X className="w-6 h-6" /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Customer name"><input required className={inputClass} value={order.userName || ''} onChange={event => setOrder({ ...order, userName: event.target.value })} /></Field>
          <Field label="Customer email"><input required type="email" className={inputClass} value={order.userEmail || ''} onChange={event => setOrder({ ...order, userEmail: event.target.value })} /></Field>
        </div>
        <section className="border border-black/10 p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display font-black uppercase">Invoice items</h3>
              <p className="text-sm text-black/45 mt-1">Add all products/services for this one customer order.</p>
            </div>
            <button type="button" onClick={() => setItems([...items, { productId: 'manual-item', productName: '', quantity: 1, options: {}, totalPrice: 0 }])} className="bg-black text-white px-4 py-3 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"><Plus className="w-3.5 h-3.5" /> Add item</button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="bg-[#F6F5F2] border border-black/10 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#2D545E]">Item {index + 1}</span>
                  {items.length > 1 && <button type="button" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
                <Field label="Product">
                  <select className={inputClass} value={item.productId || ''} onChange={event => chooseProduct(index, event.target.value)}>
                    <option value="manual-item">Custom/manual item</option>
                    {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                </Field>
                <Field label="Item title"><input required className={inputClass} value={item.productName || ''} onChange={event => updateItem(index, { productName: event.target.value })} placeholder="Business cards - 1,000 units" /></Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Quantity"><input type="number" min="1" className={inputClass} value={item.quantity || 1} onChange={event => updateItem(index, { quantity: Number(event.target.value) })} /></Field>
                  <Field label="Line total"><input type="number" min="0" step="0.01" className={inputClass} value={item.totalPrice || 0} onChange={event => updateItem(index, { totalPrice: Number(event.target.value) })} /></Field>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-black/10 p-4 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/35">Invoice total</span>
            <span className="text-2xl font-display font-black">{money(sellTotal, order.currency)}</span>
          </div>
        </section>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Cost price"><input type="number" min="0" step="0.01" className={inputClass} value={order.costPrice || 0} onChange={event => setOrder({ ...order, costPrice: Number(event.target.value) })} /></Field>
          <Field label="Currency"><select className={inputClass} value={order.currency || 'PKR'} onChange={event => setOrder({ ...order, currency: event.target.value })}>{supportedCurrencies.map(option => <option key={option.code} value={option.code}>{option.label}</option>)}</select></Field>
          <div className="bg-[#F6F5F2] p-4"><div className="text-[9px] font-black uppercase tracking-widest text-black/35">Profit</div><div className="text-2xl font-black mt-2">{money(sellTotal - Number(order.costPrice || 0), order.currency)}</div></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Status"><select className={inputClass} value={order.status} onChange={event => setOrder({ ...order, status: event.target.value as Order['status'] })}><option value="pending">Pending</option><option value="processing">Processing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></Field>
          <Field label="Payment due"><input type="date" className={inputClass} value={order.paymentDueDate || ''} onChange={event => setOrder({ ...order, paymentDueDate: event.target.value })} /></Field>
        </div>
        <Field label="Invoice notes"><textarea className={textareaClass} value={order.invoiceNotes || ''} onChange={event => setOrder({ ...order, invoiceNotes: event.target.value })} /></Field>
        <button disabled={saving} className="w-full bg-[#2D545E] text-white py-5 text-[10px] font-black uppercase tracking-[0.28em] hover:bg-black">{saving ? 'Creating...' : 'Create order'}</button>
      </form>
    </div>
  );
}

function OrdersEditor({ orders, onStatus, onCreate, onManage }: { orders: Order[]; onStatus: (id: string, status: string) => void; onCreate: () => void; onManage: (order: Order) => void }) {
  return (
    <div className="space-y-6">
      <button onClick={onCreate} className="bg-[#2D545E] text-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.28em] inline-flex items-center gap-3 hover:bg-black"><Plus className="w-4 h-4" /> Add order</button>
      {orders.length === 0 ? (
        <div className="bg-white border border-black/10 py-20 px-8 text-center">
          <div className="w-14 h-14 bg-[#EAF0F1] text-[#2D545E] mx-auto flex items-center justify-center mb-6"><ShoppingBag className="w-6 h-6" /></div>
          <h2 className="text-2xl font-display font-black uppercase">No orders yet</h2>
          <p className="text-sm text-black/45 mt-3">Create your first manual order or wait for a storefront quote request.</p>
          <button onClick={onCreate} className="mt-7 border border-black/15 px-5 py-3 text-[9px] font-black uppercase tracking-widest">Create first order</button>
        </div>
      ) : <div className="grid gap-px bg-black/5 border border-black/10">
        {orders.map(order => (
          <article key={order.id} className="bg-white p-6 flex flex-col xl:flex-row gap-6 xl:items-center">
            <div className="flex-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#2D545E] mb-2">{order.id}</div>
              <h3 className="text-2xl font-display font-black uppercase">{order.productName}</h3>
              <p className="text-sm text-black/50 mt-2">{order.userName || order.userEmail} / Qty {order.quantity} / {money(Number(order.sellPrice ?? order.totalPrice), order.currency)}</p>
            </div>
            <select value={order.status} onChange={event => onStatus(order.id, event.target.value)} className={`${inputClass} xl:w-48`}>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={() => onManage(order)} className="border border-black/15 px-5 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white">Manage</button>
          </article>
        ))}
      </div>}
    </div>
  );
}
