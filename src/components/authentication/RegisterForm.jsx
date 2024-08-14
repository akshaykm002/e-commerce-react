import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Alert, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, setUsername, setEmail, setPassword, setUserType } from '../../redux/auth/authSlice.js';
import registerImg from '../../images/RegisterImg.jpg'

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, email, password, userType, loading, error, success } = useSelector((state) => state.auth);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (username && email && password && userType) {
      dispatch(registerUser({ username, email, password, userType }));
    } else {
      alert('All fields are required');
    }
  };

  useEffect(() => {
    if (success) {
      navigate('/login');
    }
  }, [success, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow-lg p-3" style={{ maxWidth: '900px', width: '100%' }}>
        <Row className="no-gutters">
          <Col md={6} className="d-none d-md-block">
            <img
              src={registerImg}
              alt="Register"
              className="img-fluid rounded"
              style={{ objectFit: 'cover', height: '100%' }}
            />
          </Col>
          <Col md={6} className="p-4">
            <h2 className="text-center mb-4">Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Registration successful! Redirecting...</Alert>}
            <Form onSubmit={handleRegister}>
              <Form.Group controlId="formBasicUsername" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => dispatch(setUsername(e.target.value))}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => dispatch(setPassword(e.target.value))}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formUserType" className="mb-3">
                <Form.Label>User Type</Form.Label>
                <Form.Control
                  as="select"
                  value={userType}
                  onChange={(e) => dispatch(setUserType(e.target.value))}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading} className="w-100">
                Register
              </Button>
              <p className="mt-3 text-center">
                Already have an account? <Link  style={{ color: '#007bff', fontWeight: 'bold',textDecoration:'none' }} to="/login">Login</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default RegisterForm;
