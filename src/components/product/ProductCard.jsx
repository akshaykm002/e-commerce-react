import React from 'react';
import { Card } from 'react-bootstrap';

function ProductCard({ product }) {

    const truncatedDescription = product.description.length > 50
    ? `${product.description.substring(0, 50)}...`
    : product.description;

  return (
    <Card style={{ width: '17rem' }}>
      <Card.Img height={'300rem'} variant="top" src={product.imageUrl} alt={product.name} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{truncatedDescription}</Card.Text>
        <Card.Title>₹ {product.price}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
