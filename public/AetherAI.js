
(function () {
  const scriptTag = document.currentScript;
  const USER_ID = scriptTag.getAttribute("data-business-id");
  const API_URL = "http://localhost:3000/api/chat"; // match backend origin

  if (!USER_ID) {
    console.error("Missing data-business-id");
    return;
  }

  // --- Styles ---
  const style = document.createElement("style");
  style.textContent = `
    #aether-chat-container { position: fixed; bottom: 20px; right: 20px; z-index:10000; font-family: 'Inter', sans-serif; }
    #aether-toggle-btn { width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7);color:white;border:none;cursor:pointer;font-size:28px;display:flex;align-items:center;justify-content:center;transition:all 0.3s; }
    #aether-toggle-btn:hover { transform: scale(1.1); }
    #aether-chat-box { position: absolute; bottom:80px; right:0; width:350px; max-width:90vw; height:500px; max-height:80vh; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-radius:20px; box-shadow:0 20px 50px rgba(0,0,0,0.2); display:flex; flex-direction: column; overflow:hidden; transform: translateY(20px) scale(0.95); opacity:0; transition: all 0.3s; }
    #aether-chat-box.open { transform: translateY(0) scale(1); opacity:1; }
    #aether-header { background: linear-gradient(135deg,#6366f1,#a855f7); padding:15px; color:white; display:flex; justify-content:space-between; align-items:center; border-top-left-radius:20px; border-top-right-radius:20px; }
    #aether-header-title { font-weight:600; font-size:16px; }
    #aether-close-btn { background:none;border:none;color:white;font-size:24px;cursor:pointer; }
    #aether-body { flex:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; }
    .aether-msg { max-width:80%; padding:10px 15px; border-radius:15px; font-size:14px; line-height:1.5; animation: fadeIn 0.3s ease; word-wrap: break-word; }
    .aether-msg-user { align-self:flex-end; background: linear-gradient(135deg,#6366f1,#a855f7); color:white; border-bottom-right-radius:4px; }
    .aether-msg-bot { align-self:flex-start; background:#f1f5f9; color:#334155; border-bottom-left-radius:4px; }
    @keyframes fadeIn { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform:translateY(0);} }
    #aether-input-container { padding:10px; border-top:1px solid #e2e8f0; display:flex; gap:10px;color:black; background:white; border-bottom-left-radius:20px; border-bottom-right-radius:20px; }
    #aether-input { flex:1; border:1px solid #e2e8f0; border-radius:12px; padding:10px; font-size:14px; outline:none; }
    #aether-input:focus { border-color:#6366f1; }
    #aether-send-btn { background:#6366f1;color:white;border:none;border-radius:12px;width:40px;height:40px;cursor:pointer; display:flex;align-items:center;justify-content:center; }
    #aether-send-btn:hover { background:#4f46e5; }
    #aether-send-btn:disabled { background:#cbd5e1; cursor:not-allowed; }
    #aether-typing { font-size:12px;color:#94a3b8;margin-left:5px;margin-bottom:5px; display:none; }
    .aether-dot { display:inline-block; width:4px; height:4px; background:#94a3b8; border-radius:50%; margin:0 1px; animation:bounce 1.4s infinite ease-in-out both; }
    .aether-dot:nth-child(1) { animation-delay:-0.32s; }
    .aether-dot:nth-child(2) { animation-delay:-0.16s; }
    @keyframes bounce { 0%,80%,100% { transform:scale(0);} 40% { transform:scale(1);} }
    @media(max-width:480px) { #aether-chat-box { width:90vw; height:70vh; bottom:70px; right:5%; } }
  `;
  document.head.appendChild(style);

  // --- HTML ---
  const container = document.createElement("div");
  container.id = "aether-chat-container";
  container.innerHTML = `
    <button id="aether-toggle-btn">💬</button>
    <div id="aether-chat-box">
      <div id="aether-header">
        <span id="aether-header-title">AetherAI Support</span>
        <button id="aether-close-btn">&times;</button>
      </div>
      <div id="aether-body">
        <div class="aether-msg aether-msg-bot">Hello! How can I assist you today?</div>
      </div>
      <div id="aether-typing">
        Aether is typing<span class="aether-dot"></span><span class="aether-dot"></span><span class="aether-dot"></span>
      </div>
      <div id="aether-input-container">
        <input id="aether-input" placeholder="Type your message..." autocomplete="off">
        <button id="aether-send-btn">➤</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // --- Elements ---
  const toggleBtn = document.getElementById("aether-toggle-btn");
  const closeBtn = document.getElementById("aether-close-btn");
  const chatBox = document.getElementById("aether-chat-box");
  const input = document.getElementById("aether-input");
  const sendBtn = document.getElementById("aether-send-btn");
  const chatBody = document.getElementById("aether-body");
  const typing = document.getElementById("aether-typing");

  // --- Toggle Chat ---
  const toggleChat = () => {
    if (!chatBox.classList.contains("open")) {
      chatBox.classList.add("open");
      toggleBtn.innerHTML = "🗙";
    } else {
      chatBox.classList.remove("open");
      toggleBtn.innerHTML = "💬";
    }
  };
  toggleBtn.onclick = toggleChat;
  closeBtn.onclick = toggleChat;

  // --- Add message ---
  const addMessage = (text, isUser=false) => {
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

      if (data.reply) addMessage(data.reply);
      else addMessage("Sorry, something went wrong.");

    } catch (err) {
      console.error("AetherAI Error:", err);
      typing.style.display = "none";
      sendBtn.disabled = false;
      addMessage("Failed to connect to support. Please try again later.");
    }
  };

  sendBtn.onclick = sendMessage;
  input.onkeypress = (e) => { if(e.key==="Enter") sendMessage(); };

})();
