import { Link } from 'react-router-dom';
import ProductCard from '../product-card/product-card.component';

import './category-preview.styles.scss';
import { CategoryItem } from '../../store/categories/categories.types';
import { FC } from 'react';

type CategoryPreviewProps = {
  title: string;
  products: CategoryItem[]
}
const CategoryPreview: FC<CategoryPreviewProps> = ({ title, products }) => (
  <div className='category-preview-container'>
    <h2>
      <Link className='title' to={title}>
        {title.toUpperCase()}
      </Link>
    </h2>
    <div className='preview'>
      {products
        .filter((_, idx: number) => idx < 4)
        .map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
    </div>
  </div>
);

export default CategoryPreview;
