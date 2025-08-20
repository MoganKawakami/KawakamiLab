"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Opening() {
  const [progress, setProgress] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [hideWelcome, setHideWelcome] = useState(false);
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowImage(true); // 100%で画像を表示
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showImage) return;
    // プログレスバー完了から1秒後にWelcome!と黒い背景を消す
    const welcomeTimer = setTimeout(() => {
      setHideWelcome(true);
    }, 1000);

    // さらに1秒後に画像のフェードアウトを開始
    const fadeTimer = setTimeout(() => {
      setStartFadeOut(true);
    }, 2000);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(fadeTimer);
    };
  }, [showImage]);

  // フェードアウトアニメーション完了後にOpeningを非表示
  const handleExitComplete = () => {
    setDone(true);
  };

  if (done) return null;

  return (
    <>
      {/* 黒い背景とWelcome!とプログレスバー */}
      <AnimatePresence>
        {!hideWelcome && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome!
            </motion.h1>

            {/* プログレスバー */}
            {!showImage && (
              <div className="flex flex-col items-center">
                <div className="text-2xl font-mono mb-4 text-white">
                  {progress}%
                </div>
                <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.03 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 画像フェードイン・アウト */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {showImage && !startFadeOut && (
          <motion.img
            key="opening-image"
            src="/images/sample1.jpg"
            alt="Opening"
            className="fixed inset-0 z-50 w-full h-full object-cover"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
