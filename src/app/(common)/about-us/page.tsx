import React from 'react';

const Page = () => {
  return (
    <section className="flex flex-col items-center min-h-[80vh] py-12 px-4 bg-white">
      <div className="max-w-3xl w-full p-8 ">
        <div className="flex items-center mb-4">
          <span className="text-3xl md:text-4xl mr-2" role="img" aria-label="lightbulb">💡</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-black">About Us</h1>
        </div>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold text-[#A759A3]">MoodScanr.ai</span> is wholly owned and operated by <span className="font-semibold text-[#3EB9E5]">Innovation Tek Limited</span>, a UK-based company dedicated to advancing technology in AI and digital transformation.
        </p>
        <p className="text-base text-gray-700 mb-4">
          With extensive experience in artificial intelligence and digital innovation, our mission is to empower content creators and businesses with actionable insights from their audience.
        </p>
        <p className="text-base text-gray-700 mb-4">
          At Innovation Tek, we’re passionate about leveraging AI to help you understand your viewers and drive meaningful growth on platforms like YouTube.
        </p>
        <div className="mt-8 flex items-center bg-gray-50 rounded-lg p-4 shadow-sm">
          <span className="text-2xl mr-3" role="img" aria-label="mail">📧</span>
          <div>
            <span className="font-medium text-gray-800">Contact Us: </span>
            <a
              href="mailto:info@moodscanr.ai"
              className="text-[#3EB9E5] font-medium hover:underline break-all"
            >
              info@moodscanr.ai
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;