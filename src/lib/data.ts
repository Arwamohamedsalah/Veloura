import { useEffect, useState } from 'react';
import type { Product, Order, Recommendation } from './types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_RECOMMENDATIONS } from './mockData';

export type DataState = {
  products: Product[];
  orders: Order[];
  recommendations: Recommendation[];
  loading: boolean;
};

export function useData(): DataState {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setOrders(MOCK_ORDERS);
      setRecommendations(MOCK_RECOMMENDATIONS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return { products, orders, recommendations, loading };
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}
