import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeCartItem, updateCartItem } from '../../redux/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${item.productId}`);
        setProductDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load product details", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [item.productId]);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = async (e) => {
    let value = e.target.value;
    if (value === '') {
      setQuantity(value);
      return;
    }
    value = Number(value);
    if (value > 8) value = 8;
    if (value < 1) value = 1;

    setQuantity(value);
    try {
      await dispatch(updateCartItem({ id: item.id, quantity: value }));
      toast.success(`You have changed ${productDetails.name} QUANTITY to ${value}`, {
        position: "bottom-center", 
      });
    } catch (error) {
      console.error("Failed to update quantity", error);
      toast.error("Failed to update quantity", {
        position: "bottom-center",
      });
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity < 8 ? quantity + 1 : 8;
    setQuantity(newQuantity);
    dispatch(updateCartItem({ id: item.id, quantity: newQuantity }));
    toast.success(`You have changed ${productDetails.name} QUANTITY to ${newQuantity}`, {
      position: "bottom-center",
    });
  };

  const decrementQuantity = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    dispatch(updateCartItem({ id: item.id, quantity: newQuantity }));
    toast.success(`You have changed ${productDetails.name} QUANTITY to ${newQuantity}`, {
      position: "bottom-center",
    });
  };

  const removeItem = () => {
    dispatch(removeCartItem(item.id));
    toast.success("Item removed from cart", {
      position: "bottom-center",
    });
  };

  const viewProduct = () => {
    navigate(`/products/${item.productId}`);
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  const totalPrice = (productDetails.price * quantity).toFixed(2);

  return (
    <Card className="shadow-sm rounded d-flex flex-row my-3">
      <div>
        <Card.Img variant="top" src={productDetails.imageUrl} style={{ height: '200px', width: '200px' }} />
        <Form.Group className='ms-5 mt-1' controlId="quantity">
          <div className="d-flex align-items-center text-secondary mb-3">
            <div style={{ cursor: 'pointer' }} className='mb-1' onClick={decrementQuantity}>
              <FaMinus />
            </div>
            <Form.Control
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="mx-2"
              style={{ width: '35px', height: '30px' }}
            />
            <div style={{ cursor: 'pointer' }} className="d-flex align-items-center text-secondary" onClick={incrementQuantity}>
              <FaPlus />
            </div>
          </div>
        </Form.Group>
      </div>

      <Card.Body className='d-flex flex-column justify-content-between' style={{ marginLeft: '20px' }}>
        <div>
          <Card.Title>{productDetails.name}</Card.Title>
          <Card.Text>{productDetails.description}</Card.Text>
          <Card.Title style={{ fontWeight: '700' }}>Amount: ₹ {totalPrice}</Card.Title>
        </div>

        <div className='d-flex justify-content-between'>
          <span style={{ fontWeight: '700', cursor: 'pointer' }} onClick={viewProduct}>
            VIEW PRODUCT
          </span>
          <div style={{ fontWeight: '700', cursor: 'pointer' }} onClick={removeItem}>
            REMOVE PRODUCT
          </div>
        </div>
      </Card.Body>
      <ToastContainer />
      
    </Card>
  );
};

export default CartItem;
