import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 mt-10 text-white py-8">
      <div className="container mx-auto flex flex-col items-center">
        <p className="text-2xl font-bold mb-2">Costumes</p>
        
        <div className="flex space-x-8 mb-4">
          <a href="/about-us" className="text-sm hover:underline">About Us</a>
          <a href="/services" className="text-sm hover:underline">Services</a>
          <a href="/blog" className="text-sm hover:underline">Blog</a>
          <a href="/careers" className="text-sm hover:underline">Careers</a>
          <a href="/contact" className="text-sm hover:underline">Contact Us</a>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <a href="/privacy-policy" className="text-sm hover:underline">Privacy Policy</a>
          <a href="/terms-of-service" className="text-sm hover:underline">Terms of Service</a>
          <a href="/faq" className="text-sm hover:underline">FAQ</a>
          <a href="/support" className="text-sm hover:underline">Support</a>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">Instagram</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">LinkedIn</a>
        </div>
        
        <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
        <form className="flex mb-4">
          <input type="email" placeholder="Your email" className="p-2 rounded-l-md"/>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">Subscribe</button>
        </form>
        
        <p className="text-sm mb-2">© 2025 Costumes. All rights reserved.</p>
        <p className="text-xs">123 Main Street, City, Country | Phone: (123) 456-7890 | Email: info@costumes.com</p>
      </div>
    </footer>
  );
};

export default Footer;