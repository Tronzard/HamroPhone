"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Menu, X, LogOut } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Buy", href: "/buy" },
  { name: "Sell", href: "/sell" },
];

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Track scroll for background blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setAuthUser(data.user ?? null))
      .catch(() => setAuthUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-black/60 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF]">
              Hamrophone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!authLoading && (
              authUser ? (
                // Logged in: show profile icon + logout
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <User size={16} className="text-[#00E5FF]" />
                    <span className="text-sm text-white font-medium max-w-[120px] truncate">{authUser.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                // Not logged in: show Sign In + Browse Phones
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/buy"
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#001827] to-[#005f73] border border-[#00E5FF]/30 text-white text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
                  >
                    Browse Phones
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden relative z-10 p-2 text-white/80 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-semibold text-white/90 hover:text-white"
          >
            {link.name}
          </Link>
        ))}
        {authUser ? (
          <>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-semibold text-white/90 hover:text-white flex items-center gap-2"
            >
              <User size={24} className="text-[#00E5FF]" /> {authUser.name}
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="text-xl font-semibold text-red-400 hover:text-red-300 flex items-center gap-2"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-semibold text-white/90 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/buy"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 px-8 py-3 rounded-full bg-[#00E5FF] text-black font-semibold text-lg"
            >
              Browse Phones
            </Link>
          </>
        )}
      </motion.div>
    </>
  );
}
