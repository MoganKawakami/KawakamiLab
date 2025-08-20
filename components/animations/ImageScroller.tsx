"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  "/images/sample1.jpg",
  "/images/sample2.jpg",
  "/images/sample3.jpg",
  "/images/sample4.jpg",
];

interface ImageScrollerProps {
  className?: string; // ここで受け取れるように
}

export default function ImageScroller({ className }: ImageScrollerProps) {
  const imageWidth = 384; // w-96
  const totalImages = images.length * 2;
  const totalWidth = imageWidth * totalImages; // px単位
  return (
    <div
      className={`w-[1800px] h-96 mx-auto border-4 border-black overflow-hidden relative ${className}`}
    >
      {/* 文字を画像の上に絶対配置 */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10">
        <h2 className="text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
          Kawakami <br /> Lab.
        </h2>
      </div>

      {/* 流れる画像部分 */}
      <motion.div
        className="flex absolute h-full"
        animate={{ x: [0, -totalWidth / 2] }} // 半分だけ左に移動
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
      >
        {/* 画像を2セット並べて無限ループ風に */}
        {[...images, ...images].map((src, idx) => (
          <div key={idx} className="relative w-96 h-full flex-shrink-0">
            <Image src={src} alt={`img-${idx}`} fill className="object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
