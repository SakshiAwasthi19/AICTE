import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Target, 
  LogOut, 
  User, 
  Calendar, 
  Award, 
  MapPin, 
  Bell,
  Home,
  Search,
  Plus,
  Settings
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Components
import StudentProfile from '../components/student/StudentProfile';
import StudentEvents from '../components/student/StudentEvents';
import StudentCertificates from '../components/student/StudentCertificates';
import StudentPoints from '../components/student/StudentPoints';
import StudentRegistrations from '../components/student/StudentRegistrations';

interface StudentData {
  _id: string;
  name: string;
  rollNumber: string;
  college: string;
  branch: string;
  semester: number;
  aictePoints: number;
  targetPoints: number;
  profilePicture?: string;
}

const StudentDashboard: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get('/api/students/profile');
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
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
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  {studentData?.profilePicture ? (
                    <img 
                      src={studentData.profilePicture} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {studentData?.name || 'Student'}
                </h3>
                <p className="text-sm text-gray-600">
                  {studentData?.rollNumber || 'Roll Number'}
                </p>
                <p className="text-sm text-gray-600">
                  {studentData?.college || 'College'}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Link
                  to="/student"
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
                  to="/student/events"
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
                  to="/student/points"
                  onClick={() => setActiveTab('points')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'points'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Target className="h-5 w-5" />
                  <span>Points</span>
                </Link>
                
                <Link
                  to="/student/registrations"
                  onClick={() => setActiveTab('registrations')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'registrations'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Search className="h-5 w-5" />
                  <span>Registrations</span>
                </Link>
                
                <Link
                  to="/student/certificates"
                  onClick={() => setActiveTab('certificates')}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'certificates'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Award className="h-5 w-5" />
                  <span>Certificates</span>
                </Link>
                
                <Link
                  to="/student/profile"
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
              <Route path="/" element={<StudentDashboardHome studentData={studentData} />} />
              <Route path="/events" element={<StudentEvents />} />
              <Route path="/points" element={<StudentPoints />} />
              <Route path="/registrations" element={<StudentRegistrations />} />
              <Route path="/certificates" element={<StudentCertificates />} />
              <Route path="/profile" element={<StudentProfile />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Component
const StudentDashboardHome: React.FC<{ studentData: StudentData | null }> = ({ studentData }) => {
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  useEffect(() => {
    fetchNearbyEvents();
    fetchRecentRegistrations();
  }, []);

  const fetchNearbyEvents = async () => {
    try {
      const response = await axios.get('/api/students/nearby-events');
      setNearbyEvents(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching nearby events:', error);
    }
  };

  const fetchRecentRegistrations = async () => {
    try {
      const response = await axios.get('/api/students/registrations');
      setRecentRegistrations(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const progressPercentage = studentData 
    ? (studentData.aictePoints / studentData.targetPoints) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {studentData?.name || 'Student'}!
        </h1>
        <p className="text-gray-600">
          Track your AICTE points progress and discover new opportunities.
        </p>
      </div>

      {/* Points Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AICTE Points Progress</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Points</span>
            <span className="text-lg font-semibold text-primary-600">
              {studentData?.aictePoints || 0} / {studentData?.targetPoints || 100}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
            Nearby Events
          </h3>
          {nearbyEvents.length > 0 ? (
            <div className="space-y-3">
              {nearbyEvents.map((event: any) => (
                <div key={event._id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.organizationId?.name}</p>
                  <p className="text-sm text-primary-600">{event.aictePoints} points</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No nearby events found</p>
          )}
          <Link to="/student/events" className="btn-primary mt-4 w-full text-center">
            View All Events
          </Link>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            Recent Registrations
          </h3>
          {recentRegistrations.length > 0 ? (
            <div className="space-y-3">
              {recentRegistrations.map((registration: any) => (
                <div key={registration._id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{registration.eventId?.title}</h4>
                  <p className="text-sm text-gray-600">{registration.status}</p>
                  <p className="text-sm text-primary-600">{registration.eventId?.aictePoints} points</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent registrations</p>
          )}
          <Link to="/student/registrations" className="btn-primary mt-4 w-full text-center">
            View All Registrations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 