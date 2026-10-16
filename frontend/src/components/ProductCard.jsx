import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product, isWishlisted, onToggleWishlist }) {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const inStock = product.stock > 0;

  const cartItem = cartItems?.find(item => item.product?._id === product._id);
  const inCartQty = cartItem?.quantity || 0;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (isSaving || !onToggleWishlist) return;

    setIsSaving(true);
    await onToggleWishlist();
    setIsSaving(false);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isAddingToCart || !inStock) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product._id);
    } catch (err) {
      if (err.message?.toLowerCase().includes('unauthorized') || err.message?.toLowerCase().includes('login')) {
        navigate('/login');
      } else {
        alert(err.message || 'Could not add to cart');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col relative">
      {/* Wishlist Heart Button (Top-Right) */}
      <button 
        onClick={handleWishlistClick}
        disabled={isSaving}
        className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-sm transition-all duration-200 ease-in-out hover:scale-110 disabled:opacity-75 disabled:scale-100 cursor-pointer"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isSaving ? (
          <span className="text-xs font-semibold px-1">⏳ Saving...</span>
        ) : isWishlisted ? (
          <span className="text-red-500 font-bold text-lg leading-none">♥</span>
        ) : (
          <span className="text-gray-400 hover:text-red-500 font-bold text-lg leading-none">♡</span>
        )}
      </button>

      {/* Product Image */}
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-800 mt-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        <p className={`text-sm mt-1 ${inStock ? 'text-green-600' : 'text-red-500'}`}>
          {inStock ? `${product.stock} units left` : 'Out of stock'}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <Link
              to={`/products/${product._id}`}
              className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
            >
              View Details
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !inStock || inCartQty >= product.stock}
              className={`flex-1 py-2 px-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                !inStock
                  ? 'bg-gray-200 text-gray-500'
                  : inCartQty > 0
                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isAddingToCart ? (
                <span>Adding...</span>
              ) : !inStock ? (
                <span>Out of Stock</span>
              ) : inCartQty >= product.stock ? (
                <span>Max in Cart</span>
              ) : inCartQty > 0 ? (
                <span>Add Another ({inCartQty})</span>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

