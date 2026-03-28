"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-between sm:px-12 px-6 py-4 border-b border-gray-700 w-full"
    >
      <h1 
        onClick={() => router.push("/")} 
        className="text-2xl font-bold cursor-pointer"
      >
        Aether<span className="text-gray-400">AI</span>
      </h1>

      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 px-3 py-1 border border-gray-400 rounded-md cursor-pointer font-semibold hover:bg-gray-800 transition"
          onClick={() => router.push("/embed")}
        >
          Embed
          <span className="font-bold text-gray-300">
            Aether<span className="text-gray-400">AI</span>
          </span>
        </button>
      </div>
    </motion.div>
  );
}
