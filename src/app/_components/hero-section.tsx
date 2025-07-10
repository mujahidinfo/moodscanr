import Image from "next/image";
import React from "react";
import logoWhite from '~/public/logo-moodscanr-white.png';
import outlineLogo from '~/public/outline-logo.png';

export const HeroSection = () => (
  <section className="w-full md:min-h-[750px] min-h-[300px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#3EB9E5] via-[#A759A3] to-[#F7A442] py-16 relative overflow-hidden">
    {/* Wave-like background pattern */}
    <div className="absolute -inset-5 md:inset-10 top-10 md:top-20 flex items-center justify-center">
      {/* Small wave */}
      <Image 
        src={outlineLogo} 
        alt="MoodScanr Logo" 
        width={900} 
        height={520} 
        className="absolute w-[100%] md:w-[60%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
      />
    </div>
    
    <div className="flex flex-col items-center md:gap-6 gap-2 z-10 relative">
      <div className="mb-4 flex justify-center">
        <Image src={logoWhite} alt="MoodScanr Logo" width={300} height={120} className="w-32 md:w-80" />
      </div>
      <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white drop-shadow-lg md:max-w-3xl px-4">
        Stream smarter with real-time sentiment from your YouTube audience
      </h2>
    </div>
  </section>
); 