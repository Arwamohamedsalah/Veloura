import type { Product, Order, Recommendation } from './types';

const IMG = {
  coat: '/images/coat.png',
  tote: '/images/tote.png',
  gown: '/images/gown.png',
  headphones: '/images/headphones.png',
  watch: '/images/watch.png',
  speaker: '/images/speaker.png',
  ceramic: '/images/ceramic.png',
  candles: '/images/candles.png',
  lamp: '/images/lamp.png',
  sneakers: '/images/sneakers.png',
};

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Cashmere Wrap Coat', category: 'fashion', price: 890, stock: 42, rating: 4.9, image_url: IMG.coat, accent: 'emerald', status: 'active', created_at: '2026-01-15T10:00:00Z' },
  { id: '2', name: 'Heritage Leather Tote', category: 'fashion', price: 1240, stock: 18, rating: 4.8, image_url: IMG.tote, accent: 'orange', status: 'active', created_at: '2026-01-20T10:00:00Z' },
  { id: '3', name: 'Silk Evening Gown', category: 'fashion', price: 2100, stock: 8, rating: 5.0, image_url: IMG.gown, accent: 'emerald', status: 'low', created_at: '2026-02-01T10:00:00Z' },
  { id: '4', name: 'Noise-Cancel Pro Headphones', category: 'electronics', price: 549, stock: 64, rating: 4.7, image_url: IMG.headphones, accent: 'orange', status: 'active', created_at: '2026-02-10T10:00:00Z' },
  { id: '5', name: 'Smart Watch Elite', category: 'electronics', price: 799, stock: 31, rating: 4.6, image_url: IMG.watch, accent: 'emerald', status: 'active', created_at: '2026-02-15T10:00:00Z' },
  { id: '6', name: 'Portable Speaker Luxe', category: 'electronics', price: 329, stock: 0, rating: 4.5, image_url: IMG.speaker, accent: 'orange', status: 'out', created_at: '2026-03-01T10:00:00Z' },
  { id: '7', name: 'Artisan Ceramic Set', category: 'lifestyle', price: 185, stock: 55, rating: 4.8, image_url: IMG.ceramic, accent: 'emerald', status: 'active', created_at: '2026-03-05T10:00:00Z' },
  { id: '8', name: 'Scented Candle Collection', category: 'lifestyle', price: 98, stock: 12, rating: 4.9, image_url: IMG.candles, accent: 'orange', status: 'low', created_at: '2026-03-10T10:00:00Z' },
  { id: '9', name: 'Minimalist Desk Lamp', category: 'lifestyle', price: 245, stock: 28, rating: 4.7, image_url: IMG.lamp, accent: 'emerald', status: 'active', created_at: '2026-03-15T10:00:00Z' },
  { id: '10', name: 'Velour Sneakers', category: 'fashion', price: 420, stock: 36, rating: 4.6, image_url: IMG.sneakers, accent: 'orange', status: 'active', created_at: '2026-04-01T10:00:00Z' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'o1', order_no: 'VL-28491', customer: 'Sophie Laurent', email: 'sophie@email.com', channel: 'web', total: 2130, status: 'delivered', items: 2, location: 'Paris, FR', created_at: '2026-07-28T14:22:00Z' },
  { id: 'o2', order_no: 'VL-28492', customer: 'James Chen', email: 'j.chen@email.com', channel: 'app', total: 549, status: 'shipped', items: 1, location: 'Singapore', created_at: '2026-07-29T09:15:00Z' },
  { id: 'o3', order_no: 'VL-28493', customer: 'Arwa Salah', email: 'arwa@veloura.io', channel: 'boutique', total: 4340, status: 'processing', items: 3, location: 'Cairo, EG', created_at: '2026-07-30T11:40:00Z' },
  { id: 'o4', order_no: 'VL-28494', customer: 'Elena Vasquez', email: 'elena.v@email.com', channel: 'web', total: 890, status: 'pending', items: 1, location: 'Madrid, ES', created_at: '2026-07-31T16:08:00Z' },
  { id: 'o5', order_no: 'VL-28495', customer: 'Marcus Webb', email: 'm.webb@email.com', channel: 'web', total: 1240, status: 'delivered', items: 1, location: 'London, UK', created_at: '2026-08-01T08:30:00Z' },
  { id: 'o6', order_no: 'VL-28496', customer: 'Yuki Tanaka', email: 'yuki@email.com', channel: 'app', total: 799, status: 'shipped', items: 1, location: 'Tokyo, JP', created_at: '2026-08-02T13:55:00Z' },
  { id: 'o7', order_no: 'VL-28497', customer: 'Isabella Rossi', email: 'i.rossi@email.com', channel: 'boutique', total: 283, status: 'cancelled', items: 2, location: 'Milan, IT', created_at: '2026-08-03T10:20:00Z' },
  { id: 'o8', order_no: 'VL-28498', customer: 'David Okonkwo', email: 'd.ok@email.com', channel: 'web', total: 2100, status: 'processing', items: 1, location: 'Abuja, NG', created_at: '2026-08-04T17:45:00Z' },
  { id: 'o9', order_no: 'VL-28499', customer: 'Claire Dubois', email: 'c.dubois@email.com', channel: 'app', total: 420, status: 'pending', items: 1, location: 'Lyon, FR', created_at: '2026-08-05T09:12:00Z' },
  { id: 'o10', order_no: 'VL-28500', customer: 'Ryan Mitchell', email: 'ryan.m@email.com', channel: 'web', total: 1674, status: 'delivered', items: 4, location: 'New York, US', created_at: '2026-08-05T20:30:00Z' },
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'r1', title: 'Bundle silk gown with evening accessories', reason: 'Customers who viewed the Silk Evening Gown convert 34% higher when shown a curated accessory bundle at checkout.', category: 'fashion', lift: 34.2, confidence: 0.91, image_url: IMG.gown, accent: 'emerald', created_at: '2026-08-04T10:00:00Z' },
  { id: 'r2', title: 'Promote headphones to watch buyers', reason: 'Cross-sell signal detected: 28% of Smart Watch Elite purchasers also buy audio within 14 days.', category: 'electronics', lift: 28.7, confidence: 0.87, image_url: IMG.headphones, accent: 'orange', created_at: '2026-08-04T11:00:00Z' },
  { id: 'r3', title: 'Restock candle collection before weekend', reason: 'Demand forecast shows 2.4× normal velocity for Scented Candle Collection this Friday–Sunday.', category: 'lifestyle', lift: 22.1, confidence: 0.84, image_url: IMG.candles, accent: 'orange', created_at: '2026-08-05T08:00:00Z' },
  { id: 'r4', title: 'Feature cashmere coat on homepage hero', reason: 'Browse-to-cart rate for Cashmere Wrap Coat is 3.2× category average with strong repeat intent.', category: 'fashion', lift: 41.5, confidence: 0.93, image_url: IMG.coat, accent: 'emerald', created_at: '2026-08-05T09:00:00Z' },
  { id: 'r5', title: 'Launch limited ceramic pre-order', reason: 'Waitlist of 842 users for Artisan Ceramic Set — pre-order could capture $156K in 72 hours.', category: 'lifestyle', lift: 19.8, confidence: 0.79, image_url: IMG.ceramic, accent: 'emerald', created_at: '2026-08-05T10:00:00Z' },
];

export const GUIDE_ROUTES: Record<string, import('./types').View> = {
  'getting-started': 'overview',
  'ai-picks': 'ai',
  'orders': 'orders',
  'analytics': 'analytics',
  'inventory': 'inventory',
};
