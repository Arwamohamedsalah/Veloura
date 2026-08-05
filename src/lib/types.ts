export type Product = {
  id: string;
  name: string;
  category: 'fashion' | 'electronics' | 'lifestyle';
  price: number;
  stock: number;
  rating: number;
  image_url: string | null;
  accent: 'emerald' | 'orange';
  status: 'active' | 'low' | 'out';
  created_at: string;
};

export type Order = {
  id: string;
  order_no: string;
  customer: string;
  email: string | null;
  channel: 'web' | 'app' | 'boutique';
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  location: string | null;
  created_at: string;
};

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  category: string;
  lift: number;
  confidence: number;
  image_url: string | null;
  accent: 'emerald' | 'orange';
  created_at: string;
};

export type View = 'overview' | 'ai' | 'orders' | 'analytics' | 'inventory' | 'settings' | 'help' | 'design';

export type NavigateOptions = {
  settingsTab?: string;
  ordersFilter?: Order['status'] | 'all';
  orderId?: string;
};
