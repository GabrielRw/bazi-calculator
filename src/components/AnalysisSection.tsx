"use client";

import { BaziResult } from "@/types/bazi";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, Briefcase, Info, Activity, Sparkles } from "lucide-react";
import { getBranchData, getGanzhiPinyin, getGanzhiTranslation } from "@/lib/ganzhi";
import { useState } from "react";

interface AnalysisSectionProps {
    result: BaziResult;
}

function StarCard({ star, index }: { star: any, index: number }) {
    const [showInfo, setShowInfo] = useState(false);

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

export default function AnalysisSection({ result }: AnalysisSectionProps) {
    return (
        <div className="space-y-6 w-full">
            {/* Symbolic Stars */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-spirit text-sm font-bold uppercase tracking-widest mb-4">
                    <Star className="w-4 h-4" /> Symbolic Stars
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {(result.stars || []).map((star, i) => (
                        <StarCard key={i} star={star} index={i} />
                    ))}
                </div>
            </div>

            {/* Xun Kong (Void) */}
            {result.xun_kong && (
                <div className="glass-card rounded-2xl p-6 border-l-4 border-l-spirit">
                    <h3 className="flex items-center gap-2 text-spirit text-sm font-bold uppercase tracking-widest mb-4">
                        <Zap className="w-4 h-4" /> Void Branches (Xun Kong)
                    </h3>
                    <div className="flex gap-4 items-center flex-wrap">
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
                            These branches represent "emptiness" or "delays" in your natal chart.
                            {result.xun_kong.applies_to && (
                                <>
                                    <br />
                                    Applies to: <span className="text-spirit uppercase font-bold">{result.xun_kong.applies_to.join(', ')}</span> cycles.
                                </>
                            )}
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
                                            Affects: {(interaction.pillars || []).map(p => <span key={p} className="text-gray-300 font-bold">{p}</span>).reduce((prev, curr) => [prev, ' + ', curr] as any, [])}
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed font-light">
                                            {interaction.interpretation || "This interaction creates a specific energy dynamic between the pillars, influencing your life stability and potential changes."}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Professional Analysis */}
            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-clay">
                <h3 className="flex items-center gap-2 text-clay text-sm font-bold uppercase tracking-widest mb-4">
                    <Briefcase className="w-4 h-4" /> Professional Insight
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
                            "{result.professional.interpretation}"
                        </p>
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
        </div>
    );
}
