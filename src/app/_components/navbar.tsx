"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "~/public/logo.png";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut } from "lucide-react";

export function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="border-b border-white/10 bg-white backdrop-blur-xl py-2">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold text-black hover:text-black/80 w-14"
        >
          <Image src={logo} alt="MoodScanr" width={80} height={80} />
        </Link>
        <div className="hidden md:flex md:gap-6">
          <Link
            href="/dashboard"
            className={`text-2xl font-extrabold transition-colors text-black font-bricolage`}
          >
            MoodScanr.AI
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-black hover:text-black/80 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              {/* Logout */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className=" text-md text-black hover:text-black/80 cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className={`border-3 shadow-lg border-white text-xl font-semibold  transition-colors bg-gradient-to-r from-[#3EB9E5] via-[#A759A3] to-[#F7A442] px-10 py-2 rounded-full text-white`}
            >
              Connect
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
