import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@./components/Header";
import { Hero } from "@./components/Hero";
import About from "@./pages/About";
import Contact from "@./pages/Contact";
import Services from "@./pages/Services";

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