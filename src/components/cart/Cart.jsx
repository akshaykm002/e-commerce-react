import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Col, Alert, Row } from 'react-bootstrap';
import CartItem from './CartItem';
import { fetchCart } from '../../redux/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import emptyCart from '../../images/EmptyCart.webp';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, loading, error } = useSelector((state) => state.cart);
    const [productDetailsMap, setProductDetailsMap] = useState({});

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productDetailsPromises = cartItems.map(item =>
                    axios.get(`http://localhost:4000/api/products/${item.productId}`)
                );
                const productsResponses = await Promise.all(productDetailsPromises);
                const productDetailsMap = productsResponses.reduce((acc, response) => {
                    const product = response.data;
                    acc[product.id] = product;
                    return acc;
                }, {});
                setProductDetailsMap(productDetailsMap);
            } catch (error) {
                console.error("Failed to load product details", error);
            }
        };

        if (cartItems.length > 0) {
            fetchProductDetails();
        }
    }, [cartItems]);

    if (loading) {
        return <p>Loading cart...</p>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    const redirectProducts = () => {
        navigate('/products');
    };

    // Calculate total amount to be paid
    const totalAmount = cartItems.reduce((total, item) => {
        const product = productDetailsMap[item.productId] || {};
        if (product.price) {
            return total + (item.quantity * product.price);
        }
        return total;
    }, 0);

    console.log("Cart Items:", cartItems);
    console.log("Product Details Map:", productDetailsMap);
    console.log("Total Amount Calculated:", totalAmount);

    return (
        <Container>
            {cartItems.length === 0 ? (
                <div className="text-center mt-5 w-100">
                    <img
                        src={emptyCart}
                        alt="Empty Cart"
                        className="mt-5 mb-3"
                        style={{ maxWidth: '300px', width: '100%' }}
                    />
                    <h4 className='text-dark'>Your Cart is empty</h4>
                    <div
                        style={{ cursor: 'pointer', fontWeight: '600', color: 'grey' }}
                        onClick={redirectProducts}
                    >
                        Click here to redirect to products page for adding new items
                    </div>
                </div>
            ) : (
                <>
                    <Row>
                        {cartItems.map((item) => (
                            <Col key={item.id} md={12}>
                                <CartItem item={item} product={productDetailsMap[item.productId]} />
                            </Col>
                        ))}
                    </Row>
                    
                    <Row className="text-end mt-4">
    <Col md={4}><h3>Total Amount: ₹ {totalAmount}</h3></Col>
    <Col md={8}>
    <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
        Proceed to Checkout
    </button>
    </Col>
    
</Row>

                </>
            )}
        </Container>
    );
};

export default Cart;
