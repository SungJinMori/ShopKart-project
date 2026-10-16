import { Link, useNavigate } from 'react-router-dom';
import { logoutCustomer } from '../services/api';
import { useCart } from '../context/CartContext';

function Navbar({ isLoggedIn, setIsLoggedIn, wishlistCount }) {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      if (setIsLoggedIn) setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-bold text-indigo-600">
            🛒 ShopKart
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link
                  to="/home"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Products
                </Link>
                <Link
                  to="/wishlist"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1"
                >
                  Wishlist {wishlistCount !== undefined && <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-semibold">({wishlistCount})</span>}
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1"
                >
                  Cart <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-semibold">({cartCount || 0})</span>
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

