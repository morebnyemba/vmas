import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import PropertyList from "./pages/Property_List";
import Footer from '@/components/footer';
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Rent from "./pages/Rent";
import Lease from "./pages/Lease";
import ResidentialListings from "./pages/listings/Residential";
import CommercialListings from "./pages/listings/Commercial";
import LandListings from "./pages/listings/Land";
import FeaturedListings from "./pages/listings/Featured";
import SignIn from "./pages/SignIn";
import FAQs from "./pages/FAQs";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/signin" element={<SignIn />} />
            
            {/* Property Routes */}
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/lease" element={<Lease />} />
            
            {/* Listing Routes */}
            <Route path="/listings/residential" element={<ResidentialListings />} />
            <Route path="/listings/commercial" element={<CommercialListings />} />
            <Route path="/listings/land" element={<LandListings />} />
            <Route path="/listings/featured" element={<FeaturedListings />} />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;