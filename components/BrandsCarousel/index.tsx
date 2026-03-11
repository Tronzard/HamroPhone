"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BRANDS = [
  "Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Oppo", "Vivo", "Sony", "Asus", "Motorola"
];

// Duplicate the array to create a seamless infinite loop
const DUPED_BRANDS = [...BRANDS, ...BRANDS];

export default function BrandsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of THIS specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start end" means animation starts when the top of this section hits the bottom of the viewport
    // "start center" means it finishes entering when the top of this section hits the center of the viewport
    // "end start" means it's fully gone when the bottom of this section hits the top of the viewport
    offset: ["start end", "end start"],
  });

  // Fade IN when entering from below, Fade OUT when scrolling past it going up
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Slide UP when entering from below, slide UP slightly more when exiting top
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);
  
  // Also apply a slight vertical scale stretch when entering/exiting for dynamic feel
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  return (
    <section 
      ref={containerRef}
      id="brands" 
      className="relative w-full bg-zinc-950 py-32 flex flex-col items-center overflow-hidden border-t border-white/10 snap-start snap-always min-h-screen justify-center"
    >
      <motion.div 
        style={{ opacity, y, scale }}
        className="w-full flex flex-col items-center gap-16"
      >
        <div className="text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Brands We Trust
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            We only deal with authentic devices from the world's leading manufacturers. Every phone is verified.
          </p>
        </div>

        {/* Carousel Track Container */}
        <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <motion.div
            className="flex gap-16 items-center whitespace-nowrap min-w-max py-8"
            animate={{
              x: [0, -1035], // Approximate width of one set of BRANDS to translate
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20, // 20 seconds for one full loop
            }}
          >
            {DUPED_BRANDS.map((brand, i) => (
              <div 
                key={`${brand}-${i}`}
                className="text-4xl md:text-6xl font-black text-white/20 uppercase tracking-widest hover:text-white/80 transition-colors duration-300 cursor-default"
              >
                {brand}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
