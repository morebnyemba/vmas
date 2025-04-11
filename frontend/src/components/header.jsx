import { useState, useEffect } from "react";
import {
  Menu, X, Home, Building, HandCoins, ClipboardList,
  Info, Phone, ChevronDown, CircleDollarSign, HomeIcon,
  HelpCircle, LogIn, Facebook, Twitter, Instagram, Linkedin,
  Users, Handshake, Quote, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    {
      name: "Properties",
      icon: <Building className="h-4 w-4 mr-2" />,
      subLinks: [
        { name: "All Properties", href: "/properties", icon: <Building className="h-4 w-4 mr-2" /> },
        { name: "Buy", href: "/buy", icon: <CircleDollarSign className="h-4 w-4 mr-2" /> },
        { name: "Sell", href: "/sell", icon: <HandCoins className="h-4 w-4 mr-2" /> },
        { name: "Rent", href: "/rent", icon: <HomeIcon className="h-4 w-4 mr-2" /> },
        { name: "Lease", href: "/lease", icon: <ClipboardList className="h-4 w-4 mr-2" /> }
      ]
    },
    {
      name: "About",
      icon: <Info className="h-4 w-4 mr-2" />,
      subLinks: [
        { name: "About Us", href: "/about", icon: <Info className="h-4 w-4 mr-2" /> },
        { name: "Our Team", href: "/team", icon: <Users className="h-4 w-4 mr-2" /> },
        { name: "Partners", href: "/partners", icon: <Handshake className="h-4 w-4 mr-2" /> },
        { name: "Testimonials", href: "/testimonials", icon: <Quote className="h-4 w-4 mr-2" /> },
        { name: "Careers", href: "/careers", icon: <Briefcase className="h-4 w-4 mr-2" /> }
      ]
    },
    { name: "FAQs", href: "/faqs", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { name: "Contact", href: "/contact", icon: <Phone className="h-4 w-4 mr-2" /> },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, label: "Facebook", href: "#" },
    { icon: <Twitter className="h-4 w-4" />, label: "Twitter", href: "#" },
    { icon: <Instagram className="h-4 w-4" />, label: "Instagram", href: "#" },
    { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn", href: "#" },
  ];

  const Logo = () => (
    <Link 
      to="/" 
      className="flex items-center gap-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg"
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="bg-blue-600 p-2 rounded-lg"
      >
        <Building className="h-6 w-6 text-white" />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-blue-900">Masvingo Properties</span>
        <span className="text-xs text-blue-600 font-medium">Your Real Estate Partner</span>
      </div>
    </Link>
  );

  return (
    <div className="sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className={cn(
        "bg-blue-900/95 text-white py-2 px-4 text-xs sm:text-sm transition-all duration-300",
        isScrolled ? "backdrop-blur-lg py-1" : "backdrop-blur-none"
      )}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a 
              href="tel:+263772123456" 
              className="flex items-center gap-2 hover:text-blue-200 transition-colors"
            >
              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>24/7 Support: +263 772 123 456</span>
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:text-blue-200 transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn(
        "bg-white/95 border-b transition-all duration-300",
        isScrolled ? "backdrop-blur-lg h-16" : "backdrop-blur-none h-20"
      )}>
        <div className="container flex h-full items-center justify-between">
          
          {/* Mobile Header */}
          <div className="flex md:hidden w-full items-center justify-between px-4">
            <Logo />
            <div className="flex items-center gap-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                  >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] pr-0">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-2 pt-6">
                      {navLinks.map((link) => (
                        <div key={link.name} className="border-b last:border-0">
                          {link.subLinks ? (
                            <div>
                              <button
                                onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                                className="flex items-center w-full px-4 py-3 text-sm font-medium text-blue-900 hover:bg-blue-50"
                                aria-expanded={openDropdown === link.name}
                              >
                                {link.icon}
                                {link.name}
                                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${
                                  openDropdown === link.name ? 'rotate-180' : ''
                                }`} />
                              </button>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ 
                                  opacity: openDropdown === link.name ? 1 : 0,
                                  height: openDropdown === link.name ? 'auto' : 0
                                }}
                                className="overflow-hidden"
                              >
                                <div className="pl-6">
                                  {link.subLinks.map((subLink) => (
                                    <Link
                                      key={subLink.name}
                                      to={subLink.href}
                                      className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                      onClick={() => {
                                        setIsOpen(false);
                                        setOpenDropdown(null);
                                      }}
                                    >
                                      {subLink.icon}
                                      {subLink.name}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          ) : (
                            <Link
                              to={link.href}
                              className="flex items-center px-4 py-3 text-sm font-medium text-blue-900 hover:bg-blue-50"
                              onClick={() => setIsOpen(false)}
                            >
                              {link.icon}
                              {link.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-4">
                      <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                        Get Started
                      </Button>
                      <div className="flex justify-center gap-4 mb-4">
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            aria-label={social.label}
                            className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                          >
                            {social.icon}
                          </a>
                        ))}
                      </div>
                      <div className="pt-4 text-sm text-center text-blue-600 border-t">
                        © 2024 Masvingo Properties
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex w-full items-center justify-between">
            <Logo />
            
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                link.subLinks ? (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-blue-900 hover:text-blue-700 hover:bg-blue-50 gap-2 px-4 py-6 rounded-none data-[state=open]:bg-blue-50"
                      >
                        {link.icon}
                        {link.name}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="min-w-[240px] border-blue-100 shadow-lg"
                      align="start"
                    >
                      {link.subLinks.map((subLink) => (
                        <DropdownMenuItem key={subLink.name} asChild>
                          <Link
                            to={subLink.href}
                            className="flex items-center px-4 py-3 hover:bg-blue-50 gap-2 transition-colors"
                          >
                            {subLink.icon}
                            <span className="font-medium text-blue-900">{subLink.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    key={link.name}
                    variant="ghost"
                    asChild
                    className="text-blue-900 hover:text-blue-700 hover:bg-blue-50 gap-2 px-4 py-6 rounded-none"
                  >
                    <Link to={link.href}>
                      {link.icon}
                      {link.name}
                    </Link>
                  </Button>
                )
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 shadow-lg">
                  Get Started
                </Button>
              </motion.div>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-900 hover:text-blue-700 hover:bg-blue-50 gap-2"
                asChild
              >
                <Link to="/signin">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}