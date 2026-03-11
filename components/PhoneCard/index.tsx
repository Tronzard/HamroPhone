"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Battery, HardDrive, MemoryStick, Calendar, Monitor, X, User as UserIcon, Phone as PhoneIcon } from "lucide-react";

export interface PhoneData {
  _id: string;
  brand: string;
  phoneModel: string;
  ram: string;
  storage: string;
  daysUsed: number;
  batteryHealth: number;
  screenCondition: "Perfect" | "Minor Scratches" | "Cracked";
  description: string;
  price: number;
  photo: string;
  sellerId?: {
    _id: string;
    name: string;
    phone: string;
  };
}

const conditionColors = {
  Perfect: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Minor Scratches": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Cracked: "bg-red-500/20 text-red-400 border-red-500/30",
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

interface PhoneCardProps {
  phone: PhoneData;
  index: number;
}

export default function PhoneCard({ phone, index }: PhoneCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.5,
          delay: index * 0.07, // staggered delay based on card index
          ease: [0.16, 1, 0.3, 1],
        }}
        className="group relative bg-zinc-900/60 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden hover:border-[#00E5FF]/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.05)] transition-all duration-300"
      >
        {/* Photo */}
        <div className="relative h-52 bg-zinc-800 overflow-hidden">
          {phone.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={phone.photo}
              alt={`${phone.brand} ${phone.phoneModel}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">No Image</div>
          )}
          {/* Brand badge */}
          <span className="absolute top-3 left-3 text-xs font-bold bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/10">
            {phone.brand}
          </span>
          {/* Screen condition badge */}
          <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full border ${conditionColors[phone.screenCondition]}`}>
            {phone.screenCondition}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-4">
          {/* Name */}
          <div>
            <h3 className="text-white font-bold text-lg leading-snug">{phone.phoneModel}</h3>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <MemoryStick size={13} className="text-[#00E5FF] shrink-0" />
              <span>{phone.ram} RAM</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <HardDrive size={13} className="text-[#00E5FF] shrink-0" />
              <span>{phone.storage}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Battery size={13} className="text-[#00E5FF] shrink-0" />
              <span>{phone.batteryHealth}% Battery</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Calendar size={13} className="text-[#00E5FF] shrink-0" />
              <span>{phone.daysUsed}d Used</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{phone.description}</p>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/8">
            <div>
              <span className="text-2xl font-extrabold text-white">
                Rs. {phone.price.toLocaleString()}
              </span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] text-sm font-semibold border border-[#00E5FF]/20 hover:bg-[#00E5FF]/20 transition-colors cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white/70 hover:text-white rounded-full transition-colors z-20 backdrop-blur-md border border-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row min-h-full">
                {/* Modal Image */}
                <div className="w-full md:w-2/5 h-64 md:h-auto bg-zinc-800 relative shrink-0">
                  {phone.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={phone.photo}
                      alt={`${phone.brand} ${phone.phoneModel}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                  )}
                  <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full border bg-black/50 backdrop-blur-md ${conditionColors[phone.screenCondition]}`}>
                    {phone.screenCondition}
                  </span>
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col gap-6">
                  <div>
                    <span className="text-[#00E5FF] text-sm font-bold uppercase tracking-wider">{phone.brand}</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">{phone.phoneModel}</h2>
                    <div className="text-3xl font-bold text-white mt-3">
                      Rs. {phone.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-white/40 text-xs mb-1">RAM</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <MemoryStick size={14} className="text-[#00E5FF]" /> {phone.ram}
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-white/40 text-xs mb-1">Storage</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <HardDrive size={14} className="text-[#00E5FF]" /> {phone.storage}
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-white/40 text-xs mb-1">Battery Health</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <Battery size={14} className="text-[#00E5FF]" /> {phone.batteryHealth}%
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-white/40 text-xs mb-1">Usage</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <Calendar size={14} className="text-[#00E5FF]" /> {phone.daysUsed} days
                      </div>
                    </div>
                  </div>

                  {phone.description && (
                    <div>
                      <h4 className="text-white/80 font-semibold mb-2 text-sm">Description</h4>
                      <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5">
                        {phone.description}
                      </p>
                    </div>
                  )}

                  {/* Seller Info */}
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <h4 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Seller Information</h4>
                    {phone.sellerId ? (
                      <div className="flex flex-col gap-3 bg-gradient-to-br from-[#00E5FF]/10 to-transparent p-5 rounded-2xl border border-[#00E5FF]/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
                              <UserIcon size={20} />
                            </div>
                            <div>
                              <div className="text-xs text-[#00E5FF] font-medium mb-0.5">Name</div>
                              <div className="text-white font-semibold">{phone.sellerId.name}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
                            <PhoneIcon size={20} />
                          </div>
                          <div>
                            <div className="text-xs text-[#00E5FF] font-medium mb-0.5">Phone Number</div>
                            <div className="text-white font-semibold">{phone.sellerId.phone}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-white/50 text-sm italic bg-white/5 p-4 rounded-xl border border-white/5">
                        Seller information is not available.
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
