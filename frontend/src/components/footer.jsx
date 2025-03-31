import { Building, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const Footer = ({ className }) => {
  return (
    <footer className={cn('w-full border-t bg-blue-50 mt-16', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-900">Visit Masvingo</span>
                <span className="text-xs text-blue-600 font-medium">Your Real Estate Partner</span>
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-4">
              Helping you find your dream property in the heart of Zimbabwe.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-900">Quick Links</h4>
            <ul className="space-y-2">
              {['about', 'properties', 'blog', 'careers'].map((item) => (
                <li key={item}>
                  <Link to={`/${item}`}>
                    <Button variant="link" className="text-blue-600 hover:text-blue-900 px-0 capitalize">
                      {item.replace('-', ' ')}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-900">Contact</h4>
            <div className="space-y-3 text-sm text-blue-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Property Lane, Masvingo, Zimbabwe</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+263772123456" className="hover:text-blue-900">
                  +263 772 123 456
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@visitmasvingo.co.zw" className="hover:text-blue-900">
                  info@visitmasvingo.co.zw
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-900">Newsletter</h4>
            <form className="flex flex-col gap-3">
              <Input 
                placeholder="Enter your email" 
                className="rounded-lg border-blue-200 focus:border-blue-500"
                type="email"
                name="email"
              />
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Subscribe
              </Button>
            </form>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="text-blue-600 hover:text-blue-900" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-900" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-900" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-900" aria-label="Linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-blue-200" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-600">
          <div className="mb-4 md:mb-0 text-center">
            © {new Date().getFullYear()} Visit Masvingo. All rights reserved.
          </div>
          <div className="mb-4 md:mb-0 text-center">
            Designed by {" "}
            <a 
              href="https://slykertech.co.zw" 
              className="text-blue-900 hover:text-blue-600 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slyker Tech Web Services
            </a>
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
    </footer>
  );
};

export default Footer;