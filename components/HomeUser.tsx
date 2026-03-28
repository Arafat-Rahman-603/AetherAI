"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { SiGooglemessages } from "react-icons/si";
import { useUser, UserButton } from "@clerk/nextjs";

function HomeUser() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  type Feature = {
  title: string;
  description: string;
  icon: string;
};

  const features: Feature[] = [
  {
    title: "Instant Support",
    description: "Answers customer questions in real-time, reducing wait time.",
    icon: "✔",
  },
  {
    title: "24/7 Availability",
    description: "Always online to assist customers anytime, anywhere.",
    icon: "✔",
  },
  {
    title: "Smart Automation",
    description: "Handles common queries and tasks efficiently without human input.",
    icon: "✔",
  },
];

  return (
    <div className="h-full w-full font-mono ">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="h-full w-full flex items-center justify-between sm:px-12 px-6 py-3"
      >
        <h1 className="text-2xl font-bold text-gray-300">
          Aether<span className="text-gray-400">AI</span>
        </h1>
        {isSignedIn ? (
          <div className="flex items-center gap-4">
           <h1
            className="cursor-pointer hover:text-gray-400 transition-all duration-300 border-2 border-gray-400 px-2 py-1 rounded-md"
            onClick={() => router.push("/deshboard")}
          >
            Deshboard
          </h1>
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: "w-18 h-18" } }}
          />
          </div>
        ) : (
          <h1
            className="cursor-pointer hover:text-gray-400 transition-all duration-300 border-2 border-gray-400 px-2 py-1 rounded-md"
            onClick={() => router.push("/sign-in")}
          >
            Login
          </h1>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3, delay: 1 }}
        className="w-full h-[2px] bg-[#191922]"
      ></motion.div>

      <section className="grid gap-6 sm:gap-0 sm:grid-cols-2 grid-cols-1 sm:px-12 px-6 py-3 pt-12 sm:pt-26">
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: [0, 0, 0.2, 0.5, 0.8, 1], y: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <h2 className="sm:text-[2.5rem] text-[1.9rem] leading-tight font-semibold pb-4">
            Aether AI – The Ultimate Customer Support Solution
          </h2>
          <p className="text-gray-400 text-sm">
            Aether AI delivers instant, 24/7 support, resolving customer queries
            quickly and smartly. Fast, reliable, and easy to integrate — your
            smartest support teammate.
          </p>
          <div className="flex pt-6 gap-4">
            <button className="cursor-pointer hover:text-gray-800 font-semibold transition-all duration-300 border-2 border-gray-400 px-2 py-1 rounded-md hover:border-white bg-white text-black">
              {isSignedIn ? "Go to Dashboard" : "Get Started"}
            </button>
            <button
              className="cursor-pointer hover:text-gray-400 transition-all duration-300 border-2 border-gray-400 px-2 py-1 rounded-md hover:border-white"
              onClick={() => setOpen(!open)}
            >
              Learn More
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.2, 0.5, 1], scale: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="sm:w-[80%] h-fit flex flex-col bg-[#191922] rounded-lg py-2 pb-6 px-4 self-center justify-self-end relative"
        >
          <p className="text-gray-300">Live Chat Preview</p>
          <div className="w-full h-full flex flex-col rounded-lg gap-4 mt-3">
            <p className="p-2 rounded-lg bg-gray-700 w-max-[75%] self-end">
              What’s the delivery time?
            </p>
            <p className="p-2 bg-gray-200 text-black rounded-lg w-[75%] self-start">
              Most orders are delivered within 2–5 business days. You’ll get a
              tracking link once your order ships!
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: [1, 0.5, 1, 0.5], y: [0, -10, 0, -10, 0] }}
            transition={{
              duration: 4,
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              repeatDelay: 1,
            }}
            className="text-4xl absolute bottom-[-8%] right-3"
          >
            <SiGooglemessages />
          </motion.div>
        </motion.div>
      </section>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Blurred Background */}
          <div
            className="absolute sm:inset-10 sm:backdrop-blur-sm"
            onClick={() => setOpen(false)}
          ></div>

          {/* Centered Modal */}
          <div className="relative bg-gray-900 text-white rounded-xl shadow-2xl sm:w-[75%] w- [90%] p-6 z-10">
            {/* Header */}
            <div className="text-center sm:mb-4 mb-2">
              <h2 className="sm:text-2xl text-2xl font-bold text-indigo-400 mb-1">
                Aether AI
              </h2>
              <p className="text-gray-400 sm:text-sm text-xs">
                Your Smart 24/7 Support Assistant
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-300 sm:text-sm text-[0.6rem] leading-relaxed mb-4">
              Aether AI delivers instant, 24/7 support, resolving customer
              queries quickly and smartly. Fast, reliable, and easy to integrate
              — your smartest support teammate.
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 mt-1">✔</span>
                <span>
                  <strong>Instant Support:</strong> Answers customer questions
                  in real-time, reducing wait time.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 mt-1">✔</span>
                <span>
                  <strong>24/7 Availability:</strong> Always online to assist
                  customers anytime, anywhere.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 mt-1">✔</span>
                <span>
                  <strong>Smart Routing:</strong> Handles queries intelligently
                  or escalates to human agents when needed.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 mt-1">✔</span>
                <span>
                  <strong>Multi-Language Support:</strong> Communicates fluently
                  in multiple languages for global reach.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-400 mt-1">✔</span>
                <span>
                  <strong>Easy Integration:</strong> Seamlessly integrates with
                  your existing website or app.
                </span>
              </li>
            </ul>

            {/* Close Button */}
            <div className="flex justify-center">
              <button
                className="px-4 py-2 border cursor-pointer border-indigo-400 rounded-lg text-indigo-400 hover:bg-indigo-400 hover:text-gray-900 transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <section className="sm:px-12 px-6 py-3 pt-30">
        <motion.h1 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: false }} 
        transition={{ delay: 0.2 }} className="text-2xl font-bold text-gray-300 text-center">Powerful Features, Smarter Support</motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: index * 0.2 }}
          className="bg-[#191922] p-6 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300"
        >
          <div className="text-indigo-400 text-3xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-400 text-sm">{feature.description}</p>
        </motion.div>
      ))}
    </div>
      </section>
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 2 }}
        className="w-full h-[2px] bg-[#191922] mt-30"
      ></motion.div>
      <footer className="sm:px-12 px-6 py-3">
        <motion.div
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: false }} 
        transition={{ delay: 0.2 }}
         className="flex items-center justify-between">
          <h1 className="sm:text-2xl font-bold text-gray-300">Aether<span className="text-gray-400">AI</span></h1>
          <p className="sm:text-sm text-[0.6rem] text-gray-400">© 2026 Aether AI. All rights reserved.</p>
        </motion.div>
      </footer>
    </div>
  );
}

export default HomeUser;
