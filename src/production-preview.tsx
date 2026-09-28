import React from 'react';
import {createRoot} from 'react-dom/client';
import {CreateProductionJob} from './components/ProductionJobs';
import {DataService} from './lib/dataService';
import './index.css';
const orders = ['Acme', 'Northstar', 'City Cafe'].map((name, i) => ({id: `sample-${i + 1}`, userId: name, userName: name, userEmail: `${name.replaceAll(' ', '').toLowerCase()}@example.test`, productId: i === 2 ? 'flyers' : 'cards', productName: i === 2 ? 'A5 Flyers' : 'Business cards', quantity: i === 2 ? 5000 : 1000, options: {Paper: i === 2 ? '150 GSM gloss' : '350 GSM silk', Size: i === 2 ? 'A5' : '3.5 x 2 inches'}, totalPrice: 3000, status: 'pending' as const, createdAt: '2026-09-28', updatedAt: '2026-09-28'}));
DataService.createProductionJob = async () => { throw new Error('Preview only: connect the local database to save a PJO. No customer data has been changed.'); };
function Preview() {
  const [open, setOpen] = React.useState(true);
  return <><div className="p-8"><h1 className="text-2xl font-bold">Print Plaza — Local Preview</h1><p className="my-4">Sample orders only. Database saving is unavailable in this preview.</p><button className="bg-[#2D545E] text-white p-3 rounded-lg" onClick={() => setOpen(true)}>Open Create PJO</button></div>{open && <CreateProductionJob orders={orders} onClose={() => setOpen(false)} onSaved={async () => {}} />}<div className="fixed top-0 left-1/2 -translate-x-1/2 z-[60] rounded-b-lg bg-amber-100 px-4 text-xs text-amber-900">LOCAL PREVIEW · SAMPLE ORDERS · SAVING DISABLED</div></>;
}
createRoot(document.getElementById('root')!).render(<Preview />);
