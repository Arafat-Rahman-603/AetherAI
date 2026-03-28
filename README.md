# 🤖 AetherAI — AI Support Bot Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
</p>

**AetherAI** is a full-stack SaaS platform that lets businesses deploy a customizable, AI-powered customer support chat widget on any website — with just one line of code. Powered by **Google Gemini 2.5 Flash**, businesses can configure their own knowledge base and have AetherAI answer customer questions on their behalf, 24/7.

---

## ✨ Features

- 🧠 **Gemini 2.5 Flash** powered intelligent responses
- 🔐 **Clerk Authentication** — secure sign-in/sign-up with social login support
- 🗄️ **MongoDB** — persistent storage for business configurations & knowledge bases
- 💬 **Embeddable Chat Widget** — drop one `<script>` tag into any website
- 📋 **Dashboard** — configure your business name, support email & AI knowledge base
- 🌐 **CORS-ready API** — widget works cross-origin on any third-party site
- 🔁 **Multi-key API fallback** — rotates through multiple Gemini API keys for high availability
- 🎨 **Modern UI** — dark-themed, glassmorphism design with smooth animations
- 📱 **Fully Responsive** — works on desktop and mobile

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Google Gemini API Key(s)](https://aistudio.google.com/apikey)
- [Clerk Account](https://clerk.com/) for authentication

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aether-ai.git
cd aether-ai/AetherAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the `AetherAI` folder:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aether-ai

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Google Gemini API Keys (add as many as you need for fallback)
GEMINI_API_KEY_NOOR=AIza...
GEMINI_API_KEY_603=AIza...
GEMINI_API_KEY_SRISTY=AIza...
GEMINI_API_KEY_306=AIza...
GEMINI_API_KEY_MD=AIza...
GEMINI_API_KEY_306_2=AIza...
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
AetherAI/
├── app/
│   ├── api/
│   │   ├── chat/          # POST /api/chat — AI chat endpoint
│   │   └── set/           # POST /api/set  — Business config endpoint
│   ├── deshboard/         # Dashboard page (configure your bot)
│   ├── embed/             # Embed instructions page
│   ├── sign-in/           # Clerk sign-in page
│   ├── layout.tsx         # Root layout with ClerkProvider & fonts
│   └── page.tsx           # Home / landing page
├── components/
│   ├── HomeUser.tsx       # Landing page component
│   ├── Deshboard.tsx      # Dashboard UI component
│   └── Embed.tsx          # Embed instructions component
├── models/
│   └── set.model.ts       # Mongoose schema for business config
├── lib/
│   └── db.ts              # MongoDB connection utility
├── public/
│   └── AetherAI.js        # 🌐 Embeddable chat widget script
├── .env                   # Environment variables (git-ignored)
└── package.json
```

---

## 🧩 How It Works

### 1. Business Onboarding (Dashboard)

After signing in, navigate to `/deshboard`. Fill in:
- **Business Name**
- **Support Email**
- **Knowledge Base** — the information your AI will use to answer customer questions

This data is saved to MongoDB via `POST /api/set`, keyed to your Clerk user ID.

### 2. Get Your Embed Snippet (Embed Page)

Go to `/embed` to get your personalized one-line script tag:

```html
<script src="https://your-domain.com/AetherAI.js" data-business-id="YOUR_CLERK_USER_ID"></script>
```

Paste this into the `<body>` of any website you want to add chat support to.

### 3. Chat Widget in Action

The `AetherAI.js` script auto-injects a floating chat button (bottom-right corner) on the host page. When a user sends a message:

1. The widget sends a `POST` request to `/api/chat` with the `userId` and `message`
2. The API fetches the business config from MongoDB
3. A prompt is constructed with business name, email, and knowledge base
4. **Gemini 2.5 Flash** generates a grounded, accurate reply
5. The response is streamed back and displayed in the chat widget

---

## 🔌 API Reference

### `POST /api/chat`

Send a user message and receive an AI response.

**Request Body:**
```json
{
  "userId": "user_clerk_id",
  "message": "What are your business hours?"
}
```

**Response:**
```json
{
  "reply": "Our business hours are Monday–Friday, 9am–5pm EST."
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Missing `userId` |
| `404` | Business config not found |
| `500` | Internal server error |

---

### `POST /api/set`

Save or update the business configuration.

**Request Body:**
```json
{
  "userId": "user_clerk_id",
  "business": "My Business Name",
  "email": "support@mybusiness.com",
  "data": "We sell premium coffee. Our returns policy is 30 days..."
}
```

---

## 🌐 Embed Widget (`AetherAI.js`)

The public embed script is a self-contained IIFE that:

- Reads `data-business-id` from the `<script>` tag
- Injects all CSS styles dynamically (no external dependencies)
- Renders a floating toggle button and a glassmorphism chat panel
- Communicates with your `/api/chat` endpoint with full CORS support
- Shows animated typing indicators while waiting for AI responses
- Is fully responsive for mobile and desktop screens

```html
<!-- Add anywhere in your website's <body> -->
<script
  src="https://your-domain.com/AetherAI.js"
  data-business-id="user_YOUR_CLERK_ID"
></script>
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **AI** | Google Gemini 2.5 Flash (`@google/genai`) |
| **Authentication** | Clerk |
| **Database** | MongoDB + Mongoose |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | React Icons |
| **Runtime** | Node.js |

---

## 🔒 Security & Reliability

- All API routes validate the `userId` before querying the database
- Gemini API calls rotate through **multiple API keys** automatically — if one key fails (rate limit, quota), the next is tried seamlessly
- CORS headers are set on all `/api/chat` responses to support cross-origin requests from embedded widgets
- Environment variables are never exposed to the client

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">Built with ❤️ by the AetherAI Team · Powered by <a href="https://deepmind.google/technologies/gemini/">Google Gemini</a></p>
