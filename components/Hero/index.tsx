import React from "react";
import HeroCanvas from "./HeroCanvas";
import HeroTextOverlays from "./HeroTextOverlays";

export default function Hero() {
  return (
    <section className="relative w-full bg-black min-h-screen">
      {/* 
        The sticky canvas height is controlled inside HeroCanvas (e.g. h-[500vh]).
        The overlays scroll alongside over h-[400vh].
        The wrapper itself groups them. 
      */}
      <div className="relative w-full h-[500vh]">
        <HeroCanvas frameCount={151} />
        <HeroTextOverlays />
        
        {/* Invisible physical sections to create native CSS scroll snap points */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col pointer-events-none z-0">
          <div className="h-screen w-full snap-start snap-always" />
          <div className="h-screen w-full snap-start snap-always" />
          <div className="h-screen w-full snap-start snap-always" />
          <div className="h-screen w-full snap-start snap-always" />
          <div className="h-screen w-full snap-start snap-always" />
        </div>
      </div>
    </section>
  );
}
