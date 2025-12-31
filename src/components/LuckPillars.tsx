"use client";

import { LuckCycle } from "@/types/bazi";
import { getElementColor } from "@/lib/utils";
import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { getStemData, getBranchData } from "@/lib/ganzhi";

interface LuckPillarsProps {
    luck: LuckCycle;
    currentAge?: number; // to highlight current pillar
}

export default function LuckPillars({ luck, currentAge = 30 }: LuckPillarsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full relative group">
            <button
                onClick={() => scroll(-200)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10 hover:bg-white/10 no-print"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => scroll(200)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10 hover:bg-white/10 no-print"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide snap-x print:flex-wrap print:overflow-visible"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {luck.pillars.map((pillar) => {
                    const isCurrent = currentAge >= pillar.start_age && (pillar.end_year === 0 ? true : (currentAge <= (pillar.start_age + 9)));

                    const stemData = getStemData(pillar.gan);
                    const branchData = getBranchData(pillar.zhi);

                    const ganColors = getElementColor(stemData?.element || 'Metal');
                    const zhiColors = getElementColor(branchData?.element || 'Metal');

                    return (
                        <div
                            key={pillar.start_age}
                            className={`snap-center flex-shrink-0 w-32 glass-card rounded-xl p-4 flex flex-col items-center border ${isCurrent ? 'border-clay shadow-clay/20 shadow-lg bg-clay/5' : 'border-white/5 opacity-70 hover:opacity-100'}`}
                        >
                            <div className="text-xs text-gray-500 font-mono mb-2">Age {pillar.start_age}</div>

                            <div className="flex flex-col items-center gap-1 mb-2">
                                <div className="flex flex-col items-center">
                                    <div className={`text-2xl font-serif font-bold ${ganColors.text}`}>{pillar.gan}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">{stemData?.pinyin}</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className={`text-2xl font-serif font-bold ${zhiColors.text}`}>{pillar.zhi}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold">{branchData?.pinyin}</div>
                                </div>
                            </div>

                            <div className="text-[10px] text-spirit font-bold text-center mb-2 leading-tight">
                                {stemData?.translation.split(' ')[1]} {branchData?.translation}
                            </div>

                            <div className="mt-auto text-[10px] text-gray-400 font-mono text-center">
                                {pillar.start_year}-{pillar.end_year || '...'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

