"use client";

import Link from "next/link";

export default function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="bg-black text-white px-8 py-4 flex justify-between items-center w-full">
      <div className="text-xl font-bold">
        <Link href="/">Kawakami Lab.</Link>
      </div>
      <nav className="space-x-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <button 
          onClick={() => scrollToSection('about')}
          className="hover:underline cursor-pointer bg-transparent border-none text-white"
        >
          About
        </button>
        <Link href="/gallery" className="hover:underline">
          Gallery
        </Link>
        <Link href="/news" className="hover:underline">
          News
        </Link>
      </nav>
    </header>
  );
}