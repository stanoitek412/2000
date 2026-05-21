import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products, searchProducts, type Product } from '../../data/products';
import { ProductCard } from './ProductCard';
import { CategoryTabs } from './CategoryTabs';
import type { ProductCategory } from '../../data/products';

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = searchQuery
    ? searchProducts(searchQuery)
    : activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Search Bar */}
      <div style={{ padding: '12px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--muted)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 16px',
            gap: '8px',
          }}
        >
          <Search size={18} color="var(--muted-foreground)" />
          <input
            type="text"
            placeholder="搜索商品..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(!!e.target.value);
            }}
            onFocus={() => setIsSearching(true)}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: '14px',
              color: 'var(--foreground)',
            }}
          />
          {(searchQuery || isSearching) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted-foreground)',
                padding: '2px',
                display: 'flex',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      {!searchQuery && (
        <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
      )}

      {/* Product Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '0 16px 16px',
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 16px',
            color: 'var(--muted-foreground)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>没有找到相关商品</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>试试其他关键词或分类</div>
        </div>
      )}
    </div>
  );
}
