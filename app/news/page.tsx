"use client";

import { motion } from "framer-motion";

export default function News() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 text-center"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Coming Soon...
      </motion.h1>
    </div>
  );
}
