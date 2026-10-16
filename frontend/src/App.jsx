import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getWishlist } from './services/api';
import { CartProvider } from './context/CartContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Check auth and fetch wishlist on initial app mount
  useEffect(() => {
    getWishlist()
      .then(res => {
        setIsLoggedIn(true);
        setWishlistCount(res.data.count || 0);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setWishlistCount(0);
      });
  }, []);

  // Sync wishlist count whenever login state changes
  useEffect(() => {
    if (isLoggedIn) {
      getWishlist()
        .then(res => setWishlistCount(res.data.count || 0))
        .catch(err => console.error("Failed to fetch wishlist count", err));
    } else {
      setWishlistCount(0);
    }
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <CartProvider isLoggedIn={isLoggedIn}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route
            path="/home"
            element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />}
          />
          <Route
            path="/products"
            element={<Products isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} setWishlistCount={setWishlistCount} />}
          />
          <Route
            path="/products/:id"
            element={<ProductDetails isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} setWishlistCount={setWishlistCount} />}
          />
          <Route
            path="/wishlist"
            element={<Wishlist isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} setWishlistCount={setWishlistCount} />}
          />
          <Route
            path="/cart"
            element={<Cart isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />}
          />
          <Route
            path="/checkout"
            element={<Checkout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />}
          />
          <Route
            path="/orders"
            element={<Orders isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />}
          />
          <Route
            path="/orders/:id"
            element={<OrderDetails isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />}
          />
          <Route
            path="/order-success/:id"
            element={<OrderDetails isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />}
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
