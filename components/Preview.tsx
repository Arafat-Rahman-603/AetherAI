"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[10000] font-sans">
      
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl flex items-center justify-center shadow-lg hover:scale-110 transition"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat Box */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-[70px] right-0 w-[350px] max-w-[90vw] h-[500px] max-h-[80vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-4 flex justify-between items-center rounded-t-2xl">
              <span className="font-semibold text-sm">
                AetherAI Support
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              
              {/* Bot Message */}
              <div className="max-w-[80%] px-4 py-2 text-sm rounded-2xl bg-slate-100 text-slate-700 rounded-bl-sm">
                Hello! How can I assist you today?
              </div>

              {/* User Message (example UI only) */}
              <div className="max-w-[80%] px-4 py-2 text-sm rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white self-end rounded-br-sm">
                Hi there!
              </div>

            </div>

            {/* Typing Indicator */}
            <div className="px-4 pb-1 text-xs text-slate-400 flex items-center gap-1">
              Aether is typing
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-300"></span>
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2 bg-white rounded-b-2xl">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
              <button className="w-[40px] h-[40px] bg-indigo-500 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition">
                ➤
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}