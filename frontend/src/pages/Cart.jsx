import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';

function Cart({ isLoggedIn, setIsLoggedIn, wishlistCount }) {
  const navigate = useNavigate();
  const { cartItems, loading, error, cartCount, subtotal, fetchCart } = useCart();

  useEffect(() => {
    // If user is definitely logged out, redirect to login
    if (isLoggedIn === false) {
      // Let initial verification run, but if logged out navigate to login
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Cart</h1>
          {!loading && !error && cartItems.length > 0 && (
            <p className="text-gray-500 mt-2">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg animate-pulse">Loading your cart...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-red-100 p-8">
            <div className="text-center">
              <p className="text-red-500 text-xl font-medium mb-2">Something went wrong.</p>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={fetchCart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && cartItems.length === 0 && (
          <div className="flex items-center justify-center h-72 bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center max-w-md">
              <p className="text-5xl mb-4">🛒</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
              <Link
                to="/products"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Cart Contents & Order Summary */}
        {!loading && !error && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <CartItem key={item.product?._id || item._id} item={item} />
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 py-4 border-b border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items (Units)</span>
                  <span className="font-semibold text-gray-900">{cartCount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Distinct Products</span>
                  <span className="font-semibold text-gray-900">{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-base font-semibold text-gray-900">Subtotal</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors mt-2 shadow-md hover:shadow-lg cursor-pointer text-base"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors inline-flex items-center gap-1"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

