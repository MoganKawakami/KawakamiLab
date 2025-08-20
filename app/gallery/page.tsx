"use client";

import { motion } from "framer-motion";
import Goods from "@/components/Goods";

// ✅ データを分割して定義
const doujinshiData = [
  {
    title: "Future & Past",
    imageSrc: "/images/sample1.jpg",
    description:
      "題名: Futre & Past \n著者: 川上モガん.\n 出版日: 2025/08/17 \n 価格: 500円\n サイズ: B5",
  },
  {
    title: "同人誌サンプル2",
    imageSrc: "/images/sample2.jpg",
    description: "同人誌の詳細説明です。",
  },
  {
    title: "同人誌サンプル3",
    imageSrc: "/images/sample3.jpg",
    description: "同人誌の詳細説明です。",
  },
];

const goodsData = [
  {
    title: "グッズサンプル1",
    imageSrc: "/images/sample4.jpg",
    description: "グッズの詳細説明です。",
  },
  {
    title: "グッズサンプル2",
    imageSrc: "/images/sample1.jpg",
    description: "グッズの詳細説明です。",
  },
];

export default function Gallery() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 sm:gap-10 lg:gap-12">
      {/* 同人誌セクション */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">同人誌</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {doujinshiData.map((item, idx) => (
            <div key={idx} className="w-full">
              <Goods {...item} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* グッズセクション */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">グッズ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {goodsData.map((item, idx) => (
            <div key={idx} className="w-full">
              <Goods {...item} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
