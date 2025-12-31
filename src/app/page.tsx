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

    const natalAiPrompt = `You are an expert BaZi (Four Pillars) analyst and a world-class technical writer.

Your job: generate a paid-user BaZi report from the JSON input below.

This is a premium reading: it must feel clear, personal, and actionable first — and technical second.
The reader is interested in BaZi, but they are not trying to earn a certification.

========================
CORE HARD RULES
========================
1) Use ONLY the data in the JSON.
   - Never invent pillars, stems, branches, solar terms, hidden stems, Ten Gods, stars, interactions, or dates.
   - If something is missing, state it clearly and explain what you can still infer safely.

2) Make the report high-signal, not encyclopedic.
   - Do NOT treat every item as equal weight.
   - Highlight the 2–4 most important drivers, and treat the rest as supporting modifiers.

3) Explain terms, but do it efficiently.
   - Define a technical term only once, in a short “micro-definition” (1–2 lines).
   - After that, use plain language.
   - Avoid repeating definitions.

4) Always translate to lived experience.
   For every major claim include:
   - “How this shows up in real life”
   - “What to lean into”
   - “What to watch out for”
   - “Practical suggestions”

5) Tone: grounded, insightful, non-fatalistic.
   - No fear-mongering.
   - Frame as tendencies, not certainties.
   - Use warm, premium-client language.

========================
STYLE REQUIREMENTS (PAID USER)
========================
- Prioritize readability:
  - Short paragraphs, bullets, clear headers.
  - Use “So what?” summaries frequently.
- Avoid excessive numerics/debug:
  - You may reference DM strength and balance logic, but do NOT include raw debug scores unless placed in the Deep Dive appendix.
- Do not dump long lists:
  - Interactions and stars must be summarized first, then optionally expanded in the appendix.

========================
OUTPUT FORMAT (MUST FOLLOW EXACTLY)
========================

## 1) Your Core Engine (Who you are)
### 1.1 Day Master Archetype (${result?.day_master.stem} ${dmName})
- Explain the DM archetype in human terms.
- Show how weak/strong DM matters *in daily life* using professional.dm_strength (but keep it readable).
- “So what?” summary.

### 1.2 Element Balance & Temperature (high value, simple)
- Use elements.percentages and dominant.
- Explain: dominant vs missing elements and what that does to energy, focus, stress, and motivation.
- Keep it intuitive (avoid over-technical climate theory).

## 2) The Chart’s Main Life Pattern (Structure + Yong Shen)
- Define Structure (格局) in 2 lines, then explain the detected structure (professional.structure).
- Explain Yong Shen candidates + favorable/unfavorable elements in plain logic:
  - “Your chart works best when you add X and reduce Y.”
- Translate into strategy:
  - best work style, learning style, leadership style, and environment.

## 3) The 4 Pillars in Real Life (only what matters most)
For each pillar (Year/Month/Day/Hour):
- 3–6 bullets: what it means in real life.
- Mention Ten Gods only if it changes the interpretation; otherwise keep it plain.
- Include NaYin and Life Stage as a symbolic “extra layer” in 1–2 lines (no long essays).
- Day pillar must include spouse palace discussion using Day Branch only (no spouse assumptions).

## 4) Relationship, Career, Money, Health, Meaning (Applied Reading)
Create 5 sections:
- Career & learning style
- Money & risk profile
- Relationships
- Health & nervous system themes (non-medical)
- Spiritual growth / meaning (psychological framing)

Each section must include:
- Strengths
- Pitfalls
- Practices (concrete habits + environment + boundaries)

## 5) Timing: Current Phase + ${targetYear} Focus (Do NOT overwhelm)
### 5.1 Current 10-year Luck pillar (${activeLuck?.gan_zhi || 'N/A'})
- Explain the decade theme in 8–12 bullets max:
  - what the stem brings, what the branch brings (general elemental + Ten God style inference relative to DM, without inventing hidden stems).
  - how it shifts balance vs favorable/unfavorable elements.

### 5.2 ${targetYear} Annual overview (${targetGanZhi})
- 8–12 bullets max.
- Use only listed overlays/interactions/stars in flow_data year object to justify.
- Give: best moves, watch-outs, how to use the year well.

### 5.3 Monthly flow (keep it lightweight)
- Provide a “Top 4 months” list:
  - 2 months with best support (why)
  - 2 months with highest volatility (why)
- Then give a compact month-by-month:
  - 2–3 bullets per month max:
    - headline theme
    - 1–2 practical actions
- Do NOT list every interaction; only mention the dominant ones.

## 6) Personalization Cheatsheet (Premium user value)
- “You thrive when…”
- “You suffer when…”
- “Non-negotiables”
- “Best environments”
- “Fast alignment checklist” (8–10 bullets)

## 7) Optional Deep Dive Appendix (for BaZi enthusiasts)
This section is explicitly optional and can be longer.
Include:
- Raw “Chart at a glance” map (pillars, Ten Gods stem + hidden, NaYin, life stage)
- Full list of stars (with trigger rules/text)
- Full list of natal interactions (definitions + mitigation)
- Xun Kong / void branches explanation
- Data quality notes: metadata + astro_debug details (time_standard, timezone, engine)
- If any debug scores exist (professional_debug), put them ONLY here.

========================
FINAL CONSTRAINTS
========================
- The main report (sections 1–6) must feel premium, clear, not bloated.
- The appendix can be thorough, but avoid repetition.
- Never exceed 2–3 paragraphs without a “So what?” summary or bullets.

Now analyze the following JSON exactly:
${JSON.stringify(fullData, null, 2)}

---

## Final constraint
The report must be long, detailed, and helpful — but never repetitive. Prefer depth over fluff.`;

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
