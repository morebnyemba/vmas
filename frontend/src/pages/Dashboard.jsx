import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Home, 
  Heart, 
  Bell, 
  Calendar, 
  MapPin, 
  Star, 
  Search, 
  MessageSquare,
  Clock,
  CheckCircle,
  User,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  
  Shield
} from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const CustomerDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    savedProperties: [],
    viewings: [],
    messages: [],
    recommendations: [],
    payments: [],
    feeStatus: {}
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Simulate API fetch
      setTimeout(() => {
        setDashboardData({
          savedProperties: [
            { 
              id: 1, 
              title: 'Modern Downtown Apartment', 
              status: 'Available', 
              price: 1800, 
              location: 'Downtown', 
              beds: 1, 
              baths: 1, 
              sqft: 750, 
              viewingFeePaid: true,
              viewingFeeAmount: 50
            },
            { 
              id: 2, 
              title: 'Suburban Family Home', 
              status: 'Available', 
              price: 3200, 
              location: 'Greenfield', 
              beds: 3, 
              baths: 2, 
              sqft: 1800,
              viewingFeePaid: false,
              viewingFeeAmount: 75
            },
          ],
          viewings: [
            { 
              id: 1, 
              property: 'Modern Downtown Apartment', 
              date: '2024-04-15', 
              time: '2:00 PM', 
              status: 'Confirmed',
              feeStatus: 'Paid',
              amount: 50
            },
            { 
              id: 2, 
              property: 'Suburban Family Home', 
              date: '2024-04-05', 
              time: '11:00 AM', 
              status: 'Pending Payment',
              feeStatus: 'Unpaid',
              amount: 75
            },
          ],
          messages: [
            { id: 1, agent: 'Sarah Johnson', property: 'Modern Downtown Apartment', date: '2024-04-12', unread: true },
            { id: 2, agent: 'Michael Brown', property: 'Suburban Family Home', date: '2024-04-01', unread: false },
          ],
          recommendations: [
            { 
              id: 1, 
              title: 'Luxury Waterfront Condo', 
              price: 2200, 
              location: 'Bay Area', 
              beds: 2, 
              baths: 2, 
              sqft: 1100, 
              match: 92,
              viewingFee: 60
            },
            { 
              id: 2, 
              title: 'Cozy Studio Apartment', 
              price: 1450, 
              location: 'Midtown', 
              beds: 0, 
              baths: 1, 
              sqft: 550, 
              match: 87,
              viewingFee: 40
            },
          ],
          payments: [
            {
              id: 1,
              type: 'Viewing Fee',
              property: 'Modern Downtown Apartment',
              amount: 50,
              date: '2024-04-10',
              status: 'Completed',
              receiptUrl: '/receipts/12345'
            },
            {
              id: 2,
              type: 'Administration Fee',
              description: 'Document processing',
              amount: 120,
              date: '2024-03-28',
              status: 'Completed',
              receiptUrl: '/receipts/12346'
            },
            {
              id: 3,
              type: 'Commitment Fee',
              property: 'Suburban Family Home',
              amount: 300,
              date: '2024-04-02',
              status: 'Pending',
              dueDate: '2024-04-20'
            }
          ],
          feeStatus: {
            viewingFeesPaid: 1,
            viewingFeesDue: 1,
            adminFeesPaid: 1,
            adminFeesDue: 0,
            commitmentFeesPaid: 0,
            commitmentFeesDue: 1,
            totalOutstanding: 375
          }
        });
      }, 800);
    }
  }, [loading]);

  const handlePayNow = (paymentId) => {
    // In a real app, this would redirect to payment gateway
    alert(`Redirecting to payment for transaction ${paymentId}`);
    navigate('/payment', { state: { paymentId } });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-blue-700"></div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Blue Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-700 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-blue-600">
          {sidebarOpen ? (
            <h2 className="text-xl font-bold">PropertyFinder</h2>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-blue-200 hover:text-white"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <Home className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </NavLink>
            
            <NavLink
              to="/properties"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <Search className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Browse Properties</span>}
            </NavLink>
            
            <NavLink
              to="/saved"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <Heart className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Saved Properties</span>}
            </NavLink>
            
            <NavLink
              to="/viewings"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <Calendar className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Viewings</span>}
            </NavLink>
            
            <NavLink
              to="/payments"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <CreditCard className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Payments</span>}
              {dashboardData.feeStatus.totalOutstanding > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  ${dashboardData.feeStatus.totalOutstanding}
                </span>
              )}
            </NavLink>
            
            <NavLink
              to="/documents"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <FileText className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Documents</span>}
            </NavLink>
          </nav>
          
          <div className="border-t border-blue-600 mt-4 pt-4">
            <NavLink
              to="/profile"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <User className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">My Profile</span>}
            </NavLink>
            
            <NavLink
              to="/settings"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600/50'}`
              }
            >
              <Settings className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Settings</span>}
            </NavLink>
          </div>
        </div>
        
        <div className="p-4 border-t border-blue-600">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-lg font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-blue-200">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-lg font-medium">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-gray-600 mt-2">Your property search journey</p>
            </div>
            <button 
              onClick={() => navigate('/properties')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Search className="h-4 w-4" />
              Browse Properties
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<Heart className="h-6 w-6" />} 
              title="Saved Properties" 
              value={dashboardData.savedProperties.length} 
              change={`+${Math.floor(dashboardData.savedProperties.length * 0.5)} this month`} 
              iconColor="text-red-500"
            />
            
            <StatCard 
              icon={<Calendar className="h-6 w-6" />} 
              title="Upcoming Viewings" 
              value={dashboardData.viewings.filter(v => v.status === 'Confirmed' || v.status === 'Pending Payment').length} 
              change={`${dashboardData.viewings.filter(v => v.feeStatus === 'Paid').length} paid`} 
              iconColor="text-blue-500"
            />
            
            <StatCard 
              icon={<CreditCard className="h-6 w-6" />} 
              title="Outstanding Fees" 
              value={`$${dashboardData.feeStatus.totalOutstanding}`} 
              change={`${dashboardData.payments.filter(p => p.status === 'Pending').length} pending`} 
              iconColor="text-yellow-500"
            />
            
            <StatCard 
              icon={<Shield className="h-6 w-6" />} 
              title="Completed Payments" 
              value={dashboardData.payments.filter(p => p.status === 'Completed').length} 
              change="View receipts" 
              iconColor="text-green-500"
            />
          </div>

          {/* Payment Status */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Payment Overview
                  </CardTitle>
                  <button 
                    onClick={() => navigate('/payments')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Payment History
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Viewing Fees */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Viewing Fees
                      </h3>
                      <Badge variant={dashboardData.feeStatus.viewingFeesDue > 0 ? "destructive" : "default"}>
                        {dashboardData.feeStatus.viewingFeesDue > 0 ? `${dashboardData.feeStatus.viewingFeesDue} Due` : "All Paid"}
                      </Badge>
                    </div>
                    <Progress 
                      value={(dashboardData.feeStatus.viewingFeesPaid / (dashboardData.feeStatus.viewingFeesPaid + dashboardData.feeStatus.viewingFeesDue)) * 100} 
                      className="h-2 mb-2" 
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Paid: {dashboardData.feeStatus.viewingFeesPaid}</span>
                      <span>Due: {dashboardData.feeStatus.viewingFeesDue}</span>
                    </div>
                  </div>

                  {/* Administration Fees */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        Admin Fees
                      </h3>
                      <Badge variant={dashboardData.feeStatus.adminFeesDue > 0 ? "destructive" : "default"}>
                        {dashboardData.feeStatus.adminFeesDue > 0 ? `${dashboardData.feeStatus.adminFeesDue} Due` : "All Paid"}
                      </Badge>
                    </div>
                    <Progress 
                      value={(dashboardData.feeStatus.adminFeesPaid / (dashboardData.feeStatus.adminFeesPaid + dashboardData.feeStatus.adminFeesDue)) * 100} 
                      className="h-2 mb-2" 
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Paid: {dashboardData.feeStatus.adminFeesPaid}</span>
                      <span>Due: {dashboardData.feeStatus.adminFeesDue}</span>
                    </div>
                  </div>

                  {/* Commitment Fees */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-500" />
                        Commitment Fees
                      </h3>
                      <Badge variant={dashboardData.feeStatus.commitmentFeesDue > 0 ? "destructive" : "default"}>
                        {dashboardData.feeStatus.commitmentFeesDue > 0 ? `${dashboardData.feeStatus.commitmentFeesDue} Due` : "All Paid"}
                      </Badge>
                    </div>
                    <Progress 
                      value={(dashboardData.feeStatus.commitmentFeesPaid / (dashboardData.feeStatus.commitmentFeesPaid + dashboardData.feeStatus.commitmentFeesDue)) * 100} 
                      className="h-2 mb-2" 
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Paid: {dashboardData.feeStatus.commitmentFeesPaid}</span>
                      <span>Due: {dashboardData.feeStatus.commitmentFeesDue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Payments */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    Recent Transactions
                  </CardTitle>
                  <button 
                    onClick={() => navigate('/payments')}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.payments.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          payment.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {payment.status === 'Completed' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{payment.type}</h3>
                          <p className="text-sm text-gray-600">
                            {payment.property || payment.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${payment.amount}</p>
                        {payment.status === 'Completed' ? (
                          <a 
                            href={payment.receiptUrl} 
                            className="text-xs text-blue-600 hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              // In a real app, this would open the receipt
                              alert(`Viewing receipt for payment ${payment.id}`);
                            }}
                          >
                            View Receipt
                          </a>
                        ) : (
                          <button 
                            onClick={() => handlePayNow(payment.id)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Recommendations */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Recommended For You
                  </CardTitle>
                  <button className="text-sm text-blue-600 hover:underline">
                    View all
                  </button>
                </div>
                <CardDescription>Properties matching your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.recommendations.map(property => (
                    <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gray-100 h-48 w-full relative">
                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
                          {property.match}% Match
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{property.title}</h3>
                        <p className="text-gray-600">{property.location}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500">
                            {property.beds} bed • {property.baths} bath • {property.sqft} sqft
                          </div>
                          <div className="font-bold">${property.price}/mo</div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Viewing Fee:</span> ${property.viewingFee}
                          </p>
                          <div className="flex gap-2">
                            <button 
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                              onClick={() => navigate(`/properties/${property.id}`)}
                            >
                              View Details
                            </button>
                            <button 
                              className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors"
                              onClick={() => alert(`Pay $${property.viewingFee} viewing fee`)}
                            >
                              Pay Viewing Fee
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Viewings */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Upcoming Viewings
                  </CardTitle>
                  <button className="text-sm text-blue-600 hover:underline">
                    View all
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.viewings.map(viewing => (
                    <div key={viewing.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          viewing.feeStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {viewing.feeStatus === 'Paid' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{viewing.property}</h3>
                          <p className="text-sm text-gray-600">
                            {viewing.date} at {viewing.time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Fee: ${viewing.amount} ({viewing.feeStatus})
                          </p>
                        </div>
                      </div>
                      <div>
                        {viewing.feeStatus === 'Paid' ? (
                          <Badge variant="success">Confirmed</Badge>
                        ) : (
                          <button 
                            onClick={() => handlePayNow(`viewing_${viewing.id}`)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                          >
                            Pay Fee
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, change, iconColor }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`h-6 w-6 ${iconColor}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500 mt-1">{change}</p>
    </CardContent>
  </Card>
);

export default CustomerDashboard;