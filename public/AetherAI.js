(function () {
  const scriptTag = document.currentScript;
  const USER_ID = scriptTag.getAttribute("data-business-id");
  const API_URL = "https://aether-ai-support.vercel.app/api/chat";

  if (!USER_ID) {
    console.error("Missing data-business-id");
    return;
  }

  // --- Google Fonts ---
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap";
  document.head.appendChild(fontLink);

  // --- Styles ---
  const style = document.createElement("style");
  style.textContent = `
    #aether-chat-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10000;
      font-family: 'DM Sans', sans-serif;
    }

    /* Toggle Button */
    #aether-toggle-btn {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      background: linear-gradient(145deg, #7c3aed, #4f46e5);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(99, 38, 237, 0.45);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #aether-toggle-btn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 12px 28px rgba(99, 38, 237, 0.55);
    }
    #aether-toggle-btn:active {
      transform: scale(0.96);
    }

    /* Chat Box */
    #aether-chat-box {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 360px;
      max-width: 92vw;
      height: 520px;
      max-height: 80vh;
      background: #0f0f13;
      border-radius: 24px;
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.07),
        0 24px 64px rgba(0,0,0,0.55),
        0 4px 16px rgba(99, 38, 237, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      animation: aetherOpen 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    #aether-chat-box.open {
      display: flex;
    }

    @keyframes aetherOpen {
      from { opacity: 0; transform: scale(0.88) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Header */
    #aether-header {
      padding: 16px 18px;
      background: linear-gradient(135deg, #1a1a2e, #16162a);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #aether-avatar {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: linear-gradient(145deg, #7c3aed, #4f46e5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(99, 38, 237, 0.4);
    }
    #aether-header-info { flex: 1; }
    #aether-header-title {
      font-weight: 600;
      font-size: 14px;
      color: #f1f5f9;
      letter-spacing: 0.01em;
    }
    #aether-header-status {
      font-size: 11px;
      color: #6ee7b7;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }
    #aether-header-status::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6ee7b7;
      box-shadow: 0 0 6px #6ee7b7;
    }
    #aether-close-btn {
      background: rgba(255,255,255,0.06);
      border: none;
      color: #94a3b8;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s;
      line-height: 1;
    }
    #aether-close-btn:hover {
      background: rgba(255,255,255,0.12);
      color: #f1f5f9;
    }

    /* Messages Body */
    #aether-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #0f0f13;
    }

    /* Custom Scrollbar */
    #aether-body::-webkit-scrollbar {
      width: 4px;
    }
    #aether-body::-webkit-scrollbar-track {
      background: transparent;
    }
    #aether-body::-webkit-scrollbar-thumb {
      background: rgba(124, 58, 237, 0.4);
      border-radius: 99px;
      transition: background 0.2s;
    }
    #aether-body::-webkit-scrollbar-thumb:hover {
      background: rgba(124, 58, 237, 0.75);
    }
    /* Firefox */
    #aether-body {
      scrollbar-width: thin;
      scrollbar-color: rgba(124, 58, 237, 0.4) transparent;
    }

    /* Messages */
    .aether-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      word-wrap: break-word;
      animation: aetherMsgIn 0.22s ease forwards;
    }
    @keyframes aetherMsgIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .aether-msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 14px rgba(99, 38, 237, 0.3);
    }
    .aether-msg-bot {
      align-self: flex-start;
      background: #1e1e2e;
      color: #cbd5e1;
      border: 1px solid rgba(255,255,255,0.06);
      border-bottom-left-radius: 4px;
    }

    /* Date Divider */
    .aether-divider {
      text-align: center;
      font-size: 11px;
      color: #475569;
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.04em;
      margin: 4px 0;
    }

    /* Typing Indicator */
    #aether-typing {
      padding: 0 16px 10px 16px;
      display: none;
      background: #0f0f13;
    }
    .aether-typing-bubble {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #1e1e2e;
      border: 1px solid rgba(255,255,255,0.06);
      padding: 9px 14px;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
    }
    .aether-dot {
      width: 5px;
      height: 5px;
      background: #7c3aed;
      border-radius: 50%;
      animation: aetherBounce 1.3s infinite ease-in-out both;
    }
    .aether-dot:nth-child(1) { animation-delay: -0.32s; }
    .aether-dot:nth-child(2) { animation-delay: -0.16s; }
    .aether-dot:nth-child(3) { animation-delay: 0s; }
    @keyframes aetherBounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* Input Area */
    #aether-input-container {
      padding: 12px 14px;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      gap: 10px;
      background: #16162a;
    }
    #aether-input {
      flex: 1;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 13.5px;
      font-family: 'DM Sans', sans-serif;
      color: #f1f5f9;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    #aether-input::placeholder { color: #475569; }
    #aether-input:focus {
      border-color: rgba(124, 58, 237, 0.6);
      background: rgba(255,255,255,0.09);
    }
    #aether-send-btn {
      background: linear-gradient(145deg, #7c3aed, #4f46e5);
      color: white;
      border: none;
      border-radius: 12px;
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(99, 38, 237, 0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s;
    }
    #aether-send-btn:hover {
      transform: scale(1.07);
      box-shadow: 0 6px 18px rgba(99, 38, 237, 0.5);
    }
    #aether-send-btn:active { transform: scale(0.94); }
    #aether-send-btn:disabled {
      background: #1e1e2e;
      box-shadow: none;
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Mobile */
    @media (max-width: 480px) {
      #aether-chat-box {
        width: 92vw;
        height: 72vh;
        bottom: 68px;
        right: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // --- HTML ---
  const container = document.createElement("div");
  container.id = "aether-chat-container";
  container.innerHTML = `
    <button id="aether-toggle-btn">💬</button>
    <div id="aether-chat-box">
      <div id="aether-header">
        <div id="aether-avatar">✦</div>
        <div id="aether-header-info">
          <div id="aether-header-title">Aether Support</div>
          <div id="aether-header-status">Online</div>
        </div>
        <button id="aether-close-btn">✕</button>
      </div>
      <div id="aether-body">
        <div class="aether-divider">Today</div>
        <div class="aether-msg aether-msg-bot">Hey there 👋 How can I help you today?</div>
      </div>
      <div id="aether-typing">
        <div class="aether-typing-bubble">
          <span class="aether-dot"></span>
          <span class="aether-dot"></span>
          <span class="aether-dot"></span>
        </div>
      </div>
      <div id="aether-input-container">
        <input id="aether-input" placeholder="Message Aether…" autocomplete="off">
        <button id="aether-send-btn">➤</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // --- Elements ---
  const toggleBtn = document.getElementById("aether-toggle-btn");
  const closeBtn  = document.getElementById("aether-close-btn");
  const chatBox   = document.getElementById("aether-chat-box");
  const input     = document.getElementById("aether-input");
  const sendBtn   = document.getElementById("aether-send-btn");
  const chatBody  = document.getElementById("aether-body");
  const typing    = document.getElementById("aether-typing");

  let isOpen = false;

  const openChat = () => {
    isOpen = true;
    chatBox.classList.add("open");
    toggleBtn.innerHTML = "✕";
    input.focus();
  };

  const closeChat = () => {
    isOpen = false;
    chatBox.classList.remove("open");
    toggleBtn.innerHTML = "💬";
  };

  toggleBtn.onclick = () => isOpen ? closeChat() : openChat();
  closeBtn.onclick  = closeChat;

  // --- Add message ---
  const addMessage = (text, isUser = false) => {
    const msg = document.createElement("div");
    msg.className = `aether-msg ${isUser ? "aether-msg-user" : "aether-msg-bot"}`;
    msg.innerText = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  // --- Send message ---
  const sendMessage = async () => {
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, true);
    input.value = "";
    input.focus();

    typing.style.display = "block";
    chatBody.scrollTop = chatBody.scrollHeight;
    sendBtn.disabled = true;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, message: msg }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();

      typing.style.display = "none";
      sendBtn.disabled = false;

      addMessage(data.reply || "Sorry, something went wrong.");
    } catch (err) {
      console.error("AetherAI Error:", err);
      typing.style.display = "none";
      sendBtn.disabled = false;
      addMessage("Failed to connect to support. Please try again later.");
    }
  };

  sendBtn.onclick = sendMessage;
  input.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };

})();