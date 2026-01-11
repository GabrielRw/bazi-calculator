"use client";

import { BaziResult } from "@/types/bazi";
import { motion } from "framer-motion";
import { Sparkles, Gem, Info } from "lucide-react";

interface ChartRaritySectionProps {
    result: BaziResult;
}

/**
 * Calculate chart rarity based on BaZi characteristics
 * 
 * Factors considered:
 * 1. Day Master stem (10 options) - 1/10
 * 2. Hour pillar Gan-Zhi (60 combinations) - 1/60  
 * 3. Month pillar affects season (12 months) - 1/12
 * 4. Year pillar (60 year cycle) - 1/60
 * 5. Special structures are rarer
 * 6. Extreme element distributions are rarer
 * 7. Special star configurations
 * 
 * Base calculation: 10 stems × 12 branches = 60 Jia Zi
 * Four pillars: 60^4 theoretical but constrained by calendar
 * Realistic unique daily pillars per 60-year cycle ≈ 21,900 days
 * With hour pillar: 21,900 × 12 = 262,800 unique chart patterns per cycle
 */
function calculateRarity(result: BaziResult): {
    ratio: number;
    label: string;
    description: string;
    factors: { name: string; multiplier: number; note: string }[];
} {
    const factors: { name: string; multiplier: number; note: string }[] = [];
    let rarityMultiplier = 1;

    // 1. Day Master base (10 stems, roughly equal)
    factors.push({
        name: "Day Master Stem",
        multiplier: 10,
        note: `${result.day_master.stem} is one of 10 Day Masters`
    });
    rarityMultiplier *= 10;

    // 2. Day Master Strength (Strong ~40%, Weak ~40%, Balanced ~20%)
    const strength = result.professional.dm_strength.toLowerCase();
    if (strength.includes('balanced') || strength.includes('neutral')) {
        factors.push({
            name: "DM Strength",
            multiplier: 5,
            note: "Balanced/Neutral strength is rarer (~20%)"
        });
        rarityMultiplier *= 5;
    } else {
        factors.push({
            name: "DM Strength",
            multiplier: 2.5,
            note: "Strong/Weak strength (~40% each)"
        });
        rarityMultiplier *= 2.5;
    }

    // 3. Structure type rarity
    const structure = result.professional.structure.toLowerCase();
    const rareStructures = ['follow', 'special', 'fake', 'transform'];
    const uncommonStructures = ['killing', 'hurting', 'indirect'];

    if (rareStructures.some(s => structure.includes(s))) {
        factors.push({
            name: "Structure Type",
            multiplier: 50,
            note: `${result.professional.structure} is a rare structure (~2%)`
        });
        rarityMultiplier *= 50;
    } else if (uncommonStructures.some(s => structure.includes(s))) {
        factors.push({
            name: "Structure Type",
            multiplier: 10,
            note: `${result.professional.structure} is uncommon (~10%)`
        });
        rarityMultiplier *= 10;
    } else {
        factors.push({
            name: "Structure Type",
            multiplier: 4,
            note: `${result.professional.structure} is a common structure (~25%)`
        });
        rarityMultiplier *= 4;
    }

    // 4. Element distribution extremity
    const percentages = Object.values(result.elements.percentages);
    const maxElement = Math.max(...percentages);
    const minElement = Math.min(...percentages);

    if (minElement === 0) {
        factors.push({
            name: "Missing Element",
            multiplier: 8,
            note: "Chart missing one element entirely (~12%)"
        });
        rarityMultiplier *= 8;
    } else if (maxElement >= 50) {
        factors.push({
            name: "Dominant Element",
            multiplier: 6,
            note: `One element dominates 50%+ (~15%)`
        });
        rarityMultiplier *= 6;
    } else if (maxElement - minElement <= 10) {
        factors.push({
            name: "Balanced Elements",
            multiplier: 10,
            note: "Very balanced element distribution (~10%)"
        });
        rarityMultiplier *= 10;
    }

    // 5. Symbolic stars count
    const starCount = result.stars?.length || 0;
    if (starCount >= 8) {
        factors.push({
            name: "Many Stars",
            multiplier: 5,
            note: `${starCount} symbolic stars (top 20%)`
        });
        rarityMultiplier *= 5;
    } else if (starCount <= 2) {
        factors.push({
            name: "Few Stars",
            multiplier: 4,
            note: `Only ${starCount} symbolic stars (~25%)`
        });
        rarityMultiplier *= 4;
    }

    // 6. Calculate final ratio
    // Base population of chart variations in a 60-year cycle
    const baseChartVariations = 262800; // Approximate unique patterns
    const effectiveRatio = Math.round(baseChartVariations * rarityMultiplier / 100);

    // Determine label and description
    let label: string;
    let description: string;

    if (effectiveRatio >= 1000000) {
        label = "Exceptionally Rare";
        description = `Approximately 1 in ${(effectiveRatio / 1000000).toFixed(1)} million charts share your pattern`;
    } else if (effectiveRatio >= 100000) {
        label = "Very Rare";
        description = `Approximately 1 in ${Math.round(effectiveRatio / 1000)}K charts share your pattern`;
    } else if (effectiveRatio >= 10000) {
        label = "Uncommon";
        description = `Approximately 1 in ${Math.round(effectiveRatio / 1000)}K charts share your pattern`;
    } else if (effectiveRatio >= 1000) {
        label = "Somewhat Rare";
        description = `Approximately 1 in ${effectiveRatio.toLocaleString()} charts share your pattern`;
    } else {
        label = "Common Pattern";
        description = `Approximately 1 in ${effectiveRatio.toLocaleString()} charts share your pattern`;
    }

    return { ratio: effectiveRatio, label, description, factors };
}

