import { Header } from '../components/layout/Header';
import { ProductDetail } from '../components/product/ProductDetail';
import { useParams } from 'react-router-dom';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Header title="商品详情" showBack />
      {id && <ProductDetail productId={id} />}
    </div>
  );
}
