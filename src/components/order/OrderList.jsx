import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Container, ListGroup, Alert } from 'react-bootstrap';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.orders);
      } catch (err) {
        setError('Failed to fetch orders. Please try again.');
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <Container>
      <h3 className="my-4">Your Orders</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {orders.length > 0 ? (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item key={order.id} className='text-secondary'>
              Order ID: {order.id} <br /> Total Price: ₹{order.totalPrice.toFixed(2)} <br />Payment Id:{order.paymentIntentId}<br/> Status: {order.status}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No orders found.</p>
      )}
    </Container>
  );
};

export default OrderList;
