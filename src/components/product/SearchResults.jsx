import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchSearchResults } from '../../redux/products/productsSlice';
import ProductCard from './ProductCard';
import { Container, Row } from 'react-bootstrap';
import noresult from '../../images/no-result.webp'

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
    <Container>
      <Row>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
            <div className="text-center mt-5 w-100">
            <img 
              src={noresult}
              alt="No results"
              className="mb-3"
              style={{ maxWidth: '250px', width: '100%' }}
            />
            <h2>Sorry, no results found!</h2>
            <h6 style={{color:'grey'}}>Please check the spelling or try searching for something else.</h6>
          </div>
        )}
      </Row>
    </Container>
  );
};

export default SearchResults;
