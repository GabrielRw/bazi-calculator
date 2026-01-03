
import React from 'react';
import { BaziResult, Pillar } from "@/types/bazi";
import { getElementColor } from "@/lib/utils";

interface BaziReportProps {
    result: BaziResult | null;
    birthData: {
        year: number;
        month: number;
        day: number;
        hour: number;
        city: string;
        gender: string;
    } | null;
}

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

const pillarDomains: Record<string, string> = {
    "Year": "Social Circle & Legacy",
    "Month": "Career & Upbringing",
    "Day": "Core Self & Relationship",
    "Hour": "Aspirations & Children"
};

export default function BaziReport({ result, birthData }: BaziReportProps) {
    if (!result || !birthData) return null;

    return (
        <div id="bazi-report" className="hidden print:block font-serif bg-white text-black p-8 max-w-[210mm] mx-auto">
            {/* 1. Header Section */}
            <div className="text-center mb-12 border-b-2 border-black pb-8">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">BaZi Natal Report</h1>
                <div className="flex justify-center gap-8 text-sm font-sans uppercase tracking-wide text-gray-600">
                    <div>
                        <span className="font-bold text-black block mb-1">Date of Birth</span>
                        {birthData.day}/{birthData.month}/{birthData.year}
                    </div>
                    <div>
                        <span className="font-bold text-black block mb-1">Time</span>
                        {birthData.hour}:00
                    </div>
                    <div>
                        <span className="font-bold text-black block mb-1">Place</span>
                        {birthData.city}
                    </div>
                    <div>
                        <span className="font-bold text-black block mb-1">Gender</span>
                        {birthData.gender === "m" ? "Male" : "Female"}
                    </div>
                </div>
            </div>

            {/* 2. Natal Chart Grid */}
            <div className="mb-12 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-300 pb-2">The Four Pillars</h2>
                <div className="grid grid-cols-4 gap-4 border border-black rounded-lg overflow-hidden">
                    {result.pillars.map((pillar, i) => (
                        <div key={i} className={`p-4 text-center border-r border-black last:border-r-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <div className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-500">{pillar.label}</div>

                            {/* Stem */}
                            <div className="mb-4">
                                <div className="text-4xl font-serif font-bold mb-1">{pillar.gan}</div>
                                <div className="text-xs uppercase font-sans font-bold">{pillar.gan_info.element} {pillar.gan_info.polarity}</div>
                                {pillar.ten_gods?.stem && (
                                    <div className="text-[10px] text-gray-500 mt-1 uppercase">{pillar.ten_gods.stem}</div>
                                )}
                            </div>

                            <div className="border-t border-gray-300 my-4 w-1/2 mx-auto"></div>

                            {/* Branch */}
                            <div>
                                <div className="text-4xl font-serif font-bold mb-1">{pillar.zhi}</div>
                                <div className="text-xs uppercase font-sans font-bold">{pillar.zhi_info.element} {pillar.zhi_info.polarity}</div>
                                <div className="text-[10px] text-gray-500 mt-1 uppercase">{pillar.zhi_info.zodiac}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Deep Structural Analysis (Wuxing) */}
            <div className="mb-12 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-300 pb-2">Deep Structural Analysis</h2>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="border border-gray-300 p-4 rounded">
                        <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Structure Type</div>
                        <div className="text-2xl font-serif font-bold">{result.professional.structure}</div>
                    </div>
                    <div className="border border-gray-300 p-4 rounded">
                        <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Day Master Strength</div>
                        <div className="text-2xl font-serif font-bold">{result.professional.dm_strength}</div>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-sm leading-relaxed font-sans text-justify italic border-l-4 border-black pl-4 py-2">
                        {result.professional.interpretation}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 font-sans text-sm">
                    <div>
                        <div className="font-bold uppercase tracking-wide mb-2">Useful Elements (Yong Shen)</div>
                        <div className="flex gap-2 mb-4">
                            {result.professional.yong_shen_candidates.map(el => (
                                <span key={el} className="px-3 py-1 bg-gray-100 border border-black rounded font-bold">{el}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="font-bold uppercase tracking-wide mb-2">Favorable Elements</div>
                        <div className="flex gap-2">
                            {result.professional.favorable_elements.map(el => (
                                <span key={el} className="px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 rounded font-bold">{el}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Detailed Pillar Analysis (Full Expansion) */}
            <div className="space-y-8">
                <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-300 pb-2 break-before-page">Pillar Breakdown</h2>
                {result.pillars.map((pillar) => (
                    <div key={pillar.label} className="border border-gray-300 rounded-lg p-6 break-inside-avoid">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-widest">{pillar.label} Pillar</h3>
                                <div className="text-gray-500 text-sm font-sans italic">{pillarDomains[pillar.label]}</div>
                            </div>
                            <div className="text-right">
                                {pillar.life_stage && (
                                    <div className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded inline-block">{pillar.life_stage.name} Phase</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4 text-sm font-sans text-justify leading-relaxed">
                            {pillar.interpretation || "Analyzes the strength and quality of the Day Master based on seasonal and positional factors."}
                        </div>

                        {/* Hidden Stems Table */}
                        {pillar.ten_gods?.hidden && (
                            <div className="bg-gray-50 rounded p-4 text-xs font-sans">
                                <div className="uppercase font-bold text-gray-500 mb-2">Hidden Potential (Roots)</div>
                                <div className="grid grid-cols-3 gap-4">
                                    {pillar.ten_gods.hidden.map((h, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <span className="font-serif font-bold text-lg">{h.gan}</span>
                                            <div className="flex flex-col">
                                                <span className="font-bold">{h.ten_god}</span>
                                                <span className="text-gray-500 uppercase text-[10px]">{h.info.element}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 5. Footer */}
            <div className="mt-12 pt-8 border-t border-black text-center text-xs text-gray-400 font-sans uppercase tracking-widest">
                Generated by Bazi Calculator • {new Date().getFullYear()}
            </div>
        </div>
    );
}
