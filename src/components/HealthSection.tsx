"use client";

import { HealthResult } from "@/types/bazi";
import { AICardType, ChartContext, AIHistoryItem } from "@/types/ai";
import { motion } from "framer-motion";
import { Thermometer, Droplets, Shield, AlertTriangle, TrendingUp, Sparkles, Activity, Leaf, Info } from "lucide-react";
import AskAIButton from "./AskAIButton";

// Element colors for consistent styling
const ELEMENT_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
    Wood: { bg: "bg-emerald-500/20", text: "text-emerald-400", accent: "bg-emerald-500" },
    Fire: { bg: "bg-red-500/20", text: "text-red-400", accent: "bg-red-500" },
    Earth: { bg: "bg-amber-500/20", text: "text-amber-400", accent: "bg-amber-500" },
    Metal: { bg: "bg-slate-300/20", text: "text-slate-300", accent: "bg-slate-300" },
    Water: { bg: "bg-blue-500/20", text: "text-blue-400", accent: "bg-blue-500" },
};

// TCM organ correspondences for educational context
const ELEMENT_ORGANS: Record<string, { yin: string; yang: string }> = {
    Wood: { yin: "Liver", yang: "Gallbladder" },
    Fire: { yin: "Heart", yang: "Small Intestine" },
    Earth: { yin: "Spleen", yang: "Stomach" },
    Metal: { yin: "Lungs", yang: "Large Intestine" },
    Water: { yin: "Kidneys", yang: "Bladder" },
};

interface HealthSectionProps {
    data: HealthResult;
    chartContext?: ChartContext;
    onAIExplanation: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}

// Temperature gauge component
function TemperatureGauge({ score, label }: { score: number; label: string }) {
    // Map score from [-1, 1] to percentage [0, 100]
    const percentage = ((score + 1) / 2) * 100;
    const isHot = score > 0.25;
    const isCold = score < -0.25;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-clay" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Temperature</span>
                </div>
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${isHot ? "bg-red-500/20 text-red-400" :
                    isCold ? "bg-blue-500/20 text-blue-400" :
                        "bg-gray-500/20 text-gray-400"
                    }`}>
                    {label}
                </span>
            </div>
            <div className="relative h-3 bg-gradient-to-r from-blue-600 via-gray-600 to-red-600 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-gray-800 transform -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 uppercase">
                <span>Cold</span>
                <span>Balanced</span>
                <span>Hot</span>
            </div>
        </div>
    );
}

// Moisture gauge component
function MoistureGauge({ score, label }: { score: number; label: string }) {
    const percentage = ((score + 1) / 2) * 100;
    const isDamp = score > 0.2;
    const isDry = score < -0.2;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-jade" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Moisture</span>
                </div>
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${isDamp ? "bg-cyan-500/20 text-cyan-400" :
                    isDry ? "bg-orange-500/20 text-orange-400" :
                        "bg-gray-500/20 text-gray-400"
                    }`}>
                    {label}
                </span>
            </div>
            <div className="relative h-3 bg-gradient-to-r from-orange-600 via-gray-600 to-cyan-600 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-gray-800 transform -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-[9px] text-gray-500 uppercase">
                <span>Dry</span>
                <span>Balanced</span>
                <span>Damp</span>
            </div>
        </div>
    );
}

