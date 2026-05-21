import { useState } from 'react';
import { Key, AlertTriangle, Shield } from 'lucide-react';
import { importWallet } from '../../lib/tcx-wasm';
import { useStore } from '../../store';

export function WalletImport() {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const { setWallet } = useStore();

  const handleImport = async () => {
    if (!mnemonic.trim()) {
      setError('请输入助记词');
      return;
    }
    if (!password || password.length < 8) {
      setError('密码至少需要 8 个字符');
      return;
    }

    setIsImporting(true);
    setError('');

    try {
      const result = await importWallet(mnemonic.trim(), password);
      setWallet({
        isInitialized: true,
        keystoreJson: result.keystoreJson,
        password: password,
        address: result.address,
        mnemonic: result.mnemonic,
        chain: 'ETHEREUM',
      });
    } catch (err: any) {
      setError(`导入钱包失败: ${err.message || '请检查助记词格式'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '16px' }}>
      {/* Security Warning */}
      <div
        style={{
          padding: '14px',
          background: 'var(--destructive-surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          border: '1px solid var(--destructive)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <AlertTriangle size={16} color="var(--destructive)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--destructive)' }}>
            安全警告
          </span>
        </div>
        <ul style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-secondary-gray)', paddingLeft: '16px' }}>
          <li>⚠️ 此为演示项目，请勿输入真实助记词</li>
          <li>⚠️ 永远不要在不受信任的环境输入真实助记词</li>
          <li>⚠️ 任何索要助记词的行为都是诈骗</li>
        </ul>
      </div>

      {/* Mnemonic Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
          输入助记词
        </label>
        <textarea
          placeholder="请输入 12 或 24 个单词的助记词，用空格分隔"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '12px 14px',
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--foreground)',
            outline: 'none',
            resize: 'vertical',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Password Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
          设置加密密码
        </label>
        <input
          type={showMnemonic ? 'text' : 'password'}
          placeholder="至少 8 个字符"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={isImporting || !mnemonic || !password}
        style={{
          width: '100%',
          padding: '14px',
          background:
            isImporting || !mnemonic || !password
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
        {isImporting ? (
          <>
            <span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span>
            正在使用 tcx-wasm 导入钱包...
          </>
        ) : (
          <>
            <Key size={18} />
            导入钱包
          </>
        )}
      </button>

      <div
        style={{
          padding: '12px',
          background: 'var(--surface-blue)',
          borderRadius: 'var(--radius-sm)',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <Shield size={14} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary-gray)', lineHeight: 1.6 }}>
          导入过程使用 tcx-wasm 在本地完成，助记词不会被传输到任何服务器。导入后密钥材料仅存储在浏览器内存中。
        </span>
      </div>
    </div>
  );
}
