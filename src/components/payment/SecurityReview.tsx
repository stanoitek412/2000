import { Shield, AlertTriangle, CheckCircle, Eye, Lock } from 'lucide-react';
import { useStore } from '../../store';

export function SecurityReview() {
  const { securityChecks, toggleSecurityCheck, cart, wallet } = useStore();

  const allChecked = securityChecks.every((c) => c.checked);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      {/* Transaction Summary */}
      <div
        style={{
          padding: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Eye size={16} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>交易详情确认</span>
        </div>
        <div style={{ fontSize: '13px', lineHeight: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>收款方</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              0x742d...2bD18
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>支付金额</span>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>USD {totalAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>网络</span>
            <span>Ethereum Mainnet</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>签名方式</span>
            <span style={{ color: 'var(--success-text)' }}>tcx-wasm 本地签名</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>付款地址</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </span>
          </div>
        </div>
      </div>

      {/* Security Checklist */}
      <div
        style={{
          padding: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Shield size={16} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>安全检查清单</span>
          <span
            className={`badge ${allChecked ? 'badge-success' : 'badge-warning'}`}
          >
            {securityChecks.filter((c) => c.checked).length}/{securityChecks.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {securityChecks.map((check) => (
            <label
              key={check.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px',
                background: check.checked ? 'var(--success-surface)' : 'var(--background)',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${check.checked ? 'var(--success)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="checkbox"
                checked={check.checked}
                onChange={() => toggleSecurityCheck(check.id)}
                style={{
                  marginTop: '2px',
                  accentColor: 'var(--primary)',
                  width: '16px',
                  height: '16px',
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: check.checked ? 'var(--success-text)' : 'var(--foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {check.checked && <CheckCircle size={12} />}
                  {check.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-foreground)', marginTop: '2px' }}>
                  {check.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Risk Warning */}
      <div
        style={{
          padding: '14px',
          background: 'var(--warning-surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          border: '1px solid var(--warning)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <AlertTriangle size={16} color="var(--warning)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--warning)' }}>
            风险提示
          </span>
        </div>
        <ul style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-secondary-gray)', paddingLeft: '16px' }}>
          <li>区块链交易一旦确认，无法撤回或修改</li>
          <li>请确认收款地址和金额无误后再签名</li>
          <li>请勿在公共网络或不安全的环境下进行交易签名</li>
          <li>如发现异常，请立即取消交易并检查钱包安全</li>
        </ul>
      </div>

      {/* Sovereignty Notice */}
      <div
        style={{
          padding: '14px',
          background: 'var(--surface-blue)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <Lock size={14} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary-gray)', lineHeight: 1.6 }}>
          您拥有完全的资产控制权。所有签名操作使用 tcx-wasm 在您的设备本地完成，私钥永远不会离开您的设备。即付不存储、不传输任何密钥信息。
        </span>
      </div>
    </div>
  );
}
