import React from "react";
import Link from "next/link";

export const Footer = () => (
  <footer className="w-full bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] py-6 mt-8">
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-between px-4 gap-4">
      <div className="flex gap-8 text-white font-light text-lg w-full justify-around md:flex-row flex-col items-center">
        <Link href="/#pricing" className="hover:underline">Pricing</Link>
        <Link href="/terms-and-conditions" className="hover:underline">Terms and Conditions</Link>
        <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        <Link href="/contact-us" className="hover:underline">Contact Us</Link>
        <Link href="/about-us" className="hover:underline">About Us</Link>
      </div>
      <div className="text-white/50 text-lg font-light mt-2">@moodscanr.ai</div>
    </div>
  </footer>
); 