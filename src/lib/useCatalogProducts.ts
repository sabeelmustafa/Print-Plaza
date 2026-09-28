import { useEffect, useState } from 'react';
import { Product } from '../types';
import { DataService } from './dataService';

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(() => DataService.getCachedStorefront()?.products || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    DataService.getStorefront().then(data => {
      if (active) setProducts(data.products.filter(product => product.active !== false));
    }).catch(() => {
      if (active) setError('Products could not be loaded. Please retry.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);
  return { products, loading, error, retry: () => setRevision(value => value + 1) };
}
