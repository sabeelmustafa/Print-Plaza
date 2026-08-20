import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle, CheckCircle2, Clock, Download, FileText, Package, ReceiptText, ShoppingBag, Sparkles } from 'lucide-react';
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
    <div class="summary"><div class="notes"><strong>Notes</strong>${escapeInvoice(order.invoiceNotes || 'Thank you for choosing Print Plaza. Payment is due according to the terms above.')}</div><div class="totals"><div class="total-row"><span>Subtotal</span><strong>${money(sell, currency)}</strong></div><div class="total-row"><span>Paid</span><strong>${money(paid, currency)}</strong></div><div class="total-row balance"><span>Balance due</span><strong>${money(balance, currency)}</strong></div><div class="total-row grand"><span>Total</span><span>${money(sell, currency)}</span></div></div></div>
    <div class="footer"><div><strong>${escapeInvoice(companyName)}</strong><br>${escapeInvoice(settings.footer?.email || '')}<br>${escapeInvoice(settings.footer?.phone || '')}</div><div>PLAZAHQ DOCUMENT<br>${new Date().toLocaleString()}</div></div>
  </div></div><script>window.onload=function(){window.print()}</script></body></html>`);
  popup.document.close();
}

export default function UserPanel({ onBack }: { onBack: () => void }) {
  const { user, logoutCustomer } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quotations' | 'orders' | 'invoices' | 'new_quote'>('quotations');

  // New quote form state
  const [productName, setProductName] = useState('Custom Packaging Box');
  const [quantity, setQuantity] = useState('500');
  const [notes, setNotes] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState('');

  const handleProceedWithProduction = async (q: any) => {
    const formattedPrice = q.quotedPrice ? money(q.quotedPrice, q.currency) : 'the quoted price';
    if (!window.confirm(`Proceed with production order for "${q.productName}" at ${formattedPrice}?\n\nThis will generate your Print Job Order (PJO) and immediately queue it into PlazaHQ production.`)) {
      return;
    }

    setConvertingId(q.id);
    try {
      await DataService.convertQuotationToPjo(q.id, {
        sellPrice: q.quotedPrice,
        currency: q.currency,
        finishingSpecs: q.finishingSpecs,
      });
      await fetchClientArea();
      setActiveTab('orders');
    } catch (err: any) {
      console.error('Failed to convert quotation to production order:', err);
      alert('Could not proceed with production order. Please try again or contact support.');
    } finally {
      setConvertingId(null);
    }
  };

  useEffect(() => {
    if (user) fetchClientArea();
  }, [user]);

  const fetchClientArea = async () => {
    setLoading(true);
    try {
      const [orderData, quoteData, siteSettings] = await Promise.all([
        DataService.getOrders(user?.uid, user?.email),
        DataService.getQuotations(),
        DataService.getSiteSettings(),
      ]);

      const userEmail = String(user?.email || '').toLowerCase().trim();
      const myQuotes = quoteData.filter((q: any) => String(q.userEmail || '').toLowerCase().trim() === userEmail);
      const myOrders = orderData.filter((o: any) => String(o.userEmail || '').toLowerCase().trim() === userEmail || !o.userEmail);

      setOrders(myOrders);
      setQuotations(myQuotes);
      setSettings(siteSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);
    setQuoteSuccess('');
    try {
      await DataService.saveQuotation({
        userName: user?.name || user?.email,
        userEmail: user?.email,
        productName,
        productId: 'custom-quote',
        quantity: Math.max(1, Number(quantity || 1)),
        notes,
        quoteStatus: 'new',
      });
      setQuoteSuccess('Your quotation request has been submitted to PlazaHQ Press!');
      setNotes('');
      await fetchClientArea();
      setActiveTab('quotations');
    } catch (_err) {
      alert('Could not submit quotation request.');
    } finally {
      setSubmittingQuote(false);
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
    <div className="min-h-screen bg-[#FDFCFB] p-6 sm:p-8 md:p-12 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-black/10 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onBack}
                className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 hover:text-black flex items-center gap-2 transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1" /> Storefront
              </button>
              <span className="text-black/20">|</span>
              <button
                onClick={logoutCustomer}
                className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase leading-none mb-3">
              Client Portal
            </h2>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] font-bold text-[#2D545E] break-all">
              Signed in as {user?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:min-w-[580px]">
            <SummaryCard label="Quotes" value={String(quotations.length)} icon={<FileText className="w-4 h-4 text-[#2D545E]" />} />
            <SummaryCard label="Print Orders" value={String(orders.length)} icon={<ShoppingBag className="w-4 h-4 text-[#2D545E]" />} />
            <SummaryCard label="Balance Due" value={summarize(totals.balance)} icon={<ReceiptText className="w-4 h-4 text-[#E17055]" />} />
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-black/10 pb-4">
          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'quotations' ? 'bg-[#2D545E] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            My Quotations ({quotations.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#2D545E] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            My Print Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'invoices' ? 'bg-[#2D545E] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Invoices & Receipts
          </button>
          <button
            onClick={() => setActiveTab('new_quote')}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'new_quote' ? 'bg-[#E17055] text-white shadow-md' : 'bg-white text-[#E17055] hover:bg-orange-50 border border-orange-200'
            }`}
          >
            + Request New Quote
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-black/10 border-t-[#2D545E] animate-spin rounded-full" />
          </div>
        ) : (
          <>
            {/* Tab 1: My Quotations */}
            {activeTab === 'quotations' && (
              <div className="space-y-4">
                {quotations.length === 0 ? (
                  <div className="bg-white border border-black/10 p-12 text-center rounded-2xl">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold uppercase text-slate-800">No quotation requests found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 mb-6">You haven't requested any custom print quotations yet.</p>
                    <button onClick={() => setActiveTab('new_quote')} className="px-6 py-3 bg-[#E17055] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
                      Request Your First Quote
                    </button>
                  </div>
                ) : (
                  quotations.map(q => (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-[#2D545E] bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                              {q.quoteNumber || q.id}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{formatDate(q.createdAt)}</span>
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 mt-2">{q.productName}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-500">Qty: <strong>{q.quantity}</strong></span>
                          <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg ${
                            q.quoteStatus === 'converted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            q.quoteStatus === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {q.quoteStatus === 'converted' ? `Converted (${q.convertedPjoNumber || 'PJO'})` : (q.quoteStatus || 'Pending Review')}
                          </span>
                        </div>
                      </div>

                      {/* Finishing Specs */}
                      {q.finishingSpecs && Object.keys(q.finishingSpecs).length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                          <h5 className="text-[10px] font-mono font-bold uppercase text-slate-500 mb-2">Press & Finishing Specifications</h5>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(q.finishingSpecs).map(([key, val]) => (
                              <span key={key} className="text-xs bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 font-medium">
                                <strong className="text-slate-900 capitalize">{key}:</strong> {String(val)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-500 font-medium">{q.notes || 'Custom print quote inquiry'}</span>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">Quoted Price</span>
                          <span className="text-lg font-black text-[#2D545E]">
                            {q.quotedPrice ? money(q.quotedPrice, q.currency) : 'Under Review'}
                          </span>
                        </div>
                      </div>

                      {/* Approved: Proceed with Production CTA */}
                      {q.quoteStatus === 'approved' && (
                        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/90 via-cyan-50/40 to-slate-50 p-4 sm:p-5 rounded-xl border border-emerald-200/80 shadow-xs">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                                Quotation Approved by PlazaHQ Press
                                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">Ready for Production</span>
                              </p>
                              <p className="text-[11px] text-slate-600 mt-0.5">
                                Proceed to create your Print Job Order (PJO) and queue this order directly into the press & finishing pipeline.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleProceedWithProduction(q)}
                            disabled={convertingId === q.id}
                            className="w-full md:w-auto px-6 py-3 bg-[#2D545E] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shrink-0"
                          >
                            {convertingId === q.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Queueing into Pipeline...</span>
                              </>
                            ) : (
                              <>
                                <span>Proceed with Production Order</span>
                                <ArrowRight className="w-4 h-4 text-[#E17055]" />
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Converted: Link to Production Order */}
                      {q.quoteStatus === 'converted' && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2.5 text-xs text-slate-700">
                            <Package className="w-4 h-4 text-[#2D545E]" />
                            <span>Print Job Order Active in Pipeline: <strong className="font-mono text-[#2D545E]">{q.convertedPjoNumber || 'PJO Generated'}</strong></span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveTab('orders')}
                            className="text-xs font-bold text-[#2D545E] hover:text-[#E17055] transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>View in My Print Orders</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: My Print Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white border border-black/10 p-12 text-center rounded-2xl">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold uppercase text-slate-800">No active print orders</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2">Approved quotations will automatically appear here as Print Job Orders.</p>
                  </div>
                ) : (
                  orders.map(order => {
                    const currency = normalizeCurrencyCode(order.currency);
                    const sell = Number(order.sellPrice ?? order.totalPrice ?? 0);
                    const paid = Number(order.paidAmount || 0);
                    const balance = Math.max(0, sell - paid);
                    return (
                      <article key={order.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-slate-500">#{order.id}</span>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${statusClass(order.status)}`}>{order.status}</span>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${paymentClass(order.paymentStatus)}`}>{order.paymentStatus || 'unpaid'}</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900">{order.productName}</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => printClientInvoice(order, settings)}
                            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#2D545E] cursor-pointer self-start"
                          >
                            <Download className="w-4 h-4" /> Print Invoice
                          </button>
                        </div>

                        <div className="grid sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                          <div><span className="text-slate-400 block text-[10px]">Created</span><strong>{formatDate(order.createdAt)}</strong></div>
                          <div><span className="text-slate-400 block text-[10px]">Due Date</span><strong>{order.paymentDueDate ? formatDate(order.paymentDueDate) : 'On receipt'}</strong></div>
                          <div><span className="text-slate-400 block text-[10px]">Total</span><strong>{money(sell, currency)}</strong></div>
                          <div><span className="text-slate-400 block text-[10px]">Paid / Balance</span><strong className="text-[#E17055]">{money(paid, currency)} / {money(balance, currency)}</strong></div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 3: Invoices & Receipts */}
            {activeTab === 'invoices' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-xs font-mono text-slate-400">INVOICE #{order.id}</span>
                          <h4 className="text-lg font-bold text-slate-900">{order.productName}</h4>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${paymentClass(order.paymentStatus)}`}>
                          {order.paymentStatus || 'unpaid'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">{formatDate(order.createdAt)}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Amount</span>
                        <span className="text-base font-bold text-slate-900">{money(order.sellPrice || order.totalPrice || 0, order.currency)}</span>
                      </div>
                      <button
                        onClick={() => printClientInvoice(order, settings)}
                        className="px-4 py-2 bg-slate-900 hover:bg-[#2D545E] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Invoice PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Request New Quote */}
            {activeTab === 'new_quote' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl shadow-md">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Custom Print Quotation</h3>
                <p className="text-xs text-slate-500 mb-6">Submit your packaging and printing requirements directly to PlazaHQ press estimators.</p>

                {quoteSuccess && (
                  <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold">
                    {quoteSuccess}
                  </div>
                )}

                <form onSubmit={handleRequestQuote} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product / Packaging Type *</label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                      placeholder="e.g. Rigid Magnetic Gift Box, Kraft Shopping Bag"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2D545E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2D545E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Specifications & Finishing Notes</label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Specify dimensions (L x W x H), lamination (Matte/Gloss), Gold Foiling, Spot UV, embossing, stock GSM, etc."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2D545E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingQuote}
                    className="w-full py-3.5 bg-[#E17055] hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {submittingQuote ? 'Submitting Request...' : 'Submit Quotation Request'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between text-slate-400 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
        {icon}
      </div>
      <div className="text-xl font-black text-slate-900">{value}</div>
    </div>
  );
}
