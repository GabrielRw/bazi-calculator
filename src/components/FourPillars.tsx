"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pillar } from "@/types/bazi";
import { cn, getElementColor } from "@/lib/utils";
import { Info, X } from "lucide-react";

interface FourPillarsProps {
    pillars: Pillar[];
}

export default function FourPillars({ pillars }: FourPillarsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {pillars.map((pillar, index) => (
                <PillarCard key={pillar.label} pillar={pillar} index={index} />
            ))}
        </div>
    );
}

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    const ganColor = getElementColor(pillar.gan_info.element);
    const zhiColor = getElementColor(pillar.zhi_info.element);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            className="glass-card rounded-2xl p-6 flex flex-col items-center relative overflow-hidden group border border-white/5 hover:border-clay/30 transition-all duration-500"
        >
            {/* Label Badge */}
            <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                {pillar.label}
            </div>

            {/* Na Yin & Life Stage (Floating Top Right) */}
            <div className="absolute top-4 right-4 text-right space-y-1">
                {pillar.life_stage && (
                    <div className="text-[9px] font-bold text-jade uppercase bg-jade/10 border border-jade/20 px-2 py-0.5 rounded-full">
                        {pillar.life_stage.name}
                    </div>
                )}
                {pillar.nayin && (
                    <div className="text-[8px] text-spirit/60 font-mono tracking-tighter">
                        {pillar.nayin}
                    </div>
                )}
            </div>

            {/* Main Grid */}
            <div className="mt-10 grid grid-cols-2 gap-x-8 w-full">
                {/* Stem (Top Row) */}
                <div className="flex flex-col items-center col-span-2 pb-6 border-b border-white/5">
                    <div className={cn("text-6xl font-serif font-bold mb-2 transition-transform group-hover:scale-110", ganColor.text)}>
                        {pillar.gan}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-white uppercase tracking-widest">{pillar.gan_info.pinyin}</span>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] uppercase font-bold", ganColor.text)}>{pillar.gan_info.element}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] text-gray-400 capitalize">{pillar.gan_info.polarity}</span>
                        </div>
                        {pillar.ten_gods && (
                            <div className="mt-2 text-xs font-bold text-clay uppercase bg-clay/10 px-3 py-0.5 rounded-lg border border-clay/20">
                                {pillar.ten_gods.stem}
                            </div>
                        )}
                    </div>
                </div>

                {/* Branch (Full Row) */}
                <div className="flex flex-col items-center col-span-2 pt-6">
                    <div className={cn("text-6xl font-serif font-bold mb-2 transition-transform group-hover:scale-110", zhiColor.text)}>
                        {pillar.zhi}
                    </div>
                    <div className="flex flex-col items-center gap-1 mb-6">
                        <span className="text-xs font-bold text-white uppercase tracking-widest">{pillar.zhi_info.pinyin}</span>
                        <div className="flex items-center gap-2">
                            <span className={cn("text-[10px] uppercase font-bold", zhiColor.text)}>{pillar.zhi_info.element}</span>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] text-gray-400 capitalize">{pillar.zhi_info.polarity}</span>
                        </div>
                        <span className="text-[10px] text-spirit border border-white/10 px-2 py-0.5 rounded-full bg-white/5 mt-1">
                            {pillar.zhi_info.zodiac}
                        </span>
                    </div>

                    {/* Hidden Stems Section */}
                    {pillar.ten_gods?.hidden && (
                        <div className="w-full space-y-2">
                            <div className="text-[9px] uppercase font-bold text-gray-600 tracking-wider text-center flex items-center gap-2 justify-center">
                                <div className="h-px bg-white/5 flex-1" /> Hidden Stems <div className="h-px bg-white/5 flex-1" />
                            </div>
                            <div className="grid grid-cols-1 gap-1.5">
                                {pillar.ten_gods.hidden.map((hidden, hIdx) => {
                                    const hColor = getElementColor(hidden.info.element);
                                    return (
                                        <div key={hIdx} className="flex items-center justify-between px-3 py-1.5 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <span className={cn("text-sm font-serif", hColor.text)}>{hidden.gan}</span>
                                                <span className="text-[9px] text-gray-500 uppercase">{hidden.pinyin}</span>
                                            </div>
                                            <div className="text-[10px] text-spirit font-bold text-right">
                                                {hidden.ten_god}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Icon (Bottom Left) */}
            {pillar.interpretation && (
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="absolute bottom-4 left-4 p-1.5 rounded-full bg-white/5 border border-white/5 text-gray-500 hover:text-clay hover:bg-clay/10 transition-all z-20 cursor-help no-print"
                >
                    <Info className="w-3 h-3" />
                </div>
            )}

            {/* Interpretation Overlay */}
            <AnimatePresence>
                {isHovered && pillar.interpretation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 bg-void/95 p-8 flex flex-col justify-center backdrop-blur-md z-10 pointer-events-none"
                    >
                        <h4 className="text-xs font-bold text-clay uppercase tracking-widest mb-4">Pillar Interpretation</h4>
                        <p className="text-xs text-spirit leading-relaxed italic">
                            {pillar.interpretation}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
