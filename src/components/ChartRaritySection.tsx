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
 * The approach: Start with a base ratio reflecting average charts,
 * then apply multipliers ONLY for genuinely unusual features.
 * Most charts should fall in the "Typical" to "Somewhat Uncommon" range.
 */
function calculateRarity(result: BaziResult): {
    ratio: number;
    label: string;
    description: string;
    factors: { name: string; rarity: string; isUnusual: boolean }[];
} {
    const factors: { name: string; rarity: string; isUnusual: boolean }[] = [];
    let rarityScore = 0; // Additive score, not multiplicative

    // 1. Day Master - all roughly equal, not a rarity factor
    factors.push({
        name: "Day Master",
        rarity: `${result.day_master.stem} (${result.day_master.info.element})`,
        isUnusual: false
    });

    // 2. Day Master Strength
    const strength = result.professional.dm_strength.toLowerCase();
    if (strength.includes('balanced') || strength.includes('neutral') || strength.includes('average')) {
        rarityScore += 15;
        factors.push({
            name: "DM Strength",
            rarity: "Balanced (uncommon ~15%)",
            isUnusual: true
        });
    } else {
        factors.push({
            name: "DM Strength",
            rarity: result.professional.dm_strength,
            isUnusual: false
        });
    }

    // 3. Structure type - only special structures are rare
    const structure = result.professional.structure.toLowerCase();
    const veryRareStructures = ['follow', 'special', 'fake', 'transform', 'dominant'];
    const uncommonStructures = ['killing', 'hurting officer'];

    if (veryRareStructures.some(s => structure.includes(s))) {
        rarityScore += 40;
        factors.push({
            name: "Structure",
            rarity: `${result.professional.structure} (rare ~3%)`,
            isUnusual: true
        });
    } else if (uncommonStructures.some(s => structure.includes(s))) {
        rarityScore += 10;
        factors.push({
            name: "Structure",
            rarity: `${result.professional.structure} (less common ~20%)`,
            isUnusual: true
        });
    } else {
        factors.push({
            name: "Structure",
            rarity: `${result.professional.structure} (typical)`,
            isUnusual: false
        });
    }

    // 4. Element distribution - only extremes are notable
    const percentages = Object.values(result.elements.percentages);
    const maxElement = Math.max(...percentages);
    const minElement = Math.min(...percentages);
    const elements = Object.keys(result.elements.percentages);
    const maxElementName = elements.find(e => result.elements.percentages[e as keyof typeof result.elements.percentages] === maxElement);

    if (minElement === 0) {
        rarityScore += 20;
        factors.push({
            name: "Element Balance",
            rarity: "Missing element (uncommon ~10%)",
            isUnusual: true
        });
    } else if (maxElement >= 60) {
        rarityScore += 25;
        factors.push({
            name: "Element Balance",
            rarity: `Very dominant ${maxElementName} (${maxElement}%)`,
            isUnusual: true
        });
    } else if (maxElement - minElement <= 8) {
        rarityScore += 30;
        factors.push({
            name: "Element Balance",
            rarity: "Exceptionally balanced (rare ~5%)",
            isUnusual: true
        });
    } else {
        factors.push({
            name: "Element Balance",
            rarity: "Normal distribution",
            isUnusual: false
        });
    }

    // 5. Symbolic stars - only extremes matter
    const starCount = result.stars?.length || 0;
    if (starCount >= 10) {
        rarityScore += 15;
        factors.push({
            name: "Symbolic Stars",
            rarity: `${starCount} stars (high, top 10%)`,
            isUnusual: true
        });
    } else if (starCount <= 1) {
        rarityScore += 10;
        factors.push({
            name: "Symbolic Stars",
            rarity: `${starCount} stars (rare, bottom 15%)`,
            isUnusual: true
        });
    } else {
        factors.push({
            name: "Symbolic Stars",
            rarity: `${starCount} stars (typical)`,
            isUnusual: false
        });
    }

    // 6. Check for same-element pillars (all stems same element)
    const pillars = result.pillars;
    if (pillars && pillars.length >= 4) {
        const stemElements = pillars.map(p => p.gan_info.element);
        const uniqueStemElements = new Set(stemElements);
        if (uniqueStemElements.size <= 2) {
            rarityScore += 20;
            factors.push({
                name: "Pillar Harmony",
                rarity: "Stems share few elements (unusual)",
                isUnusual: true
            });
        }
    }

    // Convert score to ratio
    // Score 0 = 1 in 50 (common)
    // Score 100+ = 1 in 100,000+ (very rare)
    let ratio: number;
    if (rarityScore === 0) {
        ratio = 50;
    } else if (rarityScore < 20) {
        ratio = 100 + rarityScore * 10;
    } else if (rarityScore < 40) {
        ratio = 500 + (rarityScore - 20) * 50;
    } else if (rarityScore < 60) {
        ratio = 2000 + (rarityScore - 40) * 200;
    } else if (rarityScore < 80) {
        ratio = 8000 + (rarityScore - 60) * 500;
    } else {
        ratio = 20000 + (rarityScore - 80) * 2000;
    }

    // Determine label and description
    let label: string;
    let description: string;

    if (ratio >= 50000) {
        label = "Exceptionally Rare";
        description = `Only ~1 in ${Math.round(ratio / 1000)}K charts share this exact pattern`;
    } else if (ratio >= 10000) {
        label = "Very Rare";
        description = `Approximately 1 in ${Math.round(ratio / 1000)}K charts share this pattern`;
    } else if (ratio >= 2000) {
        label = "Uncommon";
        description = `About 1 in ${ratio.toLocaleString()} charts have similar characteristics`;
    } else if (ratio >= 500) {
        label = "Somewhat Unusual";
        description = `Roughly 1 in ${ratio} charts share these traits`;
    } else if (ratio >= 150) {
        label = "Slightly Distinctive";
        description = `Around 1 in ${ratio} charts have this configuration`;
    } else {
        label = "Common Pattern";
        description = `A fairly typical chart configuration (~1 in ${ratio})`;
    }

    return { ratio, label, description, factors };
}

