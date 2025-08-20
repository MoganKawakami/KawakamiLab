"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Opening() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // 進捗バーの更新
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // 30msごとに1%加算（約3秒で100%）

    // 3.5秒後に消える
    const timer = setTimeout(() => setShow(false), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3 }}
    >
      {/* メインタイトル */}
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="text-4xl font-bold mb-6"
      >
        Welcome!
      </motion.h1>

      {/* 数値表示 */}
      <div className="text-2xl font-mono mb-4">{progress}%</div>

      {/* プログレスバー */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.03 }}
        />
      </div>
    </motion.div>
  );
}
