import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Shield, MapPin, Info } from 'lucide-react';
import { getProductById } from '../../data/products';
import { useStore } from '../../store';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const product = getProductById(productId);
  const navigate = useNavigate();
  const { addToCart, wallet } = useStore();

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '48px 16px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>😕</div>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>商品不存在</div>
        <button
          onClick={() => navigate('/explore')}
          style={{
            marginTop: '16px',
            padding: '10px 24px',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          返回浏览
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="animate-fade-in">
      {/* Product Header */}
      <div
        style={{
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(135deg, var(--surface-blue) 0%, var(--surface-blue-info) 100%)',
        }}
      >
        <span style={{ fontSize: '64px', marginBottom: '12px' }}>{product.icon}</span>
        <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center' }}>
          {product.name}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
          {product.nameEn}
        </p>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginTop: '12px' }}>
          {product.currency} {product.price}
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {product.tags.map((tag) => (
            <span key={tag} className={`badge ${tag === '热门' ? 'badge-hot' : 'badge-info'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '16px' }}>
        {/* Region */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: 'var(--card)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '12px',
          }}
        >
          <MapPin size={16} color="var(--primary)" />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>支持地区</span>
          <span style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginLeft: 'auto' }}>
            {product.region.join(', ')}
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            padding: '16px',
            background: 'var(--card)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Info size={16} color="var(--primary)" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>商品描述</span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary-gray)' }}>
            {product.description}
          </p>
        </div>

        {/* Redemption Instructions */}
        <div
          style={{
            padding: '16px',
            background: 'var(--card)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ShoppingCart size={16} color="var(--primary)" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>兑换说明</span>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary-gray)' }}>
            {product.redemption}
          </p>
        </div>

        {/* Security Notice */}
        <div
          style={{
            padding: '16px',
            background: 'var(--warning-surface)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Shield size={16} color="var(--warning)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--warning)' }}>
              安全提示
            </span>
          </div>
          <ul style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-secondary-gray)', paddingLeft: '16px' }}>
            <li>此为演示项目，使用 Mock 数据，非真实交易</li>
            <li>兑换码仅用于演示，不可实际使用</li>
            <li>支付签名使用 tcx-wasm 在本地完成，密钥不离开设备</li>
            <li>用户拥有完全资产控制权</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              padding: '14px',
              background: 'var(--surface-blue)',
              color: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            加入购物车
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!wallet.keystoreJson}
            style={{
              flex: 1,
              padding: '14px',
              background: wallet.keystoreJson ? 'var(--primary)' : 'var(--primary-disabled)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.2s',
              opacity: wallet.keystoreJson ? 1 : 0.6,
            }}
          >
            {wallet.keystoreJson ? '立即购买' : '请先创建钱包'}
          </button>
        </div>

        {!wallet.keystoreJson && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: 'var(--muted-foreground)',
              marginTop: '8px',
            }}
          >
            请先在「钱包」页面创建或导入钱包后再购买
          </p>
        )}
      </div>
    </div>
  );
}
