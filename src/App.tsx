import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { WalletPage } from './pages/WalletPage';
import { CartPage } from './pages/CartPage';
import { PaymentPage } from './pages/PaymentPage';

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
        fontFamily: 'Inter, Noto Sans SC, sans-serif',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e7f1fc',
          borderTopColor: '#007fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <div style={{ fontSize: '14px', color: '#99a1af' }}>加载中...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh' }}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/ai" element={<AIAssistantPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/payment" element={<PaymentPage />} />
              </Routes>
            </Suspense>
          </div>
          <BottomNav />
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
