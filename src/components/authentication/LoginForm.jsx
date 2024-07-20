import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { loginUser, setEmail, setPassword } from '../../redux/auth/authSlice.js';
import { unwrapResult } from '@reduxjs/toolkit';


function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      unwrapResult(resultAction);
      navigate('/products'); 
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <>
      <Form className='d-flex justify-content-center mt-5' onSubmit={handleLogin}>
        <Form.Group className="form-control mb-3 w-25" controlId="formBasicEmail">
          <h2 className='text-center mb-4'>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <Alert variant="info">Loading...</Alert>}
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
          <Form.Control
            className='mt-3'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
          <Button className='mt-3' variant="primary" type="submit">
            Submit
          </Button>
          <p className='mt-3'>
            Don't have an account? <Link to='/register'>Register</Link>
          </p>
        </Form.Group>
      </Form>
    </>
  );
}

export default LoginForm;
