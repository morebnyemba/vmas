// components/ui/Footer.jsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = ({ className }) => {
  return (
    <footer className={cn('w-full border-t bg-background/95', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Real Estate Pro</h3>
            <p className="text-sm text-muted-foreground">
              Helping you find your dream property since 2015.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Listings', 'Blog', 'Careers'].map((item) => (
                <li key={item}>
                  <Button variant="link" className="text-muted-foreground">
                    {item}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>123 Property Lane</p>
              <p>New York, NY 10001</p>
              <p>Phone: (+263) 123-4567</p>
              <p>Email: info@vmas.com.zw</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <form className="flex flex-col gap-2">
              <Input placeholder="Enter your email" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Real Estate Pro. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <Button variant="link" className="text-muted-foreground">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-muted-foreground">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;