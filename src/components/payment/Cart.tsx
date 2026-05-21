import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, wallet } = useStore();
  const navigate = useNavigate();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '64px 16px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
        <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          购物车是空的
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '24px' }}>
          浏览商品或使用 AI 助手快速下单
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/explore')}
            style={{
              padding: '12px 24px',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            浏览商品
          </button>
          <button
            onClick={() => navigate('/ai')}
            style={{
              padding: '12px 24px',
              background: 'var(--surface-blue)',
              color: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            AI 助手
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* Cart Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {cart.map((item) => (
          <div
            key={item.product.id}
            style={{
              padding: '14px',
              background: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>{item.product.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.product.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                {item.product.currency} {item.product.price}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--foreground)',
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--foreground)',
                }}
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => removeFromCart(item.product.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--destructive)',
                  padding: '4px',
                  marginLeft: '4px',
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          padding: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>商品数量</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{totalItems} 件</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>网络手续费 (Mock)</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>~$2.50</span>
        </div>
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 700 }}>合计</span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
            USD {totalAmount + 2.5}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => navigate('/payment')}
        disabled={!wallet.keystoreJson}
        style={{
          width: '100%',
          padding: '14px',
          background: wallet.keystoreJson ? 'var(--primary)' : 'var(--primary-disabled)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          fontSize: '15px',
          fontWeight: 600,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: wallet.keystoreJson ? 1 : 0.6,
        }}
      >
        <ShoppingCart size={18} />
        {wallet.keystoreJson ? '去结算' : '请先创建钱包'}
        <ArrowRight size={16} />
      </button>

      {!wallet.keystoreJson && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--muted-foreground)',
            marginTop: '8px',
          }}
        >
          请先在「钱包」页面创建或导入钱包后再结算
        </p>
      )}
    </div>
  );
}
