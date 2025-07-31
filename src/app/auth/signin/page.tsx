"use client";
import React from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from "next/link";
import logo from "~/public/logo-moodscanr-white.png";

const SignInPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Glassmorphism card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <Image
                  src={logo}
                  alt="MoodScanr Logo"
                  width={200}
                  height={80}
                  className="w-40 h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-300 text-sm">
                Sign in to access your sentiment dashboard
              </p>
            </div>

            {/* Sign in button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full group relative overflow-hidden bg-white hover:from-red-700 hover:to-red-800 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-95"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

              <div className="relative flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="transition-transform duration-300 group-hover:rotate-12"
                >
                  <path
                    d="M23.498 12.275c0-.765-.07-1.528-.202-2.275H12v4.31h6.477c-.278 1.495-1.127 2.747-2.402 3.588v2.97h3.883c2.275-2.093 3.54-5.177 3.54-8.593z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 24c3.24 0 5.955-1.075 7.955-2.907l-3.883-2.97c-1.077.72-2.463 1.145-4.072 1.145-3.127 0-5.772-2.11-6.718-4.943H1.397v3.067C3.448 21.295 7.445 24 12 24z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.282 14.325c-.24-.72-.375-1.488-.375-2.325s.135-1.605.375-2.325V6.608H1.397C.51 8.378 0 10.125 0 12s.51 3.622 1.397 5.392l3.885-3.067z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.757c1.762 0 3.345.607 4.587 1.798l3.435-3.435C17.955 1.135 15.24 0 12 0 7.445 0 3.448 2.705 1.397 6.608l3.885 3.067C6.228 6.867 8.873 4.757 12 4.757z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-lg">Continue with Google</span>
              </div>
            </button>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="px-4 text-xs text-gray-400 font-medium">
                SECURE LOGIN
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {[
                { icon: "📊", text: "Real-time sentiment analysis" },
                { icon: "🎯", text: "YouTube live chat monitoring" },
                { icon: "🔒", text: "Secure OAuth authentication" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <Link
                href="/privacy-policy"
                className="hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/terms-and-conditions"
                className="hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Terms of Service
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;