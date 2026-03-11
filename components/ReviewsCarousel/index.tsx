"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Star } from "lucide-react";

// Mock Reviews Data
const REVIEWS = [
  {
    name: "Aaditya S.",
    role: "Verified Buyer",
    content: "Upgraded to an S23 Ultra seamlessly. The condition was exactly as described. Best marketplace in Nepal by far.",
    rating: 5,
  },
  {
    name: "Sneha R.",
    role: "Verified Seller",
    content: "Sold my old iPhone in just two days. The pricing was transparent and the pickup was completely hassle-free.",
    rating: 5,
  },
  {
    name: "Pratik K.",
    role: "Verified Buyer",
    content: "Was skeptical about buying second-hand, but Hamrophone completely changed my mind. The 30-day guarantee is real.",
    rating: 5,
  },
  {
    name: "Maya T.",
    role: "Verified Buyer",
    content: "Got a mint condition Pixel 7 Pro for way less than retail. Absolutely thrilled with the purchase and support.",
    rating: 4,
  },
  {
    name: "Rohan M.",
    role: "Verified Seller",
    content: "Incredibly fast transaction. Didn't have to bargain endlessly like on other platforms. Highly recommended.",
    rating: 5,
  }
];

// Duplicate for infinite carousel looping
const DUPED_REVIEWS = [...REVIEWS, ...REVIEWS, ...REVIEWS];

export default function ReviewsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for this section's enter/exit animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth scroll
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    mass: 0.1,
    restDelta: 0.0001
  });

  // Animations (Enter from bottom, exit through top)
  const opacity = useTransform(smoothScrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(smoothScrollYProgress, [0, 0.2, 0.8, 1], [150, 0, 0, -150]);
  const scale = useTransform(smoothScrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  return (
    <section 
      ref={containerRef}
      id="reviews" 
      className="relative w-full bg-zinc-950 py-16 flex flex-col items-center justify-center overflow-hidden border-t border-white/10 snap-start snap-always h-screen max-h-[1080px]"
    >
      <motion.div 
        style={{ opacity, y, scale }}
        className="w-full flex flex-col items-center gap-8 md:gap-12"
      >
        <div className="text-center px-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] mb-4">
            Loved by Thousands
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            Don't just take our word for it. Here is what our community of buyers and sellers have to say about their experience.
          </p>
        </div>

        {/* Carousel Track Container */}
        <div className="relative w-full overflow-hidden flex [mask-image:_linear-gradient(to_right,transparent_0,_black_200px,_black_calc(100%-200px),transparent_100%)]">
          <motion.div
            className="flex gap-6 items-center w-max py-8 px-4"
            animate={{
              x: [0, -2100], // Approximate width of one set of reviews to translate
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 35, // slow moving carousel
            }}
          >
            {DUPED_REVIEWS.map((review, i) => (
              <div 
                key={`review-${i}`}
                className="w-[350px] md:w-[400px] bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-xl shrink-0"
              >
                {/* Rating Stars */}
                <div className="flex gap-1 text-[#00E5FF]">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={18} 
                      className={idx < review.rating ? "fill-[#00E5FF]" : "fill-transparent text-white/20"} 
                    />
                  ))}
                </div>
                
                {/* Review Content */}
                <p className="text-white/80 leading-relaxed text-[15px] md:text-base italic">
                  "{review.content}"
                </p>
                
                {/* Author Info */}
                <div className="mt-auto pt-4 border-t border-white/10">
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-sm text-teal-400 font-medium">{review.role}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
