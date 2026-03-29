"use client";

import { motion } from "framer-motion";
import { useUser, useAuth , UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function Embed() {
  const router = useRouter();
  const { isSignedIn , isLoaded} = useUser();
  const { userId } = useAuth();
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

    useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return null;


  const embedCode = `<script
  src="${process.env.NEXT_PUBLIC_BASE_URL}/AetherAI.js"
  data-business-id="${userId}"
></script>`;

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0f;
          --bg-card: #0f0f18;
          --bg-elevated: #141420;
          --border: rgba(255,255,255,0.06);
          --border-accent: rgba(129,103,255,0.3);
          --text-primary: #f0eeff;
          --text-secondary: rgba(240,238,255,0.5);
          --text-muted: rgba(240,238,255,0.25);
          --accent: #8167ff;
          --accent-soft: rgba(129,103,255,0.12);
          --accent-glow: rgba(129,103,255,0.4);
          --teal: #2dd4bf;
          --teal-soft: rgba(45,212,191,0.1);
          --red: #ef4444;
          --yellow: #eab308;
          --green: #22c55e;
          --code-tag: #f472b6;
          --code-attr: #67e8f9;
          --code-val: #fcd34d;
        }

        body {
          background: var(--bg);
          font-family: 'Roboto Mono', monospace;
          color: var(--text-primary);
          min-height: 100vh;
        }

        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 600px; height: 600px;
          top: -200px; left: -200px;
          background: radial-gradient(circle, rgba(129,103,255,0.18) 0%, transparent 70%);
          animation: drift1 20s ease-in-out infinite alternate;
        }
        .orb-2 {
          width: 500px; height: 500px;
          bottom: -100px; right: -100px;
          background: radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%);
          animation: drift2 25s ease-in-out infinite alternate;
        }
        .orb-3 {
          width: 300px; height: 300px;
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(129,103,255,0.08) 0%, transparent 70%);
          animation: drift3 30s ease-in-out infinite alternate;
        }

        @keyframes drift1 { from { transform: translate(0,0); } to { transform: translate(60px, 40px); } }
        @keyframes drift2 { from { transform: translate(0,0); } to { transform: translate(-50px, -60px); } }
        @keyframes drift3 { from { transform: translate(-50%,-50%) scale(1); } to { transform: translate(-50%,-50%) scale(1.3); } }

        /* Noise texture overlay */
        .noise {
          position: fixed;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* Nav */
        nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
          background: rgba(10,10,15,0.6);
        }

        .logo {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .logo span {
          color: var(--accent);
        }
        .logo-dot {
          display: inline-block;
          width: 6px; height: 6px;
          background: var(--teal);
          border-radius: 50%;
          margin-left: 2px;
          vertical-align: super;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

        .nav-actions { display: flex; align-items: center; gap: 14px; }

        .nav-btn {
          font-family: 'Syne', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .nav-btn:hover {
          border-color: var(--border-accent);
          color: var(--text-primary);
          background: var(--accent-soft);
        }

        /* Main */
        main {
          flex: 1;
          position: relative;
          z-index: 1;
          max-width: 860px;
          width: 100%;
          margin: 0 auto;
          padding: 64px 48px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        /* Hero heading */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 16px;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: var(--teal);
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.05;
          color: var(--text-primary);
        }
        .hero-title .accent-word {
          background: linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          margin-top: 12px;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
          font-weight: 400;
          max-width: 480px;
        }

        /* Code block */
        .code-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .code-container {
          border-radius: 16px;
          border: 1px solid var(--border);
          overflow: hidden;
          background: #080810;
          box-shadow:
            0 0 0 1px rgba(129,103,255,0.05),
            0 24px 64px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.04);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .code-container:hover {
          border-color: rgba(129,103,255,0.2);
          box-shadow:
            0 0 0 1px rgba(129,103,255,0.08),
            0 24px 64px rgba(0,0,0,0.6),
            0 0 60px rgba(129,103,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .code-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
        }

        .code-dots { display: flex; gap: 7px; }
        .code-dot {
          width: 11px; height: 11px;
          border-radius: 50%;
        }

        .code-filename {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 1000;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .copy-btn.idle {
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: var(--text-secondary);
        }
        .copy-btn.idle:hover {
          border-color: var(--border-accent);
          background: var(--accent-soft);
          color: var(--text-primary);
        }
        .copy-btn.done {
          border-color: rgba(45,212,191,0.3);
          background: rgba(45,212,191,0.08);
          color: var(--teal);
        }

        .code-body {
          padding: 28px 32px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          line-height: 2;
          overflow-x: auto;
        }

        .t-tag { color: var(--code-tag); }
        .t-attr { color: var(--code-attr); }
        .t-val { color: var(--code-val); }
        .t-ind { color: rgba(255,255,255,0.15); user-select: none; }

        /* Steps grid */
        .steps-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 20px;
          padding-left: 2px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          nav { padding: 16px 20px; }
          main { padding: 40px 20px; gap: 40px; }
          .steps-grid { grid-template-columns: 1fr; }
          .code-body { padding: 20px; font-size: 0.76rem; }
        }

        .step-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          transition: all 0.3s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .step-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent-soft) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .step-card:hover {
          border-color: var(--border-accent);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(129,103,255,0.1);
        }
        .step-card:hover::before { opacity: 1; }

        .step-icon-wrap {
          position: relative;
          z-index: 1;
          flex-shrink: 0;
          width: 38px; height: 38px;
          border-radius: 10px;
          background: var(--accent-soft);
          border: 1px solid rgba(129,103,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: var(--accent);
        }

        .step-content { position: relative; z-index: 1; }
        .step-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .step-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .step-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-weight: 400;
        }

        /* Footer */
        footer {
          position: relative;
          z-index: 10;
          padding: 20px 48px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-logo {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-secondary);
        }
        .footer-logo span { color: var(--accent); }

        .footer-copy {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
        }

        @media (max-width: 640px) {
          footer { padding: 16px 20px; }
          .footer-copy { font-size: 0.6rem; }
        }

        /* Animated line */
        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), var(--teal), transparent);
          opacity: 0.3;
        }
      `}</style>

      <div className="page-wrapper" ref={containerRef}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="noise" />

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="logo">
            Aether<span>AI</span>
            <span className="logo-dot" />
          </div>
          <div className="nav-actions">
            {userId ? (
              <>
                <button className="nav-btn" onClick={() => router.push("/deshboard")}>
                  Dashboard
                </button>
                <UserButton
                  appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
                />
              </>
            ) : (
              <button className="nav-btn" onClick={() => router.push("/sign-in")}>Login</button>
            )}
          </div>
        </motion.nav>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
          className="divider-line"
        />

        {/* Main */}
        <main>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="hero-eyebrow">Integration Guide</div>
            <h2 className="hero-title">
              One snippet to<br />
              <span className="accent-word">rule them all.</span>
            </h2>
            <p className="hero-sub">
              Add Aether AI to any website in under a minute — no frameworks, no fuss. Just paste and go.
            </p>
          </motion.div>

          {/* Code block */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          >
            <p className="code-label">Your unique embed snippet</p>
            <div className="code-container">
              <div className="code-topbar">
                <div className="code-dots">
                  <div className="code-dot" style={{ background: "#ef4444" }} />
                  <div className="code-dot" style={{ background: "#eab308" }} />
                  <div className="code-dot" style={{ background: "#22c55e" }} />
                </div>
                <span className="code-filename">embed.html</span>
                <button
                  onClick={handleCopy}
                  className={`copy-btn ${copied ? "done" : "idle"}`}
                >
                  {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="code-body">
                <span className="t-tag">&lt;script</span><br />
                <span className="t-ind">{"  "}</span>
                <span className="t-attr">src</span>=<span className="t-val">
                  {`"${process.env.NEXT_PUBLIC_BASE_URL}/AetherAI.js"`}</span><br />
                <span className="t-ind">{"  "}</span>
                <span className="t-attr">data-business-id</span>=<span className="t-val">
                  {`"${userId}"`}
                </span><br />
                <span className="t-tag">&gt;&lt;/script&gt;</span>
              </div>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          >
            <p className="steps-label">How to use</p>
            <div className="steps-grid">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  className="step-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                >
                  <div className="step-icon-wrap">{s.icon}</div>
                  <div className="step-content">
                    <div className="step-num">{s.step}</div>
                    <div className="step-title">{s.title}</div>
                    <p className="step-desc">{s.desc}</p>
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
        >
          <div className="footer-logo">Aether<span>AI</span></div>
          <span className="footer-copy">© 2026 Aether AI. All rights reserved.</span>
        </motion.footer>
      </div>
    </>
  );
}