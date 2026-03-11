"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ShoppingBag, Trash2, Smartphone, Battery, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface UserListing {
  _id: string;
  brand: string;
  phoneModel: string;
  price: number;
  photo: string;
  batteryHealth: number;
  daysUsed: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Listings state
  const [listings, setListings] = useState<UserListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user data
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error("Error fetching user:", err))
      .finally(() => setLoading(false));

    // Fetch user listings
    fetch("/api/phones/my-listings")
      .then((r) => r.json())
      .then((data) => {
        if (data.listings) setListings(data.listings);
      })
      .catch((err) => console.error("Error fetching listings:", err))
      .finally(() => setListingsLoading(false));
  }, []);

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/phones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete listing");
      
      setListings((prev) => prev.filter((l) => l._id !== id));
      setMessage({ type: "success", text: "Listing deleted successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setDeletingId(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    setIsChanging(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setMessage({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsChanging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">You need to be signed in</h1>
        <a href="/login" className="px-6 py-2 bg-[#00E5FF] text-black font-semibold rounded-full hover:bg-[#00B8D4] transition-colors">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00E5FF]/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
              Your Profile
            </h1>
            <p className="text-white/50 text-lg">Manage your account settings and security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: User Info Card */}
            <div className="md:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-32">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-blue-600/20 border border-[#00E5FF]/30 flex items-center justify-center">
                    <User size={40} className="text-[#00E5FF]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-[#00E5FF] text-sm font-medium">Verified Member</p>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/30">Email Address</p>
                    <div className="flex items-center gap-3 text-white/80">
                      <Mail size={16} className="text-[#00E5FF]" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/30">Phone Number</p>
                    <div className="flex items-center gap-3 text-white/80">
                      <Phone size={16} className="text-[#00E5FF]" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings */}
            <div className="md:col-span-2 space-y-8">
              {/* Change Password Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Lock size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold">Change Password</h3>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Current Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/20 group-focus-within:text-[#00E5FF] transition-colors" />
                      </div>
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="block w-full pl-11 pr-12 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 focus:border-[#00E5FF]/40 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white"
                      >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">New Password</label>
                      <div className="relative group">
                        <input
                          type={showNew ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 focus:border-[#00E5FF]/40 transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white"
                        >
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Confirm New Password</label>
                      <div className="relative group">
                        <input
                          type={showConfirm ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 focus:border-[#00E5FF]/40 transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white"
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {message && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex items-start gap-2 p-4 rounded-2xl ${
                          message.type === "success" 
                            ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}
                      >
                        {message.type === "success" ? <CheckCircle size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isChanging}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] to-blue-500 text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChanging ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : "Update Password"}
                  </button>
                </form>
              </div>

              {/* Security Banner */}
              <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle size={24} className="text-[#00E5FF]" />
                </div>
                <div>
                  <h4 className="font-bold">Account Security</h4>
                  <p className="text-sm text-white/60">Your password should be strong and unique to protect your information and transactions.</p>
                </div>
              </div>

              {/* My Listings Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-[#00E5FF]" />
                  </div>
                  <h3 className="text-xl font-bold">My Listings</h3>
                </div>

                {listingsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
                    <p className="text-white/40 text-sm">Loading your listings...</p>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-12 px-6 border border-dashed border-white/10 rounded-2xl">
                    <Smartphone size={40} className="mx-auto text-white/10 mb-4" />
                    <p className="text-white/40 mb-6">You haven't listed any phones yet.</p>
                    <a href="/sell" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 transition-colors">
                      Start Selling
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.map((listing) => (
                      <motion.div
                        key={listing._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 hover:border-[#00E5FF]/30 transition-all"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl bg-zinc-800 shrink-0 overflow-hidden relative">
                            {listing.photo ? (
                              <img src={listing.photo} alt={listing.phoneModel} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Smartphone className="text-white/20" size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold truncate">{listing.brand} {listing.phoneModel}</h4>
                            <p className="text-[#00E5FF] font-bold">Rs. {listing.price.toLocaleString()}</p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-white/40 uppercase font-bold tracking-wider">
                              <span className="flex items-center gap-1"><Battery size={10} /> {listing.batteryHealth}%</span>
                              <span className="flex items-center gap-1"><Calendar size={10} /> {listing.daysUsed}d used</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          disabled={deletingId === listing._id}
                          className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 group-hover:border-red-500/40"
                        >
                          {deletingId === listing._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Delete Listing
                            </>
                          )}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
