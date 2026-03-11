"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import PhoneCard, { PhoneData } from "@/components/PhoneCard";
import { SlidersHorizontal, X } from "lucide-react";

const BRANDS = ["All", "Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Oppo", "Motorola", "Asus", "Sony"];
const CONDITIONS = ["All", "Perfect", "Minor Scratches", "Cracked"];

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-zinc-900/60 border border-white/8 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-zinc-800" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 w-2/3 bg-zinc-700 rounded" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-3 bg-zinc-700 rounded" />)}
        </div>
        <div className="h-3 bg-zinc-700 rounded w-full" />
        <div className="h-3 bg-zinc-700 rounded w-5/6" />
        <div className="flex justify-between pt-2 border-t border-white/8">
          <div className="h-7 w-28 bg-zinc-700 rounded" />
          <div className="h-8 w-24 bg-zinc-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function BuyPage() {
  const [phones, setPhones] = useState<PhoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [brand, setBrand] = useState("All");
  const [condition, setCondition] = useState("All");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [minBattery, setMinBattery] = useState(0);

  const fetchPhones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (brand !== "All") params.append("brand", brand);
      if (condition !== "All") params.append("screenCondition", condition);
      params.append("maxPrice", String(maxPrice));
      if (minBattery > 0) params.append("minBattery", String(minBattery));

      const res = await fetch(`/api/phones?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch phones");
      const data = await res.json();
      setPhones(data.phones);
    } catch (err) {
      setError("Could not load phones. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [brand, condition, maxPrice, minBattery]);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Page Header */}
      <div className="pt-28 pb-8 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF]">
              Browse Phones
            </h1>
            <p className="text-white/50 mt-2 text-base">
              {loading ? "Loading..." : `${phones.length} verified device${phones.length !== 1 ? "s" : ""} available`}
            </p>
          </div>
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium"
          >
            {showFilters ? <X size={16} /> : <SlidersHorizontal size={16} />}
            {showFilters ? "Close Filters" : "Filters"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-24 flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className={`lg:w-64 shrink-0 space-y-6 transition-all duration-300 ${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#00E5FF]" /> Filters
              </h2>
              <button
                onClick={() => { setBrand("All"); setCondition("All"); setMaxPrice(200000); setMinBattery(0); }}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                Reset all
              </button>
            </div>

            {/* Brand filter */}
            <div>
              <label className="text-xs text-white/50 font-semibold tracking-widest uppercase mb-3 block">Brand</label>
              <div className="flex flex-wrap gap-2">
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      brand === b
                        ? "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40"
                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Condition filter */}
            <div>
              <label className="text-xs text-white/50 font-semibold tracking-widest uppercase mb-3 block">Screen Condition</label>
              <div className="flex flex-col gap-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border text-left transition-colors ${
                      condition === c
                        ? "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/40"
                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="text-xs text-white/50 font-semibold tracking-widest uppercase mb-3 block">
                Max Price: <span className="text-[#00E5FF] normal-case font-bold">Rs. {maxPrice.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={10000}
                max={200000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#00E5FF]"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Rs. 10k</span>
                <span>Rs. 200k</span>
              </div>
            </div>

            {/* Min Battery Health */}
            <div>
              <label className="text-xs text-white/50 font-semibold tracking-widest uppercase mb-3 block">
                Min Battery Health: <span className="text-[#00E5FF] normal-case font-bold">{minBattery}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={minBattery}
                onChange={(e) => setMinBattery(Number(e.target.value))}
                className="w-full accent-[#00E5FF]"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Phone Grid */}
        <div className="flex-1">
          {error && (
            <div className="w-full py-16 text-center text-red-400 text-sm">{error}</div>
          )}

          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {loading
                ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
                : phones.length === 0
                ? (
                  <div className="col-span-full py-24 text-center text-white/30 text-lg">
                    No phones found matching your filters.
                  </div>
                )
                : phones.map((phone, i) => (
                  <PhoneCard key={phone._id} phone={phone} index={i} />
                ))
              }
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
