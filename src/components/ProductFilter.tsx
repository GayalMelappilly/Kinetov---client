'use client';

import React from 'react';
import { Search, Filter, Cpu } from 'lucide-react';

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121216] border border-[#26262E] mb-8">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-[#88889C] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search voltage, capacity, LiFePO4, 48V..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08080A] border border-[#26262E] text-white placeholder-[#656577] text-xs focus:outline-none focus:border-[#C86D27] transition-all"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
        <span className="text-xs text-[#88889C] font-semibold flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#C86D27] text-white shadow-[0_0_15px_rgba(200,109,39,0.3)]'
                : 'bg-[#19191E] text-[#B0B0C2] border border-[#26262E] hover:border-[#3B3B46] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

    </div>
  );
};
