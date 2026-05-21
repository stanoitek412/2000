import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, PenTool, Loader, ArrowRight } from 'lucide-react';
import { signTransaction } from '../../lib/tcx-wasm';
import { useStore } from '../../store';

export function PaymentConfirm() {
  const [isSigning, setIsSigning] = useState(false);
  const [signingStep, setSigningStep] = useState(0);
  const [error, setError] = useState('');
  const { wallet, cart, setPayment, securityChecks } = useStore();

  const allSecurityChecked = securityChecks.every((c) => c.checked);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleConfirmAndSign = async () => {
    if (!wallet.keystoreJson || !wallet.password || !allSecurityChecked) return;

    setIsSigning(true);
    setError('');
    setSigningStep(1);

    try {
      // Step 1: Prepare
      await new Promise((r) => setTimeout(r, 500));
      setSigningStep(2);

      // Step 2: Load keystore
      await new Promise((r) => setTimeout(r, 400));
      setSigningStep(3);

      // Step 3: Sign
      const result = await signTransaction({
        keystoreJson: wallet.keystoreJson,
        password: wallet.password,
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
        value: (totalAmount * 1e15).toString(),
        chainId: '1',
        gasPrice: '20000000000',
        gasLimit: '21000',
        nonce: String(Math.floor(Math.random() * 100)),
      });

      setSigningStep(4);
      await new Promise((r) => setTimeout(r, 300));

      // Generate mock redemption codes
      const redemptionCode = cart
        .map(() =>
          Array.from({ length: 16 }, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
          ).join('')
        )
        .join('-XX-');

      setPayment({
        step: 'success',
        redemptionCode,
        txHash: result.txHash,
        signature: result.signature,
      });
    } catch (err: any) {
      setError(`支付失败: ${err.message || '未知错误'}`);
      setSigningStep(0);
    } finally {
      setIsSigning(false);
    }
  };

  const stepLabels = [
    '验证安全检查...',
    '构建交易数据...',
    'tcx-wasm 本地签名中...',
    '交易已提交！',
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      {/* Confirmation Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--surface-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Shield size={28} color="var(--primary)" />
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>确认支付</div>
        <div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
          请确认以下交易信息并完成签名
        </div>
      </div>

      {/* Amount */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #007fff 0%, #0cc5ff 100%)',
          borderRadius: 'var(--radius-lg)',
          color: '#fff',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>支付金额</div>
        <div style={{ fontSize: '32px', fontWeight: 700 }}>
          USD {totalAmount}
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
          包含 {cart.length} 件商品
        </div>
      </div>

      {/* Signing Progress */}
      {isSigning && (
        <div
          className="animate-slide-up"
          style={{
            padding: '16px',
            background: 'var(--card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Loader size={16} className="animate-spin" color="var(--primary)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
              {stepLabels[signingStep - 1] || '处理中...'}
            </span>
          </div>
          <div
            style={{
              height: '4px',
              background: 'var(--muted)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'var(--primary)',
                borderRadius: '2px',
                width: `${(signingStep / 4) * 100}%`,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--destructive-surface)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--destructive)',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {/* Security Status */}
      {!allSecurityChecked && (
        <div
          style={{
            padding: '12px',
            background: 'var(--warning-surface)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--warning)',
          }}
        >
          <AlertTriangle size={16} />
          请先完成所有安全检查后再确认支付
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirmAndSign}
        disabled={isSigning || !allSecurityChecked}
        style={{
          width: '100%',
          padding: '16px',
          background:
            isSigning || !allSecurityChecked
              ? 'var(--primary-disabled)'
              : 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          fontSize: '16px',
          fontWeight: 700,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {isSigning ? (
          <>
            <Loader size={18} className="animate-spin" />
            签名中...
          </>
        ) : (
          <>
            <PenTool size={18} />
            确认支付并使用 tcx-wasm 签名
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <p
        style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--muted-foreground)',
          marginTop: '12px',
          lineHeight: 1.6,
        }}
      >
        点击确认后，将使用 tcx-wasm 在您的设备本地完成交易签名<br />
        私钥不会离开您的设备，即付不存储任何密钥信息
      </p>
    </div>
  );
}
