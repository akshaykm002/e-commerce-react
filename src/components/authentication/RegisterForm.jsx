import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { registerUser, setUsername, setEmail, setPassword, setUserType } from '../../redux/auth/authSlice.js';

function RegisterForm() {
  const dispatch = useDispatch();
  const { username, email, password, userType, loading, error, success } = useSelector((state) => state.auth);

  const handleRegister = async (event) => {
    event.preventDefault();
    dispatch(registerUser({ username, email, password, userType }));
  };

  return (
    <>
      <Form className="d-flex justify-content-center mt-5" onSubmit={handleRegister}>
        <Form.Group className="form-control mb-3 w-25" controlId="formBasicEmail">
        <h2 className="text-center mb-4">Register</h2>
        {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
          />
          <Form.Control
            className="mt-3"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
          <Form.Control
            className="mt-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
          />
          <Form.Group className="mt-3">
            <Form.Label>User Type</Form.Label>
            <Form.Control
              as="select"
              value={userType}
              onChange={(e) => dispatch(setUserType(e.target.value))}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>
          <Button className="mt-3" variant="primary" type="submit" disabled={loading}>
            Submit
          </Button>
          <p className="mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Form.Group>
      </Form>
    </>
  );
}

export default RegisterForm;
