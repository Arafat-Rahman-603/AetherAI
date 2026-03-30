import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import {
  Geist,
  Geist_Mono,
  Roboto_Condensed,
  Roboto_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto_Condensed({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"], // only needed weights
});
export const metadata: Metadata = {
  title: "AetherAI",
  description: "AI Support Bot Powered by Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} ${roboto.variable} h-full antialiased bg-black text-white`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider afterSignOutUrl="/" signInFallbackRedirectUrl="/">
          {children}
          <Script
            src="https://aether-ai-support.vercel.app/AetherAI.js"
            data-business-id="user_3BWkRNn60s5gUB49tbr4h3o5lTv"
          />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
