import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle, Clock, Download, FileText, Package, ReceiptText, ShoppingBag } from 'lucide-react';
import { DataService } from '../lib/dataService';
import { useAuth } from '../lib/AuthContext';
import { Order, SiteSettings } from '../types';

function normalizeCurrencyCode(currency?: string) {
  const code = String(currency || 'PKR').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : 'PKR';
}

function money(value: number, currency = 'PKR') {
  const currencyCode = normalizeCurrencyCode(currency);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
  } catch (_error) {
    return `${currencyCode} ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

function formatDate(value?: string) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString();
}

function escapeInvoice(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char] || char));
}

function statusClass(status: Order['status']) {
  if (status === 'completed') return 'bg-green-100 text-green-700';
  if (status === 'processing') return 'bg-blue-100 text-blue-700';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-orange-100 text-orange-700';
}

function paymentClass(status?: Order['paymentStatus']) {
  if (status === 'paid') return 'bg-green-100 text-green-700';
  if (status === 'partial') return 'bg-blue-100 text-blue-700';
  return 'bg-red-50 text-red-600';
}

function printClientInvoice(order: Order, settings: SiteSettings) {
  const currency = normalizeCurrencyCode(order.currency);
  const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
  const paid = Number(order.paidAmount || 0);
  const balance = Math.max(0, sell - paid);
  const items = order.items?.length
    ? order.items
    : [{ productName: order.productName, quantity: order.quantity, totalPrice: sell }];
  const documentSettings = settings.documents || {};
  const companyName = documentSettings.companyName || settings.header?.logoText || 'Print Plaza';
  const logo = documentSettings.invoiceLogo || settings.header?.logoImageDark || settings.header?.logoImage || '/brand/print-plaza-logo.png';
  const logoUrl = logo && logo.startsWith('/') ? `${window.location.origin}${logo}` : logo;
  const rows = items.map(item => {
    const lineTotal = Number(item.totalPrice || 0);
    const unitPrice = Number(item.quantity || 0) > 0 ? lineTotal / Number(item.quantity) : lineTotal;
    return `<tr><td><strong>${escapeInvoice(item.productName)}</strong></td><td>${escapeInvoice(item.quantity)}</td><td class="right">${money(unitPrice, currency)}</td><td class="right">${money(lineTotal, currency)}</td></tr>`;
  }).join('');

  const popup = window.open('', '_blank', 'width=960,height=720');
  if (!popup) return;

  popup.document.write(`<!doctype html><html><head><title>Invoice ${escapeInvoice(order.id)}</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f4f3f0;color:#111;font-family:Arial,Helvetica,sans-serif}.sheet{max-width:900px;margin:0 auto;background:#fff;min-height:100vh}.inner{padding:42px 50px}.top{height:5px;display:flex}.top div:first-child{background:#2D545E;flex:1}.top div:last-child{background:#E17055;flex:1}.header{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;margin-bottom:42px}.logo{width:210px;max-height:72px;object-fit:contain;object-position:left top}.brand h1{font-size:30px;line-height:1;margin:0;text-transform:uppercase}.muted{color:#777;font-size:12px;line-height:1.7}.meta{text-align:right;font-size:12px;line-height:1.8}.meta h2{font-size:28px;margin:0 0 8px;text-transform:uppercase}.rule{border-top:2px solid #111;margin:0 0 34px}.panels{display:grid;grid-template-columns:1.5fr 1fr;gap:18px;margin-bottom:28px}.panel{border:1px solid #ddd;padding:20px}.panel-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.24em;color:#888;margin-bottom:12px}.panel h3{margin:0 0 8px;font-size:18px}table{width:100%;border-collapse:collapse;margin-top:22px}th{background:#111;color:#fff;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.2em;padding:14px 16px}td{border-bottom:1px solid #e5e5e5;padding:16px;font-size:14px}.right{text-align:right}.summary{display:grid;grid-template-columns:1fr 310px;gap:34px;margin-top:30px}.notes{background:#fafafa;border-left:4px solid #2D545E;padding:18px;font-size:13px;line-height:1.7;color:#444}.notes strong{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.22em;color:#111;margin-bottom:10px}.totals{border:1px solid #ddd}.total-row{display:flex;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #eee;font-size:14px}.total-row:last-child{border-bottom:0}.grand{font-size:22px;font-weight:900;text-transform:uppercase}.balance{color:#E17055}.footer{margin-top:54px;border-top:1px solid #ddd;padding-top:22px;display:flex;justify-content:space-between;gap:20px;font-size:11px;color:#777;line-height:1.8}@media print{body{background:#fff}.sheet{max-width:none}.inner{padding:28px 34px}@page{size:A4;margin:.45in}}
  </style></head><body><div class="sheet"><div class="top"><div></div><div></div></div><div class="inner">
    <div class="header"><div>${logoUrl ? `<img class="logo" src="${escapeInvoice(logoUrl)}" alt="${escapeInvoice(companyName)}">` : `<div class="brand"><h1>${escapeInvoice(companyName)}</h1></div>`}</div><div class="meta"><h2>Invoice</h2><strong># ${escapeInvoice(order.id)}</strong><br>Date: ${formatDate(order.createdAt)}<br>Due: ${escapeInvoice(order.paymentDueDate || 'On receipt')}<br>Currency: ${escapeInvoice(currency)}</div></div>
    <div class="rule"></div>
    <div class="panels"><div class="panel"><div class="panel-title">Bill to</div><h3>${escapeInvoice(order.userName || 'Customer')}</h3><div class="muted">${escapeInvoice(order.userEmail)}</div></div><div class="panel"><div class="panel-title">Order status</div><h3>${escapeInvoice(order.status)}</h3><div class="muted">${items.length} item${items.length === 1 ? '' : 's'} / ${escapeInvoice(order.paymentStatus || 'unpaid')}</div></div></div>
    <table><thead><tr><th>Description</th><th>Quantity</th><th class="right">Unit price</th><th class="right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="summary"><div class="notes"><strong>Notes</strong>${escapeInvoice(order.invoiceNotes || 'Thank you for choosing Print Plaza. Payment is due according to the terms above.')}</div><div class="totals"><div class="total-row"><span>Subtotal</span><strong>${money(sell, currency)}</strong></div><div class="total-row"><span>Paid</span><strong>${money(paid, currency)}</strong></div><div class="total-row"><span>Balance due</span><strong class="balance">${money(balance, currency)}</strong></div><div class="total-row grand"><span>Total</span><span>${money(sell, currency)}</span></div></div></div>
    <div class="footer"><div><strong>${escapeInvoice(companyName)}</strong><br>${escapeInvoice(settings.footer?.email || '')}<br>${escapeInvoice(settings.footer?.phone || '')}</div><div>PLAZAHQ DOCUMENT<br>${new Date().toLocaleString()}</div></div>
  </div></div><script>window.onload=function(){window.print()}</script></body></html>`);
  popup.document.close();
}

export default function UserPanel({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchClientArea();
  }, [user]);

  const fetchClientArea = async () => {
    setLoading(true);
    try {
      const [orderData, siteSettings] = await Promise.all([
        DataService.getOrders(user?.uid, user?.email),
        DataService.getSiteSettings(),
      ]);
      setOrders(orderData);
      setSettings(siteSettings);
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => orders.reduce((result, order) => {
    const currency = normalizeCurrencyCode(order.currency);
    const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
    const paid = Number(order.paidAmount || 0);
    result.invoiced[currency] = (result.invoiced[currency] || 0) + sell;
    result.paid[currency] = (result.paid[currency] || 0) + paid;
    result.balance[currency] = (result.balance[currency] || 0) + Math.max(0, sell - paid);
    return result;
  }, { invoiced: {} as Record<string, number>, paid: {} as Record<string, number>, balance: {} as Record<string, number> }), [orders]);

  const summarize = (values: Record<string, number>) => {
    const entries = Object.entries(values);
    return entries.length ? entries.map(([currency, value]) => money(value, currency)).join(' / ') : money(0);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 sm:p-8 md:p-16 relative">
      <div className="absolute inset-0 bg-grainy opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <button
              onClick={onBack}
              className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 hover:text-black mb-8 flex items-center gap-3 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1" /> Back to website
            </button>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tighter uppercase leading-[0.85] mb-6">
              Client <br />
              <span className="text-black/10 italic font-serif lowercase">Area.</span>
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] font-bold text-[#2D545E] break-all">
              Signed in as {user?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:min-w-[620px]">
            <SummaryCard label="Orders" value={String(orders.length)} icon={<ShoppingBag className="w-4 h-4" />} />
            <SummaryCard label="Invoiced" value={summarize(totals.invoiced)} icon={<ReceiptText className="w-4 h-4" />} />
            <SummaryCard label="Balance" value={summarize(totals.balance)} icon={<FileText className="w-4 h-4" />} />
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-black/10 border-t-black animate-spin rounded-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-black/10 p-12 sm:p-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black/5 mb-10">
              <ShoppingBag className="w-8 h-8 text-black/20" />
            </div>
            <h3 className="text-2xl font-display font-black uppercase">No orders found</h3>
            <p className="mt-4 text-sm font-bold text-black/45 max-w-md mx-auto leading-relaxed">
              When we create an order or quotation for this email address, it will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => {
              const currency = normalizeCurrencyCode(order.currency);
              const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
              const paid = Number(order.paidAmount || 0);
              const balance = Math.max(0, sell - paid);
              const items = order.items?.length ? order.items : [{ productName: order.productName, quantity: order.quantity, totalPrice: sell }];
              return (
                <article key={order.id} className="bg-white border border-black/10 overflow-hidden">
                  <div className="p-6 sm:p-8 flex flex-col xl:flex-row gap-8 xl:items-start xl:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.3em]">#{order.id}</span>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 tracking-widest ${statusClass(order.status)}`}>{order.status}</span>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 tracking-widest ${paymentClass(order.paymentStatus)}`}>{order.paymentStatus || 'unpaid'}</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight mb-5 leading-none">{order.productName}</h4>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoBlock icon={<CalendarDays className="w-4 h-4" />} label="Created" value={formatDate(order.createdAt)} />
                        <InfoBlock icon={<Clock className="w-4 h-4" />} label="Due" value={order.paymentDueDate ? formatDate(order.paymentDueDate) : 'On receipt'} />
                        <InfoBlock icon={<ReceiptText className="w-4 h-4" />} label="Invoice total" value={money(sell, currency)} />
                        <InfoBlock icon={<CheckCircle className="w-4 h-4" />} label="Paid / Balance" value={`${money(paid, currency)} / ${money(balance, currency)}`} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => printClientInvoice(order, settings)}
                      className="bg-black text-white px-5 py-4 text-[9px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#2D545E]"
                    >
                      <Download className="w-4 h-4" /> Download invoice
                    </button>
                  </div>

                  <div className="border-t border-black/10 bg-[#F6F5F2] p-6 sm:p-8">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-black/35 mb-4">Work history / items</div>
                    <div className="grid gap-2">
                      {items.map((item, index) => (
                        <div key={`${order.id}-${index}`} className="bg-white border border-black/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-[#2D545E]" />
                            <div>
                              <div className="font-black uppercase tracking-tight">{item.productName}</div>
                              <div className="text-xs font-bold text-black/40 mt-1">Quantity: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="font-black">{money(Number(item.totalPrice || 0), currency)}</div>
                        </div>
                      ))}
                    </div>
                    {order.invoiceNotes && (
                      <div className="mt-4 bg-white border-l-4 border-[#2D545E] p-4 text-sm font-medium leading-relaxed text-black/60">
                        {order.invoiceNotes}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-black/10 p-5">
      <div className="flex items-center justify-between text-black/30 mb-5">
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">{label}</span>
        {icon}
      </div>
      <div className="text-xl font-display font-black uppercase leading-tight">{value}</div>
    </div>
  );
}

function InfoBlock({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="border border-black/10 bg-[#FDFCFB] p-4">
      <div className="flex items-center gap-2 text-black/30 mb-3">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-sm font-black uppercase leading-snug">{value}</div>
    </div>
  );
}
