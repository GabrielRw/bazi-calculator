"use client";

import { BaziResult } from "@/types/bazi";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Quote } from "lucide-react";
import { useState } from "react";

// Detailed suggestions for improving each element (Yòng Shén)
const YONG_SHEN_SUGGESTIONS: Record<string, { title: string; actions: string[]; lifestyle: string[]; mindset: string }> = {
    Wood: {
        title: "Cultivate Growth & Flexibility",
        actions: [
            "Start new projects or hobbies involving creation.",
            "Engage in continuous learning and reading.",
            "Spend time in forests or near greenery."
        ],
        lifestyle: [
            "Wake up early to catch the morning Qi.",
            "Decorate with plants or wooden elements.",
            "Wear green or teal accessories."
        ],
        mindset: "Benevolence. Practice kindness and patience. Be like a tree: rooted but flexible in the wind."
    },
    Fire: {
        title: "Ignite Passion & Visibility",
        actions: [
            "Express yourself publicly (speaking, performance).",
            "Socialize warmth and connect people.",
            "Engage in cardiovascular activities."
        ],
        lifestyle: [
            "Let in maximizes sunlight into your spaces.",
            "Use warm lighting and candles.",
            "Wear red, purple, or bright orange."
        ],
        mindset: "Courtesy. Be polite but radiant. Share your inner light to inspire others."
    },
    Earth: {
        title: "Build Stability & Trust",
        actions: [
            "Focus on accumulating assets and resources.",
            "Practice grounding exercises like meditation.",
            "Nurture others through food or service."
        ],
        lifestyle: [
            "Maintain a stable and predictable routine.",
            "Use ceramics, crystals, or stone decor.",
            "Wear yellow, brown, or beige tones."
        ],
        mindset: "Trustworthiness. Keep your promises. Be the solid rock others rely on."
    },
    Metal: {
        title: "Refine Structure & Clarity",
        actions: [
            "Declutter and organize your physical space.",
            "Establish firm boundaries and rules.",
            "Focus on precision and finishing tasks."
        ],
        lifestyle: [
            "Visit high-altitude places or dry climates.",
            "Use metallic accents or minimalist design.",
            "Wear white, gold, or silver."
        ],
        mindset: "Righteousness. Do what is right, not what is easy. Cut through confusion with clarity."
    },
    Water: {
        title: "Embrace Wisdom & Flow",
        actions: [
            "Engage in deep introspection or strategy.",
            "Travel or move to facilitate circulation.",
            "Listen more than you speak."
        ],
        lifestyle: [
            "Spend time near lakes, oceans, or fountains.",
            "Keep environments cool and quiet.",
            "Wear black, dark blue, or charcoal."
        ],
        mindset: "Wisdom. Adapt like water. Flow around obstacles rather than confronting them head-on."
    }
};

interface YongShenSectionProps {
    result: BaziResult;
}

export default function YongShenSection({ result }: YongShenSectionProps) {
    const usefulElements = result.professional.yong_shen_candidates || [];
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden text-center md:text-left">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Quote className="w-48 h-48 text-jade" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Quote & High Level */}
                <div className="space-y-6">
                    <h3 className="flex items-center justify-center md:justify-start gap-2 text-jade text-sm font-bold uppercase tracking-widest">
                        <Sparkles className="w-4 h-4" /> Yòng Shén (Useful God)
                    </h3>

                    <div className="py-6 border-y border-white/10">
                        <div className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                            用神得力<br />
                            <span className="text-jade">命可为</span>
                        </div>
                        <p className="text-sm text-gray-400 italic font-serif">
                            &quot;When the Useful God is empowered, destiny becomes usable.&quot;
                        </p>
                    </div>

                    <div className="text-xs text-gray-400 leading-relaxed text-justify md:text-left">
                        The <strong>Yòng Shén</strong> is the critical element needed to balance your chart's temperature (Hou) and structural strength. Strengthening this element unlocks your chart's full potential.
                    </div>
                </div>

                {/* Right: Actionable Suggestions */}
                <div className="bg-black/20 rounded-xl border border-white/5 p-6">
                    {usefulElements.length > 0 ? (
                        <div className="h-full flex flex-col">
                            {/* Element Selector (if multiple) */}
                            {usefulElements.length > 1 && (
                                <div className="flex gap-2 mb-4 justify-center md:justify-start">
                                    {usefulElements.map((el, i) => (
                                        <button
                                            key={el}
                                            onClick={() => setActiveIndex(i)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${activeIndex === i
                                                    ? "bg-jade text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                                    : "bg-white/5 text-gray-500 hover:bg-white/10"
                                                }`}
                                        >
                                            {el}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                {(() => {
                                    const element = usefulElements[activeIndex];
                                    const data = YONG_SHEN_SUGGESTIONS[element] || YONG_SHEN_SUGGESTIONS["Wood"]; // Fallback

                                    return (
                                        <motion.div
                                            key={element}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="space-y-5"
                                        >
                                            <div>
                                                <div className="text-[10px] text-jade font-bold uppercase tracking-widest mb-1">
                                                    Strengthening {element}
                                                </div>
                                                <h4 className="text-xl font-serif text-white">
                                                    {data.title}
                                                </h4>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-2 mb-2 text-spirit text-xs font-bold uppercase">
                                                        <ArrowRight className="w-3 h-3" /> Actions
                                                    </div>
                                                    <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                                                        {data.actions.map(a => <li key={a}>{a}</li>)}
                                                    </ul>
                                                </div>

                                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-2 mb-2 text-spirit text-xs font-bold uppercase">
                                                        <BookOpen className="w-3 h-3" /> Lifestyle
                                                    </div>
                                                    <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                                                        {data.lifestyle.map(a => <li key={a}>{a}</li>)}
                                                    </ul>
                                                </div>

                                                <div className="text-[10px] text-gray-500 italic pt-2 border-t border-white/5">
                                                    Mindset: {data.mindset}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })()}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
                            <Sparkles className="w-8 h-8 mb-4 opacity-20" />
                            <p className="text-xs">No specific Yòng Shén identified.<br />Your chart may be balanced or follow a special structure.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
