"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";

interface HeroCanvasProps {
  frameCount: number;
}

export default function HeroCanvas({ frameCount = 151 }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress to fix the CSS snap "jumping" effect
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 400, // high stiffness makes it track scroll very closely
    damping: 40,    // high damping prevents bouncing
    mass: 0.1,      // extremely light mass so it doesn't "linger" or drag at the end
    restDelta: 0.0001
  });

  // Load all images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Format paths exactly as in public/images
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/images/ezgif-frame-${paddedIndex}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [frameCount]);

  // Frame calculation using the smoothed progress
  const frameIndex = useTransform(smoothScrollYProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Setup canvas scaling for high DPI
      const parent = canvas.parentElement;
      if (parent) {
        const { clientWidth, clientHeight } = parent;
        const dpr = window.devicePixelRatio || 1;
        
        if (canvas.width !== clientWidth * dpr || canvas.height !== clientHeight * dpr) {
          canvas.width = clientWidth * dpr;
          canvas.height = clientHeight * dpr;
          canvas.style.width = `${clientWidth}px`;
          canvas.style.height = `${clientHeight}px`;
          ctx.scale(dpr, dpr);
        }

        // Draw current frame
        const currentIndex = Math.min(
          Math.max(0, Math.floor(frameIndex.get())),
          frameCount - 1
        );
        
        const currentImage = images[currentIndex];

        if (currentImage && currentImage.complete) {
          // Object cover logic (instead of contain) to ensure no black bars
          const imgRatio = currentImage.width / currentImage.height;
          const canvasRatio = clientWidth / clientHeight;

          let drawWidth = clientWidth;
          let drawHeight = clientHeight;
          let x = 0;
          let y = 0;

          if (imgRatio > canvasRatio) {
            // Image is wider than canvas, scale to height and crop width
            drawHeight = clientHeight;
            drawWidth = clientHeight * imgRatio;
            x = (clientWidth - drawWidth) / 2;
          } else {
            // Image is taller than canvas, scale to width and crop height
            drawWidth = clientWidth;
            drawHeight = clientWidth / imgRatio;
            y = (clientHeight - drawHeight) / 2;
          }

          // Clear background
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, clientWidth, clientHeight);
          
          // Draw image stretched/covered
          ctx.drawImage(currentImage, x, y, drawWidth, drawHeight);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [images, frameIndex, frameCount]);

  // Provide high quality first frame fallback if images not fully loaded but first frames are
  const isReady = imagesLoaded > 0;

  return (
    <div ref={containerRef} className="absolute inset-0 h-[500vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Subtle Tech Parallax Wave */}
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
          className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwRTVGRiIvPjwvc3ZnPg==')] bg-repeat"
        />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Hamrophone premium phone showcase sequence"
          className={`relative z-10 block w-full h-full transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Loading State Fallback */}
        {!isReady && (
          <div className="absolute inset-0 z-20 flex items-center justify-center text-[#00E5FF]">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-sm font-medium tracking-widest uppercase font-mono"
            >
              Loading Experience...
            </motion.div>
          </div>
        )}

        {/* Radial Gradient Overlay to blend edges */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-radial-vignette" />
      </div>
    </div>
  );
}
