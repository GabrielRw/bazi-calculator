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
    const dmName = dmInfo ? `${dmInfo.pinyin} ${dmInfo.polarity} ${dmInfo.element}` : "Day Master";
    const annualFlow = flowResult?.years[0];
    const targetYear = annualFlow?.year || 2025;
    const targetGanZhi = annualFlow?.gan_zhi || "乙巳";
    const targetAge = annualFlow?.age || "N/A";
    const activeLuck = annualFlow?.active_luck;

    const natalAiPrompt = `You are an expert BaZi (Four Pillars) analyst and a world-class premium reader. Your task is to generate a paid-user BaZi life reading from the JSON input below. This is not a certification-level report. It is a deep, personal, descriptive reading designed to help the reader understand themselves, their patterns, and how to work with them.

CORE NON-NEGOTIABLE RULES
1) Data integrity (absolute)
   Use ONLY what exists in the JSON. Never invent: pillars, stems, branches interactions, stars, transformations strength levels, favorable elements, timing. If something is missing, state it briefly and move on.
2) Human-first, analysis-second
   The report must feel like: “This is about me” Not: “This is how BaZi works”. Technical logic should be: Felt, not constantly explained. Explained only when it changes behavior or choices.
3) One core pattern, many expressions
   Identify the 2–3 dominant life drivers early. Do not repeatedly re-explain the same weakness/imbalance. Later sections should show how it manifests, not restate why it exists.
4) Minimal technical vocabulary
   Define a technical term once, in one short line. After that, use plain language. Avoid naming: scores transform levels internal engine mechanics unless placed in the Appendix.

MONTH HANDLING (CRITICAL)
The year has 12 normal calendar months. If the JSON uses non-standard indices (e.g. -1, 0, 10): Normalize internally to Month 1 → Month 12. Never mention indices. Never expose raw index logic to the reader. The reader must always experience time naturally.

STYLE REQUIREMENTS (PAID USER)
Warm, grounded, intelligent, non-fatalistic. Short paragraphs. No long lists unless emotionally useful. Frequent “So what does this mean for you?” moments. Avoid repeating the same advice with different wording. Think: Insightful guide, not academic lecturer.

REQUIRED OUTPUT STRUCTURE
0) Executive Portrait (1 page max)
   A vivid, human snapshot: Who this person fundamentally is. What stabilizes them. What destabilizes them. Their core life tension. Their biggest leverage point. No technical dumps.

1) Your Inner Engine (Core Self)
   Describe the Day Master archetype (${result?.day_master.stem} ${dmName}) as a lived personality: How they think. How they respond to stress. What gives them confidence. What drains them. Only mention strength/weakness once, clearly.

2) Energy & Balance (How life feels)
   Describe the elemental balance as lived experience: Mental pace. Emotional temperature. Motivation style. Stress response. Avoid theory. Use metaphor and sensation.

3) The Life Pattern (What keeps repeating)
   Explain the chart’s main structure (格局): What pattern keeps showing up in work, relationships, and decisions. How it matures over time. What happens when it’s respected vs ignored. No technical justifications unless essential.

4) The Four Pillars as Life Domains
   For each pillar: How it shows up in real life. What it gives. What it challenges.
   Day Pillar: Include spouse/relationship dynamic. No assumptions beyond the Day Branch.

5) Work, Money, Relationships, Health, Meaning
   Each section: Strength. Typical pitfall. One or two concrete practices. No repetition across sections.

6) Timing Focus (Current decade + ${targetYear} only)
   Describe the theme, not every interaction. What kind of decade this is. What ${targetYear} is asking for emotionally and practically. Which months feel supportive vs sensitive (use normalized months).

7) Personal Alignment Guide (High value)
   “When you are aligned, life looks like…” “When you are off-track, warning signs are…” 8–10 very practical alignment rules.

8) Optional Appendix (Clearly marked)
   Only here: Full interaction lists. Star definitions. Debug values. Technical mapping. Xun Kong mechanics. The main reading must stand alone without this.

FINAL INTENT
This reading should feel like: Recognition, Relief, Clarity, Practical orientation.
The reader should finish thinking: “This explains my life — and I know what to do next.”

Now generate the report using the JSON below:
${JSON.stringify(fullData, null, 2)}`;

    const flowAiPrompt = `You are an expert BaZi timing analyst (Da Yun + Liu Nian + Liu Yue) and a world-class technical writer.

Your job: generate a **high-value, deeply practical YEAR FLOW REPORT** for the specific year contained in the JSON \`flow_data.years[0]\`.

The reader wants maximum actionable value: what themes are likely, where the friction is, where the support is, and how to use each month intelligently.

## Core rules
1) **Use ONLY the data in the JSON.**
   - Do not invent missing months, stars, interactions, Ten Gods, or extra calculations.
   - If something is not present (e.g., no month start dates, no day-level flow), say so and work with what exists.
2) **Explain every technical term** the first time it appears:
   - annual pillar, monthly flow pillar, active luck pillar
   - 6-He, 6-Chong, Po (Break), Harm (Hai), Self-Punishment
   - Stem Combination/Clash, Directional Harmony (partial/full), Triple Harmony (partial/full), Half-3-Harmony
   - transform_to, transform_level, is_formed, mitigation, missing branch, transform_score
3) **Ground everything in the natal chart.**
   Always relate timing back to:
   - Day Master (${result?.day_master.stem} ${dmName})
   - element balance (dominant ${result?.elements.dominant}, weaker elements)
   - favorable/unfavorable elements (${result?.professional?.favorable_elements?.join('/') || 'N/A'} favorable, ${result?.professional?.unfavorable_elements?.join('/') || 'N/A'} unfavorable from professional)
4) **Non-fatalistic.** Describe tendencies + choices. No fear-mongering.
5) **Actionable outputs.**
   Every major section must include:
   - “How it can show up in real life”
   - “Best moves”
   - “Watch-outs”
   - “Practical suggestions” (planning, relationships, work, money, energy management)

---

# OUTPUT FORMAT (must follow exactly)

## 0) Year Dashboard (TL;DR)
- Year pillar (Gan-Zhi: ${targetGanZhi}) + age (${targetAge}) + active luck pillar (${activeLuck?.gan_zhi || 'N/A'} for ${activeLuck?.start_year}-${activeLuck?.end_year})
- 8–12 bullet summary of the whole year: biggest supportive forces, biggest conflicts, key repeating patterns
- “Top 3 Priorities” (the highest ROI strategies for this year)

## 1) Baseline Context (Natal + Luck Frame)
### 1.1 Natal anchors (from natal_chart)
- Day Master summary (${result?.day_master.stem} ${dmName})
- Element distribution (points + percentages)
- DM strength + structure + favorable/unfavorable elements (from \`professional\`)
- Natal stars + natal interactions that are likely to be “re-activated” in timing

### 1.2 The active 10-year luck pillar
- Identify active luck pillar: ${activeLuck?.gan_zhi || 'N/A'} (${activeLuck?.start_year} to ${activeLuck?.end_year})
- Explain, in general terms, how this luck pillar tends to color the year (elemental + “feel”)
- Keep it general: do not add unprovided Ten Gods for luck unless explicitly in JSON

## 2) The Annual Pillar Focus (Liu Nian)
Using \`flow_data.years[0].gan_zhi\` (${targetGanZhi}):
- Explain what the Heavenly Stem (gan) contributes and what the Earthly Branch (zhi) contributes (elemental & behavioral meaning)
- Compare annual element tendencies against favorable/unfavorable elements
- Summarize the “main storyline” of the year in 3–6 bullet themes

## 3) Year-Level Overlay Interactions & Stars (Big Levers)
Using \`flow_data.years[0].interactions\` and \`flow_data.years[0].stars\`:
For EACH interaction:
- Define the interaction type
- List involved pillars (hour/month/year/day/luck/annual)
- Explain what areas it most likely touches (self, career, relationships, money, travel, reputation)
- Note if it’s partial/full and what transform_to implies

For EACH star:
- Define it in plain language
- Explain how it tends to manifest during a year
- Give “best use” and “watch-out”

End this section with:
- “Top 5 Hotspots” (the most important overlays this year)
- “Stabilizers” (anything in the data that reduces volatility)

## 4) Month-by-Month Playbook (Liu Yue)
You MUST analyze EVERY month object in \`months\` (including index -1 if present).

For each month, output the following template:

### Month [index]: [gan_zhi] ([gan] / [zhi])
**A) What’s activated**
- List month interactions (with short plain-English meaning)
- List month stars

**B) Dominant pattern**
- Identify the strongest theme of the month (choose 1–2 only)
- Explain why using the interactions/stars (cite ids and transform_to)

**C) How it may show up**
- Career/work
- Money/risk
- Relationships/social
- Health/energy (non-medical, stress/pace framing)
- Learning/creativity/spiritual focus

**D) Best moves (1–5 bullets)**
**E) Watch-outs (1–5 bullets)**
**F) One practical “ritual”**
A simple weekly or daily practice aligned to the month’s pattern (planning habit, communication rule, declutter, training focus, etc.)

## 5) Repeating Patterns & Theme Clusters
Across all months, identify:
- Interactions that repeat (e.g., recurring Hai harm, recurring directional harmony, recurring stem combos)
- The 2–4 biggest “season arcs” (early/mid/late-year shifts) based strictly on the month data
- What to do differently in each arc

## 6) Tactical Strategy by Life Area (for THIS year)
Create separate sections:
- Career & execution (planning style for this year)
- Money & volatility management (budgeting, risk timing)
- Relationships & communication (how to prevent avoidable harm patterns)
- Health/energy management (sleep, pace, recovery, environment)
- Personal growth (meaning, discipline, emotional patterns)
Each must include: Strengths / Pitfalls / Practices

## 7) Timing Cheatsheet
- “Green-light months” (best months for launches, negotiations, travel, study, healing) — justify using month interactions/stars
- “Caution months” (more clash/harm/self-punishment) — justify using month interactions/stars
- A one-page style bullet summary that someone could screenshot and use

## 8) Data Quality & Limits
- Confirm year, gan_zhi, active luck, and that natal context is included
- List what’s missing that would make timing more precise (e.g., exact solar month start dates, daily flow, personal goals, location shifts)
- Do NOT blame the user; just state limitations clearly

---

# INPUT JSON
Paste and analyze the following JSON exactly:

${JSON.stringify(fullData, null, 2)}

---

## Final constraint
The report must be detailed, practical, and non-repetitive. Depth > fluff.`;

    const aiPrompt = activeTab === "flow" ? flowAiPrompt : natalAiPrompt;

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
                {copied ? "Copied! Paste into AI tool" : "Extract to AI"}
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
