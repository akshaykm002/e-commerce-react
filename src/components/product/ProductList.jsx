import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/products/productsSlice';
import ProductCard from './ProductCard';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { userType } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="bg-light">
    <Container className="products-container">
      
      {userType === 'admin' && (
        <Link to="/product-form">
          <Button variant="success" className="mb-3 mt-4">
             Create New Product <FaPlus className='mb-1 ms-2'/>
          </Button>
        </Link>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <Row>
        {products.map((product) => (
          <Col key={product.id} className="col-md-3 mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
    </div>

  );
};

export default ProductList;
