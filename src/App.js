import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import ProductList from './components/product/ProductList';
import ProductDetail from './components/product/ProductDetail';
import ProductForm from './components/product/ProductForm';
import NavbarComponent from './components/product/NavbarComponent';
import SearchResults from './components/product/SearchResults';
import Cart from './components/cart/Cart';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import OrderForm from './components/order/OrderForm';
import OrderList from './components/order/OrderList';
import AddReview from './components/product/AddReview';
import NoAccess from './components/authentication/NoAccess';
import { Navigate } from 'react-router-dom'; 


const stripePromise = loadStripe('pk_test_51Pc3Kf2LYgbJpp0urbjtRsV0hFC6DmWyX2VJequa8BpDJycvOHcl1Pqc1iYSVcBGB21VM3IJJGIATgMXRUzrEfM800HOqFhkPK');

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/products" />} /> 
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product-form" element={<ProductForm />} />
            <Route path="/product-form/:id" element={<ProductForm />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<OrderForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/add-review/:id" element={<AddReview />} />
            <Route path="/no-access" element={<NoAccess />} />


          </Routes>
          <ToastContainer />
        </MainLayout>
      </Elements>
    </BrowserRouter>
  );
}

const MainLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname  ==='/';

  return (
    <>
      {!hideNavbar && <NavbarComponent />}
      {children}
    </>
  );
};

export default App;
