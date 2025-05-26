import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout components
import { Header } from "./components/header";
import Footer from '@/components/footer';

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import PropertyList from "./pages/Property_List";
import PropertyDetailPage from "./pages/Property_Detail";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Rent from "./pages/Rent";
import Lease from "./pages/Lease";
import ResidentialListings from "./pages/listings/Residential";
import CommercialListings from "./pages/listings/Commercial";
import LandListings from "./pages/listings/Land";
import FeaturedListings from "./pages/listings/Featured";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import FAQs from "./pages/FAQs";
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import TermsAndConditions from './pages/T&Cs'; // ✅ Import Terms & Conditions page
import PrivacyPolicy from './pages/PrivacyPolicy'; // ✅ Import Privacy Policy page

// Context
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboardRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <PaymentProvider>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />

                {/* Property Routes */}
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />

                {/* Unprotected Action Routes */}
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/lease" element={<Lease />} />

                {/* Listing Routes */}
                <Route path="/listings/residential" element={<ResidentialListings propertyType="residential" />} />
                <Route path="/listings/commercial" element={<CommercialListings propertyType="commercial" />} />
                <Route path="/listings/land" element={<LandListings propertyType="land" />} />
                <Route path="/listings/featured" element={<FeaturedListings featured={true} />} />

                {/* Checkout Page */}
                <Route path="/checkout" element={<Checkout />} />

                {/* Protected Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Terms & Conditions */}
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

                {/* Privacy Policy */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </PaymentProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
