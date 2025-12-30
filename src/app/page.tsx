"use client";

import { useState } from "react";
import { BaziResult } from "@/types/bazi";
import BaziForm from "@/components/BaziForm";
import FourPillars from "@/components/FourPillars";
import ElementChart from "@/components/ElementChart";
import LuckPillars from "@/components/LuckPillars";
import AnalysisSection from "@/components/AnalysisSection";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon } from "lucide-react";

export default function Home() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      // Use Render backend directly
      const response = await fetch("https://astro-api-1qnc.onrender.com/api/v1/chinese/bazi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "astro-community-key-2025"
        },
        body: JSON.stringify({
          year: data.year,
          month: data.month,
          day: data.day,
          hour: data.hour,
          minute: data.minute,
          city: data.city,
          sex: data.gender === "male" ? "M" : "F",
          time_standard: data.timeStandard,
          include_ten_gods: true,
          include_pinyin: true,
          include_stars: true,
          include_interactions: true,
          include_professional: true,
          include_debug: true
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate chart. Please check your inputs.");
      }

      const json = await response.json();
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-void text-foreground selection:bg-clay/30">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-6">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-clay/5 via-void to-void pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-jade mb-4"
          >
            <Sparkles className="w-3 h-3" /> Modern 2026 Engine
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500">
            Cosmic <span className="text-clay">Clay</span>
          </h1>
          <p className="text-spirit text-lg md:text-xl max-w-2xl mx-auto">
            Advanced BaZi calculator with True Solar Time precision and deep professional analysis.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="px-6 mb-20 relative z-20">
        <BaziForm onSubmit={handleCalculate} isLoading={loading} />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto mb-12 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-6 space-y-12"
          >
            {/* 1. Four Pillars (Centerpiece) */}
            <section>
              <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                <Moon className="w-6 h-6 text-clay" /> Natal Chart
              </h2>
              <FourPillars pillars={result.pillars} />
            </section>

            {/* 2. Charts Row */}
            <section className="grid md:grid-cols-2 gap-8">
              <ElementChart data={result.elements} />
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-center">
                <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-6">
                  Day Master Analysis
                </h3>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-serif text-white">{result.day_master.stem}</div>
                  <div className="text-xl font-bold text-clay">{result.day_master.info.name} ({result.day_master.info.element})</div>
                  <p className="text-gray-400 text-sm italic">
                    "{result.professional.interpretation.split('.')[0]}."
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Luck Pillars */}
            <section>
              <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-6 px-1">
                Luck Cycles (10-Year Pillars)
              </h3>
              <LuckPillars luck={result.luck_cycle} />
            </section>

            {/* 4. Deep Analysis */}
            <section>
              <AnalysisSection result={result} />
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
