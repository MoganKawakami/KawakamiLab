"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-black text-white px-8 py-6 flex justify-between items-center"
    >
      {/* 左側 */}
      <p className="text-lg font-semibold">Kawakami Lab.</p>

      {/* 右側 SNSアイコン */}
      <div className="flex space-x-4">
        <a
          href="https://www.youtube.com/@%E5%B7%9D%E7%A5%9E%E3%83%A2%E3%82%AC%E3%82%93"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/YouTube.png"
            alt="YouTube"
            width={24}
            height={24}
          />
        </a>
        <a
          href="https://x.com/Mogan_Kawakami"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/icons/logo-white.png" alt="X" width={24} height={24} />
        </a>
      </div>
    </motion.footer>
  );
}
