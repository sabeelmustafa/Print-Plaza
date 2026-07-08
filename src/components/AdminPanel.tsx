import React, { useEffect, useState } from 'react';
import {
  Boxes,
  CheckCircle,
  Image as ImageIcon,
  LayoutDashboard,
  ListTree,
  LogOut,
  Palette,
  Plus,
  Save,
  Settings,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { DataService } from '../lib/dataService';
import { MediaAsset, Order, Product, ProductOption, ServiceCategory, SiteSettings } from '../types';

type AdminTab = 'site' | 'products' | 'categories' | 'media' | 'orders';

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
    email: 'hi@print.plaza',
    phone: '+1 212 555 7788',
    address: 'Studio Block A, Creative District, NY 10001',
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
        theme: { ...defaultSettings.theme, ...nextSettings.theme },
        homepage: { ...defaultSettings.homepage, ...nextSettings.homepage },
        footer: { ...defaultSettings.footer, ...nextSettings.footer },
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
      DataService.saveSiteSetting('homepage', settings.homepage),
      DataService.saveSiteSetting('theme', settings.theme),
      DataService.saveSiteSetting('footer', settings.footer),
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
      <aside className="hidden lg:flex w-72 bg-black text-white p-8 flex-col">
        <div className="mb-12">
          <div className="text-3xl font-display font-black tracking-tight uppercase">Print Plaza</div>
          <div className="text-[9px] uppercase tracking-[0.4em] text-white/30 mt-2">Control Panel</div>
        </div>
        <nav className="space-y-3 flex-1">
          <TabButton tab="site" activeTab={activeTab} onClick={setActiveTab} icon={<LayoutDashboard />} label="Website" />
          <TabButton tab="products" activeTab={activeTab} onClick={setActiveTab} icon={<Boxes />} label="Products" />
          <TabButton tab="categories" activeTab={activeTab} onClick={setActiveTab} icon={<ListTree />} label="Categories" />
          <TabButton tab="media" activeTab={activeTab} onClick={setActiveTab} icon={<ImageIcon />} label="Media URLs" />
          <TabButton tab="orders" activeTab={activeTab} onClick={setActiveTab} icon={<ShoppingBag />} label="Orders" />
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
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40 font-bold mt-2">MySQL-backed CMS</p>
          </div>
          <div className="flex lg:hidden gap-2 overflow-x-auto">
            {(['site', 'products', 'categories', 'media', 'orders'] as AdminTab[]).map(tab => (
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
              {activeTab === 'site' && <SiteEditor settings={settings} setSettings={setSettings} onSave={saveSite} />}
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
                <OrdersEditor orders={orders} onStatus={async (id, status) => {
                  await DataService.updateOrderStatus(id, status);
                  await loadAll();
                }} />
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

function SiteEditor({ settings, setSettings, onSave }: { settings: SiteSettings; setSettings: (settings: SiteSettings) => void; onSave: () => void }) {
  const homepage = settings.homepage || {};
  const theme = settings.theme || {};
  const footer = settings.footer || {};

  return (
    <div className="space-y-8 max-w-5xl">
      <Section title="Homepage">
        <Field label="Hero title"><input className={inputClass} value={homepage.heroTitle || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, heroTitle: event.target.value } })} /></Field>
        <Field label="Hero subtitle"><textarea className={textareaClass} value={homepage.heroSubtitle || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, heroSubtitle: event.target.value } })} /></Field>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Primary button"><input className={inputClass} value={homepage.primaryButtonText || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, primaryButtonText: event.target.value } })} /></Field>
          <Field label="Secondary button"><input className={inputClass} value={homepage.secondaryButtonText || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, secondaryButtonText: event.target.value } })} /></Field>
        </div>
        <Field label="Hero image URL"><input className={inputClass} value={homepage.heroImage || ''} onChange={event => setSettings({ ...settings, homepage: { ...homepage, heroImage: event.target.value } })} /></Field>
      </Section>

      <Section title="Theme">
        <div className="grid md:grid-cols-4 gap-5">
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
      </Section>

      <Section title="Footer">
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Brand text"><input className={inputClass} value={footer.brandText || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, brandText: event.target.value } })} /></Field>
          <Field label="Tagline"><input className={inputClass} value={footer.tagline || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, tagline: event.target.value } })} /></Field>
          <Field label="Email"><input className={inputClass} value={footer.email || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, email: event.target.value } })} /></Field>
          <Field label="Phone"><input className={inputClass} value={footer.phone || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, phone: event.target.value } })} /></Field>
        </div>
        <Field label="Address"><textarea className={textareaClass} value={footer.address || ''} onChange={event => setSettings({ ...settings, footer: { ...footer, address: event.target.value } })} /></Field>
      </Section>

      <button onClick={onSave} className="bg-black text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.35em] flex items-center gap-3 hover:bg-[#2D545E]">
        <Save className="w-4 h-4" /> Save Website
      </button>
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
        <Field label="Image URL"><input className={inputClass} value={product.image || ''} onChange={event => setProduct({ ...product, image: event.target.value })} /></Field>

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
      <form onSubmit={onSave} className="bg-white border border-black/10 p-6 grid md:grid-cols-[1fr_1.5fr_1fr_auto] gap-4 items-end">
        <Field label="Title"><input className={inputClass} value={editingMedia.title || ''} onChange={event => setEditingMedia({ ...editingMedia, title: event.target.value })} /></Field>
        <Field label="Image/file URL"><input required className={inputClass} value={editingMedia.url || ''} onChange={event => setEditingMedia({ ...editingMedia, url: event.target.value })} /></Field>
        <Field label="Alt text"><input className={inputClass} value={editingMedia.altText || ''} onChange={event => setEditingMedia({ ...editingMedia, altText: event.target.value })} /></Field>
        <button type="submit" className="bg-black text-white h-12 px-5 text-[10px] font-black uppercase tracking-widest">Save</button>
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

function OrdersEditor({ orders, onStatus }: { orders: Order[]; onStatus: (id: string, status: string) => void }) {
  return (
    <div className="grid gap-px bg-black/5 border border-black/10">
      {orders.map(order => (
        <article key={order.id} className="bg-white p-6 flex flex-col xl:flex-row gap-6 xl:items-center">
          <div className="flex-1">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#2D545E] mb-2">{order.id}</div>
            <h3 className="text-2xl font-display font-black uppercase">{order.productName}</h3>
            <p className="text-sm text-black/50 mt-2">{order.userName || order.userEmail} / Qty {order.quantity} / ${order.totalPrice.toFixed(2)}</p>
          </div>
          <select value={order.status} onChange={event => onStatus(order.id, event.target.value)} className={inputClass}>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </article>
      ))}
    </div>
  );
}
