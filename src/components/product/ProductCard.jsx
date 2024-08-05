import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
      navigate(`/product/${product.id}`);
    };

    const truncatedDescription = product.description.length > 50
    ? `${product.description.substring(0, 50)}...`
    : product.description;

  return (
    <Card onClick={handleCardClick} style={{ cursor: 'pointer',width:'17rem' }} className="h-100">
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
