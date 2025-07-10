"use client";
import React from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import logo from '~/public/logo-moodscanr-white.png';


const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#3EB9E5] via-[#A759A3] to-[#F7A442]">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
         <Image src={logo} alt="MoodScanr Logo" width={300} height={120} className="w-32 md:w-40 mb-5" />
        <h1 className="text-2xl font-bold text-white mb-2">Sign in to MoodScanr</h1>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="cursor-pointer flex items-center gap-3 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-800 text-white font-semibold text-lg shadow transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="currentColor" className="text-white">
            <g>
              <path d="M31.67 8.87a3.97 3.97 0 0 0-2.8-2.81C26.13 5.33 16 5.33 16 5.33s-10.13 0-12.87.73a3.97 3.97 0 0 0-2.8 2.81C0.6 11.6 0.6 16 0.6 16s0 4.4.73 7.13a3.97 3.97 0 0 0 2.8 2.81c2.74.73 12.87.73 12.87.73s10.13 0 12.87-.73a3.97 3.97 0 0 0 2.8-2.81c.73-2.73.73-7.13.73-7.13s0-4.4-.73-7.13zM12.8 21.13V10.87L21.2 16l-8.4 5.13z"/>
            </g>
          </svg>
          Sign in with YouTube
        </button>
      </div>
    </div>
  );
};

export default SignInPage;