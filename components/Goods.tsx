"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GoodsProps {
  title: string;
  imageSrc: string;
  description: string;
}

export default function Goods({ title, imageSrc, description }: GoodsProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      {/* 画像とタイトルを縦に配置 */}
      <div
        className="cursor-pointer flex flex-col items-center"
        onClick={() => setShowDetail(true)}
      >
        <div className="w-64 h-64 relative">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <h3 className="text-xl font-bold mt-2 text-center">{title}</h3>
      </div>

      {/* 詳細モーダル */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg max-w-md w-full"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // モーダル内クリックは閉じない
            >
              <h3 className="text-2xl font-bold mb-4">{title}</h3>
              <Image
                src={imageSrc}
                alt={title}
                width={400}
                height={400}
                className="object-cover rounded-lg mb-4"
              />
              <p className="whitespace-pre-line">{description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
