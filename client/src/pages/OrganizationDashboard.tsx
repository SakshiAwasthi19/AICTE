import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Target, 
  LogOut, 
  User, 
  Calendar, 
  Award, 
  Building2, 
  Bell,
  Home,
  Plus,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Components
import OrganizationProfile from '../components/organization/OrganizationProfile';
import OrganizationEvents from '../components/organization/OrganizationEvents';
import OrganizationRegistrations from '../components/organization/OrganizationRegistrations';
import OrganizationAnalytics from '../components/organization/OrganizationAnalytics';

interface OrganizationData {
  _id: string;
  name: string;
  description: string;
  category: string;
  phone: string;
  logo?: string;
  isVerified: boolean;
}

const OrganizationDashboard: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const response = await axios.get('/api/organizations/profile');
      setOrganizationData(response.data);
    } catch (error) {
      console.error('Error fetching organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">PointMate</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Notifications</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Organization Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  {organizationData?.logo ? (
                    <img 
                      src={organizationData.logo} 
                      alt="Logo" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-primary-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {organizationData?.name || 'Organization'}
                </h3>
                <p className="text-sm text-gray-600">
                  {organizationData?.category || 'Category'}
                </p>
                {organizationData?.isVerified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    Verified
                  </span>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Link
                  to="/organization"
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  to="/organization/events"
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'events'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </Link>
                
                <Link
                  to="/organization/registrations"
                  onClick={() => setActiveTab('registrations')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'registrations'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Registrations</span>
                </Link>
                
                <Link
                  to="/organization/analytics"
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics</span>
                </Link>
                
                <Link
                  to="/organization/profile"
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Routes>
              <Route path="/" element={<OrganizationDashboardHome organizationData={organizationData} />} />
              <Route path="/events" element={<OrganizationEvents />} />
              <Route path="/registrations" element={<OrganizationRegistrations />} />
              <Route path="/analytics" element={<OrganizationAnalytics />} />
              <Route path="/profile" element={<OrganizationProfile />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Component
const OrganizationDashboardHome: React.FC<{ organizationData: OrganizationData | null }> = ({ organizationData }) => {
  const [recentEvents, setRecentEvents] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsResponse, registrationsResponse] = await Promise.all([
        axios.get('/api/organizations/events'),
        axios.get('/api/organizations/events')
      ]);
      
      setRecentEvents(eventsResponse.data.slice(0, 3));
      setTotalEvents(eventsResponse.data.length);
      
      // Calculate total registrations
      let total = 0;
      eventsResponse.data.forEach((event: any) => {
        total += event.currentParticipants || 0;
      });
      setTotalRegistrations(total);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {organizationData?.name || 'Organization'}!
        </h1>
        <p className="text-gray-600">
          Manage your events and track student registrations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRegistrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-2xl font-semibold text-gray-900">
                {organizationData?.isVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            Recent Events
          </h3>
          {recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((event: any) => (
                <div key={event._id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.category}</p>
                  <p className="text-sm text-primary-600">{event.aictePoints} points</p>
                  <p className="text-sm text-gray-500">
                    {event.currentParticipants}/{event.maxParticipants} participants
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No events created yet</p>
          )}
          <Link to="/organization/events" className="btn-primary mt-4 w-full text-center">
            Manage Events
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/organization/events" 
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-5 w-5 text-primary-600" />
              <span>Create New Event</span>
            </Link>
            
            <Link 
              to="/organization/registrations" 
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Users className="h-5 w-5 text-primary-600" />
              <span>View Registrations</span>
            </Link>
            
            <Link 
              to="/organization/analytics" 
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <span>View Analytics</span>
            </Link>
            
            <Link 
              to="/organization/profile" 
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-5 w-5 text-primary-600" />
              <span>Update Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard; 