// Element bar with rooting indicator
function ElementBar({
    element,
    percentage,
    rooting,
    isDominant,
    isWeak,
    multiplier
}: {
    element: string;
    percentage: number;
    rooting: number;
    isDominant: boolean;
    isWeak: boolean;
    multiplier: number;
}) {
    const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.Earth;
    const organs = ELEMENT_ORGANS[element];

    return (
        <div className="space-y-1.5 group">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${colors.text}`}>{element}</span>
                    {isDominant && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-jade/20 text-jade font-bold uppercase">Strong</span>
                    )}
                    {isWeak && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold uppercase">Weak</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-gray-500">×{multiplier.toFixed(1)}</span>
                    <span className="text-xs text-gray-400 font-mono">{percentage.toFixed(1)}%</span>
                </div>
            </div>

            {/* Main bar */}
            <div className="relative h-4 bg-white/5 rounded-lg overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${colors.accent} opacity-80`}
                />

                {/* Rooting indicator (darker section at bottom) */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rooting * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`absolute bottom-0 h-1.5 ${colors.accent} opacity-100`}
                    title={`Rooting: ${(rooting * 100).toFixed(0)}%`}
                />
            </div>

            {/* Organ tooltip on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-gray-500 flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                <span>{organs?.yin} / {organs?.yang}</span>
            </div>
        </div>
    );
}

// Timing risk card
function TimingRiskCard({ peak }: { peak: { period?: string; year?: number; gan_zhi: string; strain_index: number; strain_type?: string; drivers?: string[]; level: string } }) {
    const levelColors: Record<string, string> = {
        low: "bg-green-500/20 text-green-400 border-green-500/30",
        moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        elevated: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        high: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const colorClass = levelColors[peak.level] || levelColors.moderate;

    return (
        <div className={`p-3 rounded-lg border ${colorClass} space-y-2`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-serif text-white">{peak.gan_zhi}</span>
                    <span className="text-xs text-gray-400">
                        {peak.period || peak.year}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold">{peak.level}</span>
                    <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-current rounded-full"
                            style={{ width: `${peak.strain_index * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {peak.strain_type && (
                <div className="text-[10px] uppercase tracking-wider text-gray-500">
                    Type: {peak.strain_type}
                </div>
            )}

            {peak.drivers && peak.drivers.length > 0 && (
                <div className="text-xs text-gray-400 italic">
                    {peak.drivers[0]}
                </div>
            )}
        </div>
    );
}

export default function HealthSection({ data, chartContext, onAIExplanation, onAIRequest, aiHistory }: HealthSectionProps) {
    const { bazi_context, element_balance, constitution, timing } = data;
    const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">
                    Health & Constitution Analysis
                </h3>
                <div className="flex-1 h-px bg-white/5" />
                <div className="flex items-center gap-1 text-[9px] text-gray-600">
                    <Info className="w-3 h-3" />
                    <span>TCM Framework</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Constitution Card (Main Feature) */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden">

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <Activity className="w-4 h-4 text-jade" />
                                Constitution Type
                            </h4>
                            <div className="flex gap-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${constitution.temperature === "hot" ? "bg-red-500/20 text-red-400" :
                                    constitution.temperature === "cold" ? "bg-blue-500/20 text-blue-400" :
                                        "bg-gray-500/20 text-gray-400"
                                    }`}>
                                    {constitution.temperature}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${constitution.moisture === "damp" ? "bg-cyan-500/20 text-cyan-400" :
                                    constitution.moisture === "dry" ? "bg-orange-500/20 text-orange-400" :
                                        "bg-gray-500/20 text-gray-400"
                                    }`}>
                                    {constitution.moisture}
                                </span>
                            </div>
                        </div>

                        {/* Day Master Context */}
                        <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500">Day Master</span>
                                <span className="text-lg font-serif text-white">{bazi_context.day_master}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${ELEMENT_COLORS[bazi_context.day_master_element]?.bg} ${ELEMENT_COLORS[bazi_context.day_master_element]?.text}`}>
                                    {bazi_context.day_master_element}
                                </span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${bazi_context.day_master_strength === "Weak" ? "bg-red-500/20 text-red-400" : "bg-jade/20 text-jade"
                                    }`}>
                                    {bazi_context.day_master_strength}
                                </span>
                            </div>
                        </div>

                        {/* Gauges */}
                        <TemperatureGauge
                            score={constitution.temperature_score}
                            label={constitution.temperature}
                        />

                        <MoistureGauge
                            score={constitution.moisture_score}
                            label={constitution.moisture}
                        />

                        {/* Seasonal Context */}
                        <div className="text-[10px] text-gray-500 flex items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-lg">{element_balance.seasonal_adjustments.month_branch}</span>
                            <span>Birth month influences seasonal element strength</span>
                        </div>
                    </div>
                </div>

                {/* Element Balance Panel */}
                <div className="glass-card rounded-2xl p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-clay" />
                            Element Balance
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-white/30 rounded" />
                                <span>Distribution</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-1 bg-white/60 rounded" />
                                <span>Rooting</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {elements.map((el) => (
                            <ElementBar
                                key={el}
                                element={el}
                                percentage={element_balance.effective_distribution[el] || 0}
                                rooting={element_balance.rooting_scores[el] || 0}
                                isDominant={element_balance.dominant_elements.includes(el)}
                                isWeak={element_balance.weak_elements.includes(el)}
                                multiplier={element_balance.seasonal_adjustments.multipliers[el] || 1}
                            />
                        ))}
                    </div>

                    {/* Dominant / Weak Summary */}
                    <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Dominant</div>
                            <div className="flex flex-wrap gap-1">
                                {element_balance.dominant_elements.map(el => (
                                    <span key={el} className={`text-xs px-2 py-1 rounded ${ELEMENT_COLORS[el]?.bg} ${ELEMENT_COLORS[el]?.text} font-bold`}>
                                        {el}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Weak / Deficient</div>
                            <div className="flex flex-wrap gap-1">
                                {element_balance.weak_elements.map(el => (
                                    <span key={el} className={`text-xs px-2 py-1 rounded ${ELEMENT_COLORS[el]?.bg} ${ELEMENT_COLORS[el]?.text} font-bold opacity-60`}>
                                        {el}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Balance Strategy & Timing Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Balance Strategy */}
                <div className="glass-card rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                        <Shield className="w-4 h-4 text-jade" />
                        Balance Strategy
                    </h4>

                    <div className="space-y-4">
                        {/* Priority Elements */}
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Priority Elements to Cultivate</div>
                            <div className="flex flex-wrap gap-2">
                                {bazi_context.balance_strategy.priority_elements.map((el, i) => (
                                    <motion.div
                                        key={el}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${ELEMENT_COLORS[el]?.bg} border border-white/10`}
                                    >
                                        <Sparkles className={`w-4 h-4 ${ELEMENT_COLORS[el]?.text}`} />
                                        <span className={`text-sm font-bold ${ELEMENT_COLORS[el]?.text}`}>{el}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Reasons */}
                        <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Rationale</div>
                            <ul className="space-y-2">
                                {bazi_context.balance_strategy.reason.map((reason, i) => (
                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-jade mt-1.5 flex-shrink-0" />
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Favorable vs Unfavorable */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-jade/10 rounded-lg p-3 border border-jade/20">
                                <div className="text-[10px] uppercase tracking-wider text-jade mb-1">Favorable</div>
                                <div className="text-xs text-gray-300">
                                    {bazi_context.favorable_elements.join(", ")}
                                </div>
                            </div>
                            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                <div className="text-[10px] uppercase tracking-wider text-red-400 mb-1">Unfavorable</div>
                                <div className="text-xs text-gray-300">
                                    {bazi_context.unfavorable_elements.join(", ")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timing Risk Analysis */}
                <div className="glass-card rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-clay" />
                        Timing Risk Periods
                    </h4>

                    {timing ? (
                        <div className="space-y-4">
                            {/* Decade Peaks */}
                            {timing.decade_peaks.length > 0 && (
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Decade Peaks</div>
                                    <div className="space-y-2">
                                        {timing.decade_peaks.slice(0, 3).map((peak, i) => (
                                            <TimingRiskCard key={i} peak={peak} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Year Peaks */}
                            {timing.year_peaks.length > 0 && (
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Annual Peaks</div>
                                    <div className="space-y-2">
                                        {timing.year_peaks.slice(0, 3).map((peak, i) => (
                                            <TimingRiskCard key={i} peak={peak} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-[9px] text-gray-500 pt-2 border-t border-white/5">
                                Analysis range: {timing.analysis_range}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <Activity className="w-8 h-8 mb-2 opacity-30" />
                            <span className="text-xs">Timing analysis not available</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Disclaimer & AI Button */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="text-[9px] text-gray-500 italic max-w-2xl">
                    ⚠️ {data.disclaimer?.slice(0, 200) || "This analysis is based on classical BaZi/TCM frameworks and does not constitute medical advice."}
                </div>

                {chartContext && (
                    <div className="print:hidden">
                        <AskAIButton
                            cardType="health"
                            cardData={data as unknown as Record<string, unknown>}
                            chartContext={chartContext}
                            onExplanation={(exp) => onAIExplanation(exp, "Health & Constitution", "health")}
                            onError={(err) => console.error(err)}
                            onRequestStart={onAIRequest}
                            cardTitle="Health & Constitution"
                            history={aiHistory}
                            size="sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
