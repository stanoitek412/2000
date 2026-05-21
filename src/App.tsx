import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { WalletPage } from './pages/WalletPage';
import { CartPage } from './pages/CartPage';
import { PaymentPage } from './pages/PaymentPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/ai" element={<AIAssistantPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </div>
        <BottomNav />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
