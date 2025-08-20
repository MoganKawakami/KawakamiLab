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
  // レスポンシブ対応の画像幅設定
  const mobileImageWidth = 192; // w-48 (12rem = 192px)
  const tabletImageWidth = 256; // w-64 (16rem = 256px)
  const desktopImageWidth = 384; // w-96 (24rem = 384px)

  const totalImages = images.length * 2;

  // 各デバイスサイズでの総幅計算
  const mobileTotalWidth = mobileImageWidth * totalImages;
  const tabletTotalWidth = tabletImageWidth * totalImages;
  const desktopTotalWidth = desktopImageWidth * totalImages;

  return (
    <div
      className={`w-full max-w-sm sm:max-w-2xl lg:max-w-[1800px] h-48 sm:h-64 lg:h-96 mx-auto border-2 sm:border-4 border-black overflow-hidden relative ${className}`}
    >
      {/* 文字を画像の上に絶対配置 */}
      <div className="absolute left-3 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 z-10">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
          Kawakami <br /> Lab.
        </h2>
      </div>

      {/* 流れる画像部分 - モバイル用 */}
      <motion.div
        className="flex absolute h-full sm:hidden"
        animate={{ x: [0, -mobileTotalWidth / 2] }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
      >
        {[...images, ...images].map((src, idx) => (
          <div key={idx} className="relative w-48 h-full flex-shrink-0">
            <Image src={src} alt={`img-${idx}`} fill className="object-cover" />
          </div>
        ))}
      </motion.div>

      {/* 流れる画像部分 - タブレット用 */}
      <motion.div
        className="hidden sm:flex lg:hidden absolute h-full"
        animate={{ x: [0, -tabletTotalWidth / 2] }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
      >
        {[...images, ...images].map((src, idx) => (
          <div
            key={`tablet-${idx}`}
            className="relative w-64 h-full flex-shrink-0"
          >
            <Image src={src} alt={`img-${idx}`} fill className="object-cover" />
          </div>
        ))}
      </motion.div>

      {/* 流れる画像部分 - デスクトップ用 */}
      <motion.div
        className="hidden lg:flex absolute h-full"
        animate={{ x: [0, -desktopTotalWidth / 2] }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
      >
        {[...images, ...images].map((src, idx) => (
          <div
            key={`desktop-${idx}`}
            className="relative w-96 h-full flex-shrink-0"
          >
            <Image src={src} alt={`img-${idx}`} fill className="object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
