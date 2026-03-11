"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#050505] text-white/70 border-t border-white/10 pt-20 pb-10 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF]">
              Hamrophone
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            The most trusted and transparent second-hand smartphone marketplace. Buy verified devices or sell yours effortlessly.
          </p>
          <div className="flex gap-4 items-center">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h3 className="text-white font-bold text-lg">Quick Links</h3>
          <nav className="flex flex-col gap-3 text-sm">
            <Link href="#phones" className="hover:text-[#00E5FF] transition-colors w-fit">Browse Phones</Link>
            <Link href="/sell" className="hover:text-[#00E5FF] transition-colors w-fit">Sell Your Device</Link>
            <Link href="#mission" className="hover:text-[#00E5FF] transition-colors w-fit">Our Mission</Link>
            <Link href="#reviews" className="hover:text-[#00E5FF] transition-colors w-fit">Customer Reviews</Link>
          </nav>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-6">
          <h3 className="text-white font-bold text-lg">Support</h3>
          <nav className="flex flex-col gap-3 text-sm">
            <Link href="#" className="hover:text-white transition-colors w-fit">Help Center</Link>
            <Link href="#" className="hover:text-white transition-colors w-fit">Warranty Policy</Link>
            <Link href="#" className="hover:text-white transition-colors w-fit">Return Policy</Link>
            <Link href="#" className="hover:text-white transition-colors w-fit">Terms & Conditions</Link>
            <Link href="#" className="hover:text-white transition-colors w-fit">Privacy Policy</Link>
          </nav>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <h3 className="text-white font-bold text-lg">Contact Us</h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#00E5FF] shrink-0 mt-0.5" />
              <span>Kathmandu, Nepal<br/>Tech Hub Building, Suite 402</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[#00E5FF] shrink-0" />
              <span>+977 1-4000000</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[#00E5FF] shrink-0" />
              <span>support@hamrophone.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="w-full border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Hamrophone. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
