"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Cpu, Database, Battery, AlertTriangle, FileText, Camera, Loader2, CheckCircle, AlertCircle, X, ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import brandModelsData from "@/public/brand_models.json";

const BRANDS = Object.keys(brandModelsData);
type BrandName = keyof typeof brandModelsData;

const RAM_OPTIONS = ["4GB", "6GB", "8GB", "12GB", "16GB", "18GB", "24GB"];
const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const SCREEN_CONDITIONS = ["Perfect", "Minor Scratches", "Cracked"];

export default function SellPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [form, setForm] = useState({
    brand: BRANDS[0],
    phoneModel: brandModelsData[BRANDS[0] as BrandName][0] || "",
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
    
    // If brand changes, we must reset the phoneModel to the first available model for that new brand
    if (name === "brand") {
      const newModels = brandModelsData[value as BrandName] || [];
      setForm((prev) => ({ 
        ...prev, 
        brand: value, 
        phoneModel: newModels.length > 0 ? newModels[0] : "" 
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus({ type: "error", text: "Please select a valid image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setStatus({ type: "error", text: "Image is too large. Maximum size is 5MB." });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setForm((prev) => ({ ...prev, photo: data.url }));
    } catch (err: any) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setIsUploading(false);
    }
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
                    <select
                      name="phoneModel"
                      required
                      value={form.phoneModel}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 transition-all appearance-none cursor-pointer"
                    >
                      {form.brand && brandModelsData[form.brand as BrandName]
                        ? brandModelsData[form.brand as BrandName].map(model => (
                            <option key={model} value={model}>{model}</option>
                          ))
                        : <option value={form.phoneModel}>{form.phoneModel}</option>
                      }
                    </select>
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

                  {/* Image Upload Area */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-white/60">Device Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    
                    {form.photo ? (
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 group bg-black/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={form.photo} 
                          alt="Device preview" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, photo: "" }))}
                          className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 z-10 cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer bg-black/20"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin mb-2" />
                            <p className="text-sm font-medium text-white/70">Uploading image...</p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1 group-hover:bg-white/10 transition-colors">
                              <ImageIcon className="text-white/40" size={24} />
                            </div>
                            <p className="text-sm font-medium text-white/80">Click to upload photo</p>
                            <p className="text-xs text-white/40">PNG, JPG, WEBP up to 5MB</p>
                          </>
                        )}
                      </div>
                    )}
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
                  By submitting, you confirm that all details provided are accurate. Misleading information may lead to account suspension
                      and price   will be updated by our evaluation model.
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
    </div>
  );
}
