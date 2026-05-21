import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, PenTool, Loader } from 'lucide-react';
import { signTransaction } from '../../lib/tcx-wasm';
import { useStore } from '../../store';

export function SigningDemo() {
  const [isSigning, setIsSigning] = useState(false);
  const [signResult, setSignResult] = useState<{ signature: string; txHash: string } | null>(null);
  const [error, setError] = useState('');
  const [signingStep, setSigningStep] = useState(0);
  const { wallet, cart } = useStore();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSign = async () => {
    if (!wallet.keystoreJson || !wallet.password) return;

    setIsSigning(true);
    setError('');
    setSignResult(null);
    setSigningStep(1);

    try {
      // Step 1: Prepare transaction
      await new Promise((r) => setTimeout(r, 600));
      setSigningStep(2);

      // Step 2: Cache keystore
      await new Promise((r) => setTimeout(r, 400));
      setSigningStep(3);

      // Step 3: Sign with tcx-wasm
      const result = await signTransaction({
        keystoreJson: wallet.keystoreJson,
        password: wallet.password,
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
        value: (totalAmount * 1e15).toString(), // Convert to wei-like format
        chainId: '1',
        gasPrice: '20000000000',
        gasLimit: '21000',
        nonce: String(Math.floor(Math.random() * 100)),
      });

      setSigningStep(4);
      await new Promise((r) => setTimeout(r, 300));

      setSignResult(result);
      setSigningStep(0);
    } catch (err: any) {
      setError(`签名失败: ${err.message || '未知错误'}`);
      setSigningStep(0);
    } finally {
      setIsSigning(false);
    }
  };

  const steps = [
    { label: '准备交易数据', desc: '构建 Ethereum 交易参数' },
    { label: '加载密钥库', desc: '从 tcx-wasm 加载加密的 keystore' },
    { label: '本地签名', desc: '使用 tcx-wasm 在浏览器端完成 ECDSA 签名' },
    { label: '签名完成', desc: '交易签名已生成，密钥未离开设备' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      {/* Signing Process */}
      <div
        style={{
          padding: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <PenTool size={16} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>tcx-wasm 签名流程</span>
        </div>

        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
              borderBottom: index < steps.length - 1 ? '1px solid var(--border)' : 'none',
              opacity:
                signingStep === 0 && !signResult
                  ? 0.4
                  : signingStep > index || signResult
                  ? 1
                  : signingStep === index + 1
                  ? 1
                  : 0.4,
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 600,
                background:
                  signResult || signingStep > index + 1
                    ? 'var(--success)'
                    : signingStep === index + 1
                    ? 'var(--primary)'
                    : 'var(--muted)',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {signResult || signingStep > index + 1 ? (
                <CheckCircle size={14} />
              ) : signingStep === index + 1 ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                index + 1
              )}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{step.label}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sign Result */}
      {signResult && (
        <div
          className="animate-slide-up"
          style={{
            padding: '16px',
            background: 'var(--success-surface)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            border: '1px solid var(--success)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <CheckCircle size={16} color="var(--success-text)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--success-text)' }}>
              签名成功
            </span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>
              交易哈希 (TxHash)
            </div>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                wordBreak: 'break-all',
                color: 'var(--foreground)',
                background: 'var(--background)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {signResult.txHash}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginBottom: '2px' }}>
              签名 (Signature)
            </div>
            <div
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                wordBreak: 'break-all',
                color: 'var(--foreground)',
                background: 'var(--background)',
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {signResult.signature?.slice(0, 64)}...
            </div>
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

      {/* Security Note */}
      <div
        style={{
          padding: '12px',
          background: 'var(--surface-blue)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <Shield size={14} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary-gray)', lineHeight: 1.6 }}>
          签名过程完全在浏览器端使用 tcx-wasm 完成。私钥在 WASM 内存中解密后立即用于签名，签名完成后内存被安全清除。密钥材料永远不会离开您的设备。
        </span>
      </div>

      {/* Sign Button */}
      <button
        onClick={handleSign}
        disabled={isSigning || !wallet.keystoreJson}
        style={{
          width: '100%',
          padding: '14px',
          background:
            isSigning || !wallet.keystoreJson
              ? 'var(--primary-disabled)'
              : 'var(--primary)',
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
        }}
      >
        {isSigning ? (
          <>
            <Loader size={18} className="animate-spin" />
            正在签名...
          </>
        ) : (
          <>
            <PenTool size={18} />
            {wallet.keystoreJson ? '使用 tcx-wasm 签名交易' : '请先创建钱包'}
          </>
        )}
      </button>
    </div>
  );
}
