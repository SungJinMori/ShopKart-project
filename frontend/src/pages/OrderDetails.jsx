import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../services/api';
import Navbar from '../components/Navbar';

function OrderDetails({ isLoggedIn, setIsLoggedIn, wishlistCount }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const orderPlacedNow = location.state?.orderPlaced;

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getOrderById(id);
      setOrder(res.data.order);
    } catch (err) {
      if (err.response?.status === 401) {
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not own this order.');
      } else if (err.response?.status === 404) {
        setError('Order not found.');
      } else {
        setError('Something went wrong while loading the order.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Bonus Challenge (+10 marks): Admin/Demo order status progression
  const handleStatusProgression = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateOrderStatus(id, newStatus);
      setOrder(res.data.order);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'SHIPPED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />

      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg animate-pulse">Loading order details...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center my-8">
            <p className="text-red-500 text-xl font-bold mb-2">Error Loading Order</p>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/orders"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
            >
              View My Orders
            </Link>
          </div>
        )}

        {/* Order Details */}
        {!loading && !error && order && (
          <div className="space-y-6">
            {/* Success Banner if redirected from checkout */}
            {orderPlacedNow && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm">
                <span className="text-4xl block mb-2">✅</span>
                <h1 className="text-2xl font-bold text-green-900">Order Placed Successfully!</h1>
                <p className="text-green-700 text-sm mt-1">
                  Thank you! Your payment has been verified and your order has been confirmed.
                </p>
              </div>
            )}

            {/* Order Meta Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Order Reference
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                  #{order._id}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-bold">
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Bonus Challenge (+10 Marks): Demo Order Status Progression */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <div>
                <span className="font-semibold text-indigo-900">⭐ Bonus Challenge (Status Progression):</span>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Advance the order through its lifecycle stages for TA Viva demonstration.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusProgression(st)}
                    disabled={isUpdatingStatus || order.status === st}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 ${
                      order.status === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Items Snapshot (2 Cols) */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                  Purchased Items ({order.items.length})
                </h3>

                <div className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=Item';
                          }}
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{item.price.toLocaleString('en-IN')} × {item.quantity} unit{item.quantity > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-base">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-indigo-600 text-2xl font-bold">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Shipping Address & Actions (1 Col) */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 mb-3">
                    Delivery Address
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
                    <p>{order.shippingAddress?.addressLine1}</p>
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-gray-500 pt-2">📞 {order.shippingAddress?.phone}</p>
                  </div>
                </div>

                {/* Navigation CTA Buttons */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
                  <Link
                    to="/orders"
                    className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors"
                  >
                    View My Orders
                  </Link>
                  <Link
                    to="/products"
                    className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;

