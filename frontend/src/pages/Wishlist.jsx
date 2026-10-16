import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../services/api';
import Navbar from '../components/Navbar';
import WishlistCard from '../components/WishlistCard';

function Wishlist({ isLoggedIn, setIsLoggedIn, wishlistCount, setWishlistCount }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getWishlist();
      setWishlist(res.data.wishlist || []);
      if (setIsLoggedIn) setIsLoggedIn(true);
      if (setWishlistCount) setWishlistCount(res.data.count ?? res.data.wishlist.length);
    } catch (err) {
      if (err.response?.status === 401) {
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate('/login');
      } else {
        setError('Unable to load wishlist.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      setWishlistCount(prev => prev - 1);
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      alert("Unable to remove product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          {!loading && !error && (
            <p className="text-gray-500 mt-2">
              {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg animate-pulse">Loading your wishlist...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-red-100">
            <div className="text-center">
              <p className="text-red-500 text-xl font-medium mb-2">Something went wrong.</p>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={fetchWishlist}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
            <div className="text-center">
              <p className="text-gray-400 text-5xl mb-4">❤️</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Save products you love and find them here later.</p>
              <Link
                to="/products"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <WishlistCard 
                key={product._id} 
                product={product} 
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
