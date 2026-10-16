import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import Navbar from '../components/Navbar';

function Orders({ isLoggedIn, setIsLoggedIn, wishlistCount }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
      if (setIsLoggedIn) setIsLoggedIn(true);
    } catch (err) {
      if (err.response?.status === 401) {
        if (setIsLoggedIn) setIsLoggedIn(false);
        navigate('/login');
      } else {
        setError('Unable to load your orders.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

      <div className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          {!loading && !error && orders.length > 0 && (
            <p className="text-gray-500 mt-2">
              Viewing {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed with ShopKart
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg animate-pulse">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-red-100 p-8">
            <div className="text-center">
              <p className="text-red-500 text-xl font-bold mb-2">Something went wrong.</p>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={fetchOrders}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex items-center justify-center h-72 bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center max-w-md">
              <p className="text-5xl mb-4">📦</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You have not placed any orders yet.</h2>
              <p className="text-gray-500 mb-6">Explore our catalog and find products you love!</p>
              <Link
                to="/products"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Orders Listing */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order #{order._id}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="py-4 space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.name} <span className="text-gray-400 font-medium">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer: Total & CTA */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</span>
                    <p className="text-xl font-bold text-indigo-600">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

