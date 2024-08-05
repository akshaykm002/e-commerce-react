import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navbar, Nav, Form, FormControl, Button, Container, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { searchProducts } from '../../redux/products/productsSlice';

const NavbarComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchProducts({ query: searchTerm }));
    navigate(`/search?query=${searchTerm}`);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/products" className="me-5">
          <img
            src="https://w7.pngwing.com/pngs/126/12/png-transparent-serving-cart-typo3-e-commerce-logo-cart-logo-logo-steel-update.png"
            width="30"
            height="30"
            className="d-inline-block align-top" 
            alt="LOGO"
          />
          {' '}E-Shopey
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Form className="d-flex" onSubmit={handleSearch}>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
              <FaShoppingCart size="1.5em" />
              Cart
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
