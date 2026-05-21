import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { WalletCreate } from '../components/wallet/WalletCreate';
import { WalletImport } from '../components/wallet/WalletImport';
import { SigningDemo } from '../components/wallet/SigningDemo';
import { SecurityChecklist } from '../components/security/SecurityChecklist';
import { useStore } from '../store';

type WalletTab = 'wallet' | 'signing' | 'security';

export function WalletPage() {
  const [activeTab, setActiveTab] = useState<WalletTab>('wallet');
  const { wallet } = useStore();

  const tabs: { id: WalletTab; label: string }[] = [
    { id: 'wallet', label: wallet.isInitialized ? '我的钱包' : '创建/导入' },
    { id: 'signing', label: '签名演示' },
    { id: 'security', label: '安全设计' },
  ];

  return (
    <div>
      <Header title="钱包" />
      
      {/* Tab Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '8px 16px',
          background: 'var(--muted)',
          margin: '0 16px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '16px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--foreground)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'wallet' && <WalletCreate />}
      {activeTab === 'signing' && <SigningDemo />}
      {activeTab === 'security' && <SecurityChecklist />}
    </div>
  );
}
