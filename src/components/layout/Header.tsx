import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({ title, showBack, rightElement }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--foreground)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--foreground)',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
}
