import { useState } from 'react';
import { Link } from 'react-router-dom';

function WishlistCard({ product, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const inStock = product.stock > 0;

  const handleRemoveClick = async (e) => {
    e.preventDefault();
    if (isRemoving || !onRemove) return;

    setIsRemoving(true);
    await onRemove(product._id);
    setIsRemoving(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
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

        <div className="mt-auto pt-4 flex flex-col gap-2">
          <Link
            to={`/products/${product._id}`}
            className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={handleRemoveClick}
            disabled={isRemoving}
            className="w-full text-center bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRemoving ? 'Removing...' : 'Remove ♥'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
