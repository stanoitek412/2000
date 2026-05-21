import { useNavigate } from 'react-router-dom';
import type { Product } from '../../data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '28px' }}>{product.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--foreground)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
            {product.nameEn}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
          {product.currency} {product.price}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`badge ${tag === '热门' ? 'badge-hot' : 'badge-info'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>
        地区: {product.region.join(', ')}
      </div>
    </div>
  );
}
