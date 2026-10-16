import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/api';
import Navbar from '../components/Navbar';

function Home({ isLoggedIn, setIsLoggedIn, wishlistCount }) {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setCustomer(res.data);
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setIsLoggedIn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wishlistCount={wishlistCount} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {customer?.fullName}! 👋
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Here&apos;s your ShopKart profile information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-6">
            <span className="text-3xl font-bold text-indigo-600">
              {customer?.fullName?.charAt(0)?.toUpperCase()}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Full Name</span>
              <span className="text-gray-900 font-semibold">{customer?.fullName}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-gray-900 font-semibold">{customer?.email}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-500 font-medium">Phone</span>
              <span className="text-gray-900 font-semibold">{customer?.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

