import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Alert, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUser,
  setEmail,
  setPassword,
} from "../../redux/auth/authSlice.js";
import { unwrapResult } from "@reduxjs/toolkit";
import loginImg from "../../images/LoginImg.jpg";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, loading, error } = useSelector(
    (state) => state.auth
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      unwrapResult(resultAction);
      navigate("/products");
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="shadow-lg p-3"
        style={{ maxWidth: "900px", width: "100%", backgroundColor: "" }}
      >
        <Row className="no-gutters">
          <Col md={6} className="d-none d-md-block">
            <img
              src={loginImg}
              alt="Login"
              className="img-fluid rounded"
              style={{ objectFit: "cover", height: "100%" }}
            />
          </Col>
          <Col md={6} className="p-4">
            <h2 className="text-center mb-4">Welcome Back !</h2>
            <h6 className="text-center mb-4 text-secondary">
              Enter credentials to LOGIN
            </h6>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <Alert variant="info">Loading...</Alert>}
            <Form onSubmit={handleLogin}>
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
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100"
              >
                Login
              </Button>
              <p className="mt-5 text-center">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#007bff",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Register
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default LoginForm;
