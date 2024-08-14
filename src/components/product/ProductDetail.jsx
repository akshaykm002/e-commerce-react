import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../../redux/products/productsSlice.js';
import { addToCart, fetchCart, updateCartItem } from '../../redux/cart/cartSlice.js';
import { Container, Card, Spinner, Alert, Col, Row, ListGroup, Button } from 'react-bootstrap';
import { FaArrowAltCircleDown, FaCartPlus, FaStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, error } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.cartItems); 
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    // dispatch(fetchCart());
  }, [dispatch, id]);

  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };

  const handleAddToCart = () => {
    const existingCartItem = cartItems.find(cartItem => cartItem.productId === product.id);
  
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + 1;
  
      if (newQuantity > 8) {
        toast.error('Cannot add more than 8 unit(s) this product.', {
          position: "bottom-center"
        });
        return;
      }
  
      // Update the quantity if it does not exceed stock
      dispatch(updateCartItem({ id: existingCartItem.id, quantity: newQuantity }))
        .then(() => {
          dispatch(fetchCart()); // Refresh cart after update
          toast.success(`${product.name} quantity updated to ${newQuantity}`, {
            position: "bottom-center"
          });
        });
  
    } else {
      // If the item does not exist, check if the initial quantity exceeds stock
      if (product.stock < 1) {
        toast.error('Cannot add item to cart. Out of stock.', {
          position: "bottom-center"
        });
        return;
      }
  
      // Add the new item to the cart with quantity 1
      dispatch(addToCart({ productId: product.id, quantity: 1 }))
        .then(() => {
          dispatch(fetchCart()); // Refresh cart after addition
          toast.success(`${product.name} added to cart`, {
            position: "bottom-center"
          });
        });
    }
  
    // Redirect to the cart page after adding the item
    navigate('/cart');
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRatingColor = (rating) => {
    if (rating > 3) return 'green';
    if (rating >= 2) return 'darkorange';
    if (rating === 0) return 'lightgrey';
    return 'red';
  };

  const timeAgo = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const differenceInSeconds = Math.floor((now - reviewDate) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute * 60;
    const secondsInDay = secondsInHour * 24;
    const secondsInMonth = secondsInDay * 30;
    const secondsInYear = secondsInDay * 365;

    if (differenceInSeconds < secondsInMinute) {
      return `${Math.floor(differenceInSeconds)} seconds ago`;
    } else if (differenceInSeconds < secondsInHour) {
      return `${Math.floor(differenceInSeconds / secondsInMinute)} minutes ago`;
    } else if (differenceInSeconds < secondsInDay) {
      return `${Math.floor(differenceInSeconds / secondsInHour)} hours ago`;
    } else if (differenceInSeconds < secondsInMonth) {
      return `${Math.floor(differenceInSeconds / secondsInDay)} days ago`;
    } else if (differenceInSeconds < secondsInYear) {
      return `${Math.floor(differenceInSeconds / secondsInMonth)} months ago`;
    } else {
      return `${Math.floor(differenceInSeconds / secondsInYear)} years ago`;
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!product) return <p>No product found</p>;

  const averageRating = product.reviews ? calculateAverageRating(product.reviews) : 0;
  const totalReviews = product.reviews ? product.reviews.length : 0;

  const handleAddReview = () => {
    navigate(`/add-review/${product.id}`);
  };

  return (
    <Container style={{ width: '75%' }} className="mt-5">
      <Row>
        <Col md={6}>
          <Card.Img style={{ height: '27rem', width: '23rem' }} variant="top" src={product.imageUrl} />
          <Button variant="warning" onClick={handleAddToCart} className='w-75 ms-3 mt-2 text-light'>
            <span className='me-2 fs-5' style={{fontWeight:'650'}}>ADD TO CART</span> <FaCartPlus fontSize={22} className='mb-1' />
          </Button>
        </Col>
        <Col md={6}>
          <Card.Body>
            <h2>{product.name}</h2>
            <br />
            <Card.Text>{product.description}</Card.Text>
            <h3 className='mb-3'>₹ {product.price}</h3>
            <Card.Text style={{ fontWeight: '600' }} className={product.stock < 11 ? 'text-danger' : ''}>
              {product.stock < 11
                ? `Hurry !!! Only ${product.stock} stock${product.stock > 1 ? 's' : ''} left`
                : `Stocks: ${product.stock}`}
            </Card.Text>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: getRatingColor(averageRating),
                  color: 'white',
                  borderRadius: '20px',
                  padding: '5px 10px',
                  marginRight: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {averageRating}<FaStar />
              </div>
              <span style={{ color: 'grey', fontWeight: 'bolder' }}> {totalReviews} reviews</span>
            </div>
            <div style={{cursor:'pointer'}}  variant="primary" onClick={handleAddReview} className='d-flex align-items-center text-primary mt-3'>
             <FaStar /> <span style={{fontWeight:'600'}} className='ms-2'>Rate & Review Product</span>
            </div>
            <h5 className='text-success' onClick={toggleReviews} style={{ cursor: 'pointer', marginTop: '20px' }}>
              <span className='me-2'>Click to view reviews</span><FaArrowAltCircleDown/>
            </h5>
            {showReviews && (
              product.reviews && product.reviews.length > 0 ? (
                <ListGroup>
                  {product.reviews.map((review, index) => (
                    <ListGroup.Item key={index}>
                      <h6 style={{ color: 'grey' }}>CarTify customer</h6>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            backgroundColor: getRatingColor(review.rating),
                            color: 'white',
                            borderRadius: '20px',
                            padding: '5px 10px',
                            marginRight: '10px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {review.rating}<FaStar />
                        </div>
                        <span style={{ color: 'grey', fontWeight: 'bolder' }}> {review.comment} </span>
                      </div>
                      <p>{timeAgo(review.createdAt)}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Alert variant="info">No reviews available.</Alert>
              )
            )}
              
          </Card.Body>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default ProductDetail;
