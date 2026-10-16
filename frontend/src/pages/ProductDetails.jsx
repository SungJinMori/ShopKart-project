import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getWishlist, toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

function ProductDetails({ isLoggedIn, setIsLoggedIn, wishlistCount, setWishlistCount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const cartItem = cartItems?.find(item => item.product?._id === id);
  const inCartQty = cartItem?.quantity || 0;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getProductById(id);
        setProduct(res.data.product);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Product not found.');
        } else if (err.response?.status === 400) {
          setError('Invalid product ID.');
        } else {
          setError('Something went wrong while loading the product.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Check if current product is in user's wishlist
    getWishlist()
      .then(res => {
        const ids = (res.data.wishlist || []).map(p => p._id);
        setIsWishlisted(ids.includes(id));
        if (setIsLoggedIn) setIsLoggedIn(true);
        if (setWishlistCount) setWishlistCount(res.data.count ?? res.data.wishlist.length);
      })
      .catch(() => {
        setIsWishlisted(false);
      });
  }, [id, setIsLoggedIn, setWishlistCount]);

  const handleToggleWishlist = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await toggleWishlist(id);
      setIsWishlisted(res.data.saved);
      if (setWishlistCount) {
        setWishlistCount(prev => res.data.saved ? prev + 1 : Math.max(0, prev - 1));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate('/login');
        return;
      }
      alert('Unable to update wishlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (isAddingToCart || !inStock) return;
    setIsAddingToCart(true);
    try {
      await addToCart(id);
    } catch (err) {
      if (err.message?.toLowerCase().includes('unauthorized') || err.message?.toLowerCase().includes('login')) {
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate('/login');
        return;
      }
      alert(err.message || 'Unable to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="text-indigo-600 hover:text-indigo-700 font-medium mb-6 inline-flex items-center gap-1 cursor-pointer"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="h-80 md:h-full bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col">
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
              <p className="text-gray-600 mt-4 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                <p className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {inStock ? `✅ In Stock — ${product.stock} units available` : '❌ Out of Stock'}
                </p>
              </div>

              <div className="mt-auto pt-8 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || isAddingToCart || inCartQty >= product.stock}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-lg flex items-center justify-center gap-2"
                >
                  {isAddingToCart
                    ? '⏳ Adding...'
                    : !inStock
                    ? 'Out of Stock'
                    : inCartQty >= product.stock
                    ? 'Max Units in Cart'
                    : inCartQty > 0
                    ? `🛒 Add Another (${inCartQty} in cart)`
                    : '🛒 Add to Cart'}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  disabled={isSaving}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors cursor-pointer text-lg flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSaving ? '⏳ Saving...' : isWishlisted ? '♥ Saved to Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;

