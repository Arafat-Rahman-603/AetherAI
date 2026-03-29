"use client";

import React, { useState } from "react";
import { motion } from "framer-motion"; // use framer-motion, not motion/react
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "./Navbar";

function Dashboard() {
  const userId = useUser().user?.id;
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");

  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/set", {
        userId,
        business: businessName,
        email: businessEmail,
        data: knowledgeBase,
      });
      
      setSave(true);
      setTimeout(() => {
        setSave(false);
        router.push("/embed");
      }, 2000);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // redirect if not signed in and load data
  React.useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`/api/set?userId=${userId}`);
        if (res.data.set) {
          setBusinessName(res.data.set.business || "");
          setBusinessEmail(res.data.set.email || "");
          setKnowledgeBase(res.data.set.data || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isSignedIn, router, userId]);

  return (
    <div className="relative h-screen bg-[#0f0f12] text-gray-300 font-mono">
      {/* Header */}
      <Navbar />
      {save && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 2 }}
          className="w-fit  bg-[#191922] p-2 rounded-md absolute top-20 right-10"
        >
          <p className="text-gray-400 text-xs ">
            Data saved successfully
          </p>
        </motion.div>
      )}

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="w-full h-[2px] bg-gray-800"
      />

      {/* Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="px-6 sm:px-12 py-6 pt-15"
      >
        <div className="w-full md:w-[80%] lg:w-[50%] xl:w-[40%] mx-auto bg-[#191922] p-6 rounded-xl shadow-lg space-y-3">
          <h2 className="text-3xl font-bold font-mono text-gray-200 leading-tight">
            AetherAI Config
          </h2>
          <p className="text-gray-400 leading-tight">
            Configure your AI Support Bot by giving information about your
            business.
          </p>

          {/* Form */}
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <h3 className="text-gray-200 leading-tight text-xl font-semibold">
              Business details
            </h3>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              placeholder="Business Name"
              className="border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-gray-400 transition bg-[#1b1b24] text-gray-200"
            />
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              required
              placeholder="Business Email"
              className="border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-gray-400 transition bg-[#1b1b24] text-gray-200"
            />
            <h3 className="text-gray-200 text-xl font-semibold leading-tight">
              Business knowledge base
            </h3>
            <p className="text-gray-400 text-xs leading-tight">
              Add FAQ, product details, policies, or any information you want
              the AI to know.
            </p>
            <textarea
              placeholder={`Example:
What is your return policy?
How long does shipping take?
Do you offer discounts?
What are your business hours?`}
              rows={6}
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-gray-400 transition bg-[#1b1b24] text-gray-200"
            />
            <motion.button
              disabled={loading}
              whileHover={{ scale: 1.05, backgroundColor: "#4b5563" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold px-4 py-2 rounded-md transition cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </form>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 2 }}
        className="w-full h-[2px] bg-[#191922] absolute top-0"
      ></motion.div>
      <footer className="sm:px-12 px-6 py-3 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between gap-2"
        >
          <h1 className="sm:text-2xl font-bold text-gray-300">
            Aether<span className="text-gray-400">AI</span>
          </h1>
          <p className="sm:text-sm text-[0.6rem] text-gray-400">
            © 2026 Aether AI. All rights reserved.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}

export default Dashboard;
