"use client";

import { BaziResult } from "@/types/bazi";
import { ChartContext, AICardType, AIHistoryItem } from "@/types/ai";
import { motion } from "framer-motion";
import { Users, Star, ChevronDown, ChevronUp, Sparkles, Crown, Palette, FlaskConical, Briefcase, Trophy } from "lucide-react";
import { useState, useMemo } from "react";
import { matchCharts, ChartMatch, getMatchDescription } from "@/lib/chartMatcher";
import { CATEGORY_LABELS, CATEGORY_COLORS, FamousCategory } from "@/data/famousPeople";
import AskAIButton from "./AskAIButton";

// Category icons
const CATEGORY_ICONS: Record<FamousCategory, React.ReactNode> = {
    artist: <Palette className="w-3 h-3" />,
    leader: <Crown className="w-3 h-3" />,
    scientist: <FlaskConical className="w-3 h-3" />,
    entrepreneur: <Briefcase className="w-3 h-3" />,
    performer: <Trophy className="w-3 h-3" />,
};

interface FamousMatchesSectionProps {
    result: BaziResult;
    chartContext?: ChartContext;
    onAIExplanation: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}

function MatchCard({ match, rank }: { match: ChartMatch; rank: number }) {
    const [expanded, setExpanded] = useState(false);
    const { person, score, commonalities, breakdown } = match;
    const categoryColors = CATEGORY_COLORS[person.category];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
            className="glass-card rounded-xl p-4 relative overflow-hidden group hover:border-white/20 transition-all"
        >
            {/* Rank Badge */}
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-jade/20 text-jade flex items-center justify-center text-xs font-bold">
                #{rank + 1}
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar placeholder with initials */}
                <div className={`w-12 h-12 rounded-full ${categoryColors.bg} ${categoryColors.text} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                    {person.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{person.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors.bg} ${categoryColors.text} font-bold uppercase flex items-center gap-1`}>
                            {CATEGORY_ICONS[person.category]}
                            {person.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* Score */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-jade" />
                    <span className="text-2xl font-bold text-white">{score}%</span>
                    <span className="text-xs text-gray-500">{getMatchDescription(score)}</span>
                </div>
            </div>

            {/* Day Master chip */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-serif text-white">{person.dayMaster.stem}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    {person.dayMaster.polarity} {person.dayMaster.element}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${person.dmStrength === 'Strong' ? 'bg-jade/20 text-jade' :
                        person.dmStrength === 'Weak' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-500/20 text-gray-400'
                    }`}>
                    {person.dmStrength}
                </span>
            </div>

            {/* Commonalities */}
            {commonalities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {commonalities.map((c, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-jade/10 text-jade border border-jade/20">
                            ✓ {c}
                        </span>
                    ))}
                </div>
            )}

            {/* Expand/Collapse */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors py-1"
            >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? 'Less' : 'More'}
            </button>

            {/* Expanded Content */}
            {expanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-3 border-t border-white/5 mt-2 space-y-3"
                >
                    {/* Brief */}
                    <p className="text-xs text-gray-400 italic">{person.brief}</p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1">
                        {person.keywords.map((kw, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                                {kw}
                            </span>
                        ))}
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-1.5">
                        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Match Breakdown</div>
                        <div className="grid grid-cols-3 gap-2 text-[9px]">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Day Master</span>
                                <span className="text-white">{breakdown.dayMaster}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Strength</span>
                                <span className="text-white">{breakdown.dmStrength}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Elements</span>
                                <span className="text-white">{breakdown.elements}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Structure</span>
                                <span className="text-white">{breakdown.structure}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Pillars</span>
                                <span className="text-white">{breakdown.pillars}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Stars</span>
                                <span className="text-white">{breakdown.stars}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

export default function FamousMatchesSection({
    result,
    chartContext,
    onAIExplanation,
    onAIRequest,
    aiHistory
}: FamousMatchesSectionProps) {
    const [showAll, setShowAll] = useState(false);

    // Compute matches
    const matches = useMemo(() => matchCharts(result, 10), [result]);

    const displayedMatches = showAll ? matches : matches.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">
                    Famous Chart Matches
                </h3>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[9px] text-gray-600 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    50 Historical Figures
                </span>
            </div>

            {/* Intro Text */}
            <div className="glass-card rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-400">
                    <span className="text-white font-medium">Discover your chart archetypes.</span> We compare your BaZi chart
                    against 50 famous figures from history—artists, leaders, scientists, entrepreneurs, and performers—to find
                    those with similar cosmic blueprints. Scores are based on Day Master, element balance, structure, and more.
                </div>
            </div>

            {/* Matches Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {displayedMatches.map((match, i) => (
                    <MatchCard key={match.person.id} match={match} rank={i} />
                ))}
            </div>

            {/* Show More / Less */}
            {matches.length > 5 && (
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp className="w-4 h-4" /> Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" /> Show {matches.length - 5} More
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* AI Button */}
            {chartContext && (
                <div className="flex justify-end print:hidden">
                    <AskAIButton
                        cardType="structure"
                        cardData={{
                            topMatches: matches.slice(0, 3).map(m => ({
                                name: m.person.name,
                                score: m.score,
                                commonalities: m.commonalities,
                                category: m.person.category
                            }))
                        } as unknown as Record<string, unknown>}
                        chartContext={chartContext}
                        onExplanation={(exp) => onAIExplanation(exp, "Famous Chart Matches", "structure")}
                        onError={(err) => console.error(err)}
                        onRequestStart={onAIRequest}
                        cardTitle="Famous Chart Matches"
                        history={aiHistory}
                        size="sm"
                    />
                </div>
            )}
        </div>
    );
}
