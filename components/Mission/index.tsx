"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Mission() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of THIS specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start animating when the top of the element hits the bottom of the viewport
    // Finish exiting when the bottom of the element hits the top of the viewport
    offset: ["start end", "end start"],
  });

  // Smooth out the scroll progress
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    mass: 0.1,
    restDelta: 0.0001
  });

  // Fade IN when entering from below, Fade OUT when scrolling past it going up
  const opacity = useTransform(smoothScrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Slide UP when entering from below, slide UP slightly more when exiting top
  const y = useTransform(smoothScrollYProgress, [0, 0.2, 0.8, 1], [150, 0, 0, -150]);
  
  // Subtle scaling effect for Card pop
  const scale = useTransform(smoothScrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  return (
    <section 
      ref={containerRef}
      id="mission" 
      className="relative w-full bg-black py-32 md:py-48 flex items-center justify-center overflow-hidden snap-start snap-always min-h-screen px-6 md:px-12"
    >
      {/* Background Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#00E5FF]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* The Elevate Card */}
      <motion.div 
        style={{ opacity, y, scale }}
        className="relative z-10 w-full max-w-5xl bg-zinc-900/50 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 md:p-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#00E5FF]/20 to-transparent opacity-50 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-400/20 to-transparent opacity-50 blur-2xl" />

        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center">
          
          {/* Text Content */}
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight leading-[1.1]">
              Our Mission:<br />
              <span className="text-[#00E5FF]">Democratizing Tech.</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#00E5FF] to-teal-400 rounded-full" />
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-medium">
              We believe that owning a flagship phone shouldn't require breaking the bank or sacrificing peace of mind. Hamrophone was built to create a trusted, transparent ecosystem where premium devices are given a second life.
            </p>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-medium">
              Every device is rigorously tested, securely verified, and affordably priced — so you can connect to what matters most, without compromise.
            </p>
          </div>

          {/* Stat/Visual block */}
          <div className="w-full md:w-[40%] flex flex-col gap-6">
            <div className="bg-black/40 border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
              <div className="text-5xl font-black text-white mb-2">100%</div>
              <div className="text-sm text-[#00E5FF] font-semibold tracking-widest uppercase">Verified Sellers</div>
            </div>
             <div className="bg-black/40 border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
              <div className="text-5xl font-black text-white mb-2">0</div>
              <div className="text-sm text-[#00E5FF] font-semibold tracking-widest uppercase">Hidden Fees</div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
