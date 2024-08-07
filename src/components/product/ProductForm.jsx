import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { fetchProductById, createProduct, updateProduct } from '../../redux/products/productsSlice';
import { Form, Button, Container } from 'react-bootstrap';
import { FaPencilAlt } from 'react-icons/fa';

const ProductForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    imageFile: null, // Add imageFile to the state
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userType, token } = useSelector((state) => state.auth);
  const { product } = useSelector((state) => state.products);

  useEffect(() => {
    if (userType !== 'admin') {
      navigate('/no-access');
      return;
    }
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, userType, navigate]);

  useEffect(() => {
    if (product && id) {
      setProductData({ ...product, imageFile: null }); // Ensure imageFile is reset when product is loaded
    }
  }, [product, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    if (productData.imageFile) {
      formData.append('image', productData.imageFile);
    }

    if (id) {
      dispatch(updateProduct({ id, token, formData })).then(() => {
        navigate('/products');
      });
    } else {
      dispatch(createProduct({ token, formData })).then(() => {
        navigate('/products');
      });
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setProductData({ ...productData, imageUrl: URL.createObjectURL(file), imageFile: file });
    }
  }, [productData]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  if (userType !== 'admin') return null;

  return (
    <Container className='w-50'>
      <h2>{id ? 'Edit Product' : 'Add a New Product'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="stock">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="image" className="mt-3">
          <Form.Label>Product Image</Form.Label>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {productData.imageUrl ? (
              <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <img
                  src={productData.imageUrl}
                  alt="Product"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    
                  }}
                  className="overlay"
                >
                  <FaPencilAlt color="white" size="2em" />
                </div>
              </div>
            ) : (
              <p>Drag 'n' drop an image here, or click to select one</p>
            )}
          </div>
        </Form.Group>
        <Button type="submit" className="mt-3">
          {id ? 'Update Product' : 'Add Product'}
        </Button>
      </Form>
    </Container>
  );
};

export default ProductForm;
