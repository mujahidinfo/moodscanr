import React from "react";
import Link from "next/link";

export const GetStartedSection = () => (
  <section className="w-full bg-white py-16 flex flex-col items-center justify-around text-center min-h-[50vh]">
    <h3 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] bg-clip-text text-transparent">GET STARTED</h3>
    <p className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] bg-clip-text text-transparent">Connect your channel and go live smarter</p>
    <Link href="/dashboard">
      <button className="border-2 border-white px-8 py-2 rounded-full text-white font-noprmal text-xl shadow-md bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] hover:opacity-90 transition">Connect now!</button>
    </Link>
  </section>
); 