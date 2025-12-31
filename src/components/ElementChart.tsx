"use client";

import { ElementData } from "@/types/bazi";
import { getElementColor } from "@/lib/utils";
import { motion } from "framer-motion";

interface ElementChartProps {
    data: ElementData;
}

export default function ElementChart({ data }: ElementChartProps) {
    // Elements in generative cycle order
    const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];

    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-6">
                Element Strength ({data.dominant} Dominant)
            </h3>

            <div className="space-y-4">
                {elements.map((el, i) => {
                    const percentage = data.percentages[el] || 0;
                    const colors = getElementColor(el);

                    return (
                        <div key={el} className="flex items-center gap-4">
                            <div className="w-16 flex-shrink-0">
                                <div className={`text-sm font-bold ${colors.text}`}>{el}</div>
                                <div className="text-xs text-gray-500">{percentage}%</div>
                            </div>

                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={`h-full rounded-full transition-all ${colors.base} shadow-lg`}
                                    style={{
                                        boxShadow: percentage > 0 ? `0 0 10px ${colors.text.replace('text-', '')}` : 'none'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-gray-500 font-mono">
                Scoring Model: {data.scoring_model}
            </div>
        </div>
    );
}
