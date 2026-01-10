"use client";

import { BaziResult, Star as StarType } from "@/types/bazi";
import { AICardType, ChartContext, AIHistoryItem } from "@/types/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, Briefcase, Info, Activity, Sparkles, BookOpen } from "lucide-react";
import { getBranchData, getGanzhiPinyin } from "@/lib/ganzhi";
import { useState } from "react";
import StarDetailModal from "./StarDetailModal";
import AskAIButton from "./AskAIButton";


const VOID_BRANCH_DETAILS: Record<string, { themes: string; void: string; activated: string }> = {
    "子": {
        themes: "movement, communication, circulation, connection",
        void: "Efforts don't immediately circulate. Communication is delayed or indirect. Mobility is mental more than physical.",
        activated: "Messages land. Connections form. Movement resumes with clarity."
    },
    "丑": {
        themes: "accumulation, security, resources, patience",
        void: "Stability feels provisional. Resources exist but feel inaccessible. Long-term security is postponed.",
        activated: "Foundations solidify. Savings, assets, or commitments become real."
    },
    "寅": {
        themes: "initiative, courage, leadership, starting force",
        void: "Hesitation before action. Strong intent without immediate execution. Leadership expressed indirectly.",
        activated: "Decisive action. Clear starts. Assertive movement forward."
    },
    "卯": {
        themes: "growth, refinement, social harmony",
        void: "Relationships feel undefined. Growth is internal before visible. Refinement without recognition.",
        activated: "Social ease improves. Growth becomes observable. Creative output gains form."
    },
    "辰": {
        themes: "foundations, destiny, long-term structure",
        void: "Life direction feels non-linear. Foundations require revision. Strategy precedes construction.",
        activated: "Structural decisions are made. Long plans crystallize. Foundations stabilize."
    },
    "巳": {
        themes: "desire, ambition, strategy, charisma",
        void: "Motivation is intermittent. Desire is intellectualized. Action waits for meaning.",
        activated: "Focused ambition. Strategic execution. Fire applied precisely."
    },
    "午": {
        themes: "visibility, momentum, recognition",
        void: "Effort without spotlight. Energy expended quietly. Momentum stalls despite activity.",
        activated: "Recognition appears. Momentum accelerates. Presence becomes visible."
    },
    "未": {
        themes: "belonging, nourishment, emotional grounding",
        void: "Emotional support feels diffuse. Belonging is conceptual rather than felt. Care without reciprocity.",
        activated: "Emotional anchoring. Support structures become tangible. Community solidifies."
    },
    "申": {
        themes: "skill application, adaptability, tactics",
        void: "Skills underused. Intelligence unnoticed. Adaptation without payoff.",
        activated: "Competence recognized. Tactical advantage emerges. Skills convert into results."
    },
    "酉": {
        themes: "standards, detail, value judgment",
        void: "High standards without reward. Precision overlooked. Self-critique dominates.",
        activated: "Value becomes measurable. Standards rewarded. Precision appreciated."
    },
    "戌": {
        themes: "responsibility, boundaries, duty",
        void: "Roles unclear. Responsibility postponed. Endings unresolved.",
        activated: "Commitments formalized. Boundaries clarified. Matters closed properly."
    },
    "亥": {
        themes: "intuition, rest, inner depth",
        void: "Inner richness without expression. Withdrawal without renewal. Insight without outlet.",
        activated: "Intuition expressed. Emotional depth shared. Recovery and renewal occur."
    }
};

interface AnalysisSectionProps {
    result: BaziResult;
    chartContext?: ChartContext;
    onAIExplanation?: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest?: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}

interface StarCardProps {
    star: any;
    index: number;
    onShowDetail: (star: StarType) => void;
    chartContext?: ChartContext;
    onAIExplanation?: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest?: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}

