import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchSearchResults } from '../../redux/products/productsSlice';
import ProductCard from './ProductCard';

const SearchResults = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults(query));
    }
  }, [dispatch, query]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
