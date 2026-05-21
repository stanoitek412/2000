import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '32px',
            textAlign: 'center',
            fontFamily: 'Inter, Noto Sans SC, sans-serif',
          }}
        >
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#111d4a' }}>
            页面加载出错
          </h2>
          <p style={{ fontSize: '14px', color: '#99a1af', marginBottom: '16px', lineHeight: 1.6 }}>
            应用遇到了一个错误，请尝试刷新页面。
            <br />
            如果问题持续，请检查浏览器是否支持 WebAssembly。
          </p>
          <div
            style={{
              padding: '12px',
              background: '#fde8ea',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f3636f',
              fontFamily: 'monospace',
              maxWidth: '100%',
              overflow: 'auto',
              marginBottom: '16px',
              wordBreak: 'break-all',
            }}
          >
            {this.state.error?.message || '未知错误'}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 32px',
              background: '#007fff',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
