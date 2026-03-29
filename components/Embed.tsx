"use client";

import { motion } from "framer-motion";
import { useUser, useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function Embed() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { userId } = useAuth();
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return null;

  const embedCode = `<script\n  src="${process.env.NEXT_PUBLIC_BASE_URL}/AetherAI.js"\n  data-business-id="${userId}"\n></script>`;

  const handleCopy = async () => {
    try {
      if (!userId) throw new Error("User ID not loaded yet");
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Failed to copy. Please try again.");
    }
  };

  const steps = [
    {
      step: "01",
      title: "Copy the snippet",
      desc: "Click the copy button above to copy your unique embed script to your clipboard.",
      icon: "⌘",
    },
    {
      step: "02",
      title: "Open your website code",
      desc: "Navigate to your website's HTML file (e.g. index.html) in your code editor.",
      icon: "◈",
    },
    {
      step: "03",
      title: "Paste before </body>",
      desc: "Find the closing </body> tag and paste the script directly before it.",
      icon: "◎",
    },
    {
      step: "04",
      title: "Save & reload",
      desc: "Save your file, deploy your website, and reload the page to see the chatbot live.",
      icon: "◉",
    },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0a0f] text-[#f0eeff] font-mono">

      {/* Ambient orbs */}
      <div className="fixed -top-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none z-0 blur-[120px] bg-[radial-gradient(circle,rgba(129,103,255,0.18)_0%,transparent_70%)] animate-[drift1_20s_ease-in-out_infinite_alternate]" />
      <div className="fixed -bottom-24 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-[120px] bg-[radial-gradient(circle,rgba(45,212,191,0.12)_0%,transparent_70%)] animate-[drift2_25s_ease-in-out_infinite_alternate]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none z-0 blur-[120px] bg-[radial-gradient(circle,rgba(129,103,255,0.08)_0%,transparent_70%)]" />

      {/* Noise overlay */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none z-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between px-12 py-5 border-b border-white/[0.06] backdrop-blur-xl bg-[rgba(10,10,15,0.6)]"
      >
        <div className="text-[1.4rem] font-extrabold tracking-tight text-[#f0eeff]">
          Aether<span className="text-[#8167ff]">AI</span>
          <span className="inline-block w-1.5 h-1.5 bg-[#2dd4bf] rounded-full ml-0.5 align-super animate-[blink_2s_ease-in-out_infinite]" />
        </div>
        <div className="flex items-center gap-3.5">
          {userId ? (
            <>
              <button
                onClick={() => router.push("/deshboard")}
                className="text-xs font-semibold uppercase tracking-widest px-[18px] py-2 rounded-lg border border-white/[0.06] bg-[#141420] text-white/50 cursor-pointer transition-all duration-200 hover:border-[rgba(129,103,255,0.3)] hover:text-[#f0eeff] hover:bg-[rgba(129,103,255,0.12)]"
              >
                Dashboard
              </button>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
            </>
          ) : (
            <button
              onClick={() => router.push("/sign-in")}
              className="text-xs font-semibold uppercase tracking-widest px-[18px] py-2 rounded-lg border border-white/[0.06] bg-[#141420] text-white/50 cursor-pointer transition-all duration-200 hover:border-[rgba(129,103,255,0.3)] hover:text-[#f0eeff] hover:bg-[rgba(129,103,255,0.12)]"
            >
              Login
            </button>
          )}
        </div>
      </motion.nav>

      {/* Divider line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
        className="h-px bg-gradient-to-r from-transparent via-[#8167ff] to-[#2dd4bf] opacity-30"
      />

      {/* Main */}
      <main className="flex-1 relative z-[1] max-w-[860px] w-full mx-auto px-12 py-16 flex flex-col gap-14">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.12em] uppercase text-[#2dd4bf] mb-4 before:block before:w-6 before:h-px before:bg-[#2dd4bf]">
            Integration Guide
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.04em] leading-[1.05] text-[#f0eeff]">
            One snippet to<br />
            <span className="bg-gradient-to-br from-[#8167ff] to-[#2dd4bf] bg-clip-text text-transparent">
              rule them all.
            </span>
          </h2>
          <p className="mt-3 text-[0.95rem] text-white/50 leading-[1.7] font-normal max-w-[480px]">
            Add Aether AI to any website in under a minute — no frameworks, no fuss. Just paste and go.
          </p>
        </motion.div>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        >
          <p className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-white/25 mb-3">
            Your unique embed snippet
          </p>
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#080810] shadow-[0_0_0_1px_rgba(129,103,255,0.05),0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:border-[rgba(129,103,255,0.2)] hover:shadow-[0_0_0_1px_rgba(129,103,255,0.08),0_24px_64px_rgba(0,0,0,0.6),0_0_60px_rgba(129,103,255,0.05),inset_0_1px_0_rgba(255,255,255,0.04)]">

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04] bg-white/[0.02]">
              <div className="flex gap-[7px]">
                <div className="w-[11px] h-[11px] rounded-full bg-[#ef4444]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#eab308]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#22c55e]" />
              </div>
              <span className="text-[0.68rem] text-white/25 tracking-[0.05em]">embed.html</span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 z-[10000] cursor-pointer text-[0.72rem] font-bold cursor-pointer tracking-[0.04em] px-3.5 py-[7px] rounded-lg border transition-all duration-200 ${
                  copied
                    ? "border-[rgba(45,212,191,0.3)] bg-[rgba(45,212,191,0.08)] text-[#2dd4bf]"
                    : "border-white/10 bg-white/[0.04] text-white/50 hover:border-[rgba(129,103,255,0.3)] hover:bg-[rgba(129,103,255,0.12)] hover:text-[#f0eeff]"
                }`}
              >
                {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Code body */}
            <div className="px-8 py-7 text-[0.82rem] leading-[2] overflow-x-auto">
              <span className="text-[#f472b6]">&lt;script</span><br />
              <span className="text-white/15 select-none">{"  "}</span>
              <span className="text-[#67e8f9]">src</span>=<span className="text-[#fcd34d]">{`"${process.env.NEXT_PUBLIC_BASE_URL}/AetherAI.js"`}</span><br />
              <span className="text-white/15 select-none">{"  "}</span>
              <span className="text-[#67e8f9]">data-business-id</span>=<span className="text-[#fcd34d]">{`"${userId}"`}</span><br />
              <span className="text-[#f472b6]">&gt;&lt;/script&gt;</span>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        >
          <p className="text-[0.65rem] font-medium tracking-[0.14em] uppercase text-white/25 mb-5 pl-0.5">
            How to use
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                className="group relative bg-[#0f0f18] border border-white/[0.06] rounded-[14px] p-[22px] flex gap-4 items-start cursor-default overflow-hidden transition-all duration-300 hover:border-[rgba(129,103,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(129,103,255,0.1)]"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(129,103,255,0.12)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-[1] flex-shrink-0 w-[38px] h-[38px] rounded-[10px] bg-[rgba(129,103,255,0.12)] border border-[rgba(129,103,255,0.2)] flex items-center justify-center text-base text-[#8167ff]">
                  {s.icon}
                </div>
                <div className="relative z-[1]">
                  <div className="text-[0.62rem] font-medium text-[#8167ff] tracking-[0.1em] mb-1">{s.step}</div>
                  <div className="text-[0.88rem] font-bold text-[#f0eeff] mb-1.5 tracking-[-0.01em]">{s.title}</div>
                  <p className="text-[0.78rem] text-white/50 leading-[1.6] font-normal">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 px-12 py-5 border-t border-white/[0.06] flex items-center justify-between"
      >
        <div className="text-base font-extrabold tracking-tight text-white/50">
          Aether<span className="text-[#8167ff]">AI</span>
        </div>
        <span className="text-[0.72rem] text-white/25">© 2026 Aether AI. All rights reserved.</span>
      </motion.footer>

      {/* Keyframe styles */}
      <style>{`
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes drift1 { from { transform: translate(0,0); } to { transform: translate(60px, 40px); } }
        @keyframes drift2 { from { transform: translate(0,0); } to { transform: translate(-50px, -60px); } }
        @media (max-width: 640px) {
          nav { padding: 16px 20px !important; }
          main { padding: 40px 20px !important; }
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}