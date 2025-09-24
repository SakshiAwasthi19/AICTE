import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  GraduationCap, 
  Building2, 
  Target, 
  MapPin, 
  Bell, 
  Award,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    const redirectPath = user.userType === 'student' ? '/student' : '/organization';
    window.location.href = redirectPath;
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PointMate</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your <span className="text-primary-600">AICTE Points</span> with Ease
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect students with organizations to earn the required 100 AICTE points for degree completion. 
            Track progress, discover nearby events, and manage certificates all in one platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-outline text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PointMate?
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive solution for AICTE points management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Target className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Point Tracking</h3>
              <p className="text-gray-600">
                Track your AICTE points progress with real-time updates and visual progress indicators.
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nearby Events</h3>
              <p className="text-gray-600">
                Discover events within 10km of your location with automatic notifications.
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certificate Management</h3>
              <p className="text-gray-600">
                Store and manage all your certificates and achievements in one secure location.
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Bell className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-gray-600">
                Get notified about new events, registration confirmations, and point updates.
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organization Network</h3>
              <p className="text-gray-600">
                Connect with verified organizations and discover quality events.
              </p>
            </div>

            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Events</h3>
              <p className="text-gray-600">
                All events are verified and provide legitimate AICTE points.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Types Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join PointMate Today
            </h2>
            <p className="text-lg text-gray-600">
              Choose your role and start managing AICTE points effectively
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <GraduationCap className="h-12 w-12 text-primary-600" />
                <h3 className="text-2xl font-bold ml-4">For Students</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Track AICTE points progress
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Discover nearby events
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Manage certificates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Get smart notifications
                </li>
              </ul>
              <Link to="/register" className="btn-primary w-full text-center">
                Sign Up as Student
              </Link>
            </div>

            {/* Organization Card */}
            <div className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <Building2 className="h-12 w-12 text-primary-600" />
                <h3 className="text-2xl font-bold ml-4">For Organizations</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Create AICTE point events
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Manage registrations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Track attendance
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  Issue certificates
                </li>
              </ul>
              <Link to="/register" className="btn-primary w-full text-center">
                Sign Up as Organization
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-2xl font-bold">PointMate</span>
            </div>
            <p className="text-gray-400">
              © 2024 PointMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 