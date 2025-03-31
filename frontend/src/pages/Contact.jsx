// src/pages/Contact.jsx
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Our Office</h2>
          <address className="not-italic">
            <p className="mb-2">123 Main Street</p>
            <p className="mb-2">Masvingo, Zimbabwe</p>
            <p className="mb-4">Phone: +263 772 123 456</p>
          </address>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Get Directions
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Send a Message</h2>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-2 border rounded"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-2 border rounded"
            />
            <textarea 
              placeholder="Your Message" 
              rows="4" 
              className="w-full p-2 border rounded"
            ></textarea>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}