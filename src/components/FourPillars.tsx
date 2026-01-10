"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pillar } from "@/types/bazi";
import { ChartContext, AICardType, AIHistoryItem } from "@/types/ai";
import { cn, getElementColor } from "@/lib/utils";
import { Info, X, Zap, Sparkles, User } from "lucide-react";
import AskAIButton from "./AskAIButton";

interface FourPillarsProps {
    pillars: Pillar[];
    chartContext?: ChartContext;
    onAIExplanation?: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest?: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}

const pillarDomains: Record<string, string> = {
    "Year": "Social Circle & Legacy",
    "Month": "Career & Upbringing",
    "Day": "Core Self & Relationship",
    "Hour": "Aspirations & Children"
};

const tenGodArchetypes: Record<string, string> = {
    "Friend": "The Companion",
    "Rob Wealth": "The Challenger",
    "Eating God": "The Artist",
    "Hurting Officer": "The Innovator",
    "Direct Wealth": "The Builder",
    "Indirect Wealth": "The Hunter",
    "Direct Officer": "The Commander",
    "Seven Killings": "The Warrior",
    "Direct Resource": "The Guardian",
    "Indirect Resource": "The Seeker"
};

export default function FourPillars({ pillars, chartContext, onAIExplanation, onAIRequest, aiHistory }: FourPillarsProps) {
    const [activePillarIndex, setActivePillarIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const handleAIExplanation = (explanation: string, cardTitle: string) => {
        if (onAIExplanation) {
            onAIExplanation(explanation, cardTitle);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-10">
                {pillars.map((pillar, index) => (
                    <PillarCard
                        key={pillar.label}
                        pillar={pillar}
                        index={index}
                        onClick={() => setActivePillarIndex(index)}
                        chartContext={chartContext}
                        onAIExplanation={handleAIExplanation}
                        onAIRequest={onAIRequest}
                        aiHistory={aiHistory}
                    />
                ))}
            </div>

            {/* Detailed Overlay View (Portaled to Body) */}
            {mounted && createPortal(
                <AnimatePresence>
                    {activePillarIndex !== null && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setActivePillarIndex(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                key="modal"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2, delay: 0.05 }}
                                className="relative z-[101] w-full max-w-lg pointer-events-none flex justify-center"
                            >
                                <PillarDetailView
                                    pillar={pillars[activePillarIndex]}
                                    onClose={() => setActivePillarIndex(null)}
                                    chartContext={chartContext}
                                    onAIExplanation={handleAIExplanation}
                                    onAIRequest={onAIRequest}
                                    aiHistory={aiHistory}
                                />
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

function PillarCard({ pillar, index, onClick, chartContext, onAIExplanation, onAIRequest, aiHistory }: {
    pillar: Pillar;
    index: number;
    onClick: () => void;
    chartContext?: ChartContext;
    onAIExplanation?: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest?: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}) {
    const ganColor = getElementColor(pillar.gan_info.element);
    const zhiColor = getElementColor(pillar.zhi_info.element);
    const archetype = pillar.ten_gods?.stem ? tenGodArchetypes[pillar.ten_gods.stem] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            className="glass-card rounded-2xl p-6 pb-16 flex flex-col items-center relative overflow-hidden group border border-white/5 hover:border-clay/50 cursor-pointer hover:shadow-2xl hover:shadow-clay/10 transition-all duration-300 print:pb-6 print:min-h-0"
        >
            {/* Hover visual cue - Hide in print */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-clay/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity print:hidden" />

            {/* Domain Label */}
            <div className="absolute top-4 left-4" onClick={onClick}>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 group-hover:text-white transition-colors print:text-black">
                    {pillar.label}
                </div>
                <div className="text-[8px] text-spirit/60 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 print:opacity-100 print:translate-y-0 print:text-gray-500">
                    {pillarDomains[pillar.label]}
                </div>
            </div>

            {/* Na Yin & Life Stage (Floating Top Right) */}
            <div className="absolute top-4 right-4 text-right space-y-1">
                {pillar.life_stage && (
                    <div className="text-[9px] font-bold text-jade uppercase bg-jade/10 border border-jade/20 px-2 py-0.5 rounded-full print:bg-gray-100 print:border-gray-300 print:text-teal-700">
                        {pillar.life_stage.name}
                    </div>
                )}
            </div>

            {/* Main Grid - clickable area */}
            <div className="mt-12 grid grid-cols-1 gap-y-6 w-full text-center print:mt-8 print:gap-y-4" onClick={onClick}>
                {/* Stem */}
                <div className="flex flex-col items-center">
                    <div className={cn("text-7xl font-serif font-bold mb-2 transition-transform group-hover:scale-110", ganColor.text)}>
                        {pillar.gan}
                    </div>
                    {archetype && (
                        <div className="text-xs font-bold text-clay uppercase tracking-wider mb-0.5 print:text-orange-700">
                            {archetype}
                        </div>
                    )}
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{pillar.gan_info.pinyin}</span>
                    <span className="text-[9px] text-gray-600 uppercase">{pillar.gan_info.element} {pillar.gan_info.polarity}</span>
                </div>

                {/* Branch */}
                <div className="flex flex-col items-center pt-4 border-t border-white/5 relative print:border-gray-200">
                    {/* Zodiac Background Watermark - Hide in print */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-white/[0.02] font-serif pointer-events-none print:hidden">
                        {pillar.zhi}
                    </div>

                    <div className={cn("text-5xl font-serif font-bold mb-2 transition-transform group-hover:scale-110", zhiColor.text)}>
                        {pillar.zhi}
                    </div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5 print:text-black">
                        {pillar.zhi_info.zodiac}
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{pillar.zhi_info.pinyin}</span>
                    <span className="text-[9px] text-gray-600 uppercase">{pillar.zhi_info.element} {pillar.zhi_info.polarity}</span>
                </div>
            </div>

            {/* Bottom actions - Info and AI button */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4 print:hidden">
                <button onClick={onClick} className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-600 opacity-50 group-hover:opacity-100 transition-opacity">
                    <Info className="w-3 h-3" /> Details
                </button>
                {chartContext && onAIExplanation && (
                    <AskAIButton
                        cardType="pillar"
                        cardData={pillar as unknown as Record<string, unknown>}
                        chartContext={chartContext}
                        onExplanation={(exp) => onAIExplanation?.(exp, `${pillar.label} Pillar`, "pillar")}
                        onError={(err) => console.error(err)}
                        onRequestStart={onAIRequest}
                        cardTitle={`${pillar.label} Pillar`}
                        history={aiHistory}
                        size="sm"
                    />
                )}
            </div>
        </motion.div>
    );
}

function PillarDetailView({ pillar, onClose, chartContext, onAIExplanation, onAIRequest, aiHistory }: {
    pillar: Pillar;
    onClose: () => void;
    chartContext?: ChartContext;
    onAIExplanation?: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest?: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}) {
    const ganColor = getElementColor(pillar.gan_info.element);
    const zhiColor = getElementColor(pillar.zhi_info.element);
    const archetype = pillar.ten_gods?.stem ? tenGodArchetypes[pillar.ten_gods.stem] : null;

    const handleAskAI = (explanation: string) => {
        if (onAIExplanation) {
            onAIExplanation(explanation, `${pillar.label} Pillar`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg pointer-events-auto max-h-[90vh] overflow-y-auto"
        >

            <div className="relative p-6 md:p-8">
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="text-xs font-bold text-jade uppercase tracking-[0.3em] mb-2 print:text-teal-700">
                        {pillar.label} Pillar Analysis
                    </div>
                    <h2 className="text-2xl font-serif text-white mb-1 print:text-black">
                        {pillarDomains[pillar.label]}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        Meaning & Influence
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8 relative">
                    {/* Vertical Divider */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 print:bg-gray-200" />

                    {/* Stem Analysis */}
                    <div className="text-center">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-4 tracking-widest">Heaven</div>
                        <div className={cn("text-6xl font-serif font-bold mb-3", ganColor.text)}>
                            {pillar.gan}
                        </div>
                        <div className="inline-block bg-white/5 px-3 py-1 rounded-full text-xs font-bold text-white mb-2 border border-white/10 print:text-black print:border-gray-200">
                            {pillar.gan_info.element}
                        </div>
                        {archetype && (
                            <div className="mt-2 text-clay font-bold text-sm flex items-center justify-center gap-1.5 direction-col print:text-orange-700">
                                <User className="w-3 h-3" /> &quot;The {archetype.split(' ')[1]}&quot;
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                            Points to your outer world expression and surface relationships.
                        </p>
                    </div>

                    {/* Branch Analysis */}
                    <div className="text-center">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-4 tracking-widest">Earth</div>
                        <div className={cn("text-6xl font-serif font-bold mb-3", zhiColor.text)}>
                            {pillar.zhi}
                        </div>
                        <div className="inline-block bg-white/5 px-3 py-1 rounded-full text-xs font-bold text-white mb-2 border border-white/10 print:text-black print:border-gray-200">
                            {pillar.zhi_info.zodiac}
                        </div>
                        <div className="mt-2 text-jade font-bold text-xs print:text-teal-700">
                            {pillar.life_stage?.name || 'Cycle'} Phase
                        </div>
                        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                            Determines your inner reality, feelings, and domestic life.
                        </p>
                    </div>
                </div>

                {/* Interpretation Content */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/5 relative overflow-hidden print:bg-white print:border-gray-200">
                    <div className="absolute top-0 right-0 p-4 opacity-5 print:hidden">
                        <Sparkles className="w-24 h-24" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 print:text-black">
                        <Zap className="w-4 h-4 text-clay print:text-orange-600" /> Core Insight
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed italic print:text-gray-700">
                        &quot;{pillar.interpretation || "This pillar represents a fundamental aspect of your life structure. Its interactions define your potential."}&quot;
                    </p>

                    {/* Ask AI Button */}
                    {chartContext && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end print:hidden">
                            <AskAIButton
                                cardType="pillar"
                                cardData={pillar as unknown as Record<string, unknown>}
                                chartContext={chartContext}
                                onExplanation={handleAskAI}
                                onError={(error) => console.error('AI Error:', error)}
                                onRequestStart={onAIRequest}
                                cardTitle={`${pillar.label} Pillar`}
                                history={aiHistory}
                                size="md"
                            />
                        </div>
                    )}
                </div>

                {/* Hidden Stems Detail */}
                {pillar.ten_gods?.hidden && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Hidden Potential (Roots)
                            </h3>
                            {chartContext && (
                                <AskAIButton
                                    cardType="roots"
                                    cardData={{
                                        pillar_name: pillar.label,
                                        hidden_stems: pillar.ten_gods.hidden
                                    }}
                                    chartContext={chartContext}
                                    onExplanation={(exp) => onAIExplanation?.(exp, `${pillar.label} Root Potential`, "roots")}
                                    onError={(error) => console.error('AI Error:', error)}
                                    onRequestStart={onAIRequest}
                                    cardTitle={`${pillar.label} Root Potential`}
                                    history={aiHistory}
                                    size="xs"
                                />
                            )}
                        </div>
                        <div className="grid gap-2">
                            {pillar.ten_gods.hidden.map((hidden, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("text-xl font-serif w-8 text-center", getElementColor(hidden.info.element).text)}>
                                            {hidden.gan}
                                        </div>
                                        <div className="text-xs text-gray-400 print:text-gray-600">
                                            {hidden.info.element}
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-spirit text-right print:text-gray-700">
                                        {hidden.ten_god}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
