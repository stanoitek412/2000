import { AlertTriangle, Info, Shield } from 'lucide-react';

interface RiskBannerProps {
  type: 'warning' | 'danger' | 'info';
  message: string;
  detail?: string;
}

export function RiskBanner({ type, message, detail }: RiskBannerProps) {
  const config = {
    warning: {
      bg: 'var(--warning-surface)',
      color: 'var(--warning)',
      border: 'var(--warning)',
      icon: AlertTriangle,
    },
    danger: {
      bg: 'var(--destructive-surface)',
      color: 'var(--destructive)',
      border: 'var(--destructive)',
      icon: AlertTriangle,
    },
    info: {
      bg: 'var(--surface-blue)',
      color: 'var(--primary)',
      border: 'var(--info-border)',
      icon: Info,
    },
  };

  const c = config[type];
  const Icon = c.icon;

  return (
    <div
      style={{
        padding: '12px 14px',
        background: c.bg,
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${c.border}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
      }}
    >
      <Icon size={16} color={c.color} style={{ marginTop: '1px', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: c.color }}>{message}</div>
        {detail && (
          <div style={{ fontSize: '11px', color: 'var(--text-secondary-gray)', marginTop: '4px', lineHeight: 1.5 }}>
            {detail}
          </div>
        )}
      </div>
    </div>
  );
}
