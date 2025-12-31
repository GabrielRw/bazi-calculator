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
import { Sparkles, Moon, Activity, Info, Clock, Map, Bot, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

  const handleExtractToAI = () => {
    const fullData = {
      natal_chart: result,
      flow_data: flowResult,
      metadata: {
        generated_at: new Date().toISOString(),
        engine: "True Bazi Calculator v2026"
      }
    };

    const dmInfo = result?.day_master.info;
    const dmName = dmInfo?.pinyin || dmInfo?.name || "Day Master";

    const aiPrompt = `You are an expert BaZi (Four Pillars) analyst and a world-class technical writer.

Your job: generate a **complete, deeply explanatory BaZi report** from the **JSON input** provided below.  
The reader may be a beginner, but they want maximum value and “no stone unturned.”

## Core rules
1) **Use ONLY the data in the JSON.**  
   - If something is missing (e.g., no spouse palace interpretation), say what’s missing and what you *can still infer safely*.  
   - Never invent pillars, stems, branches, solar terms, or extra stars not present.
2) **Explain everything you mention.**  
   Every technical term must be defined the first time it appears (DM strength, structure, Ten Gods, NaYin, Xun Kong, 6-He, 6-Chong, Po, Hai harm, directional harmony, life stage, etc.).
3) **Be explicit and structured.**  
   Output must be organized with clear headings, subheadings, bullet points, and “so-what” summaries.
4) **Actionable value.**  
   For each major section, include:  
   - “How this can show up in real life”  
   - “What to lean into”  
   - “What to watch out for”  
   - “Practical suggestions” (habits, work styles, environments, timing)
5) **Tone:** insightful, grounded, non-fatalistic. No fear-mongering.

---

# OUTPUT FORMAT (must follow exactly)

## 0) Executive Snapshot (TL;DR)
- 8–12 bullets summarizing the chart: dominant elements, DM strength, structure, favorable/unfavorable elements, standout interactions/stars, and main life themes.
- Add a “Top 3 Levers” section: the 3 highest-impact recommendations.

## 1) Chart at a Glance (Raw Map)
Present a compact recap derived from JSON:
- Day Master (stem, element, polarity)
- Four Pillars (Year/Month/Day/Hour): gan-zhi, elements, Ten Gods (stem + hidden), NaYin, life stage
- Luck Cycle direction + start age and the list of 10-year pillars with dates

## 2) Day Master Deep Dive (${result?.day_master.stem} ${dmInfo?.polarity} ${dmInfo?.element})
Explain:
- The archetype of ${dmInfo?.polarity} ${dmInfo?.element} (${dmName}): strengths, blind spots, needs
- What “Strong DM” means in THIS chart (use professional.dm_strength and professional_debug to justify)
- The “balance objective”: what the chart needs more/less of, based on favorable/unfavorable elements

## 3) Five Elements Balance & Temperature
Use elements.points and elements.percentages:
- Dominant vs weak elements (Water, Wood, Metal, Earth, Fire)
- What the distribution implies about temperament, stress patterns, and decision style
- “Temperature” and dryness/wetness logic using only what’s inferable (e.g., strong Water + Metal support, low Fire)

## 4) Structure /格局 and Yong Shen Logic
Use professional.structure + yong_shen_candidates + rationale:
- Define “Structure” and what the detected structure means
- Explain why specific elements are candidates (drain/control logic)
- Translate this into practical life strategy (work modes, learning style, leadership style)

## 5) Ten Gods: Full Mapping & Meaning
For EACH pillar:
- List stem Ten God and hidden stems Ten Gods (from JSON)
- Explain what each Ten God means for a ${dmName} DM
- Interpret pillar-by-pillar: Year (social persona), Month (career/parents), Day (self/intimacy), Hour (legacy/drive)
- Then synthesize: which Ten Gods dominate, which are missing, and what that implies

## 6) Pillar-by-Pillar Interpretation (High Resolution)
Dedicated subsections for:
- Year pillar analysis
- Month pillar analysis
- Day pillar analysis (include spouse palace discussion using Day Branch only, without inventing spouse details)
- Hour pillar analysis
Include: NaYin meaning (as symbolic layer), life stage meanings, and how hidden stems modify the visible story.

## 7) Stars / Shen Sha (as given)
For each star in natal_chart.stars:
- Define the star (in plain language)
- Explain the trigger_rule and trigger_text as written
- Give balanced interpretations: gifts, risks, and constructive use
Do not add extra stars not listed.

## 8) Natal Interactions & Formations
For each interaction in natal_chart.interactions:
- Define the interaction type (Self Punishment, Harm, Directional Harmony)
- Explain which pillars are involved, and the likely life arenas affected
- Provide mitigation strategies and positive expressions
Also explain “partial vs full transform” and what it means when is_formed = true.

## 9) Xun Kong / Void Branches
Use natal_chart.xun_kong:
- Explain what void branches mean
- Interpret the void branches in a practical way
- Explain how voids might show up in timing (without adding new calculations)

## 10) Luck Cycles (10-Year Da Yun)
Using natal_chart.luck_cycle:
For EACH 10-year pillar:
- Ages + years
- What the Gan brings + what the Zhi brings (elemental + Ten God style inference relative to ${dmName}; keep it general)
- How this likely shifts the balance vs favorable/unfavorable elements
- A short “theme” + “best moves” + “watch-outs”
Do not claim certainty; frame as tendencies.

## 11) Current & Near-Term Timing Focus
Using flow_data for year 2025:
### 11.1 Annual Overview (2025 乙巳)
- Explain the annual pillar meaning relative to natal chart
- Use listed interactions (annual_overlay, luck_overlay) and stars to justify themes
### 11.2 Monthly Flow Breakdown (All months in JSON)
For each month object:
- Identify month gan-zhi
- List its interactions and stars
- Interpret what it favors/challenges (career, relationships, health, study, travel, money) with clear rationale
- Give 1–3 practical “do this” suggestions per month

## 12) Career, Money, Relationships, Health, Spiritual Growth
Create separate sections:
- Career & learning style (tie to structure + Ten Gods)
- Money & risk profile (wealth gods present in hidden stems, volatility markers)
- Relationships (include Widow Star, harms/clashes, self-punishment patterns)
- Health & nervous system themes (use element balance; avoid medical claims)
- Spiritual growth / meaning (frame as psychological growth)
Each section must include “Strengths / Pitfalls / Practices”.

## 13) Personalization Cheatsheet
- “If you’re this chart, you thrive when…”
- “You suffer when…”
- “Non-negotiables”
- “Best environments” (social + climate + work setting)
- “Fast alignment checklist” (10 bullets)

## 14) Data Quality & What’s Missing
Use natal_chart.metadata + astro_debug:
- Confirm time_standard, resolved_timezone, and that true solar time was used
- Mention engine version, rulesets
- List any missing data that would improve interpretation (e.g., spouse gender assumptions, dayun ten gods not provided, etc.)

## 15) Appendix
- Glossary of all terms used
- A compact table-like bullet list of pillars and key tags (no markdown tables required)

---

# INPUT JSON
Paste and analyze the following JSON exactly:

${JSON.stringify(fullData, null, 2)}

---

## Final constraint
The report must be long, detailed, and helpful — but never repetitive. Prefer depth over fluff.`;

    navigator.clipboard.writeText(aiPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCalculate = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const headers = {
        "Content-Type": "application/json"
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
        fetch("/api/bazi/natal", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }),
        fetch("/api/bazi/flow", {
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

              <button
                onClick={handleExtractToAI}
                className={clsx(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border",
                  copied
                    ? "bg-jade/20 text-jade border-jade/50"
                    : "text-spirit hover:text-white border-white/10 hover:bg-white/5"
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                {copied ? "Copied JSON!" : "Extract to AI"}
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
