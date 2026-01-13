"use client";

import { BaziResult } from "@/types/bazi";
import { ChartContext } from "@/types/ai";
import FourPillars from "@/components/FourPillars";
import WuxingChart from "@/components/WuxingChart";
import HealthSection from "@/components/HealthSection";
import AnalysisSection from "@/components/AnalysisSection";
import ChartRaritySection from "@/components/ChartRaritySection";
import LuckPillars from "@/components/LuckPillars";

interface FamousChartDisplayProps {
    chart: BaziResult;
    chartContext: ChartContext;
}

export default function FamousChartDisplay({ chart, chartContext }: FamousChartDisplayProps) {
    // No-op handlers for static page
    const handleAIExplanation = () => { };
    const handleAIRequest = () => { };

    return (
        <div className="space-y-12">
            {/* 0. Day Master Card (New) */}
            <section className="flex justify-center">
                <div className="glass-card rounded-2xl p-8 flex flex-col justify-center text-center relative overflow-hidden group min-w-0 max-w-2xl w-full">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-8">
                        Day Master Energy
                    </h3>
                    <div className="space-y-6">
                        <div className="text-8xl font-serif text-white hover:scale-110 transition-transform cursor-default select-none">
                            {chart.day_master.stem}
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-clay mb-1">{chart.day_master.info.name}</div>
                            <div className="text-xs text-spirit uppercase tracking-widest">{chart.day_master.info.polarity} {chart.day_master.info.element}</div>
                        </div>
                        <div className="pt-6 border-t border-white/5">
                            <p className="text-gray-400 text-sm italic leading-relaxed">
                                &quot;{chart.professional.interpretation.split('.')[0]}.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1. Four Pillars */}
            <section>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-6 px-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-jade" /> Natal Chart
                </h3>
                <FourPillars
                    pillars={chart.pillars}
                    chartContext={chartContext}
                    onAIExplanation={handleAIExplanation}
                    onAIRequest={handleAIRequest}
                />
            </section>

            {/* 2. Wuxing - Element Balance (Renamed from 3 to match flow) */}
            <section>
                <WuxingChart
                    data={{
                        percentages: chart.elements.percentages,
                        points: chart.elements.points,
                        scoring_model: chart.elements.scoring_model,
                        dominant: chart.elements.dominant
                    }}
                    pillars={chart.pillars}
                    chartContext={chartContext}
                    onAIExplanation={handleAIExplanation}
                    onAIRequest={handleAIRequest}
                />
            </section>

            {/* 3. Health / Constitution */}
            {chart.health && (
                <section>
                    <HealthSection
                        data={chart.health}
                        chartContext={chartContext}
                        onAIExplanation={handleAIExplanation}
                        onAIRequest={handleAIRequest}
                    />
                </section>
            )}

            {/* 4. Chart Rarity (Moved up) */}
            <section>
                <ChartRaritySection result={chart} />
            </section>

            {/* 5. Luck Pillars */}
            <section>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-6 px-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay" /> Luck Cycles
                </h3>
                <LuckPillars
                    luck={chart.luck_cycle}
                    chartContext={chartContext}
                />
            </section>

            {/* 6. Analysis / Attributes (Moved to bottom) */}
            <section>
                <AnalysisSection
                    result={chart}
                    chartContext={chartContext}
                    onAIExplanation={handleAIExplanation}
                    onAIRequest={handleAIRequest}
                />
            </section>
        </div>
    );
}
