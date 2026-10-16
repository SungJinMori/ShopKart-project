import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product = item.product;
  if (!product) return null;

  const itemTotal = (product.price || 0) * item.quantity;
  const isMinQuantity = item.quantity <= 1;
  const isMaxQuantity = item.quantity >= product.stock;

  const handleIncrease = async () => {
    if (isUpdating || isMaxQuantity) return;
    setIsUpdating(true);
    try {
      await updateQuantity(product._id, item.quantity + 1);
    } catch (err) {
      alert(err.message || 'Failed to increase quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (isUpdating || isMinQuantity) return;
    setIsUpdating(true);
    try {
      await updateQuantity(product._id, item.quantity - 1);
    } catch (err) {
      alert(err.message || 'Failed to decrease quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await removeFromCart(product._id);
    } catch (err) {
      alert(err.message || 'Failed to remove product from cart');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Product Image & Info */}
      <div className="flex gap-4 items-center flex-1">
        <Link to={`/products/${product._id}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </Link>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            {product.category}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="text-base sm:text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-gray-500 text-sm mt-1">
            Unit Price: <span className="font-medium text-gray-700">₹{product.price.toLocaleString('en-IN')}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {product.stock} units available in stock
          </p>
        </div>
      </div>

      {/* Quantity Controls & Line Subtotal */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {/* Quantity Controls: [-] Qty [+] */}
        <div className="flex flex-col items-center">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <button
              onClick={handleDecrease}
              disabled={isUpdating || isRemoving || isMinQuantity}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-base cursor-pointer"
              title={isMinQuantity ? 'Minimum quantity is 1' : 'Decrease quantity'}
            >
              -
            </button>
            <span className="w-10 text-center font-semibold text-gray-800 text-sm">
              {isUpdating ? '...' : item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isUpdating || isRemoving || isMaxQuantity}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-base cursor-pointer"
              title={isMaxQuantity ? 'Cannot exceed stock limit' : 'Increase quantity'}
            >
              +
            </button>
          </div>
          <button
            onClick={handleRemove}
            disabled={isRemoving || isUpdating}
            className="text-xs text-red-500 hover:text-red-700 mt-2 font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
        </div>

        {/* Row Subtotal */}
        <div className="text-right min-w-[90px]">
          <span className="text-xs text-gray-400 block sm:hidden">Total</span>
          <p className="text-lg font-bold text-gray-900">
            ₹{itemTotal.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartItem;

