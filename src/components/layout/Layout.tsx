import { type ReactNode } from 'react';
import { useStore } from '../../store';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { showDemoBanner, setShowDemoBanner } = useStore();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showDemoBanner && (
        <div className="demo-banner">
          ⚠️ 演示项目 — 使用 Mock 数据，非真实交易 | Demo Only — Mock Data
          <button
            className="demo-banner-close"
            onClick={() => setShowDemoBanner(false)}
          >
            ✕
          </button>
        </div>
      )}
      <main style={{ flex: 1, paddingBottom: '72px' }}>
        {children}
      </main>
    </div>
  );
}
