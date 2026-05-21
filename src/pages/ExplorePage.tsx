import { Header } from '../components/layout/Header';
import { ProductGrid } from '../components/product/ProductGrid';

export function ExplorePage() {
  return (
    <div>
      <Header title="浏览商品" />
      <ProductGrid />
    </div>
  );
}
