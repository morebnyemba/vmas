import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Home,
  DollarSign,
  Users,
  MapPin,
  List,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    properties: [],
    interests: [],
    transactions: [],
  });

  useEffect(() => {
    // Fetch data from API and update dashboardData
    // Example:
    // const fetchData = async () => {
    //   const properties = await fetch('/api/properties');
    //   const interests = await fetch('/api/interests');
    //   const transactions = await fetch('/api/transactions');
    //   setDashboardData({ properties, interests, transactions });
    // };
    // fetchData();

    // Dummy data for demonstration
    setDashboardData({
      properties: [
        { id: 1, title: 'Cozy Apartment', status: 'Available', price: 150000 },
        { id: 2, title: 'Spacious House', status: 'Sold', price: 350000 },
      ],
      interests: [
        { id: 1, property: 'Cozy Apartment', date: '2024-03-15' },
        { id: 2, property: 'Spacious House', date: '2024-03-20' },
      ],
      transactions: [
        { id: 1, type: 'Purchase', amount: 350000, date: '2024-03-22' },
        { id: 2, type: 'Viewing', amount: 0, date: '2024-03-25' },
      ],
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Home className="h-6 w-6 text-blue-500" />
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.properties.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Users className="h-6 w-6 text-green-500" />
            <CardTitle>Total Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.interests.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <DollarSign className="h-6 w-6 text-yellow-500" />
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.transactions.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <MapPin className="h-6 w-6 text-red-500" />
            <CardTitle>Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell>${property.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
