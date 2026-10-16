import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

// ---- Customer Auth APIs ----

export const registerCustomer = (data) => {
  return API.post('/customers/register', data);
};

export const loginCustomer = (data) => {
  return API.post('/customers/login', data);
};

export const getProfile = () => {
  return API.get('/customers/me');
};

export const logoutCustomer = () => {
  return API.post('/customers/logout');
};

// ---- Product APIs ----

export const getProducts = (params = {}) => {
  return API.get('/products', { params });
};

export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

// ---- Wishlist APIs ----

export const getWishlist = () => {
  return API.get('/wishlist');
};

export const addToWishlist = (productId) => {
  return API.post(`/wishlist/${productId}`);
};

export const removeFromWishlist = (productId) => {
  return API.delete(`/wishlist/${productId}`);
};

export const toggleWishlist = (productId) => {
  return API.patch(`/wishlist/${productId}/toggle`);
};

// ---- Cart APIs (Lab 05) ----

export const getCart = () => {
  return API.get('/cart');
};

export const addToCart = (productId) => {
  return API.post(`/cart/${productId}`);
};

export const updateCartQuantity = (productId, quantity) => {
  return API.patch(`/cart/${productId}`, { quantity });
};

export const removeFromCart = (productId) => {
  return API.delete(`/cart/${productId}`);
};

// ---- Order APIs (Lab 06) ----

export const createPaymentOrder = (shippingAddress) => {
  return API.post('/orders/create-payment-order', { shippingAddress });
};

export const verifyPayment = (paymentData) => {
  return API.post('/orders/verify-payment', paymentData);
};

export const getMyOrders = () => {
  return API.get('/orders');
};

export const getOrderById = (id) => {
  return API.get(`/orders/${id}`);
};

export const updateOrderStatus = (id, status) => {
  return API.patch(`/orders/${id}/status`, { status });
};

export default API;

