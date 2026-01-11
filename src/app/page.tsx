"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { BaziResult, BaziFlowResult, SynastryResult, LifespanResult, HealthResult } from "@/types/bazi";
import { ChartContext, AICardType, AIHistoryItem } from "@/types/ai";
import BaziForm from "@/components/BaziForm";
import FourPillars from "@/components/FourPillars";
import ElementChart from "@/components/ElementChart";
import WuxingChart from "@/components/WuxingChart";
import JingQiShenChart from "@/components/JingQiShenChart";
import YongShenSection from "@/components/YongShenSection";
import HealthSection from "@/components/HealthSection";
import LuckPillars from "@/components/LuckPillars";
import AnalysisSection from "@/components/AnalysisSection";
import FlowSection from "@/components/FlowSection";
import SynastryResultView from "@/components/SynastryResult";
import AISidebar from "@/components/AISidebar";
import AskAIButton from "@/components/AskAIButton";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Moon, Activity, Info, Clock, Map, Bot, Check, ArrowLeft, History, Plus } from "lucide-react";
import Image from "next/image";
import logo from "./logo.png";
import clsx from "clsx";
import BaziReport from "@/components/BaziReport";
import AIIcon from "@/components/AIIcon";


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
  const [lifespanResult, setLifespanResult] = useState<LifespanResult | null>(null);
  const [healthResult, setHealthResult] = useState<HealthResult | null>(null);
  const [cultivationFactor, setCultivationFactor] = useState(0.5);
  const [synastryResult, setSynastryResult] = useState<SynastryResult | null>(null);
  const [synastryNames, setSynastryNames] = useState<{ a: string; b: string } | null>(null);

  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"natal" | "flow">("natal");
  const [activeMode, setActiveMode] = useState<"individual" | "synastry">("individual");
  const [copied, setCopied] = useState(false);

  // History State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loadedData, setLoadedData] = useState<any | null>(null);

  // AI History State
  const [aiHistory, setAiHistory] = useState<AIHistoryItem[]>([]);

  // Unique ID for the current chart to group AI history
  const chartId = useMemo(() => {
    if (!birthData) return "";
    return `${birthData.year}-${birthData.month}-${birthData.day}-${birthData.hour}-${birthData.minute}-${birthData.city}-${birthData.gender}`;
  }, [birthData]);

  // Create chart context for AI explanations
  const chartContext: ChartContext | undefined = useMemo(() => {
    if (!result) return undefined;
    return {
      dayMaster: result.day_master,
      elements: result.elements,
      structure: result.professional.structure,
      dmStrength: result.professional.dm_strength,
      pillars: result.pillars,
    };
  }, [result]);

  // AI Sidebar State
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiCardTitle, setAiCardTitle] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Global AI explanation handler passed to all components
  const handleAIExplanation = useCallback((explanation: string, cardTitle: string, cardType: AICardType = 'pillar') => {
    setAiExplanation(explanation);
    setAiCardTitle(cardTitle);
    setAiSidebarOpen(true);
    setAiLoading(false);

    // Save to AI History if chart is active
    if (chartId) {
      const newItem: AIHistoryItem = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        cardType,
        cardTitle,
        explanation,
        chartId
      };

      setAiHistory(prev => {
        const updated = [newItem, ...prev].slice(0, 50); // Keep last 50
        localStorage.setItem(`ai_history_${chartId}`, JSON.stringify(updated));
        return updated;
      });
    }
  }, [chartId]);

  // Handler for when AI request starts
  const handleAIRequest = useCallback((cardTitle: string, isCacheHit?: boolean) => {
    setAiCardTitle(cardTitle);
    if (!isCacheHit) {
      setAiLoading(true);
      setAiExplanation(""); // Clear current while loading new one
    }
    setAiSidebarOpen(true);
  }, []);
  // Handler for starting a fresh calculation
  const handleNewCalculation = useCallback(() => {
    setResult(null);
    setSynastryResult(null);
    setFlowResult(null);
    setLoadedData(null);
    setBirthData(null);
    setError(null);
    setAiSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("bazi_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Load AI history when chart changes
  useEffect(() => {
    if (chartId) {
      const saved = localStorage.getItem(`ai_history_${chartId}`);
      if (saved) {
        try {
          setAiHistory(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load AI history", e);
        }
      } else {
        setAiHistory([]);
      }
    }
  }, [chartId]);

  // Refetch lifespan when cultivation factor changes
  useEffect(() => {
    if (!birthData || !result) return;

    const headers = { "Content-Type": "application/json" };
    const payload = {
      year: birthData.year,
      month: birthData.month,
      day: birthData.day,
      hour: birthData.hour,
      minute: birthData.minute,
      city: birthData.city,
      sex: birthData.gender === "male" ? "M" : "F",
      time_standard: "true_solar_absolute",
      max_age: 120,
      cultivation_factor: cultivationFactor
    };

    fetch("/api/bazi/lifespan", {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setLifespanResult(data); })
      .catch(err => console.error("Lifespan refetch error:", err));
  }, [cultivationFactor, birthData, result]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveToHistory = (formData: any, resultData: BaziResult, flowData: BaziFlowResult) => {
    const label = formData.name
      ? formData.name
      : `${formData.year}-${formData.month}-${formData.day} ${formData.city}`;

    const newItem = {
      ...formData,
      timestamp: Date.now(),
      label,
      result: resultData,
      flowResult: flowData
    };

    const updated = [newItem, ...history.filter(h => {
      if (formData.name && h.name === formData.name) return false;
      return h.year !== newItem.year ||
        h.month !== newItem.month ||
        h.day !== newItem.day ||
        h.hour !== newItem.hour ||
        h.city !== newItem.city
    }
    )].slice(0, 10);

    setHistory(updated);
    localStorage.setItem("bazi_history", JSON.stringify(updated));
  };

  const handleDeleteHistory = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("bazi_history", JSON.stringify(updated));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectHistory = (item: any) => {
    setLoadedData(item); // triggers form update

    // If we have cached results, load them immediately
    if (item.result && item.flowResult) {
      setResult(item.result);
      setFlowResult(item.flowResult);
      setBirthData({
        year: item.year,
        month: item.month,
        day: item.day,
        hour: item.hour,
        minute: item.minute,
        city: item.city,
        gender: item.gender,
        timeStandard: item.timeStandard
      });
      setActiveTab("natal");
      setActiveMode("individual");
      setSynastryResult(null);
      setError(null);
    }
  };

  const handleExtractToAI = () => {
    if (activeMode === "synastry") {
      const synastryPrompt = `🔹 PRECISION BaZi SYNASTRY PROMPT (COMPATIBILITY ENGINE)
You are an expert BaZi Synastry analyst.
Generate a premium compatibility reading for ${synastryNames?.a || "Person A"} (Day Master: ${synastryResult?.day_master_analysis.dm_a}) and ${synastryNames?.b || "Person B"} (Day Master: ${synastryResult?.day_master_analysis.dm_b}).

CORE RULES
1) Grounding
Every insight must come from the JSON data:
- Pillar interactions (Year/Month/Day/Hour)
- Element balance comparison
- Ten Gods (Deities) cross-analysis
- Void/Star interactions

2) No "Perfect Match" Myths
Do not say "Good" or "Bad". Use "High Friction", "Deep Support", "Growth Opportunity", "Comfort Zone".
Real relationships are mixed. Reflect that.

3) Structure
0) The Synastry Archetype: Give the couple a title (e.g. "The Anchor and the Sail", "Fire forging Metal").
1) The Core Spark: What attracts them instantly (Day Master + Element check).
2) The Friction Point: Where they hurt each other most (Clashes/Harms in Day/Month).
3) The Support System: How they help each other grow (Element support, noble people).
4) Long-term Viability: Marriage palace analysis (Day Branch interaction).
5) Practical Advice for ${synastryNames?.a || "Person A"} regarding ${synastryNames?.b || "Person B"}.
6) Practical Advice for ${synastryNames?.b || "Person B"} regarding ${synastryNames?.a || "Person A"}.

JSON DATA:
${JSON.stringify(synastryResult, null, 2)}`;

      navigator.clipboard.writeText(synastryPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const fullData = {
      natal_chart: result,
      flow_data: flowResult,
      metadata: {
        generated_at: new Date().toISOString(),
        engine: "True Bazi Calculator v2026"
      }
    };
    // ... rest of AI logic ...
    const dmInfo = result?.day_master.info;
    const dmName = dmInfo ? `${dmInfo.pinyin} ${dmInfo.polarity} ${dmInfo.element}` : "Day Master";
    const annualFlow = flowResult?.years[0];
    const targetYear = annualFlow?.year || 2025;
    const targetGanZhi = annualFlow?.gan_zhi || "乙巳";
    const targetAge = annualFlow?.age || "N/A";
    const activeLuck = annualFlow?.active_luck;

    const natalAiPrompt = `🔹 COMPACT PRECISION BaZi PROMPT (WITH POETIC ARCHETYPE)
You are an expert BaZi (Four Pillars) analyst and premium reader.
Generate a paid-user BaZi life reading from the JSON below.
This reading must be specific, traceable, and non-generic.
If a sentence could describe many people, rewrite or remove it.

CORE RULES
1) Absolute grounding
Use ONLY what exists in the JSON.
Every insight must be traceable to:
a pillar,
an interaction,
an element imbalance,
a structure,
or a named star.
No grounding → do not say it.

2) Interactions drive meaning
Do not list interactions mechanically.
Instead:
Identify tensions between life domains (career vs intimacy, public vs private, control vs growth, etc.)
Anchor each tension to at least one natal or repeating interaction
If an interaction does not create friction or consequence, omit it from the main text.

3) One engine, one destabilizer, one compensation
Early in the reading, clearly identify:
the core life engine (what truly drives this person),
the main destabilizing pressure,
the habitual compensation they use (even if flawed).
Do not introduce new drivers later.

4) No archetypal filler
Words like sensitive, intuitive, strategic, deep are forbidden unless immediately followed by:
“This shows up concretely as…”

REQUIRED STRUCTURE (SHORT)
0) Poetic Archetype (Named)
Give this life a clear archetypal title (e.g. The Tempered Strategist, The Soft-Bladed Warrior).
In 5–6 lines:
Describe who this person is in motion
What kind of battles they fight
What kind of strength they are not
This must be symbolic and chart-grounded.

1) How You Actually Make Decisions
What decisions are easy
What decisions stall or backfire
One recurring decision error
(Anchor to interactions, not personality labels.)

2) Internal Friction Map
Describe two internal conflicts, phrased as:
“One part of you wants X, but another part immediately does Y.”
Each must map to a specific clash, punishment, or reinforcement loop.

3) Relationship Pattern
What initially attracts others
What later becomes non-negotiable tension
Why this repeats
(Day Pillar only. No romantic generalities.)

4) Work & Authority Pattern
Relationship to pressure, rules, and evaluation
Where authority is accepted vs resisted
Include one sentence starting with:
“You work best not when…”

5) The Cost of Your Strength
List 3 real strengths, each immediately followed by:
the price it extracts over time
No advice here.

6) Timing Focus (Current Decade + ${targetYear})
What this decade is forcing you to unlearn
One emotional theme of ${targetYear}
One behavioral risk of ${targetYear}
Synthesize. Do not list interactions.

7) Alignment Rules (Strict & Testable)
8 short rules of the form:
“If you do X for too long, Y happens.”
Each rule must be visibly derived from the chart.

8) Optional Appendix
Only here:
interaction lists
stars
voids
structure labels
The main text must stand without it.

FINAL CHECK (MANDATORY)
Before finalizing:
Could this describe someone with a different Day Branch? → Rewrite.
Does the archetype feel symbolic but precise? → If vague, sharpen.
Does the reader feel seen, not comforted? → If not, sharpen.

FINAL INTENT
The reader should finish thinking:
“This isn’t a personality description.
This is the shape of my life.”

JSON DATA:
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCalculate = async (data: any, mode: "individual" | "synastry" = "individual") => {
    setLoading(true);
    setError(null);
    setActiveMode(mode);
    setSynastryResult(null);
    setSynastryNames(null);

    try {
      const headers = { "Content-Type": "application/json" };

      if (mode === "synastry") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalizeData = (d: any) => ({
          year: d.year,
          month: d.month,
          day: d.day,
          hour: d.hour,
          minute: d.minute,
          city: d.city,
          sex: d.gender === "male" ? "M" : "F",
          time_standard: d.timeStandard
        });

        const personA = normalizeData(data.person_a);
        const personB = normalizeData(data.person_b);

        setSynastryNames({
          a: data.person_a.name || "Person A",
          b: data.person_b.name || "Person B"
        });

        const response = await fetch("/api/bazi/synastry", {
          method: "POST",
          headers,
          body: JSON.stringify({ person_a: personA, person_b: personB })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to analyze compatibility.");
        }

        const result = await response.json();
        setSynastryResult(result);

      } else {
        const payload = {
          year: data.year,
          month: data.month,
          day: data.day,
          hour: data.hour,
          minute: data.minute,
          city: data.city,
          ...(data.lat !== undefined && { lat: data.lat }),
          ...(data.lng !== undefined && { lng: data.lng }),
          sex: data.gender === "male" ? "M" : "F",
          time_standard: data.timeStandard,
          include_pinyin: true,
          include_stars: true,
          include_interactions: true,
          include_professional: true,
          include_debug: true,
          max_age: 120
        };

        // 1. Fetch Core Data (Blocking)
        const [baziRes, flowRes] = await Promise.all([
          fetch("/api/bazi/natal", { method: "POST", headers, body: JSON.stringify(payload) }),
          fetch("/api/bazi/flow", {
            method: "POST",
            headers,
            body: JSON.stringify({ ...payload, target_year: new Date().getFullYear() })
          })
        ]);

        if (!baziRes.ok || !flowRes.ok) throw new Error("Failed to calculate destiny and flow.");

        const [baziJson, flowJson] = await Promise.all([baziRes.json(), flowRes.json()]);

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

        saveToHistory(data, baziJson, flowJson);

        // Critical data loaded, unblock UI
        setLoading(false);

        // Fetch Lifespan Data Asynchronously (Non-blocking)
        // Note: Lifespan algorithm requires true_solar_absolute
        fetch("/api/bazi/lifespan", {
          method: "POST",
          headers,
          body: JSON.stringify({ ...payload, time_standard: "true_solar_absolute", cultivation_factor: cultivationFactor })
        })
          .then(res => {
            if (res.ok) return res.json();
            return null;
          })
          .then(data => {
            if (data) setLifespanResult(data);
          })
          .catch(err => console.error("Lifespan fetch error:", err));

        // Fetch Health Data Asynchronously (Non-blocking)
        fetch("/api/bazi/health", {
          method: "POST",
          headers,
          body: JSON.stringify({ ...payload, include_timing: true, timing_years_ahead: 10 })
        })
          .then(res => {
            if (res.ok) return res.json();
            return null;
          })
          .then(data => {
            if (data) setHealthResult(data);
          })
          .catch(err => console.error("Health fetch error:", err));

      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setLoading(false);
    }
    // removed finally block to manually control loading timing
  };

  return (
    <main className="min-h-screen pb-20 bg-void text-foreground selection:bg-clay/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-50 z-0 no-print">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-clay/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-jade/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-6 z-10 print:hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 mb-8"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <Image
                src={logo}
                alt="True Bazi Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-600">
            True <span className="text-clay">Bazi</span> Calculator
          </h1>
          <p className="text-spirit text-lg md:text-xl max-w-2xl mx-auto font-light">
            High-precision Chinese destiny engine with <span className="text-white">True Solar Time</span> and interactive life flow analysis.
          </p>
        </div>
      </div>

      {/* Floating Reopen Button */}
      {!aiSidebarOpen && aiHistory.length > 0 && !loading && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -10 }}
          onClick={() => setAiSidebarOpen(true)}
          className="fixed top-1/2 right-0 -translate-y-1/2 z-[190] bg-jade text-void p-3 rounded-l-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] group transition-all print:hidden"
        >
          <div className="flex flex-col items-center gap-1">
            <AIIcon size={18} className="text-void" />
            <span className="text-[10px] font-bold uppercase [writing-mode:vertical-lr]">AI</span>
          </div>
        </motion.button>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {(!result && !synastryResult) ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 mb-16 relative z-20 no-print max-w-2xl mx-auto"
          >
            <BaziForm
              onSubmit={handleCalculate}
              isLoading={loading}
              history={history}
              onDeleteHistory={handleDeleteHistory}
              onSelectHistory={handleSelectHistory}
              loadedData={loadedData}
            />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={clsx(
              "relative z-10 w-full px-4 mx-auto pb-20 transition-all duration-500 ease-in-out",
              aiSidebarOpen ? "lg:mr-[425px] lg:max-w-[calc(100%-425px)]" : "max-w-6xl"
            )}
          >
            {activeMode === "individual" && result ? (
              <>
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
                    onClick={handleNewCalculation}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <Plus className="w-4 h-4" /> New Chart
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
                    {copied ? <Check className="w-4 h-4" /> : <AIIcon size={16} className="text-current" />}
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
                      <FourPillars
                        pillars={result.pillars}
                        chartContext={chartContext}
                        onAIExplanation={handleAIExplanation}
                        onAIRequest={handleAIRequest}
                        aiHistory={aiHistory}
                      />
                    </section>

                    {/* 2. Charts Row */}
                    <div className="grid lg:grid-cols-3 gap-8 w-full overflow-hidden">
                      <div className="lg:col-span-2 space-y-8 min-w-0">
                        <ElementChart data={result.elements} />
                        {lifespanResult && (
                          <JingQiShenChart
                            data={lifespanResult.curve}
                            metadata={lifespanResult.metadata}
                            currentAge={result.current_age}
                            cultivationFactor={cultivationFactor}
                            onCultivationChange={setCultivationFactor}
                            chartContext={chartContext}
                            onAIExplanation={handleAIExplanation}
                            onAIRequest={handleAIRequest}
                            aiHistory={aiHistory}
                          />
                        )}
                      </div>

                      <div className="glass-card rounded-2xl p-8 flex flex-col justify-center text-center relative overflow-hidden group min-w-0">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-8">
                          Day Master Energy
                        </h3>
                        <div className="space-y-6">
                          <div className="text-8xl font-serif text-white hover:scale-110 transition-transform cursor-default select-none">
                            {result.day_master.stem}
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-clay mb-1">{result.day_master.info.name}</div>
                            <div className="text-xs text-spirit uppercase tracking-widest">{result.day_master.info.polarity} {result.day_master.info.element}</div>
                          </div>
                          <div className="pt-6 border-t border-white/5">
                            <p className="text-gray-400 text-sm italic leading-relaxed">
                              &quot;{result.professional.interpretation.split('.')[0]}.&quot;
                            </p>
                          </div>

                          {/* Ask AI Button for Day Master */}
                          {chartContext && (
                            <div className="pt-4 print:hidden">
                              <AskAIButton
                                cardType="daymaster"
                                cardData={result.day_master as unknown as Record<string, unknown>}
                                chartContext={chartContext}
                                onExplanation={(exp: string) => handleAIExplanation(exp, "Day Master", "daymaster")}
                                onError={(err: string) => console.error('AI Error:', err)}
                                onRequestStart={handleAIRequest}
                                cardTitle="Day Master"
                                history={aiHistory}
                                size="sm"
                                className="mx-auto"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2.5 Wuxing Five Phases Chart */}
                    <section>
                      <WuxingChart
                        data={result.elements}
                        pillars={result.pillars}
                        chartContext={chartContext}
                        onAIExplanation={handleAIExplanation}
                        onAIRequest={handleAIRequest}
                        aiHistory={aiHistory}
                      />
                    </section>

                    {/* 2.6 Health & Constitution Section */}
                    {healthResult && (
                      <section>
                        <HealthSection
                          data={healthResult}
                          chartContext={chartContext}
                          onAIExplanation={handleAIExplanation}
                          onAIRequest={handleAIRequest}
                          aiHistory={aiHistory}
                        />
                      </section>
                    )}

                    {/* 3. Luck Pillars */}
                    <section>
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-6 px-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-clay" /> Luck Cycles
                      </h3>
                      <LuckPillars
                        luck={result.luck_cycle}
                        chartContext={chartContext}
                        onAIExplanation={handleAIExplanation}
                        onAIRequest={handleAIRequest}
                        aiHistory={aiHistory}
                      />
                    </section>

                    {/* 3. Deep Analysis & Yong Shen */}
                    <section className="space-y-8">
                      <YongShenSection result={result} chartContext={chartContext} onAIExplanation={handleAIExplanation} onAIRequest={handleAIRequest} aiHistory={aiHistory} />
                      <AnalysisSection result={result} chartContext={chartContext} onAIExplanation={handleAIExplanation} onAIRequest={handleAIRequest} aiHistory={aiHistory} />
                    </section>

                    {/* 5. Precise Technical Data */}
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
                          {result.astro_debug.latitude !== undefined && result.astro_debug.longitude !== undefined && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500 flex items-center gap-2"><Map className="w-3 h-3" /> Coordinates</span>
                              <span className="text-spirit font-mono">
                                {result.astro_debug.latitude.toFixed(4)}°, {result.astro_debug.longitude.toFixed(4)}°
                              </span>
                            </div>
                          )}
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
              </>
            ) : (
              activeMode === "synastry" && synastryResult && (
                <>
                  <div className="mb-8 pl-4 border-l-2 border-clay/30 flex items-center justify-between">
                    <div>
                      <button
                        onClick={handleNewCalculation}
                        className="text-xs uppercase tracking-widest text-gray-500 mb-2 hover:text-clay transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" /> New Chart
                      </button>
                      <div className="text-2xl text-white font-serif">Compatibility Analysis</div>
                    </div>

                    <button
                      onClick={handleExtractToAI}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border",
                        copied
                          ? "bg-jade/20 text-jade border-jade/50"
                          : "text-spirit hover:text-white border-white/10 hover:bg-white/5"
                      )}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <AIIcon size={12} className="text-current" />}
                      {copied ? "Copied Prompt" : "AI Extract"}
                    </button>
                  </div>

                  <SynastryResultView
                    result={synastryResult}
                    personAName={synastryNames?.a || "Person A"}
                    personBName={synastryNames?.b || "Person B"}
                  />
                </>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated Print Report */}
      {(result && (birthData || loadedData)) && (
        <BaziReport
          result={result}
          birthData={birthData || (loadedData ? {
            year: loadedData.year,
            month: loadedData.month,
            day: loadedData.day,
            hour: loadedData.hour,
            city: loadedData.city,
            gender: loadedData.gender
          } : null)}
        />
      )}

      {/* AI Sidebar */}
      <AISidebar
        isOpen={aiSidebarOpen}
        onClose={() => setAiSidebarOpen(false)}
        explanation={aiExplanation}
        cardTitle={aiCardTitle}
        isLoading={aiLoading}
        history={aiHistory}
        onSelectHistory={(item) => {
          setAiExplanation(item.explanation);
          setAiCardTitle(item.cardTitle);
          setAiLoading(false); // Explicitly set aiLoading to false when selecting from history
        }}
        onClearHistory={() => {
          if (chartId) {
            setAiHistory([]);
            localStorage.removeItem(`ai_history_${chartId}`);
          }
        }}
      />
    </main>
  );
}
