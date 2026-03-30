"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 shadow-sm sticky top-0 bg-white z-50">
      <h1 className="text-2xl font-bold">MerchantHub</h1>

      <div className="hidden md:flex gap-6">
        <Link href="#features">Features</Link>
        <Link href="#about">About</Link>
        <Link href="#cta">Get Started</Link>
      </div>

      <button className="bg-black text-white px-4 py-2 rounded-xl">
        Login
      </button>
    </nav>
  );
}
