import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginForm from './components/authentication/LoginForm';
import RegisterForm from './components/authentication/RegisterForm';
import ProductList from './components/product/ProductList';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/products" element={<ProductList />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