export default function ChartRaritySection({ result }: ChartRaritySectionProps) {
    const rarity = calculateRarity(result);

    // Calculate a visual percentage for the gauge (log scale)
    const logRatio = Math.log10(rarity.ratio);
    const maxLog = 7; // 10 million
    const gaugePercent = Math.min((logRatio / maxLog) * 100, 100);

    // Color based on rarity
    const getColor = () => {
        if (rarity.ratio >= 1000000) return "text-purple-400";
        if (rarity.ratio >= 100000) return "text-jade";
        if (rarity.ratio >= 10000) return "text-blue-400";
        if (rarity.ratio >= 1000) return "text-amber-400";
        return "text-gray-400";
    };

    const getBgColor = () => {
        if (rarity.ratio >= 1000000) return "from-purple-500/20 to-purple-500/5";
        if (rarity.ratio >= 100000) return "from-jade/20 to-jade/5";
        if (rarity.ratio >= 10000) return "from-blue-500/20 to-blue-500/5";
        if (rarity.ratio >= 1000) return "from-amber-500/20 to-amber-500/5";
        return "from-gray-500/20 to-gray-500/5";
    };

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">
                    Chart Rarity
                </h3>
                <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br ${getBgColor()}`}
            >
                {/* Decorative background */}
                <div className="absolute top-0 right-0 opacity-5">
                    <Gem className="w-32 h-32 -mt-8 -mr-8" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    {/* Main stat */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className={`w-5 h-5 ${getColor()}`} />
                            <span className={`text-sm font-bold uppercase tracking-wider ${getColor()}`}>
                                {rarity.label}
                            </span>
                        </div>

                        <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                            1 in {rarity.ratio >= 1000000
                                ? `${(rarity.ratio / 1000000).toFixed(1)}M`
                                : rarity.ratio >= 1000
                                    ? `${(rarity.ratio / 1000).toFixed(0)}K`
                                    : rarity.ratio.toLocaleString()}
                        </div>

                        <p className="text-xs text-gray-400">{rarity.description}</p>
                    </div>

                    {/* Rarity gauge */}
                    <div className="w-full md:w-48">
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-2 text-center">Rarity Scale</div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 flex">
                                <div className="flex-1 bg-gray-500/20" />
                                <div className="flex-1 bg-amber-500/20" />
                                <div className="flex-1 bg-blue-500/20" />
                                <div className="flex-1 bg-jade/20" />
                                <div className="flex-1 bg-purple-500/20" />
                            </div>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${gaugePercent}%` }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="h-full bg-white/80 rounded-full relative z-10"
                            />
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-600 mt-1">
                            <span>Common</span>
                            <span>Rare</span>
                            <span>Unique</span>
                        </div>
                    </div>
                </div>

                {/* Factors breakdown */}
                <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase tracking-wider mb-3">
                        <Info className="w-3 h-3" />
                        Contributing Factors
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {rarity.factors.map((factor, i) => (
                            <div key={i} className="text-[10px] p-2 rounded-lg bg-white/5">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">{factor.name}</span>
                                    <span className="text-white font-medium">×{factor.multiplier}</span>
                                </div>
                                <div className="text-[9px] text-gray-600">{factor.note}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
