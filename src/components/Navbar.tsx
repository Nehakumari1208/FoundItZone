'use client'

import { useState } from "react";
import { Briefcase, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          FoundItZone
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/home"
            className="bg-black text-white font-semibold px-5 py-2 rounded-full shadow hover:bg-indigo-100 hover:text-black transition"
          >
            Home
          </Link>
          <Link
            href="/home/found"
            className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-full shadow hover:bg-indigo-100 transition"
          >
            Found Something?
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2 font-semibold rounded-full border-2 border-white hover:bg-purple-500"
          >
            <Briefcase className="w-5 h-5" />
            Manage Posts
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 ">
          <Link
            href="/home"
            className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full text-center shadow hover:bg-indigo-100 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/home/found"
            className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full text-center shadow hover:bg-indigo-100 transition"
            onClick={() => setMenuOpen(false)}
          >
            Found Something?
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-full bg-white border-2 text-indigo-700  border-white hover:bg-purple-500"
            onClick={() => setMenuOpen(false)}
          >
            <Briefcase className="w-5 h-5" />
            Manage Posts
          </Link>
          <div className="flex justify-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      )}
    </nav>
  );
}
