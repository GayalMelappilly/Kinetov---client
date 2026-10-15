export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  voltage: string;
  capacity: string;
  chemistry: string;
  maxDischarge?: string | null;
  cycleLife?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  connectorType?: string | null;
  category: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentUpiTxnId?: string | null;
  orderStatus: string;
  items: OrderItem[];
  createdAt: string;
}

export interface CustomBatteryQuote {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'BUY_CUSTOM' | 'SELL_BATTERY';
  voltageReq?: string | null;
  capacityReq?: string | null;
  application?: string | null;
  notes: string;
  status: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
}
