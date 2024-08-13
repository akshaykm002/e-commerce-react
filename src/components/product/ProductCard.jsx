import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaCartPlus, FaEdit, FaStar, FaTrash } from 'react-icons/fa';
import { Card, Button, Col } from 'react-bootstrap';
import './products.css'; 
import { deleteProduct } from '../../redux/products/productsSlice';
import { addToCart, updateCartItem } from '../../redux/cart/cartSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth.userType);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/products/${product.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const token = localStorage.getItem('token'); // Or wherever you store the token
  
      if (!token) {
        toast.error('Authentication token is missing. Please login again.', {
          position: 'top-right',
        });
        return;
      }
  
      dispatch(deleteProduct({ id: product.id, token }))
        .then(() => {
          toast.success('Product deleted successfully!', {
            position: 'top-right',
          });
        })
        .catch((error) => {
          toast.error(`Failed to delete product: ${error.message}`, {
            position: 'top-right',
          });
        });
    }
  };
  

  const handleAddToCart = () => {
    const existingCartItem = cartItems.find(cartItem => cartItem.productId === product.id);

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + 1;

      if (newQuantity > 8) {
        toast.error('Cannot add more than 8 quantity of a single product.', {
          position: 'top-right',
        });
        return;
      }

      // Update the quantity if it does not exceed stock
      dispatch(updateCartItem({ id: existingCartItem.id, quantity: newQuantity }))
        .then(() => {
          toast.success('Quantity updated in cart!', {
            position: 'top-right',
          });
        })
        .catch((error) => {
          toast.error('Failed to update quantity.', {
            position: 'top-right',
          });
        });

    } else {
      // If the item does not exist, check if the initial quantity exceeds stock
      if (product.stock < 1) {
        toast.error('Cannot add item to cart. Out of stock.', {
          position: 'top-right'
        });
        return;
      }

      // Add the new item to the cart with quantity 1
      dispatch(addToCart({ productId: product.id, quantity: 1 }))
        .then(() => {
          toast.success('Item added to cart!', {
            position: 'top-right'
          });
          setTimeout(() => {
            navigate('/cart');
          }, 1000); 
        })
        .catch((error) => {
          toast.error('Failed to add item to cart.', {
            position: 'top-right',
          });
        });
    }
  };

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = product.reviews ? calculateAverageRating(product.reviews) : 0;
  const totalReviews = product.reviews ? product.reviews.length : 0;

  return (
    <Col md={4} className="mt-4">
      <Card
        onClick={handleCardClick}
        className="card-hover shadow-sm rounded overflow-hidden"
        style={{ cursor: 'pointer', width: '16rem', position: 'relative' }}
      >
        <div style={{ position: 'relative' }}>
          <Card.Img style={{ height: '16.5rem' }} variant="top" src={product.imageUrl} alt={product.name} />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              margin:'2px',
              backgroundColor: averageRating >= 3 ? 'green' : averageRating >= 2 ? 'darkorange' : averageRating === 0 ? 'lightgrey' : 'red',              
              borderRadius: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: 'grey',
            }}
          >
            <div
              style={{
                color: 'white',
                borderRadius: '20px',
                padding: '5px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {averageRating} <FaStar />  <span className='mb-1 mx-1'>|</span> {totalReviews} 
            </div>
          </div>
        </div>
        <Card.Body>
          <Card.Title>
            {product.name.length > 10 ? product.name.slice(0, 20) + '...' : product.name}
          </Card.Title>
          <Card.Text>
            {product.description.length > 30 ? product.description.slice(0, 24) + ' ...' : product.description}
          </Card.Text >
          <Card.Text className={product.stock < 11 ? 'text-danger' : ''}>
            {product.stock < 11
              ? `Hurry !!! Only ${product.stock} stock${product.stock > 1 ? 's' : ''} left`
              : `Stocks: ${product.stock}`}
          </Card.Text>

          <div className='d-flex flex-row justify-content-between'>
          <h5 className='mt-2'>₹ {product.price}</h5>

          <button
  
  style={{
    color: 'white',
    backgroundColor: 'darkorange',
    border: 'none',              
    borderRadius: '5px',  
    padding: '8px 14px',     
    cursor: 'pointer'           
  }}
  onClick={handleAddToCart}
>
  <FaCartPlus fontSize={20} />
</button>


          </div>
      
          {userType === 'admin' && (
            <div className="d-flex justify-content-between mt-2">
              <Button
                className='d-flex align-items-center'
                as={Link}
                to={`/product-form/${product.id}`}
                variant="warning"
                onClick={(e) => e.stopPropagation()}
              >
                <FaEdit />
              </Button>
              <Button onClick={handleDelete} className="delete-button d-flex align-items-center" variant='danger'>
                <FaTrash />
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      <ToastContainer />
    </Col>
  );
};

export default ProductCard;
