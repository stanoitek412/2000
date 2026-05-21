import { Header } from '../components/layout/Header';
import { Cart } from '../components/payment/Cart';

export function CartPage() {
  return (
    <div>
      <Header title="购物车" />
      <Cart />
    </div>
  );
}
