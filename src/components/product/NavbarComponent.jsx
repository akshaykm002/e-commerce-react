import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Form, FormControl, Button, Container, InputGroup, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { searchProducts } from '../../redux/products/productsSlice';
import { logout } from '../../redux/auth/authSlice'; 
import logo from '../../images/38248895-removebg-preview.png'
const NavbarComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { username } = useSelector((state) => state.auth);

  // console.log('Username from Redux state:', username); 


  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchProducts({ query: searchTerm }));
    navigate(`/search?query=${searchTerm}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="warning" expand="lg" sticky='top'>
      <Container>
        <Navbar.Brand as={Link} to="/products" className="me-5 d-flex align-items-center bg-dark rounded px-2">
          <img
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top" 
            alt="LOGO"
          />
          {' '}<b className='text-warning'>CarTify</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Form className="d-flex" onSubmit={handleSearch}>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Search for Products . . ."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="secondary" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
              <FaShoppingCart size="1.5em" className='mb-2' />
              <h5>Cart</h5>
            </Nav.Link>
            {username ? (
              <NavDropdown title={username} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/orders">Orders</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link className='ms-5' as={Link} to="/login"><h5>Login</h5></Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