function StarCard({ star, index, onShowDetail, chartContext, onAIExplanation, onAIRequest, aiHistory }: StarCardProps) {
    const [showInfo, setShowInfo] = useState(false);

    const handleAskAI = (explanation: string) => {
        if (onAIExplanation) {
            onAIExplanation(explanation, `Star: ${star.name}`, "star");
        }
    };

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative p-4 bg-white/5 rounded-xl border border-white/5 hover:border-spirit/30 transition-colors group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold text-sm">{star.name}</span>
                <span className="text-[10px] text-gray-500 uppercase px-2 py-0.5 bg-black/30 rounded-full">
                    {star.pillar} ({star.zhi})
                </span>
            </div>

            {/* Description Toggle */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="text-xs text-gray-400 leading-relaxed pt-2 border-t border-white/5 text-justify">
                            {star.desc}
                        </p>
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onShowDetail(star);
                                }}
                                className="flex-1 flex items-center gap-1.5 text-[10px] font-bold uppercase text-jade hover:text-white transition-colors border border-jade/20 hover:border-white/20 bg-jade/10 hover:bg-white/5 px-3 py-1.5 rounded-lg justify-center"
                            >
                                <BookOpen className="w-3 h-3" /> Deep Analysis
                            </button>
                            {chartContext && (
                                <AskAIButton
                                    cardType="star"
                                    cardData={star as Record<string, unknown>}
                                    chartContext={chartContext}
                                    onExplanation={handleAskAI}
                                    onError={(error) => console.error('AI Error:', error)}
                                    onRequestStart={onAIRequest}
                                    cardTitle={`Star: ${star.name}`}
                                    history={aiHistory}
                                    size="sm"
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Info Icon */}
            {!showInfo && (
                <div className="h-6" /> /* Spacer to prevent layout jump if description is hidden */
            )}

            <button
                onClick={() => setShowInfo(!showInfo)}
                className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${showInfo
                    ? "text-spirit bg-spirit/10"
                    : "text-gray-600 hover:text-gray-300 hover:bg-white/5"
                    }`}
                title="View Star Details"
            >
                <Info className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
}

export default function AnalysisSection({ result, chartContext, onAIExplanation, onAIRequest, aiHistory }: AnalysisSectionProps) {
    const [selectedStar, setSelectedStar] = useState<StarType | null>(null);

    const handleAIExplanation = (explanation: string, cardTitle: string, cardType?: AICardType) => {
        if (onAIExplanation) {
            onAIExplanation(explanation, cardTitle, cardType);
        }
    };

    return (
        <div className="space-y-6 w-full">
            <StarDetailModal
                star={selectedStar}
                isOpen={!!selectedStar}
                onClose={() => setSelectedStar(null)}
            />

            {/* Symbolic Stars */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-spirit text-sm font-bold uppercase tracking-widest mb-4">
                    <Star className="w-4 h-4" /> Symbolic Stars
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {(result.stars || []).map((star, i) => (
                        <StarCard
                            key={i}
                            star={star}
                            index={i}
                            onShowDetail={(s) => setSelectedStar(s)}
                            chartContext={chartContext}
                            onAIExplanation={handleAIExplanation}
                            onAIRequest={onAIRequest}
                            aiHistory={aiHistory}
                        />
                    ))}
                </div>
            </div>

            {/* Xun Kong (Void) */}
            {result.xun_kong && (
                <div className="glass-card rounded-2xl p-6 border-l-4 border-l-spirit">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 text-spirit text-sm font-bold uppercase tracking-widest">
                            <Zap className="w-4 h-4" /> Void Branches (Xun Kong)
                        </h3>
                        {chartContext && (
                            <AskAIButton
                                cardType="void"
                                cardData={result.xun_kong as unknown as Record<string, unknown>}
                                chartContext={chartContext}
                                onExplanation={(exp) => handleAIExplanation(exp, "Void Branches (Xun Kong)", "void")}
                                onError={(error) => console.error('AI Error:', error)}
                                onRequestStart={onAIRequest}
                                cardTitle="Void Branches (Xun Kong)"
                                history={aiHistory}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4 items-start flex-wrap">
                            <div className="flex gap-2">
                                {(result.xun_kong.void_branches || []).map((v, i) => {
                                    const data = getBranchData(v);
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div className="text-2xl font-serif text-white bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl border border-white/10">
                                                {v}
                                            </div>
                                            <div className="text-[9px] text-gray-500 uppercase font-bold">{data?.pinyin}</div>
                                            <div className="text-[9px] text-spirit font-bold uppercase">{data?.translation}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex-1 text-xs text-gray-400">
                                <p className="mb-2">
                                    Derived from your Day Pillar, these branches represent "emptiness" (De Kong).
                                    When they appear in your chart, they can indicate areas where energy is disconnected, spiritual, or hard to grasp.
                                </p>

                                {result.xun_kong.applies_to && result.xun_kong.applies_to.length > 0 ? (
                                    <div className="mt-3 space-y-2 pt-3 border-t border-white/5">
                                        <div className="text-[10px] text-spirit font-bold uppercase tracking-widest mb-1">Impact Analysis</div>
                                        {result.xun_kong.applies_to.map(pillar => {
                                            const p = pillar.toLowerCase();
                                            let insight = "";

                                            if (p.includes("year")) insight = "Disconnected from ancestral support. You are a self-made pioneer.";
                                            else if (p.includes("month")) insight = "Career path is non-linear. You thrive in independent or unconventional roles.";
                                            else if (p.includes("day")) insight = "Relationship dynamics are spiritual or distant. You need a partner who respects your space.";
                                            else if (p.includes("hour")) insight = "Unconventional approach to projects/children. You focus on the journey, not the legacy.";

                                            return (
                                                <div key={pillar} className="bg-white/5 p-2 rounded-lg border border-white/5">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold text-spirit uppercase bg-spirit/10 px-1.5 py-0.5 rounded border border-spirit/20">
                                                            {pillar} Pillar
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-400 leading-snug">{insight}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="mt-2 text-jade text-[11px] flex items-center gap-2 bg-jade/5 p-2 rounded-lg border border-jade/10">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Your void branches are not present in the natal chart structure. Their effects are conditional and timing-based.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Activation & Effect */}
                        <div className="pt-4 border-t border-white/5">
                            <div className="bg-black/20 rounded-lg p-3">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-spirit" /> Activation (Filling the Void)
                                </div>
                                <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                                    When a void branch appears through time (Annual Year, Month, or Luck Pillar), its latent influence becomes expressed. Themes that were abstract, delayed, or hard to grasp may move into concrete form, bringing clarity, decision, or consequence.
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    {(result.xun_kong.void_branches || []).map(branch => {
                                        const data = getBranchData(branch);
                                        const details = VOID_BRANCH_DETAILS[branch] || {
                                            themes: "Unknown",
                                            void: "Unknown",
                                            activated: "Unknown"
                                        };

                                        return (
                                            <div key={branch} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg font-serif text-white bg-black/20 w-8 h-8 flex items-center justify-center rounded border border-white/10">{branch}</span>
                                                    <div>
                                                        <div className="text-xs font-bold text-spirit uppercase">{data?.translation} ({data?.pinyin})</div>
                                                        <div className="text-[9px] text-gray-500 uppercase">Abstracted: {details.themes}</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    <div className="bg-black/20 p-2 rounded border border-white/5">
                                                        <div className="text-[8px] text-gray-600 uppercase font-bold mb-1">When Void</div>
                                                        <p className="text-[10px] text-gray-400 leading-snug">{details.void}</p>
                                                    </div>
                                                    <div className="bg-jade/5 p-2 rounded border border-jade/10">
                                                        <div className="text-[8px] text-jade uppercase font-bold mb-1">When Activated</div>
                                                        <p className="text-[10px] text-gray-300 leading-snug">{details.activated}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Interactions */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-jade text-sm font-bold uppercase tracking-widest mb-4">
                    <Activity className="w-4 h-4" /> Elemental Interactions
                </h3>
                <div className="space-y-4">
                    {(result.interactions || []).map((interaction, i) => {
                        const type = interaction.type.toLowerCase();
                        let style = { color: "text-spirit", bg: "bg-white/5", border: "border-white/5", icon: Activity, title: "Neutral" };

                        if (type.includes("harmony") || type.includes("combination") || type.includes("support")) {
                            style = { color: "text-jade", bg: "bg-jade/10", border: "border-jade/20", icon: Sparkles, title: "Synthesis" };
                        } else if (type.includes("clash") || type.includes("harm") || type.includes("punishment") || type.includes("break")) {
                            style = { color: "text-peach", bg: "bg-peach/10", border: "border-peach/20", icon: Zap, title: "Friction" };
                        }

                        const Icon = style.icon;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                                className={`p-4 rounded-xl border ${style.bg} ${style.border} relative overflow-hidden group hover:brightness-110 transition-all`}
                            >
                                <div className="flex gap-4 items-start relative z-10">
                                    <div className="flex flex-col items-center bg-black/20 p-2 rounded-lg min-w-[4rem]">
                                        <div className="text-2xl font-serif text-gray-200">
                                            {interaction.stems?.join('') || interaction.branches?.join('') || "⚡️"}
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5 mt-1">
                                            <div className="text-[7px] text-gray-400 uppercase font-mono">
                                                {(interaction.stems || interaction.branches || []).map(c => getGanzhiPinyin(c)).join('•')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className={`text-sm font-bold uppercase tracking-tight flex items-center gap-2 ${style.color}`}>
                                                <Icon className="w-3.5 h-3.5" />
                                                {interaction.id?.replace(/_/g, ' ') || interaction.type}
                                            </div>
                                            {interaction.transform_to && (
                                                <div className="text-[10px] bg-black/30 text-white px-2 py-0.5 rounded-full font-bold uppercase border border-white/10">
                                                    → {interaction.transform_to}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-mono flex items-center gap-1">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            Affects: {(interaction.pillars || []).map(p => <span key={p} className="text-gray-300 font-bold">{p}</span>).reduce((prev, curr) => [prev, ' + ', curr] as any, [])}
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed font-light">
                                            {interaction.interpretation || "This interaction creates a specific energy dynamic between the pillars, influencing your life stability and potential changes."}
                                        </p>
                                        {/* Ask AI Button */}
                                        {chartContext && (
                                            <div className="mt-3 flex justify-end print:hidden">
                                                <AskAIButton
                                                    cardType="interaction"
                                                    cardData={interaction as unknown as Record<string, unknown>}
                                                    chartContext={chartContext}
                                                    onExplanation={(explanation) => handleAIExplanation(explanation, `Interaction: ${interaction.id?.replace(/_/g, ' ') || interaction.type}`, "interaction")}
                                                    onError={(error) => console.error('AI Error:', error)}
                                                    onRequestStart={onAIRequest}
                                                    cardTitle={`Interaction: ${interaction.id?.replace(/_/g, ' ') || interaction.type}`}
                                                    history={aiHistory}
                                                    size="sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Deep Structural Analysis */}
            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-clay print:break-inside-avoid">
                <h3 className="flex items-center gap-2 text-clay text-sm font-bold uppercase tracking-widest mb-4">
                    <Briefcase className="w-4 h-4" /> Deep Structural Analysis
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Structure</div>
                        <div className="text-white font-serif text-xl">{result.professional.structure}</div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Strength</div>
                        <div className="text-white font-serif text-xl">{result.professional.dm_strength}</div>
                    </div>
                    <div className="col-span-2 p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 text-jade">Useful Elements (Yong Shen)</div>
                        <div className="flex gap-2">
                            {(result.professional.yong_shen_candidates || []).map((y, i) => (
                                <span key={i} className="px-2 py-0.5 bg-jade/10 text-jade rounded-md text-[10px] font-bold border border-jade/20">
                                    {y}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Elemental Profile</div>
                        <div className="flex gap-3">
                            <div className="flex-1 space-y-1.5">
                                <div className="text-[10px] text-spirit uppercase">Favorable</div>
                                <div className="flex gap-2 flex-wrap">
                                    {(result.professional.favorable_elements || []).map((el, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-jade/10 text-jade border border-jade/20 rounded-lg text-xs font-bold">
                                            {el}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <div className="text-[10px] text-gray-500 uppercase">Unfavorable</div>
                                <div className="flex gap-2 flex-wrap text-gray-500">
                                    {(result.professional.unfavorable_elements || []).map((el, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold">
                                            {el}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-clay/5 rounded-xl border border-clay/10">
                        <p className="text-xs text-spirit leading-relaxed italic">
                            &quot;{result.professional.interpretation}&quot;
                        </p>
                        {/* Ask AI Button */}
                        {chartContext && (
                            <div className="mt-4 pt-3 border-t border-clay/10 flex justify-end print:hidden">
                                <AskAIButton
                                    cardType="structure"
                                    cardData={result.professional as unknown as Record<string, unknown>}
                                    chartContext={chartContext}
                                    onExplanation={(explanation) => handleAIExplanation(explanation, `Structure: ${result.professional.structure}`, "structure")}
                                    onError={(error) => console.error('AI Error:', error)}
                                    onRequestStart={onAIRequest}
                                    cardTitle={`Structure: ${result.professional.structure}`}
                                    history={aiHistory}
                                    size="md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Technical Rationale (Debug Info) */}
                    {result.professional.professional_debug && (
                        <div className="pt-6 border-t border-white/5">
                            <h4 className="text-[10px] uppercase font-bold text-gray-600 mb-4 tracking-widest">Technical Rationale</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono mb-4">
                                <div>
                                    <span className="text-gray-500">Strength Score:</span>
                                    <div className="text-white">{result.professional.professional_debug.dm_strength_score}</div>
                                </div>
                                <div>
                                    <span className="text-gray-500">Balance Ratio:</span>
                                    <div className="text-white">{result.professional.professional_debug.balance_ratio}</div>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500">Seasonal Influence:</span>
                                    <div className="text-jade">{result.professional.professional_debug.season_reason}</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] text-gray-500 font-mono uppercase">Logic Flow:</span>
                                <div className="space-y-1">
                                    {(result.professional.professional_debug.yong_shen_rationale || []).map((r, i) => (
                                        <div key={i} className="text-[9px] text-spirit bg-black/20 p-1.5 rounded border border-white/5">
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
