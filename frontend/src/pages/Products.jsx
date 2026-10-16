import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getWishlist, toggleWishlist } from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

function Products({ isLoggedIn, setIsLoggedIn, wishlistCount, setWishlistCount }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Fetch Wishlist IDs on mount
  useEffect(() => {
    getWishlist()
      .then(res => {
        setWishlistIds((res.data.wishlist || []).map(p => p._id));
        if (setIsLoggedIn) setIsLoggedIn(true);
        if (setWishlistCount) setWishlistCount(res.data.count ?? res.data.wishlist.length);
      })
      .catch(() => {
        // Not logged in or guest browsing, wishlist remains empty
      });
  }, [setIsLoggedIn, setWishlistCount]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category) params.category = category;

        const res = await getProducts(params);
        setProducts(res.data.products);
      } catch (err) {
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  const handleToggleWishlist = async (productId) => {
    try {
      const res = await toggleWishlist(productId);
      if (res.data.saved) {
        setWishlistIds(prev => [...prev, productId]);
        if (setWishlistCount) setWishlistCount(prev => prev + 1);
      } else {
        setWishlistIds(prev => prev.filter(id => id !== productId));
        if (setWishlistCount) setWishlistCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate('/login');
        return;
      }
      console.error("Failed to toggle wishlist", error);
      alert("Unable to save product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="text-gray-500 mt-2">Discover amazing deals on ShopKart</p>
        </div>

        {/* Search & Filter */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 text-lg font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-400 text-5xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg font-medium">No products found.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter.</p>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                isWishlisted={wishlistIds.includes(product._id)}
                onToggleWishlist={() => handleToggleWishlist(product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;

