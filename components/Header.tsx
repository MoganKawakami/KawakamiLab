"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    // モバイルメニューを閉じる
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    // モバイルメニューを閉じる
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-black text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center w-full relative">
      {/* ロゴ */}
      <div className="text-lg sm:text-xl font-bold">
        <Link href="/" onClick={handleLinkClick}>
          Kawakami Lab.
        </Link>
      </div>

      {/* デスクトップナビゲーション */}
      <nav className="hidden md:flex space-x-4 lg:space-x-6">
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

      {/* ハンバーガーメニューボタン（モバイル・タブレット用） */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="メニューを開く"
      >
        <span className={`block w-5 h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-700 z-50">
          <nav className="flex flex-col py-4">
            <Link 
              href="/" 
              className="hover:bg-gray-800 px-4 sm:px-6 py-3 transition-colors"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <button 
              onClick={() => scrollToSection('about')}
              className="hover:bg-gray-800 px-4 sm:px-6 py-3 text-left cursor-pointer bg-transparent border-none text-white transition-colors"
            >
              About
            </button>
            <Link 
              href="/gallery" 
              className="hover:bg-gray-800 px-4 sm:px-6 py-3 transition-colors"
              onClick={handleLinkClick}
            >
              Gallery
            </Link>
            <Link 
              href="/news" 
              className="hover:bg-gray-800 px-4 sm:px-6 py-3 transition-colors"
              onClick={handleLinkClick}
            >
              News
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}