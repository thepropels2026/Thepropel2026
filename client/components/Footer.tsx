import Link from 'next/link'; // Next.js link for client-side navigation
// Import icons from lucide-react for social media and contact information
import { Instagram, Linkedin, Twitter, Facebook, Youtube, MapPin, Mail, Phone } from 'lucide-react';

/**
 * Footer component: The bottom section of the application.
 * Contains brand information, social links, quick navigation, contact details, and copyright.
 */
export default function Footer() {
  return (
    // Footer container with glassmorphism styling and dark theme
    <footer className="bg-[#0a0a0f]/80 backdrop-blur-md border-t border-white/10 py-16 mt-20 font-inter">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* SECTION 1: Brand Information & Social Media Links */}
        <div className="col-span-1 md:col-span-1 flex flex-col items-start">
          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center gap-3 font-montserrat text-2xl font-extrabold tracking-wider mb-4">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            The Propels
          </Link>
          {/* Brand Tagline */}
          <p className="text-white/80 text-sm mb-6 leading-relaxed">Turning India's 75% students Entrepreneurial intents into Real world Revenue.</p>
          
          {/* Social Media Link Icons */}
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 rounded-full text-white hover:text-cyan-500 hover:bg-white/10 transition-all"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-full text-white hover:text-cyan-500 hover:bg-white/10 transition-all"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-full text-white hover:text-cyan-500 hover:bg-white/10 transition-all"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-full text-white hover:text-cyan-500 hover:bg-white/10 transition-all"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-white/5 rounded-full text-white hover:text-cyan-500 hover:bg-white/10 transition-all"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
        
        {/* SECTION 2: Quick Navigation Links */}
        <div>
          <h4 className="text-lg font-montserrat font-bold mb-4 text-white">Quick Nav</h4>
          <div className="flex flex-col gap-3 text-sm text-white">
            <Link href="/#about" className="hover:text-cyan-400 transition-colors">About Us</Link>
            <Link href="/tools" className="hover:text-cyan-400 transition-colors">Propulsion Tools</Link>
            <Link href="/market-research" className="hover:text-cyan-400 transition-colors">Market Research</Link>
            <Link href="#" className="hover:text-cyan-400 transition-colors">Other links</Link>
            <Link href="/careers" className="hover:text-cyan-400 transition-colors">Careers at The Propels</Link>
          </div>
        </div>

        {/* SECTION 3: Contact Information */}
        <div>
          <h4 className="text-lg font-montserrat font-bold mb-4 text-white">Contact Us</h4>
          <div className="flex flex-col gap-4 text-sm text-white">
            {/* Email Contact */}
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-cyan-500" />
              <span>hello@thepropels.com</span>
            </div>
            {/* Phone Contact */}
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-cyan-500" />
              <span>+91 99999 99999</span>
            </div>
            {/* Physical Address */}
            <div className="flex items-start gap-3 mt-2">
              <MapPin className="w-5 h-5 text-cyan-500 shrink-0" />
              <span>Cyber Hub, Gurugram<br />Haryana, India 122002</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Location Map Preview */}
        <div>
          <h4 className="text-lg font-montserrat font-bold mb-4 text-white">Our Coordinates</h4>
          <div className="w-full h-32 bg-white/5 rounded-lg overflow-hidden border border-white/10 relative group cursor-pointer">
            {/* Decorative background and overlay effects */}
            <div className="absolute inset-0 bg-cyan-900/20 group-hover:bg-cyan-900/40 transition-colors z-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500 z-10">
              {/* Map pin with glow effect */}
              <MapPin className="w-8 h-8 mb-2 drop-shadow-[0_0_10px_rgba(0,242,255,0.8)]" />
              <span className="text-xs font-bold tracking-widest uppercase">View on Map</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center text-white/60 mt-16 pt-8 border-t border-white/5 text-xs tracking-wider">
        &copy; {new Date().getFullYear()} THE PROPELS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
