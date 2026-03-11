"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";

export default function HeroTextOverlays() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress to fix the CSS snap "jumping" effect
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    mass: 0.1,
    restDelta: 0.0001
  });

  // Top Left: Headline (Appears immediately, stays for a bit, then fades)
  const tlOpacity = useTransform(smoothScrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const tlY = useTransform(smoothScrollYProgress, [0, 0.25], [0, -50]);

  // Top Right: Subheadline (Fades in, stays visible longer = "pause", then fades out)
  const trOpacity = useTransform(smoothScrollYProgress, [0.2, 0.3, 0.5, 0.6], [0, 1, 1, 0]);
  const trY = useTransform(smoothScrollYProgress, [0.2, 0.3, 0.5, 0.6], [50, 0, 0, -50]);

  // Bottom Left: Microcopy (Fades in, stays visible longer = "pause", then fades out)
  const blOpacity = useTransform(smoothScrollYProgress, [0.5, 0.6, 0.8, 0.9], [0, 1, 1, 0]);
  const blY = useTransform(smoothScrollYProgress, [0.5, 0.6, 0.8, 0.9], [50, 0, 0, -50]);

  // Bottom Right: CTAs (Fades in at the end and stays visible)
  const brOpacity = useTransform(smoothScrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const brY = useTransform(smoothScrollYProgress, [0.8, 0.9, 1], [50, 0, 0]);

  return (
    <div ref={containerRef} className="absolute inset-0 h-[400vh] pointer-events-none z-30">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-8 md:p-16 lg:p-24 overflow-hidden">
        
        {/* TOP ROW */}
        <div className="flex justify-between items-start w-full">
          {/* Top Left: Headline */}
          <motion.div
            style={{ opacity: tlOpacity, y: tlY }}
            className="max-w-xl left-corner"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[1.1]">
              Hamrophone. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-teal-400">
                Find your next phone.
              </span>
            </h1>
          </motion.div>

          {/* Top Right: Subheadline */}
          <motion.div
            style={{ opacity: trOpacity, y: trY }}
            className="max-w-md text-right ml-auto"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90">
              Trusted marketplace · Verified sellers · Affordable flagship devices.
            </h2>
          </motion.div>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex justify-between items-end w-full pb-[10vh]">
          {/* Bottom Left: Microcopy */}
          <motion.div
            style={{ opacity: blOpacity, y: blY }}
            className="max-w-lg"
          >
            <p className="text-lg md:text-xl font-medium text-white/70 leading-relaxed border-l-2 border-[#00E5FF] pl-6 py-2">
              Discover a smarter way to buy and sell phones — reliable devices, transparent pricing, and effortless upgrades.
            </p>
          </motion.div>

          {/* Bottom Right: CTAs */}
          <motion.div
            style={{ opacity: brOpacity, y: brY }}
            className="flex flex-col sm:flex-row gap-4 items-end pointer-events-auto"
          >
            <Link
              href="/buy"
              className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#00E5FF] transition-all duration-300"
            >
              Browse Phones
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/sell"
              className="group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
            >
              <Smartphone className="opacity-70 group-hover:opacity-100 transition-opacity" />
              Sell Your Phone
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
