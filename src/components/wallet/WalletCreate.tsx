import { useState } from 'react';
import { Shield, Eye, EyeOff, Copy, Check, AlertTriangle, Key, Wallet } from 'lucide-react';
import { createWallet, importWallet, isWasmReady } from '../../lib/tcx-wasm';
import { useStore } from '../../store';

export function WalletCreate() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [wasmReady, setWasmReady] = useState(isWasmReady());
  const { setWallet, wallet } = useStore();

  const handleCreate = async () => {
    if (!password || password.length < 8) {
      setError('密码至少需要 8 个字符');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const result = await createWallet({ password });
      setWallet({
        isInitialized: true,
        keystoreJson: result.keystoreJson,
        password: password,
        address: result.address,
        mnemonic: result.mnemonic,
        chain: 'ETHEREUM',
      });
    } catch (err: any) {
      setError(`创建钱包失败: ${err.message || '未知错误'}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (wallet.isInitialized) {
    return <WalletInfo />;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      {/* Security Notice */}
      <div
        style={{
          padding: '14px',
          background: 'var(--surface-blue)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          border: '1px solid var(--info-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Shield size={16} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
            自托管安全说明
          </span>
        </div>
        <ul style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-secondary-gray)', paddingLeft: '16px' }}>
          <li>助记词和私钥仅在本地生成，<b>永远不会离开您的设备</b></li>
          <li>使用 tcx-wasm 在浏览器端完成所有加密操作</li>
          <li>imToken / 即付 不存储或传输您的密钥信息</li>
          <li>请妥善备份助记词，丢失将无法恢复资产</li>
        </ul>
      </div>

      {/* Demo Warning */}
      <div
        style={{
          padding: '10px 14px',
          background: 'var(--warning-surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--warning)',
        }}
      >
        <AlertTriangle size={14} />
        <span>⚠️ 演示项目 — 请勿输入真实资产相关的密码</span>
      </div>

      {/* Password Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
          设置密码
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="至少 8 个字符"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 14px',
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              color: 'var(--foreground)',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--muted-foreground)',
              padding: '4px',
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
          确认密码
        </label>
        <input
          type="password"
          placeholder="再次输入密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            color: 'var(--foreground)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

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

      {/* Create Button */}
      <button
        onClick={handleCreate}
        disabled={isCreating || !password || !confirmPassword}
        style={{
          width: '100%',
          padding: '14px',
          background:
            isCreating || !password || !confirmPassword
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
        {isCreating ? (
          <>
            <span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span>
            正在使用 tcx-wasm 生成钱包...
          </>
        ) : (
          <>
            <Key size={18} />
            创建钱包
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
        创建钱包即表示您同意自行保管助记词和私钥<br />
        密钥使用 tcx-wasm 在本地生成，不会上传至任何服务器
      </p>
    </div>
  );
}

export function WalletInfo() {
  const { wallet, resetWallet } = useStore();
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      {/* Wallet Card */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #007fff 0%, #0cc5ff 100%)',
          borderRadius: 'var(--radius-lg)',
          color: '#fff',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Wallet size={20} />
          <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9 }}>Ethereum 钱包</span>
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>地址</div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            wordBreak: 'break-all',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {wallet.address || '0x...'}
          <button
            onClick={() => copyToClipboard(wallet.address || '', 'address')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 6px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {copied === 'address' ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      {/* Mnemonic Section */}
      <div
        style={{
          padding: '16px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Key size={16} color="var(--primary)" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>助记词</span>
          </div>
          <button
            onClick={() => setShowMnemonic(!showMnemonic)}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '12px',
              color: 'var(--muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {showMnemonic ? <EyeOff size={12} /> : <Eye size={12} />}
            {showMnemonic ? '隐藏' : '显示'}
          </button>
        </div>

        {showMnemonic ? (
          <>
            <div
              style={{
                padding: '12px',
                background: 'var(--warning-surface)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.8,
                color: 'var(--foreground)',
                wordBreak: 'break-word',
              }}
            >
              {wallet.mnemonic}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                fontSize: '11px',
                color: 'var(--destructive)',
              }}
            >
              <AlertTriangle size={12} />
              请勿向任何人展示助记词！拥有助记词 = 拥有资产控制权
            </div>
          </>
        ) : (
          <div style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
            点击「显示」查看助记词（请确保周围无人）
          </div>
        )}
      </div>

      {/* Signing Info */}
      <div
        style={{
          padding: '16px',
          background: 'var(--success-surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Shield size={16} color="var(--success-text)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--success-text)' }}>
            安全状态
          </span>
        </div>
        <ul style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-secondary-gray)', paddingLeft: '16px' }}>
          <li>✅ 钱包已使用 tcx-wasm 在本地创建</li>
          <li>✅ 密钥材料未离开设备</li>
          <li>✅ 所有签名操作将在本地完成</li>
          <li>✅ 用户拥有完全资产控制权</li>
        </ul>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          if (confirm('确定要重置钱包吗？这将清除所有本地数据。')) {
            resetWallet();
          }
        }}
        style={{
          width: '100%',
          padding: '12px',
          background: 'var(--destructive-surface)',
          color: 'var(--destructive)',
          border: '1px solid var(--destructive)',
          borderRadius: 'var(--radius-full)',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'all 0.2s',
        }}
      >
        重置钱包（仅演示用）
      </button>
    </div>
  );
}
