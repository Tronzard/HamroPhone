"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Cpu, Database, Battery, AlertTriangle, FileText, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Oppo", "Motorola", "Asus", "Sony"];
const RAM_OPTIONS = ["4GB", "6GB", "8GB", "12GB", "16GB", "18GB", "24GB"];
const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const SCREEN_CONDITIONS = ["Perfect", "Minor Scratches", "Cracked"];

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState({
    brand: "Apple",
    phoneModel: "",
    ram: "8GB",
    storage: "128GB",
    daysUsed: "",
    batteryHealth: "100",
    screenCondition: "Perfect",
    description: "",
    photo: "",
  });

  // Authentication check
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login?callbackUrl=/sell");
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/login?callbackUrl=/sell");
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/phones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create listing");
      }

      setStatus({ type: "success", text: "Listing created! Redirecting to your profile..." });
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err: any) {
      setStatus({ type: "error", text: err.message });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
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
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
              Sell Your Device
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Provide your phone details below. Our AI model will calculate the best market price for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Device Identity */}
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Smartphone className="text-[#00E5FF]" size={20} />
                    <h3 className="font-bold text-lg">Identity</h3>
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Brand</label>
                    <select
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all appearance-none cursor-pointer"
                    >
                      {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                    </select>
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Model Name</label>
                    <input
                      type="text"
                      name="phoneModel"
                      required
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={form.phoneModel}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* RAM */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">RAM</label>
                      <select
                        name="ram"
                        value={form.ram}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all cursor-pointer"
                      >
                        {RAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>

                    {/* Storage */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Storage</label>
                      <select
                        name="storage"
                        value={form.storage}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all cursor-pointer"
                      >
                        {STORAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Camera className="text-[#00E5FF]" size={20} />
                    <h3 className="font-bold text-lg">Visuals</h3>
                  </div>

                  {/* Photo URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Photo URL</label>
                    <input
                      type="url"
                      name="photo"
                      placeholder="https://example.com/phone.jpg"
                      value={form.photo}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Condition & Usage */}
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Battery className="text-[#00E5FF]" size={20} />
                    <h3 className="font-bold text-lg">Condition</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Days Used */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Days Used</label>
                      <input
                        type="number"
                        name="daysUsed"
                        required
                        min="0"
                        placeholder="0"
                        value={form.daysUsed}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all"
                      />
                    </div>

                    {/* Battery Health */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Battery Health %</label>
                      <input
                        type="number"
                        name="batteryHealth"
                        required
                        min="1"
                        max="100"
                        placeholder="100"
                        value={form.batteryHealth}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Screen Condition */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Screen Condition</label>
                    <div className="flex flex-col gap-2">
                      {SCREEN_CONDITIONS.map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, screenCondition: cond }))}
                          className={`px-4 py-3 rounded-2xl border text-sm font-medium text-left transition-all ${
                            form.screenCondition === cond
                              ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                              : "bg-black/40 border-white/10 text-white/60 hover:border-white/20"
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-[#00E5FF]" size={20} />
                    <h3 className="font-bold text-lg">Details</h3>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Description (Optional)</label>
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Tell buyers more about the device..."
                      value={form.description}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Area */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-start gap-4">
                <AlertTriangle className="text-blue-400 shrink-0 mt-1" size={20} />
                <p className="text-sm text-white/60 leading-relaxed">
                  By submitting, you confirm that all details provided are accurate. Misleading information may lead to account suspension. 
                  Price is currently set to <span className="text-white font-bold">Rs. 0</span> and will be updated by our evaluation model.
                </p>
              </div>

              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-2xl ${
                      status.type === "success" 
                        ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                  >
                    {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="font-medium">{status.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 rounded-3xl bg-gradient-to-r from-[#00E5FF] to-blue-500 text-black font-bold text-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Creating Listing...
                  </>
                ) : "Create Listing"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
