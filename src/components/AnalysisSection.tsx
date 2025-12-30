"use client";

import { BaziResult } from "@/types/bazi";
import { motion } from "framer-motion";
import { Star, Zap, Briefcase } from "lucide-react";

interface AnalysisSectionProps {
    result: BaziResult;
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
                    {result.stars.map((star, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-spirit/30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-white font-bold text-sm">{star.name}</span>
                                <span className="text-[10px] text-gray-500 uppercase px-2 py-0.5 bg-black/30 rounded-full">
                                    {star.pillar} ({star.zhi})
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{star.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Interactions */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-jade text-sm font-bold uppercase tracking-widest mb-4">
                    <Zap className="w-4 h-4" /> Interactions
                </h3>
                <div className="space-y-3">
                    {result.interactions.map((interaction, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            className="flex gap-4 items-start p-3 bg-white/5 rounded-xl border border-white/5"
                        >
                            <div className="text-xl font-serif text-gray-600">
                                {/* Try to show the relevant chars if available */}
                                {interaction.stems?.join('+') || interaction.branches?.join('+') || "⚡️"}
                            </div>
                            <div>
                                <div className="text-sm text-jade font-bold mb-0.5">{interaction.type}</div>
                                <div className="text-xs text-gray-500 mb-1">
                                    Affects: {interaction.pillars.join(', ')}
                                </div>
                                <p className="text-xs text-gray-300">{interaction.interpretation}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Professional Analysis */}
            <div className="glass-card rounded-2xl p-6 border-l-4 border-l-clay">
                <h3 className="flex items-center gap-2 text-clay text-sm font-bold uppercase tracking-widest mb-4">
                    <Briefcase className="w-4 h-4" /> Professional Insight
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-black/20 rounded-xl">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Structure</div>
                        <div className="text-white font-serif text-lg">{result.professional.structure}</div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Strength</div>
                        <div className="text-white font-serif text-lg">{result.professional.dm_strength}</div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Favorable Elements</div>
                    <div className="flex gap-2 flex-wrap">
                        {result.professional.favorable_elements.map((el, i) => (
                            <span key={i} className="px-3 py-1 bg-jade/10 text-jade border border-jade/20 rounded-lg text-xs font-bold">
                                {el}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-gray-300 leading-relaxed italic">
                        "{result.professional.interpretation}"
                    </p>
                </div>
            </div>
        </div>
    );
}
