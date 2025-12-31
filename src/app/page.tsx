"use client";

import { useState } from "react";
import { BaziResult, BaziFlowResult } from "@/types/bazi";
import BaziForm from "@/components/BaziForm";
import FourPillars from "@/components/FourPillars";
import ElementChart from "@/components/ElementChart";
import LuckPillars from "@/components/LuckPillars";
import AnalysisSection from "@/components/AnalysisSection";
import FlowSection from "@/components/FlowSection";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon, Activity, Info, Clock, Map } from "lucide-react";
import clsx from "clsx";

interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city: string;
  gender: string;
  timeStandard: string;
}

export default function Home() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [flowResult, setFlowResult] = useState<BaziFlowResult | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"natal" | "flow">("natal");

  const handleCalculate = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_ASTRO_API_KEY || ""
      };

      const payload = {
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
      };

      // Perform parallel fetches for Natal and Flow
      const [baziRes, flowRes] = await Promise.all([
        fetch("https://astro-api-1qnc.onrender.com/api/v1/chinese/bazi", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }),
        fetch("https://astro-api-1qnc.onrender.com/api/v1/chinese/bazi/flow", {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...payload,
            target_year: new Date().getFullYear(), // Default to current year for flow
          }),
        })
      ]);

      if (!baziRes.ok || !flowRes.ok) {
        throw new Error("Failed to calculate destiny and flow. Please check your inputs.");
      }

      const [baziJson, flowJson] = await Promise.all([
        baziRes.json(),
        flowRes.json()
      ]);

      setResult(baziJson);
      setFlowResult(flowJson);
      setBirthData({
        year: data.year,
        month: data.month,
        day: data.day,
        hour: data.hour,
        minute: data.minute,
        city: data.city,
        gender: data.gender,
        timeStandard: data.timeStandard
      });
      setActiveTab("natal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-void text-foreground selection:bg-clay/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-50 z-0 no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-clay/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-jade/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-jade mb-4"
          >
            <Sparkles className="w-3 h-3" /> Modern 2026 Engine
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-600">
            True <span className="text-clay">Bazi</span> Calculator
          </h1>
          <p className="text-spirit text-lg md:text-xl max-w-2xl mx-auto font-light">
            High-precision Chinese destiny engine with <span className="text-white">True Solar Time</span> and interactive life flow analysis.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="px-6 mb-16 relative z-20 no-print">
        <BaziForm onSubmit={handleCalculate} isLoading={loading} />
      </div>

      {/* Main Analysis Area */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-6 space-y-8 relative z-10"
          >
            {/* Tabs Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10 no-print">
              <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveTab("natal")}
                  className={clsx(
                    "px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                    activeTab === "natal" ? "bg-clay text-void shadow-lg shadow-clay/20" : "text-gray-400 hover:text-white"
                  )}
                >
                  <Moon className="w-4 h-4" /> Natal Chart
                </button>
                <button
                  onClick={() => setActiveTab("flow")}
                  className={clsx(
                    "px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                    activeTab === "flow" ? "bg-jade text-void shadow-lg shadow-jade/20" : "text-gray-400 hover:text-white"
                  )}
                >
                  <Activity className="w-4 h-4" /> Destiny Flow
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Clock className="w-4 h-4" /> Print Full Report
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 mb-8 max-w-md mx-auto">
                {error}
              </div>
            )}

            {/* Content Rendering */}
            {activeTab === "natal" ? (
              <div className="space-y-12">
                {/* 1. Four Pillars (Centerpiece) */}
                <section>
                  <FourPillars pillars={result.pillars} />
                </section>

                {/* 2. Charts Row */}
                <section className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ElementChart data={result.elements} />
                  </div>
                  <div className="glass-card rounded-2xl p-8 flex flex-col justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles className="w-20 h-20 text-clay" />
                    </div>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-8">
                      Day Master Energy
                    </h3>
                    <div className="space-y-6">
                      <div className="text-8xl font-serif text-white hover:scale-110 transition-transform cursor-default select-none">{result.day_master.stem}</div>
                      <div>
                        <div className="text-2xl font-bold text-clay mb-1">{result.day_master.info.name}</div>
                        <div className="text-xs text-spirit uppercase tracking-widest">{result.day_master.info.polarity} {result.day_master.info.element}</div>
                      </div>
                      <div className="pt-6 border-t border-white/5">
                        <p className="text-gray-400 text-sm italic leading-relaxed">
                          "{result.professional.interpretation.split('.')[0]}."
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Luck Pillars */}
                <section>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-6 px-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay" /> Luck Cycles
                  </h3>
                  <LuckPillars luck={result.luck_cycle} />
                </section>

                {/* 4. Deep Analysis */}
                <section>
                  <AnalysisSection result={result} />
                </section>

                {/* 5. Precise Technical Data (The Debug/Astro Info User Asked For) */}
                {result.astro_debug && (
                  <section className="pt-12 border-t border-white/5 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6 opacity-30">
                      <div className="h-px bg-white/20 flex-1" />
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                        <Info className="w-3 h-3" /> Technical Engine Specs
                      </div>
                      <div className="h-px bg-white/20 flex-1" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                      {/* Safe Date Formatter Helper */}
                      {(() => {
                        const formatDate = (dateStr: string | undefined, mode: "full" | "time") => {
                          if (!dateStr) return "--:--";
                          const d = new Date(dateStr.replace(" ", "T"));
                          if (isNaN(d.getTime())) return dateStr;
                          return mode === "full" ? d.toLocaleString() : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        };

                        return (
                          <>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 flex items-center gap-2"><Clock className="w-3 h-3" /> Input Local</span>
                              <span className="text-spirit font-mono">{formatDate(result.astro_debug!.input_local_time, "full")}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Effective Solar</span>
                              <span className="text-jade font-bold font-mono">{formatDate(result.astro_debug!.effective_solar_time, "time")}</span>
                            </div>
                          </>
                        );
                      })()}
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 flex items-center gap-2"><Map className="w-3 h-3" /> Time Method</span>
                        <span className="text-clay uppercase font-bold tracking-tight">
                          {result.astro_debug.time_standard?.replace(/_/g, " ").replace("true", "Precise") || "Standard"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 flex items-center gap-2"><Info className="w-3 h-3" /> Engine Status</span>
                        <span className="text-jade flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
                          SYNCCED ({result.summary.zodiac})
                        </span>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="space-y-12">
                {flowResult && birthData && (
                  <FlowSection initialFlow={flowResult} birthData={birthData} />
                )}
                {(!flowResult || !birthData) && (
                  <div className="text-center py-20 text-gray-500">Generating future flow cycles...</div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
