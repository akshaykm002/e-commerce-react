import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import ProductList from './components/product/ProductList';
import ProductDetail from './components/product/ProductDetail';
import ProductForm from './components/product/ProductForm';
import NavbarComponent from './components/product/NavbarComponent';
import SearchResults from './components/product/SearchResults';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product-form" element={<ProductForm />} />
          <Route path="/product-form/:id" element={<ProductForm />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

const MainLayout = ({ children }) => {
  const location = useLocation();

  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <NavbarComponent />}
      {children}
    </>
  );
};

export default App;
