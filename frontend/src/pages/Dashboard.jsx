import axios from 'axios';
import React, { useState, useEffect } from 'react';
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
    Shield,
    Briefcase,
    Building,
    Users,
    ArrowUp,
    ArrowDown,
    Plus
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
const StatCard = ({ icon, title, value, trend, change, gradient }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <div className="text-3xl font-bold">{value}</div>
                </div>
                <div className={`bg-gradient-to-br ${gradient} p-3 rounded-xl shadow-sm`}>
                    {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
                </div>
            </div>
            {trend !== 'neutral' && (
                <div className="flex items-center gap-2 mt-4">
                    <div className={`flex items-center gap-1 text-sm ${
                        trend === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {trend === 'positive' ? (
                            <ArrowUp className="h-4 w-4" />
                        ) : (
                            <ArrowDown className="h-4 w-4" />
                        )}
                        <span>{change}%</span>
                    </div>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
            )}
        </CardContent>
    </Card>
);

const CustomerDashboard = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        savedProperties: [],
        viewings: [],
        messages: [],
        recommendations: [],
        payments: [],
        feeStatus: {},
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState('dashboard');

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!loading && isAuthenticated) {
                try {
                    // Simulated API calls with mock data
                    const mockRecommendations = [
                        {
                            id: 1,
                            title: "Modern Downtown Loft",
                            location: "Manhattan, NY",
                            price: 4500,
                            image: "https://source.unsplash.com/random/800x600/?apartment"
                        },
                        {
                            id: 2,
                            title: "Suburban Family Home",
                            location: "Brooklyn, NY",
                            price: 3200,
                            image: "https://source.unsplash.com/random/800x600/?house"
                        },
                    ];

                    const mockViewings = [
                        {
                            id: 1,
                            property: {
                                title: "Luxury Penthouse",
                                location: "Upper East Side, NY"
                            },
                            date: "2024-03-20T14:00:00",
                            confirmed: true
                        },
                    ];

                    setDashboardData({
                        ...dashboardData,
                        savedProperties: Array(5).fill({}),
                        recommendations: mockRecommendations,
                        viewings: mockViewings,
                        payments: [
                            { id: 1, amount: 1200, date: "2024-03-01", status: "completed" },
                            { id: 2, amount: 1200, date: "2024-02-01", status: "completed" }
                        ],
                        feeStatus: {
                            total: 4800,
                            paid: 2400,
                            dueDate: "2024-04-01"
                        }
                    });

                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                }
            }
        };

        loadDashboardData();
    }, [loading, isAuthenticated]);

    const getUserInitials = () => {
        const firstInitial = user?.first_name?.[0] || '';
        const lastInitial = user?.last_name?.[0] || '';
        return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
    };

    const getFullName = () => {
        if (user?.first_name && user?.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return user?.first_name || user?.last_name || 'User';
    };

    const DashboardHome = () => (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                        Welcome back, <span className="text-blue-700">{user?.first_name || 'User'}</span>!
                    </h1>
                    <p className="text-muted-foreground mt-2.5">
                        Here's your personalized property search update
                    </p>
                </div>
                <Button
                    onClick={() => setActiveView('properties')}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Search className="h-5 w-5" />
                    <span className="font-semibold">Explore Properties</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={<Heart className="h-6 w-6" />}
                    title="Saved Properties"
                    value={dashboardData.savedProperties.length}
                    trend="positive"
                    change={15}
                    gradient="from-red-500 to-pink-500"
                />
                <StatCard
                    icon={<CheckCircle className="h-6 w-6" />}
                    title="Completed Viewings"
                    value={4}
                    trend="positive"
                    change={8}
                    gradient="from-green-500 to-emerald-500"
                />
                <StatCard
                    icon={<CreditCard className="h-6 w-6" />}
                    title="Total Payments"
                    value={`$${dashboardData.payments.reduce((sum, p) => sum + p.amount, 0)}`}
                    trend="neutral"
                    change={0}
                    gradient="from-purple-500 to-indigo-500"
                />
                <StatCard
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="New Messages"
                    value={3}
                    trend="negative"
                    change={-5}
                    gradient="from-orange-500 to-amber-500"
                />
            </div>

            <div className="mb-8">
                <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-blue-50/50 rounded-t-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold">Payment Overview</CardTitle>
                                    <CardDescription>Your recent payment activities</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="link"
                                onClick={() => setActiveView('payments')}
                                className="text-blue-600 hover:text-blue-700 h-auto p-0"
                            >
                                View History <ChevronRight className="h-4 w-4 ml-1.5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1">
                                    <span className="text-sm font-medium">Total Paid</span>
                                    <p className="text-2xl font-bold">
                                        ${dashboardData.payments.reduce((sum, p) => sum + p.amount, 0)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium">Next Payment Due</span>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        ${dashboardData.feeStatus?.total - dashboardData.feeStatus?.paid}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Due by {new Date(dashboardData.feeStatus?.dueDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Payment Progress</span>
                                    <span>{((dashboardData.feeStatus?.paid / dashboardData.feeStatus?.total) * 100 || 0).toFixed(0)}%</span>
                                </div>
                                <Progress 
                                    value={(dashboardData.feeStatus?.paid / dashboardData.feeStatus?.total) * 100 || 0}
                                    className="h-3 bg-gray-100"
                                    indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-400"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-0 shadow-xl overflow-hidden">
                    <CardHeader className="bg-indigo-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <Star className="h-6 w-6 text-yellow-500" />
                                Top Picks for You
                            </CardTitle>
                            <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                                See All <ChevronRight className="h-4 w-4 ml-1.5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.recommendations.map(property => (
                                <div key={property.id} className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <img 
                                        src={property.image} 
                                        alt={property.title}
                                        className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="p-4 bg-white">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold">{property.title}</h3>
                                            <Badge variant="premium" className="shrink-0">
                                                ${property.price}/mo
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{property.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-emerald-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-emerald-600" />
                                Upcoming Viewings
                            </CardTitle>
                            <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto">
                                View All <ChevronRight className="h-4 w-4 ml-1.5" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {dashboardData.viewings.map(viewing => (
                                <div key={viewing.id} className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{viewing.property.title}</h4>
                                            <Badge variant={viewing.confirmed ? 'success' : 'warning'}>
                                                {viewing.confirmed ? 'Confirmed' : 'Pending'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(viewing.date).toLocaleDateString()}</span>
                                            <MapPin className="h-4 w-4 ml-2" />
                                            <span>{viewing.property.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );

    const FavoritesView = () => (
        <div className="space-y-6">
            <Card className="border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-6 w-6 text-red-500" />
                        Saved Properties
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dashboardData.savedProperties.map((property, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="h-40 bg-gray-100 rounded-lg mb-3"></div>
                                    <h3 className="font-medium">Property {index + 1}</h3>
                                    <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>Location</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const NotificationsView = () => (
        <Card className="border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-6 w-6 text-blue-500" />
                    Notifications
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Bell className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="font-medium">Notification {item}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    This is a sample notification message.
                                </p>
                                <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const DocumentsView = () => (
        <Card className="border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-green-500" />
                    My Documents
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {['Lease Agreement', 'Payment Receipt', 'ID Verification'].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium">{doc}</h4>
                                    <p className="text-sm text-muted-foreground">PDF • {Math.floor(Math.random() * 2) + 1} MB</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                Download
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const ProfileView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-xl lg:col-span-1">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold">
                                {getUserInitials()}
                            </div>
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <h3 className="text-xl font-bold">{getFullName()}</h3>
                        <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
                        <Button className="mt-4 w-full">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-xl lg:col-span-2">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">First Name</label>
                            <p className="font-medium">{user?.first_name || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                            <p className="font-medium">{user?.last_name || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="font-medium">{user?.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <p className="font-medium">Not provided</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const SettingsView = () => (
        <Card className="border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-6 w-6 text-orange-500" />
                    Account Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-medium mb-2">Notification Preferences</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span>Email Notifications</span>
                                <div className="h-6 w-11 rounded-full bg-gray-200 flex items-center justify-end p-0.5">
                                    <div className="h-5 w-5 rounded-full bg-white shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>SMS Alerts</span>
                                <div className="h-6 w-11 rounded-full bg-blue-600 flex items-center justify-start p-0.5">
                                    <div className="h-5 w-5 rounded-full bg-white shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Security</h3>
                        <Button variant="outline" className="w-full">
                            Change Password
                        </Button>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Danger Zone</h3>
                        <Button variant="destructive" className="w-full">
                            Delete Account
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const PaymentsView = () => (
        <Card className="border-0 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                    Payment History
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData.payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {new Date(payment.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        ${payment.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                                            {payment.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );

    const PropertiesView = () => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Available Properties</h2>
                    <p className="text-muted-foreground">Browse our selection of properties</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <MapPin className="h-4 w-4 mr-2" />
                        Map View
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.recommendations.concat(dashboardData.recommendations).map((property, index) => (
                    <Card key={`${property.id}-${index}`} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                            <div className="relative">
                                <img 
                                    src={property.image} 
                                    alt={property.title}
                                    className="h-48 w-full object-cover rounded-t-lg"
                                />
                                <Button 
                                    size="sm" 
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-900"
                                >
                                    <Heart className="h-4 w-4 mr-1" />
                                    Save
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold">{property.title}</h3>
                                    <Badge variant="premium" className="shrink-0">
                                        ${property.price}/mo
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{property.location}</span>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                    <Button size="sm">
                                        Schedule Viewing
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50/95">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-700 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-xl`}>
                <div className="p-4 flex items-center justify-between border-b border-blue-600/50">
                    {sidebarOpen ? (
                        <h2 className="text-xl font-bold tracking-tight">PropertyFinder</h2>
                    ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full shadow-sm"></div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-blue-600/30 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? 
                            <ChevronLeft className="h-5 w-5 text-blue-200" /> : 
                            <ChevronRight className="h-5 w-5 text-blue-200" />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <nav className="space-y-1.5">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`flex items-center p-3 rounded-xl transition-all w-full ${
                                activeView === 'dashboard' 
                                ? 'bg-blue-600 shadow-inner' 
                                : 'hover:bg-blue-600/30 hover:translate-x-1'
                            }`}
                        >
                            <Home className="h-5 w-5 min-w-[20px]" />
                            {sidebarOpen && <span className="ml-3 text-sm font-medium">Dashboard</span>}
                        </button>

                        <button
                            onClick={() => setActiveView('favorites')}
                            className={`flex items-center p-3 rounded-xl transition-all w-full ${
                                activeView === 'favorites' 
                                ? 'bg-blue-600 shadow-inner' 
                                : 'hover:bg-blue-600/30 hover:translate-x-1'
                            }`}
                        >
                            <Heart className="h-5 w-5" />
                            {sidebarOpen && <span className="ml-3 text-sm font-medium">Favorites</span>}
                        </button>

                        <button
                            onClick={() => setActiveView('notifications')}
                            className={`flex items-center p-3 rounded-xl transition-all w-full ${
                                activeView === 'notifications' 
                                ? 'bg-blue-600 shadow-inner' 
                                : 'hover:bg-blue-600/30 hover:translate-x-1'
                            }`}
                        >
                            <Bell className="h-5 w-5" />
                            {sidebarOpen && <span className="ml-3 text-sm font-medium">Notifications</span>}
                        </button>

                        <button
                            onClick={() => setActiveView('documents')}
                            className={`flex items-center p-3 rounded-xl transition-all w-full ${
                                activeView === 'documents' 
                                ? 'bg-blue-600 shadow-inner' 
                                : 'hover:bg-blue-600/30 hover:translate-x-1'
                            }`}
                        >
                            <FileText className="h-5 w-5" />
                            {sidebarOpen && <span className="ml-3 text-sm font-medium">Documents</span>}
                        </button>
                    </nav>

                    <div className="border-t border-blue-600/50 mt-4 pt-4">
                        <button
                            onClick={() => setActiveView('profile')}
                            className={`flex items-center p-3 rounded-xl transition-all w-full ${
                                activeView === 'profile' 
                                ? 'bg-blue-600 shadow-inner' 
                                : 'hover:bg-blue-600/30 hover:translate-x-1'
                            }`}
                        >
                            <User className="h-5 w-5" />
                            {sidebarOpen && <span className="ml-3 text-sm font-medium">Profile</span>}
                        </button>

                        <button
                            onClick={() => setActiveView('settings')}
                            className={`flex items-center p-3 rounded-xl transition-all w-full ${
                                activeView === 'settings' 
                                ? 'bg-blue-600 shadow-inner' 
                                : 'hover:bg-blue-600/30 hover:translate-x-1'
                            }`}
                        >
                            <Settings className="h-5 w-5" />
                            {sidebarOpen && <span className="ml-3 text-sm font-medium">Settings</span>}
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-blue-600/50">
                    <div className={`flex ${sidebarOpen ? 'items-center' : 'justify-center'}`}>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                                <span className="text-lg font-medium tracking-wide">
                                    {getUserInitials()}
                                </span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-800"></div>
                        </div>
                        {sidebarOpen && (
                            <div className="ml-3">
                                <p className="font-medium text-sm">{getFullName()}</p>
                                <p className="text-xs text-blue-200/80 mt-0.5">{user?.email || 'user@example.com'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/95 to-gray-100/90">
                <div className="container mx-auto p-4 md:p-6 lg:p-8">
                    {activeView !== 'dashboard' && (
                        <div className="mb-6">
                            <Button 
                                onClick={() => setActiveView('dashboard')}
                                variant="ghost" 
                                className="gap-2 text-blue-600 hover:text-blue-700 pl-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </div>
                    )}
                    
                    {activeView === 'dashboard' && <DashboardHome />}
                    {activeView === 'favorites' && <FavoritesView />}
                    {activeView === 'notifications' && <NotificationsView />}
                    {activeView === 'documents' && <DocumentsView />}
                    {activeView === 'profile' && <ProfileView />}
                    {activeView === 'settings' && <SettingsView />}
                    {activeView === 'payments' && <PaymentsView />}
                    {activeView === 'properties' && <PropertiesView />}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;