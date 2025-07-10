import Image from "next/image";
import React from "react";
import useCaseImage1 from "@/assets/use-case-image-1.png";
import useCaseImage2 from "@/assets/use-case-image-2.png";
import useCaseImage3 from "@/assets/use-case-image-3.png";

const useCases = [
  {
    title: "Monitor live sentiment during a product reveal to gauge real-time audience excitement and tweak their pitch accordingly.",
    description: "Instant feedback lets them react to what's landing - or what's not - increasing viewer retention and engagement.",
    img: useCaseImage1,
    imgPosition: "right"
  },
  {
    title: "Track live sentiment during brand-sponsored streams to spot issues early and respond quickly.",
    description: "Real-time alerts help you protect your brand and manage your community with confidence.",
    img: useCaseImage2,
    imgPosition: "left"
  },
  {
    title: "Review sentiment trends after your stream to pinpoint moments that sparked engagement or caused drop-offs.",
    description: "Use these insights to refine your content strategy and maximise future impact.",
    img: useCaseImage3,
    imgPosition: "right"
  },
];

export const UseCasesSection = () => (
  <section className="w-full bg-gradient-to-br from-[#3EB9E5] via-[#A759A3] to-[#F7A442] py-16 flex flex-col items-center ">
    <h3 className="text-5xl font-extrabold mb-10 text-white">USE CASES</h3>
    <div className="flex flex-col gap-10 w-full max-w-4xl container mx-auto px-4">
      {useCases.map((uc, i) => (
        <div key={i} className={`flex flex-col md:flex-row items-center bg-white/80 md:rounded-full rounded-2xl shadow-lg p-6 md:p-8 gap-6 md:gap-10`}>
          {/* Image circle */}
          <div className={`flex-1 text-left ${uc.imgPosition === "left" ? "md:text-right md:order-1" : "md:text-left md:order-2"}`}>
            <p className="font-semibold text-lg mb-2 text-black/90">{uc.title}</p>
            <p className="text-gray-700 text-base">{uc.description}</p>
          </div>
          <div className={`rounded-full overflow-hidden w-44 h-44 flex items-center justify-center bg-gray-200 ${uc.imgPosition === "left" ? "md:order-2" : "md:order-1 md:mr-10"}`}>
            <Image src={uc.img} alt="Use Case 1" width={200} height={200} className="rounded-full object-cover w-44 h-44" />
          </div>
        </div>
      ))}
    </div>
  </section>
); 