import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, ExternalLink, Shield, ArrowRight } from 'lucide-react';
import { useStore } from '../../store';
import { useState } from 'react';

export function PaymentSuccess() {
  const { cart, payment, clearCart, resetPayment, wallet } = useStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (payment.redemptionCode) {
      navigator.clipboard.writeText(payment.redemptionCode).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDone = () => {
    clearCart();
    resetPayment();
    navigate('/');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      {/* Success Animation */}
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div
          className="animate-bounce-in"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--success-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '3px solid var(--success)',
          }}
        >
          <CheckCircle size={40} color="var(--success-text)" />
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          支付成功！
        </div>
        <div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
          您的订单已通过 tcx-wasm 签名确认
        </div>
      </div>

      {/* Redemption Code */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #007fff 0%, #0cc5ff 100%)',
          borderRadius: 'var(--radius-lg)',
          color: '#fff',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>
          兑换码（Mock 数据）
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            wordBreak: 'break-all',
            lineHeight: 1.6,
            background: 'rgba(255,255,255,0.15)',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {payment.redemptionCode}
        </div>
        <button
          onClick={handleCopy}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '12px auto 0',
            cursor: 'pointer',
          }}
        >
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          {copied ? '已复制' : '复制兑换码'}
        </button>
      </div>

      {/* Transaction Details */}
      <div
        style={{
          padding: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
          交易详情
        </div>
        <div style={{ fontSize: '13px', lineHeight: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>交易哈希</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {payment.txHash?.slice(0, 10)}...{payment.txHash?.slice(-8)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>签名</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {payment.signature?.slice(0, 10)}...
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>付款地址</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>签名方式</span>
            <span style={{ color: 'var(--success-text)', fontWeight: 500 }}>
              tcx-wasm 本地签名
            </span>
          </div>
        </div>
      </div>

      {/* Purchased Items */}
      <div
        style={{
          padding: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
          已购商品
        </div>
        {cart.map((item) => (
          <div
            key={item.product.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '24px' }}>{item.product.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.product.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                {item.product.currency} {item.product.price} × {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div
        style={{
          padding: '14px',
          background: 'var(--success-surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <Shield size={14} color="var(--success-text)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--success-text)', lineHeight: 1.6 }}>
          本次交易使用 tcx-wasm 在您的设备本地完成签名。私钥从未离开您的设备，即付不存储、不传输任何密钥信息。您始终拥有完全的资产控制权。
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/explore')}
          style={{
            flex: 1,
            padding: '14px',
            background: 'var(--surface-blue)',
            color: 'var(--primary)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          继续购物
        </button>
        <button
          onClick={handleDone}
          style={{
            flex: 1,
            padding: '14px',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          完成
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
