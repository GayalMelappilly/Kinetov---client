import { Product, Order, CustomBatteryQuote, AdminUser } from '../types';

const LIVE_API_URL = 'https://kinetov---server.shy-hill-9a53.workers.dev/api';
const LOCAL_API_URL = 'http://localhost:5000/api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? LIVE_API_URL
    : LOCAL_API_URL);

// Helper for HTTP requests
async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

// Products API
export const getProducts = async (category?: string, search?: string): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);

  const query = params.toString() ? `?${params.toString()}` : '';
  const data = await fetcher<{ products: Product[] }>(`/products${query}`);
  return data.products;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const data = await fetcher<{ product: Product }>(`/products/${slug}`);
  return data.product;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const data = await fetcher<{ product: Product }>('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
  return data.product;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const data = await fetcher<{ product: Product }>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
  return data.product;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  return await fetcher<{ message: string }>(`/products/${id}`, {
    method: 'DELETE',
  });
};

export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const res = await fetch(`${API_BASE_URL}/products/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.imageUrls;
};

// Orders API
export const createOrder = async (orderPayload: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { productId: string; quantity: number }[];
  paymentMethod: string;
  paymentUpiTxnId?: string;
}): Promise<Order> => {
  const data = await fetcher<{ order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
  return data.order;
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order> => {
  const data = await fetcher<{ order: Order }>(`/orders/${orderNumber}`);
  return data.order;
};

export const getAdminOrders = async (): Promise<Order[]> => {
  const data = await fetcher<{ orders: Order[] }>('/orders/admin/all');
  return data.orders;
};

export const updateOrderStatus = async (
  id: string,
  orderStatus: string,
  paymentStatus?: string
): Promise<Order> => {
  const data = await fetcher<{ order: Order }>(`/orders/admin/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ orderStatus, paymentStatus }),
  });
  return data.order;
};

// Quotes API (Buy / Sell custom battery)
export const submitCustomQuote = async (payload: {
  name: string;
  email: string;
  phone: string;
  type: 'BUY_CUSTOM' | 'SELL_BATTERY';
  voltageReq?: string;
  capacityReq?: string;
  application?: string;
  notes: string;
}): Promise<{ message: string; quote: CustomBatteryQuote }> => {
  return await fetcher<{ message: string; quote: CustomBatteryQuote }>('/quotes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getAdminQuotes = async (): Promise<CustomBatteryQuote[]> => {
  const data = await fetcher<{ quotes: CustomBatteryQuote[] }>('/quotes/admin/all');
  return data.quotes;
};

// Admin Auth API
export const adminLogin = async (
  username: string,
  password: string
): Promise<{ token: string; admin: AdminUser }> => {
  return await fetcher<{ token: string; admin: AdminUser }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const getAdminProfile = async (): Promise<AdminUser> => {
  const data = await fetcher<{ admin: AdminUser }>('/admin/me');
  return data.admin;
};
