import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { createOrder } from '../../redux/orders/orderSlice';
import { toast } from 'react-toastify';
import { Form, Button, Container, Row, Col, ListGroup, Alert, Card } from 'react-bootstrap';


const API_URL = 'http://localhost:4000/api';

const OrderForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [productDetailsMap, setProductDetailsMap] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method
    const { email } = useSelector((state) => state.auth);


    // Fetch cart items and product details
    useEffect(() => {
        // console.log(email);
        
        const fetchCartItemsAndProducts = async () => {
            try {
                // Fetch cart items
                const cartResponse = await axios.get(`${API_URL}/cart`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const items = cartResponse.data.cartItems;
                setCartItems(items);

                // Fetch product details
                const productDetailsPromises = items.map(item =>
                    axios.get(`${API_URL}/products/${item.productId}`)
                );
                const productsResponses = await Promise.all(productDetailsPromises);
                const productDetailsMap = productsResponses.reduce((acc, response) => {
                    const product = response.data;
                    acc[product.id] = product; 
                    return acc;
                }, {});
                setProductDetailsMap(productDetailsMap);

                // Calculate total price
                const total = items.reduce((total, item) => {
                    const product = productDetailsMap[item.productId] || {};
                    if (product.price) {
                        return total + (item.quantity * product.price);
                    }
                    return total;
                }, 0);
                setTotalPrice(total);
            } catch (error) {
                setError('Failed to load cart items or product details');
                console.error('Error:', error);
            }
        };

        fetchCartItemsAndProducts();
    }, []);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        try {
            let orderData;

            if (paymentMethod === 'card') {
                if (!stripe || !elements) {
                    return;
                }

                const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: elements.getElement(CardElement),
                });

                if (error) {
                    throw new Error(error.message);
                }

                orderData = {
                    paymentMethodId: stripePaymentMethod.id,
                    totalPrice,
                    cartItems,
                };
            } else if (paymentMethod === 'cod') {
                orderData = {
                    paymentMethodId: null,
                    totalPrice,
                    cartItems,
                };
            }

            await dispatch(createOrder(orderData));
            toast.success('Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            toast.error(`Order failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Order Form</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                {/* Payment Method Selection */}
                <Form.Group controlId="payment-method" className="mb-3">
                    <Form.Label>Choose Payment Method</Form.Label>
                    <Form.Control
                        as="select"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                    >
                        <option value="card">Credit/Debit Card</option>
                        <option value="cod">Cash on Delivery</option>
                    </Form.Control>
                </Form.Group>

                {/* Card Payment Details */}
                {paymentMethod === 'card' && (
                    <Form.Group controlId="card-element" className="mb-3">
                        <Form.Label>Enter Card Number</Form.Label>
                        <div className="form-control p-2">
                            <CardElement id="card-element" />
                        </div>
                    </Form.Group>
                )}

                <Form.Group className="mb-3">
                    <h4>Products in Your Order</h4>
                    <ListGroup>
                        {cartItems.map(item => {
                            const product = productDetailsMap[item.productId];
                            return (
                                <ListGroup.Item key={item.productId}>
                                    {product ? (
                                        <Row>
                                            <Col md={2}>
                                                <img height={'110px'} src={product.imageUrl} alt='Product'  />
                                            </Col>
                                            <Col md={8}>
                                            <h6 className=' pt-2'>{product.name}</h6>

                                            <p>{product.description}</p>                                              
                                                
                                            </Col>
                                            <Col>
                                            <h6 className='mb-2'>Quantity :{item.quantity}</h6>
                                            <h6>Price :₹{product.price.toFixed(2)}</h6>
                                            </Col>
                                        </Row>
                                    ) : (
                                        <div>Loading product details...</div>
                                    )}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <h4>Total Price: ₹{totalPrice.toFixed(2)}</h4>
                </Form.Group>

                <Card className="mb-3 w-75">
                    <Card.Body>
                        <div className='d-flex justify-content-between'>
                                <Card.Text>
                                   <div className='mt-3'> An email of your order status will be delivered to <strong>{email}</strong></div>
                                </Card.Text>
                                <Button type="submit" variant="success" disabled={loading}>
                                    {loading ? 'Processing...' : 'Place Order'}
                                </Button>
                           
                        </div>
                    </Card.Body>
                    </Card>
            </Form>
        </Container>
    );
};

export default OrderForm;
