import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Sparkles, Wallet, ShoppingCart } from 'lucide-react';
import { useStore } from '../store';
import { products } from '../data/products';

export function HomePage() {
  const navigate = useNavigate();
  const { wallet, cart } = useStore();

  const featuredProducts = products.filter((p) => p.tags.includes('热门')).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div
        style={{
          padding: '32px 16px 24px',
          background: 'linear-gradient(135deg, #007fff 0%, #0cc5ff 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
            即付
          </div>
          <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '4px' }}>
            Instant Pay
          </div>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '20px' }}>
            钱包电商助手 · Bitrefill 合作伙伴赛道
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/ai')}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 'var(--radius-full)',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Sparkles size={16} />
              AI 下单
            </button>
            <button
              onClick={() => navigate('/explore')}
              style={{
                padding: '10px 20px',
                background: '#fff',
                color: 'var(--primary)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              浏览商品
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '16px',
          marginTop: '-12px',
        }}
      >
        <div
          onClick={() => navigate('/wallet')}
          style={{
            padding: '16px',
            background: 'var(--card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Wallet size={16} color="var(--primary)" />
            <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>钱包状态</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            {wallet.isInitialized ? '已连接' : '未创建'}
          </div>
          {wallet.address && (
            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            </div>
          )}
        </div>
        <div
          onClick={() => navigate('/cart')}
          style={{
            padding: '16px',
            background: 'var(--card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <ShoppingCart size={16} color="var(--primary)" />
            <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>购物车</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            {cart.length} 件商品
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700 }}>热门商品</span>
          <button
            onClick={() => navigate('/explore')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            查看全部 <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                padding: '14px',
                background: 'var(--card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{product.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                {product.name}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                {product.currency} {product.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Badge */}
      <div style={{ padding: '0 16px 16px' }}>
        <div
          onClick={() => navigate('/wallet')}
          style={{
            padding: '16px',
            background: 'var(--success-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <Shield size={20} color="var(--success-text)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success-text)' }}>
              自托管安全架构
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary-gray)' }}>
              基于 tcx-wasm · Token UI Security · 用户完全控制
            </div>
          </div>
        </div>
      </div>

      {/* imToken 10th Anniversary Badge */}
      <div style={{ padding: '0 16px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
          🎉 imToken 10 周年 AI 共创活动 · Bitrefill 合作伙伴赛道
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '4px' }}>
          演示项目 — 使用 Mock 数据 — 非真实交易
        </div>
      </div>
    </div>
  );
}
