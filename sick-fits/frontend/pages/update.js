import { any } from 'prop-types';
import UpdateProduct from '../components/UpdateProduct.js';
import ProductsPage from './products/index.js';

export default function UpdatePage({ query }) {
  //   console.log(query);
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}
