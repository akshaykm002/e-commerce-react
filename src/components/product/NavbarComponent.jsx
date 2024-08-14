import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Form, FormControl, Button, Container, InputGroup, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaPowerOff, FaBox } from 'react-icons/fa';
import { searchProducts } from '../../redux/products/productsSlice';
import { logout } from '../../redux/auth/authSlice'; 
import logo from '../../images/cartify.png'
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
    <Navbar style={{backgroundColor:'rgba(0, 137, 145)'}} expand="lg" sticky='top'>
      <Container>
        <Navbar.Brand as={Link} to="/products" className="me-5 d-flex align-items-center  rounded px-2 mt-1">
          <img
            src={logo}
            
            className="d-inline-block align-top " 
            alt="LOGO"
            style={{width:'160px',height:'50px'}}
          />
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
          <Nav className="ms-auto mt-1 ">
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center text-light">
              <FaShoppingCart size="1.5em" className='mb-2 ' />
              <h5 className='me-5' >Cart</h5>
            </Nav.Link>
            {username ? (
              <NavDropdown style={{fontWeight:'bold'}} title={username} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/orders"><FaBox className='me-2 '/>
                <span style={{fontWeight:'600'}}>Orders</span>
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}><FaPowerOff className='me-2 '/><span style={{fontWeight:'600'}}>Logout</span> </NavDropdown.Item>
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
