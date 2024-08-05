import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../redux/products/productsSlice.js';
import { Container, Card, Spinner, Alert, Col, Row } from 'react-bootstrap';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!product) return <p>No product found</p>;

  return (
    <Container style={{width:'75%'}} className="mt-5">
    <Row>
      <Col md={6}>
        <Card.Img style={{height:'27rem',width:'23rem'}} variant="top" src={product.imageUrl} />
      </Col>
      <Col md={6}>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <br />
          <Card.Text>{product.description}</Card.Text>
          <Card.Title>₹ {product.price}</Card.Title>
          <Card.Text>Stock: {product.stock}</Card.Text>
        </Card.Body>
      </Col>
    </Row>
  </Container>
  );
}

export default ProductDetail;
