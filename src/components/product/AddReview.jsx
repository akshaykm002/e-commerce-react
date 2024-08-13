import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addReview } from '../../redux/products/productsSlice.js';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

function AddReview() {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addReview({ productId: id, rating, comment }))
      .then(() => {
        navigate(`/products/${id}`);
      })
      .catch((err) => {
        console.error('Failed to add review:', err);
      });
  };

  return (
    <Container style={{ width: '50%' }} className="mt-5">
      <Card>
        <Card.Body>
          <h2>Add Review</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={30}
                    color={star <= rating ? 'gold' : 'lightgray'}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group controlId="comment" className="mt-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Submit Review
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddReview;
