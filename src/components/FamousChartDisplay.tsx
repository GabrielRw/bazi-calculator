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

            {/* 3. Wuxing - Element Balance */}
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

            {/* 4. Health / Constitution */}
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

            {/* 5. Analysis / Attributes */}
            <section>
                <AnalysisSection
                    result={chart}
                    chartContext={chartContext}
                    onAIExplanation={handleAIExplanation}
                    onAIRequest={handleAIRequest}
                />
            </section>

            {/* 6. Chart Rarity */}
            <section>
                <ChartRaritySection result={chart} />
            </section>

            {/* 7. Luck Pillars */}
            <section>
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-6 px-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay" /> Luck Cycles
                </h3>
                <LuckPillars
                    luck={chart.luck_cycle}
                    chartContext={chartContext}
                />
            </section>
        </div>
    );
}
