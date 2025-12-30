"use client";

import { motion } from "framer-motion";
import { Pillar } from "@/types/bazi";
import { cn, getElementColor } from "@/lib/utils";

interface FourPillarsProps {
    pillars: Pillar[];
}

export default function FourPillars({ pillars }: FourPillarsProps) {
    // Order: Year (Right) -> Hour (Left) is traditional, but typical Western display is Year -> Hour (Left to Right).
    // The JSON array is likely ordered Year, Month, Day, Hour.
    // We'll display them Left-to-Right: Year -> Month -> Day -> Hour for clarity, or Right-to-Left if we want traditional chineese.
    // Let's stick to standard Western LTR: Year, Month, Day, Hour.

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {pillars.map((pillar, index) => {
                const ganColor = getElementColor(pillar.gan_info.element);
                const zhiColor = getElementColor(pillar.zhi_info.element);

                return (
                    <motion.div
                        key={pillar.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card rounded-2xl p-4 flex flex-col items-center relative overflow-hidden group hover:border-white/20 transition-all"
                    >
                        {/* Label Badge */}
                        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 border border-white/5 px-2 py-0.5 rounded-full bg-black/20">
                            {pillar.label}
                        </div>

                        {/* Na Yin Overlay (Bottom) */}
                        {pillar.nayin && (
                            <div className="absolute bottom-0 inset-x-0 py-1 bg-black/40 text-[10px] text-center text-gray-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                {pillar.nayin}
                            </div>
                        )}

                        {/* Content Container */}
                        <div className="mt-6 flex flex-col items-center gap-6 w-full">

                            {/* Heavenly Stem (Gan) */}
                            <div className="flex flex-col items-center">
                                <div className={cn("text-5xl font-serif font-bold mb-1", ganColor.text)}>
                                    {pillar.gan}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-white uppercase">{pillar.gan_info.pinyin}</span>
                                    <span className={cn("text-[10px] opacity-70", ganColor.text)}>
                                        {pillar.gan_info.element} {pillar.gan_info.polarity}
                                    </span>
                                    {/* Ten God for Stem */}
                                    {pillar.ten_gods && (
                                        <span className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-300">
                                            {pillar.ten_gods.stem}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {/* Earthly Branch (Zhi) */}
                            <div className="flex flex-col items-center pb-4">
                                <div className={cn("text-5xl font-serif font-bold mb-1", zhiColor.text)}>
                                    {pillar.zhi}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-white uppercase">{pillar.zhi_info.pinyin}</span>
                                    <span className={cn("text-[10px] opacity-70", zhiColor.text)}>
                                        {pillar.zhi_info.element} {pillar.zhi_info.polarity}
                                    </span>
                                    <span className="text-[10px] text-white/50 lowercase italic">
                                        {pillar.zhi_info.zodiac}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