export default function ChartRaritySection({ result }: ChartRaritySectionProps) {
    const rarity = calculateRarity(result);

    // Calculate a visual percentage for the gauge (log scale, capped)
    const logRatio = Math.log10(Math.max(rarity.ratio, 1));
    const minLog = Math.log10(50); // 1 in 50
    const maxLog = Math.log10(100000); // 1 in 100K
    const gaugePercent = Math.min(Math.max(((logRatio - minLog) / (maxLog - minLog)) * 100, 5), 100);

    // Color based on rarity
    const getColor = () => {
        if (rarity.ratio >= 50000) return "text-purple-400";
        if (rarity.ratio >= 10000) return "text-jade";
        if (rarity.ratio >= 2000) return "text-blue-400";
        if (rarity.ratio >= 500) return "text-amber-400";
        return "text-gray-400";
    };

    const getBgColor = () => {
        if (rarity.ratio >= 50000) return "from-purple-500/20 to-purple-500/5";
        if (rarity.ratio >= 10000) return "from-jade/20 to-jade/5";
        if (rarity.ratio >= 2000) return "from-blue-500/20 to-blue-500/5";
        if (rarity.ratio >= 500) return "from-amber-500/20 to-amber-500/5";
        return "from-gray-500/20 to-gray-500/5";
    };

    const unusualFactors = rarity.factors.filter(f => f.isUnusual);

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
                            1 in {rarity.ratio >= 1000
                                ? `${(rarity.ratio / 1000).toFixed(rarity.ratio >= 10000 ? 0 : 1)}K`
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
                        </div>
                    </div>
                </div>

                {/* Factors breakdown - only show unusual ones prominently */}
                {unusualFactors.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 uppercase tracking-wider mb-3">
                            <Info className="w-3 h-3" />
                            What Makes Your Chart Distinctive
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {unusualFactors.map((factor, i) => (
                                <div key={i} className="text-[10px] px-3 py-1.5 rounded-full bg-white/10 text-white">
                                    <span className="text-gray-400">{factor.name}:</span>{" "}
                                    <span className="font-medium">{factor.rarity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {unusualFactors.length === 0 && (
                    <div className="mt-4 text-[10px] text-gray-500 text-center">
                        Your chart has a typical configuration with no extreme characteristics.
                    </div>
                )}
            </motion.div>
        </div>
    );
}
