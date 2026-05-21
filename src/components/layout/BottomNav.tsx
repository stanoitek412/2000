import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, Wallet, ShoppingCart } from 'lucide-react';

const tabs = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/explore', icon: Compass, label: '浏览' },
  { path: '/ai', icon: MessageCircle, label: 'AI 助手' },
  { path: '/wallet', icon: Wallet, label: '钱包' },
  { path: '/cart', icon: ShoppingCart, label: '购物车' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--background)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '64px',
        zIndex: 100,
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              padding: '6px 12px',
              color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
              transition: 'color 0.2s',
              fontSize: '10px',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
