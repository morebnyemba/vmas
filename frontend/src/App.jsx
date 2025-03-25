import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header.jsx"; // Or .js, .tsx, etc.
import { Hero } from "@/components/Hero.jsx";   // Or .js, .tsx, etc.
import About from "@/pages/About.jsx";       // Or .js, .tsx, etc.
import Contact from "@/pages/Contact.jsx";     // Or .js, .tsx, etc.
import Services from "@/pages/Services.jsx";    // Or .js, .tsx, etc.
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;