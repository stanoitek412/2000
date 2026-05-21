import { categories, type ProductCategory } from '../../data/products';

interface CategoryTabsProps {
  activeCategory: ProductCategory | 'all';
  onSelect: (category: ProductCategory | 'all') => void;
}

export function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '12px 16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <button
        onClick={() => onSelect('all')}
        style={{
          flexShrink: 0,
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          background: activeCategory === 'all' ? 'var(--primary)' : 'var(--muted)',
          color: activeCategory === 'all' ? '#fff' : 'var(--foreground)',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          style={{
            flexShrink: 0,
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: activeCategory === cat.id ? 'var(--primary)' : 'var(--muted)',
            color: activeCategory === cat.id ? '#fff' : 'var(--foreground)',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
}
