'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  ShoppingBag,
  Sliders,
  LogOut,
  Upload,
  CheckCircle2,
  X,
  UserCheck,
  ShieldCheck,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { Product, Order, CustomBatteryQuote } from '../../../types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getAdminOrders,
  updateOrderStatus,
  getAdminQuotes
} from '../../../lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, token, isLoading: isAuthLoading, logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'quotes'>('products');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // Quotes state
  const [quotes, setQuotes] = useState<CustomBatteryQuote[]>([]);
  const [isQuotesLoading, setIsQuotesLoading] = useState(false);

  // Modal / Form state for Product Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    voltage: '',
    capacity: '',
    chemistry: 'LiFePO4',
    maxDischarge: '',
    cycleLife: '',
    dimensions: '',
    weight: '',
    connectorType: '',
    category: 'Solar & Home Energy Storage',
    imagesText: '', // newline separated URLs
    stock: '10',
    isFeatured: false,
  });

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !admin) {
      router.push('/admin/login');
    }
  }, [admin, isAuthLoading, router]);

  // Load Data based on active tab
  useEffect(() => {
    if (admin) {
      if (activeTab === 'products') fetchProductsData();
      if (activeTab === 'orders') fetchOrdersData();
      if (activeTab === 'quotes') fetchQuotesData();
    }
  }, [admin, activeTab]);

  const fetchProductsData = async () => {
    setIsProductsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const fetchOrdersData = async () => {
    setIsOrdersLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const fetchQuotesData = async () => {
    setIsQuotesLoading(true);
    try {
      const data = await getAdminQuotes();
      setQuotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsQuotesLoading(false);
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      voltage: '48V',
      capacity: '100Ah',
      chemistry: 'LiFePO4',
      maxDischarge: '150A Continuous',
      cycleLife: '3500+ Cycles',
      dimensions: '350 x 200 x 180 mm',
      weight: '14.5 kg',
      connectorType: 'M8 Copper Terminals',
      category: 'Solar & Home Energy Storage',
      imagesText: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&q=80&w=800',
      stock: '10',
      isFeatured: false,
    });
    setUploadFiles([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : '',
      voltage: product.voltage,
      capacity: product.capacity,
      chemistry: product.chemistry,
      maxDischarge: product.maxDischarge || '',
      cycleLife: product.cycleLife || '',
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      connectorType: product.connectorType || '',
      category: product.category,
      imagesText: product.images.join('\n'),
      stock: product.stock.toString(),
      isFeatured: product.isFeatured,
    });
    setUploadFiles([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this custom battery product?')) return;
    try {
      await deleteProduct(id);
      fetchProductsData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      let finalImages: string[] = productForm.imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // Handle image file uploads if selected
      if (uploadFiles.length > 0) {
        setIsUploading(true);
        const uploadedUrls = await uploadProductImages(uploadFiles);
        // Prefix with backend host if relative
        const fullUrls = uploadedUrls.map((u) =>
          u.startsWith('/') ? `http://localhost:5000${u}` : u
        );
        finalImages = [...finalImages, ...fullUrls];
        setIsUploading(false);
      }

      if (finalImages.length === 0) {
        finalImages = ['https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&q=80&w=800'];
      }

      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? parseFloat(productForm.compareAtPrice) : null,
        voltage: productForm.voltage,
        capacity: productForm.capacity,
        chemistry: productForm.chemistry,
        maxDischarge: productForm.maxDischarge,
        cycleLife: productForm.cycleLife,
        dimensions: productForm.dimensions,
        weight: productForm.weight,
        connectorType: productForm.connectorType,
        category: productForm.category,
        images: finalImages,
        stock: parseInt(productForm.stock),
        isFeatured: productForm.isFeatured,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setIsModalOpen(false);
      fetchProductsData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product.');
    }
  };

  // Update Order Status
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrdersData();
    } catch (e) {
      alert('Failed to update status.');
    }
  };

  if (isAuthLoading || !admin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#C86D27] border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Admin Header */}
      <div className="p-6 rounded-3xl bg-[#121216] border border-[#26262E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C86D27]/10 border border-[#C86D27]/40 text-[#C86D27] flex items-center justify-center font-bold text-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white">Admin Control Center</h1>
              <span className="px-2.5 py-0.5 rounded bg-[#C86D27] text-white text-[10px] font-bold uppercase">
                Authorized
              </span>
            </div>
            <p className="text-xs text-[#88889C] mt-0.5">
              Logged in as <span className="text-white font-bold">{admin.name}</span> ({admin.username})
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            router.push('/admin/login');
          }}
          className="px-4 py-2.5 rounded-xl bg-[#19191E] border border-[#3B3B46] text-xs font-bold text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#26262E] space-x-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-2 font-bold text-sm flex items-center space-x-2 transition-all border-b-2 ${
            activeTab === 'products'
              ? 'border-[#C86D27] text-[#F3AA72]'
              : 'border-transparent text-[#88889C] hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Management</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 font-bold text-sm flex items-center space-x-2 transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-[#C86D27] text-[#F3AA72]'
              : 'border-transparent text-[#88889C] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders & UPI Verification</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-4 px-2 font-bold text-sm flex items-center space-x-2 transition-all border-b-2 ${
            activeTab === 'quotes'
              ? 'border-[#C86D27] text-[#F3AA72]'
              : 'border-transparent text-[#88889C] hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Custom Buy/Sell Quotes</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Custom Battery Products ({products.length})</h2>
              <p className="text-xs text-[#88889C]">Add, update pricing, multiple images, and specs.</p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-[#C86D27] hover:bg-[#E28844] text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Product</span>
            </button>
          </div>

          {isProductsLoading ? (
            <div className="text-center py-12 text-xs text-[#88889C]">Loading products...</div>
          ) : (
            <div className="rounded-2xl border border-[#26262E] bg-[#121216] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#19191E] border-b border-[#26262E] text-[#88889C] uppercase font-semibold">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Specs (V / Ah / Chem)</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#26262E]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#19191E]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg bg-[#08080A] object-cover border border-[#26262E] shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white max-w-xs truncate">{p.name}</div>
                              <div className="text-[10px] text-[#88889C]">{p.images.length} Image(s)</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-[#F3AA72]">{p.voltage}</span> &bull; {p.capacity} &bull; {p.chemistry}
                        </td>
                        <td className="p-4 font-bold text-white">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${
                            p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-[#88889C]">{p.category}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 rounded-lg bg-[#19191E] text-white hover:text-[#C86D27] hover:border-[#C86D27] border border-[#26262E]"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-[#19191E] text-red-400 hover:bg-red-500/10 border border-[#26262E]"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Customer Guest Orders ({orders.length})</h2>
              <p className="text-xs text-[#88889C]">Manage fulfillment and verify UPI payment transactions.</p>
            </div>
            <button
              onClick={fetchOrdersData}
              className="px-4 py-2 rounded-xl bg-[#19191E] border border-[#3B3B46] text-xs font-semibold text-white hover:border-[#C86D27] flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
            </button>
          </div>

          {isOrdersLoading ? (
            <div className="text-center py-12 text-xs text-[#88889C]">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-[#121216] rounded-2xl border border-[#26262E] text-xs text-[#88889C]">
              No guest orders placed yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="p-6 rounded-2xl bg-[#121216] border border-[#26262E] space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#26262E] pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#F3AA72] text-sm">{o.orderNumber}</span>
                      <span className="text-[#88889C] ml-3">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[11px] border border-emerald-500/30">
                        {o.paymentMethod} &bull; {o.paymentStatus}
                      </span>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className="px-3 py-1 rounded-lg bg-[#08080A] border border-[#3B3B46] text-white text-xs font-bold focus:border-[#C86D27] outline-none"
                      >
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">{o.customerName}</div>
                      <div className="text-[#88889C]">{o.customerEmail} &bull; {o.customerPhone}</div>
                      <div className="text-[#88889C] mt-1">{o.address}, {o.city}, {o.state} - {o.pincode}</div>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="text-[#88889C]">UPI / Payment Ref:</div>
                      <div className="font-mono font-bold text-white text-sm">{o.paymentUpiTxnId || 'N/A'}</div>
                      <div className="text-lg font-extrabold text-gradient-copper mt-1">
                        Total: ₹{o.totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-[#08080A] p-3 rounded-xl border border-[#26262E] space-y-1.5 text-xs">
                    <div className="font-semibold text-[#88889C] text-[11px]">Ordered Battery Pack(s):</div>
                    {o.items.map((it) => (
                      <div key={it.id} className="flex justify-between text-white font-medium">
                        <span>{it.productName} (Qty: {it.quantity})</span>
                        <span>₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOM QUOTES */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Custom Battery Build & Sell Requests ({quotes.length})</h2>
              <p className="text-xs text-[#88889C]">Requests submitted by customers wanting custom builds or selling batteries.</p>
            </div>
            <button
              onClick={fetchQuotesData}
              className="px-4 py-2 rounded-xl bg-[#19191E] border border-[#3B3B46] text-xs font-semibold text-white hover:border-[#C86D27] flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Quotes
            </button>
          </div>

          {isQuotesLoading ? (
            <div className="text-center py-12 text-xs text-[#88889C]">Loading quotes...</div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-16 bg-[#121216] rounded-2xl border border-[#26262E] text-xs text-[#88889C]">
              No custom build/sell quote submissions yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quotes.map((q) => (
                <div key={q.id} className="p-6 rounded-2xl bg-[#121216] border border-[#26262E] space-y-3 text-xs shadow-lg">
                  <div className="flex justify-between items-center border-b border-[#26262E] pb-2">
                    <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                      q.type === 'BUY_CUSTOM' ? 'bg-[#C86D27]/20 text-[#F3AA72] border border-[#C86D27]/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {q.type === 'BUY_CUSTOM' ? 'Custom Build Request' : 'Customer Selling Battery'}
                    </span>
                    <span className="text-[#88889C] text-[11px]">{new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <div className="font-bold text-white text-sm">{q.name}</div>
                    <div className="text-[#88889C]">{q.email} &bull; {q.phone}</div>
                  </div>

                  {q.type === 'BUY_CUSTOM' && (
                    <div className="p-2.5 rounded-lg bg-[#08080A] border border-[#26262E] grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#88889C]">Voltage:</span>
                        <div className="font-bold text-white">{q.voltageReq || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-[#88889C]">Capacity:</span>
                        <div className="font-bold text-white">{q.capacityReq || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-[#88889C]">Application:</span>
                        <div className="font-bold text-[#F3AA72]">{q.application || 'N/A'}</div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-[#08080A] border border-[#26262E] space-y-1">
                    <div className="text-[#88889C] text-[10px] uppercase font-bold">Notes / Requirements</div>
                    <p className="text-[#B0B0C2] leading-relaxed whitespace-pre-wrap">{q.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#121216] border border-[#26262E] rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[#26262E] pb-4">
              <h3 className="font-bold text-lg text-white">
                {editingProduct ? 'Edit Custom Battery Product' : 'Create New Custom Battery Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#88889C] hover:text-white hover:bg-[#19191E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-[#B0B0C2]">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. VoltCraft 48V 100Ah LiFePO4 Solar Pack"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="129990"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Compare At Price (Original ₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.compareAtPrice}
                    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                    placeholder="149990"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Nominal Voltage *</label>
                  <input
                    type="text"
                    required
                    value={productForm.voltage}
                    onChange={(e) => setProductForm({ ...productForm, voltage: e.target.value })}
                    placeholder="48V"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none font-bold text-[#F3AA72]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Capacity *</label>
                  <input
                    type="text"
                    required
                    value={productForm.capacity}
                    onChange={(e) => setProductForm({ ...productForm, capacity: e.target.value })}
                    placeholder="100Ah"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Chemistry *</label>
                  <select
                    value={productForm.chemistry}
                    onChange={(e) => setProductForm({ ...productForm, chemistry: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  >
                    <option value="LiFePO4">LiFePO4 (Lithium Iron Phosphate)</option>
                    <option value="Lithium NMC">Lithium-Ion (NMC High Drain)</option>
                    <option value="LiPo">LiPo (Lithium Polymer High C)</option>
                    <option value="LTO">LTO (Lithium Titanate)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  >
                    <option value="Solar & Home Energy Storage">Solar & Home Energy Storage</option>
                    <option value="EV & Electric Bikes">EV & Electric Bikes</option>
                    <option value="Drone & Robotics">Drone & Robotics</option>
                    <option value="Marine & RV Power">Marine & RV Power</option>
                    <option value="Custom Battery">Custom Battery</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Max Discharge Current</label>
                  <input
                    type="text"
                    value={productForm.maxDischarge}
                    onChange={(e) => setProductForm({ ...productForm, maxDischarge: e.target.value })}
                    placeholder="150A Continuous / 300A Peak"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Cycle Life</label>
                  <input
                    type="text"
                    value={productForm.cycleLife}
                    onChange={(e) => setProductForm({ ...productForm, cycleLife: e.target.value })}
                    placeholder="6000+ Cycles @ 80% DOD"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Dimensions</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    placeholder="440 x 400 x 220 mm"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Weight</label>
                  <input
                    type="text"
                    value={productForm.weight}
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    placeholder="42.0 kg"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Connector Type</label>
                  <input
                    type="text"
                    value={productForm.connectorType}
                    onChange={(e) => setProductForm({ ...productForm, connectorType: e.target.value })}
                    placeholder="M8 Copper Terminals & Anderson SB175"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#B0B0C2]">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#B0B0C2]">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Comprehensive description of cell testing, laser-welded busbars, active BMS..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white focus:border-[#C86D27] outline-none"
                />
              </div>

              {/* Multiple Images Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#B0B0C2] flex items-center justify-between">
                  <span>Image URLs (Multiple images supported - 1 URL per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={productForm.imagesText}
                  onChange={(e) => setProductForm({ ...productForm, imagesText: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-1619725002198...&#10;https://images.unsplash.com/photo-1558441719..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white font-mono text-[11px] focus:border-[#C86D27] outline-none"
                />
              </div>

              {/* Local Image Upload Option */}
              <div className="p-3 rounded-xl bg-[#08080A] border border-[#26262E] space-y-1.5">
                <label className="font-semibold text-[#B0B0C2] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#C86D27]" /> Or Upload Image Files from Computer
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) setUploadFiles(Array.from(e.target.files));
                  }}
                  className="text-xs text-[#88889C] file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#19191E] file:text-white hover:file:bg-[#C86D27]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="accent-[#C86D27] w-4 h-4"
                />
                <label htmlFor="isFeatured" className="font-semibold text-[#B0B0C2] cursor-pointer">
                  Feature this battery on store home page banner
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-[#26262E]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#19191E] border border-[#26262E] font-bold text-white hover:bg-[#26262E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3 rounded-xl bg-[#C86D27] hover:bg-[#E28844] font-bold text-white shadow-lg"
                >
                  {isUploading ? 'Uploading Images...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
