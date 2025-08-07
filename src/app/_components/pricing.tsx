import React from "react";

export const PricingSection = () => {
  return (
    <section
      className="w-full py-20 px-4 bg-gradient-to-br from-white via-[#f7fafc] to-[#f3e8ff]"
      id="pricing"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] bg-clip-text text-transparent">
            Pricing
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed">
              MoodScanr is currently free to use while we're in early access.
              Our goal is to empower content creators with real-time audience
              insights — no paywalls, no gimmicks. Whether you're just starting
              out or already live-streaming to thousands, we're here to help you
              understand your viewers better and grow your community.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 transform hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3EB9E5] to-[#A759A3] text-white text-sm font-semibold rounded-full mb-6">
                  🚀 Early Access
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Free for Early Users
                </h3>

                <div className="text-6xl font-bold text-[#A759A3] mb-2">$0</div>

                <p className="text-gray-600 mb-8">
                  No credit card required • No hidden fees
                </p>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Real-time sentiment analysis
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Live chat monitoring</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Interactive dashboard</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Unlimited streams</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Priority support</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-[#3EB9E5] to-[#A759A3] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Get Started Free
                </button>

                <p className="text-sm text-gray-500 mt-4">
                  Join thousands of creators already using MoodScanr
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            💡 <span className="font-semibold">Coming Soon:</span> Premium
            features for power users
          </p>
        </div>
      </div>
    </section>
  );
}; 