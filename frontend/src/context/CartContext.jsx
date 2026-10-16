import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartQuantity as apiUpdateQuantity, removeFromCart as apiRemoveFromCart } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children, isLoggedIn }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch cart from server
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCart();
      setCartItems(res.data.cart || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setCartItems([]);
      } else {
        setError('Unable to load your cart.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart on mount and when login state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart, isLoggedIn]);

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      const res = await apiAddToCart(productId);
      if (res.data.cart) {
        setCartItems(res.data.cart);
      } else {
        await fetchCart();
      }
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to add product to cart';
      throw new Error(msg);
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await apiUpdateQuantity(productId, quantity);
      if (res.data.cart) {
        setCartItems(res.data.cart);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to update quantity';
      throw new Error(msg);
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    try {
      const res = await apiRemoveFromCart(productId);
      if (res.data.cart) {
        setCartItems(res.data.cart);
      } else {
        setCartItems(prev => prev.filter(item => item.product?._id !== productId));
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to remove product';
      throw new Error(msg);
    }
  };

  // Derived calculations (Task 15)
  // Total units across all items (e.g. 2 keyboards + 1 mouse = 3)
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  // Subtotal = Sum of (price * quantity)
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  // Number of distinct items
  const distinctItemCount = cartItems.length;

  // Clear cart locally after verified order creation
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    loading,
    error,
    cartCount,
    subtotal,
    distinctItemCount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

