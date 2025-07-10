import React from "react";
import Link from "next/link";

export const HowItWorksSection = () => {

  const howItWorks = [
    {
      icon: <svg width="30" height="30" fill="black" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
      title: "Connect to your YouTube account",
      description: "Connect to your YouTube account to get started.",
      iconPosition: "right"
    },
    {
      icon: <svg width="30" height="30" fill="black" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
      title: "Select a stream you would like to analyse",
      description: "Select a stream you would like to analyse.",
      iconPosition: "left"
    },
    {
      icon: <svg width="30" height="30" fill="black" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
      title: "Review livestream sentiment analysis in real-time",
      description: "Review livestream sentiment analysis in real-time.",
      iconPosition: "right"
    },
  ]

  return (
  <section className="w-full bg-white py-16 flex flex-col items-center text-center container mx-auto px-4">
    <h3 className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] bg-clip-text text-transparent">HOW IT WORKS</h3>
    <div className="flex flex-col gap-6 items-center max-w-2xl mx-auto mb-6">
      {howItWorks.map((item, index) => (
        <div key={index} className="flex md:flex-row flex-col items-center gap-3">
          <span className={`inline-flex items-center justify-center w-8 h-8 text-black ${item.iconPosition === "left" ? "md:order-1" : "md:order-2"}`}>
            {item.icon}
          </span>
          <span className={`ml-2 text-3xl font-light ${item.iconPosition === "left" ? "md:text-left md:order-2" : "md:text-right md:order-1"}`}>{item.title}</span>
        </div>
      ))}
      </div>
    <p className="font-bold text-2xl my-10 bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] bg-clip-text text-transparent">Instant feedback. Real emotions. Smarter content.</p>
    <p className="font-light text-2xl mb-10 text-black">Click below to connect your YouTube Channel</p>
    <Link href="/dashboard">
      <button className="px-10 py-2 border-2 border-white rounded-full text-white font-semibold shadow-md bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] hover:opacity-90 transition">Connect</button>
    </Link>
  </section>
  )
}
  