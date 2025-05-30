import { Building, Phone, Mail, MapPin, Facebook, Instagram, ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = ({ className }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Update datetime every minute
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formattedDateTime = currentDateTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <footer className={cn('w-full border-t bg-blue-50 mt-16', className)}>
      <div className="container mx-auto px-4 py-12">
        {/* ... (rest of your footer content remains exactly the same) ... */}

        <Separator className="my-8 bg-blue-200" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-600">
          <div className="mb-4 md:mb-0 text-center">
            © {formattedDateTime} Visit Masvingo. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Link to="/privacy-policy">
              <Button variant="link" className="text-blue-600 hover:text-blue-900 px-0">
                Privacy Policy
              </Button>
            </Link>
            <Link to="/terms-of-service">
              <Button variant="link" className="text-blue-600 hover:text-blue-900 px-0">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;