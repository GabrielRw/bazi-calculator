import { SynastryResult } from "@/types/bazi";
import { motion } from "framer-motion";
import { Heart, Sparkles, Scale, BookOpen } from "lucide-react";
import { clsx } from "clsx";

interface SynastryResultProps {
    result: SynastryResult;
    personAName?: string;
    personBName?: string;
}

// --------------------------------------------------------------------------
// PINYIN MAP & HELPERS
// --------------------------------------------------------------------------
const PINYIN_MAP: Record<string, string> = {
    "甲": "Jiǎ", "乙": "Yǐ", "丙": "Bǐng", "丁": "Dīng", "戊": "Wù",
    "己": "Jǐ", "庚": "Gēng", "辛": "Xīn", "壬": "Rén", "癸": "Guǐ",
    "子": "Zǐ", "丑": "Chǒu", "寅": "Yín", "卯": "Mǎo", "辰": "Chén", "巳": "Sì",
    "午": "Wǔ", "未": "Wèi", "申": "Shēn", "酉": "Yǒu", "戌": "Xū", "亥": "Hài"
};

const getWithPinyin = (char: string) => {
    // If it's a known single char, return Char (Pinyin). 
    // If unknown or multiple chars, just return originals (fallback).
    if (PINYIN_MAP[char]) {
        return (
            <span className="flex flex-col items-center leading-none">
                <span className="text-3xl font-serif font-bold text-white mb-2">{char}</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wide">{PINYIN_MAP[char]}</span>
            </span>
        );
    }
    return <span className="text-3xl font-serif font-bold text-white">{char}</span>;
};

// Simple explainer tooltip/block
const Explainer = ({ title, text }: { title: string, text: string }) => (
    <div className="flex gap-2 items-start p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 mt-2">
        <BookOpen className="w-4 h-4 text-clay shrink-0 mt-0.5" />
        <div>
            <span className="text-clay font-bold block mb-0.5">{title}</span>
            {text}
        </div>
    </div>
);

export default function SynastryResultView({ result, personAName = "Person A", personBName = "Person B" }: SynastryResultProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-jade";
        if (score >= 60) return "text-clay";
        if (score >= 40) return "text-peach";
        return "text-red-500";
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Header / Hero Score */}
            <div className="glass-card p-8 rounded-3xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jade via-clay to-peach opacity-50" />

                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Compatibility Analysis</h2>

                <div className="flex flex-col items-center justify-center">
                    <div className={clsx("text-8xl font-serif font-bold mb-2", getScoreColor(result.score))}>
                        {result.score}
                    </div>
                    <div className="text-2xl text-white font-medium mb-2">
                        {result.overall_compatibility}
                    </div>
                    <p className="text-gray-400 max-w-xl mx-auto italic">
                        &quot;{result.conflict_summary}&quot;
                    </p>
                </div>
            </div>

            {/* Core Dynamic Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Day Master Connection */}
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-white/5 text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Core Dynamic</h3>
                            <div className="text-[10px] text-gray-500">Day Master Interaction</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl mb-4">
                        <div className="text-center">
                            <div className="text-xs text-gray-500 mb-2">{personAName}</div>
                            {getWithPinyin(result.day_master_analysis.dm_a)}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="text-[10px] font-bold text-clay uppercase tracking-widest">{result.day_master_analysis.relation}</div>
                            <div className="w-16 h-px bg-white/20" />
                            <div className="text-xs font-bold text-white">{result.day_master_analysis.score}/100</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-500 mb-2">{personBName}</div>
                            {getWithPinyin(result.day_master_analysis.dm_b)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        {result.day_master_analysis.dynamic.replace(/Person A/g, personAName).replace(/Person B/g, personBName)}
                    </p>

                    <Explainer
                        title="What is the Day Master?"
                        text="The Day Master represents your core self/identity. This interaction shows the fundamental 'chemistry' between two personalities."
                    />
                </div>

                {/* Spouse Palace (Emotional Safety) */}
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-white/5 text-white">
                            <Heart className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Emotional Bond</h3>
                            <div className="text-[10px] text-gray-500">Spouse Palace (Day Branch)</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl mb-4">
                        <div className="text-center">
                            <div className="text-xs text-gray-500 mb-2">{personAName}&apos;s Palace</div>
                            {getWithPinyin(result.spouse_palace_analysis.branch_a)}
                        </div>
                        <div className="text-center px-4">
                            <div className={clsx("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md",
                                result.spouse_palace_analysis.score > 50 ? "bg-jade/10 text-jade" : "bg-red-500/10 text-red-400"
                            )}>
                                {result.spouse_palace_analysis.interaction}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-500 mb-2">{personBName}&apos;s Palace</div>
                            {getWithPinyin(result.spouse_palace_analysis.branch_b)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        {result.spouse_palace_analysis.description}
                    </p>
                    <Explainer
                        title="The Spouse Palace"
                        text="Located in your Day Branch, this sector governs intimate relationships. Harmony here indicates deep emotional safety and understanding."
                    />
                </div>
            </div>

            {/* Element Balance */}
            <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-white/5 text-white">
                        <Scale className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Element Support</h3>
                        <div className="text-[10px] text-gray-500">Do you complete each other energetically?</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-3">
                        {result.element_analysis.details.map((detail, i) => (
                            <div key={i} className="flex gap-3 text-sm text-gray-300">
                                <span className={clsx("font-bold",
                                    detail.includes("weak") || detail.includes("cannot support") ? "text-red-400" : "text-jade"
                                )}>•</span>
                                {detail.replace(/Person A/g, personAName).replace(/Person B/g, personBName)}
                            </div>
                        ))}
                    </div>

                    <div className="bg-black/20 rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase font-bold">{personAName} needs</span>
                            <span className="text-white font-bold">{result.element_analysis.a_needs}</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase font-bold">{personBName} needs</span>
                            <span className="text-white font-bold">{result.element_analysis.b_needs}</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase font-bold">Total Support</span>
                            <span className={clsx("font-bold", getScoreColor(result.element_analysis.score))}>
                                {result.element_analysis.score}/100
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pillar Interactions List */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 pl-2">Pillar-by-Pillar Interactions</h3>
                {result.pillar_interactions.map((interaction, idx) => (
                    <div key={idx} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-16 flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{interaction.pillar}</span>
                                <span className="text-[10px] text-gray-600 uppercase">Pillar</span>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white mb-0.5">
                                    {interaction.branch_interaction.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {interaction.branch_interaction.type}
                                </div>
                            </div>
                        </div>
                        <div className={clsx("text-sm font-bold",
                            interaction.net_score > 0 ? "text-jade" :
                                interaction.net_score < 0 ? "text-red-400" : "text-gray-400"
                        )}>
                            {interaction.net_score > 0 ? "+" : ""}{interaction.net_score}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hidden Connections Bonus */}
            {result.hidden_interactions.count > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-jade/10 to-transparent border border-jade/20 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-jade mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-jade mb-1">Hidden Karma Bonus (+{result.score_breakdown.hidden_bonus})</h4>
                        <div className="text-xs text-gray-300 space-y-1">
                            {result.hidden_interactions.connections.map((c, i) => (
                                <div key={i}>{c}</div>
                            ))}
                        </div>
                        <div className="text-[10px] text-jade/70 mt-2 italic">
                            *Hidden connections represent subconscious bonding and past-life affinities.
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
