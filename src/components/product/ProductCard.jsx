import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Card, Button, Col } from 'react-bootstrap';
import './products.css'; 
import { deleteProduct } from '../../redux/products/productsSlice';


const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent the default action if the click event is triggered from the button
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/products/${product.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct({ id: product.id ,token}));
    }
  };

  return (
    <Col md={4} className="mt-4">
      <Card
        onClick={handleCardClick}
        className="card-hover shadow-sm rounded overflow-hidden"
        style={{ cursor: 'pointer', width: '16rem' }}
      >
        <Card.Img style={{ height: '16.5rem' }} variant="top" src={product.imageUrl} alt={product.name} />
        <Card.Body>
          <Card.Title>
            {product.name.length >20?product.name.slice(0,20):product.name}
          </Card.Title>
          <Card.Text>
            {product.description.length > 30
              ? product.description.slice(0, 24) + ' . . .'
              : product.description}
          </Card.Text>
          
          <h6>₹ {product.price}</h6>

          {/* Stock information with conditional styling */}
          <Card.Text className={product.stock < 11 ? 'text-danger' : ''}>
            {product.stock < 11 ? `Hurry !!! Only ${product.stock} stock${product.stock > 1 ? 's' : ''} left` : `Stocks: ${product.stock}`}
          </Card.Text>

          {userType === 'admin' && (
            <div className="d-flex justify-content-between mt-2">
              <Button
                className='d-flex align-items-center '
                as={Link}
                to={`/product-form/${product.id}`}
                variant="warning"
                onClick={(e) => e.stopPropagation()}
              >
                <FaEdit className='' /> 
              </Button>
              <Button onClick={handleDelete} className="delete-button d-flex align-items-center" variant='danger'><FaTrash/></Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductCard;
