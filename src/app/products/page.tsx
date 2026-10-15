'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { getProducts } from '../../lib/api';
import { ProductCard } from '../../components/ProductCard';
import { ProductFilter } from '../../components/ProductFilter';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts(selectedCategory, searchQuery);
      setProducts(data);

      // Extract unique categories
      const cats = Array.from(new Set(data.map((p) => p.category)));
      setCategories(['All', ...cats]);
    } catch (err) {
      console.error('Error fetching catalog:', err);
      setError('Unable to load products. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-[#26262E] pb-6">
        <h1 className="text-3xl font-extrabold text-white">Kinetov Custom Battery Catalog</h1>
        <p className="text-xs text-[#88889C] mt-1">
          Showing available custom lithium packs engineered with active BMS & laser welded busbars.
        </p>
      </div>

      {/* Filter Component */}
      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-[#121216] border border-[#26262E] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-[#121216] rounded-2xl border border-[#26262E] space-y-4">
          <div className="text-[#88889C] text-sm">{error}</div>
          <button
            onClick={fetchProducts}
            className="px-5 py-2.5 rounded-xl bg-[#C86D27] hover:bg-[#E28844] text-xs font-bold text-white transition-all"
          >
            Retry Connection
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#121216] rounded-2xl border border-[#26262E] space-y-3">
          <div className="text-[#88889C] text-sm">No custom batteries match your criteria.</div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#19191E] border border-[#3B3B46] text-xs font-semibold text-white hover:border-[#C86D27]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
