"use client";

import { useState, useCallback } from "react";
import { BaziFlowResult, BaziFlowYear, BaziFlowMonth, Interaction, Star } from "@/types/bazi";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Activity, ChevronLeft, ChevronRight, Loader2, Sparkles, Zap, AlertCircle } from "lucide-react";
import { getBranchData, getStemData, getGanzhiPinyin, getGanzhiTranslation } from "@/lib/ganzhi";
import clsx from "clsx";

interface FlowSectionProps {
    initialFlow: BaziFlowResult;
    birthData: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        city: string;
        gender: string;
        timeStandard: string;
    };
}

// Cache for flow data by year
const flowCache = new Map<string, BaziFlowYear>();

function getCacheKey(birthData: FlowSectionProps["birthData"], year: number): string {
    return `${birthData.year}-${birthData.month}-${birthData.day}-${birthData.hour}-${birthData.minute}-${birthData.city}-${year}`;
}

export default function FlowSection({ initialFlow, birthData }: FlowSectionProps) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [yearData, setYearData] = useState<BaziFlowYear | null>(
        initialFlow?.years?.[0] || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    // Initialize cache with initial flow data
    if (initialFlow?.years?.[0]) {
        const key = getCacheKey(birthData, initialFlow.years[0].year);
        if (!flowCache.has(key)) {
            flowCache.set(key, initialFlow.years[0]);
        }
    }

    const fetchYearFlow = useCallback(async (targetYear: number) => {
        const cacheKey = getCacheKey(birthData, targetYear);

        // Check cache first
        if (flowCache.has(cacheKey)) {
            setYearData(flowCache.get(cacheKey)!);
            setSelectedYear(targetYear);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/bazi/flow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    year: birthData.year,
                    month: birthData.month,
                    day: birthData.day,
                    hour: birthData.hour,
                    minute: birthData.minute,
                    city: birthData.city,
                    sex: birthData.gender === "male" ? "M" : "F",
                    time_standard: birthData.timeStandard,
                    target_year: targetYear,
                    include_stars: true,
                    include_interactions: true
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch flow data for this year.");
            }

            const data: BaziFlowResult = await response.json();

            if (data.years && data.years.length > 0) {
                flowCache.set(cacheKey, data.years[0]);
                setYearData(data.years[0]);
                setSelectedYear(targetYear);
            } else {
                throw new Error("No flow data available for this year.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }, [birthData]);

    const handleYearChange = (year: number) => {
        setSelectedMonth(null);
        fetchYearFlow(year);
    };

    // Generate year options (10 years back to 10 years forward from current year)
    const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    if (!yearData && !loading) {
        return (
            <div className="text-center py-20 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-4 opacity-50" />
                <p>No flow data available. Please calculate your chart first.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 px-4">
                <div className="p-2 bg-jade/10 rounded-lg">
                    <Activity className="w-5 h-5 text-jade" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Destiny Flow</h2>
                    <p className="text-xs text-spirit">Annual and monthly energy transitions.</p>
                </div>
            </div>

            {/* Year Selector */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        <span>Select Year to Analyze</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Previous Year Button */}
                        <button
                            onClick={() => handleYearChange(selectedYear - 1)}
                            disabled={loading || selectedYear <= yearOptions[0]}
                            className={clsx(
                                "p-2 rounded-lg border transition-all",
                                selectedYear <= yearOptions[0]
                                    ? "border-white/5 text-gray-600 cursor-not-allowed"
                                    : "border-white/10 text-gray-400 hover:text-white hover:border-jade/30 hover:bg-jade/5"
                            )}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Year Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => handleYearChange(Number(e.target.value))}
                                disabled={loading}
                                className="appearance-none bg-void/60 border border-white/10 rounded-xl px-6 py-3 text-xl font-bold text-white text-center cursor-pointer hover:border-jade/30 focus:border-jade focus:outline-none focus:ring-2 focus:ring-jade/20 transition-all min-w-[140px]"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year} className="bg-void text-white">
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                {loading ? (
                                    <Loader2 className="w-4 h-4 text-jade animate-spin" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500 rotate-90" />
                                )}
                            </div>
                        </div>

                        {/* Next Year Button */}
                        <button
                            onClick={() => handleYearChange(selectedYear + 1)}
                            disabled={loading || selectedYear >= yearOptions[yearOptions.length - 1]}
                            className={clsx(
                                "p-2 rounded-lg border transition-all",
                                selectedYear >= yearOptions[yearOptions.length - 1]
                                    ? "border-white/5 text-gray-600 cursor-not-allowed"
                                    : "border-white/10 text-gray-400 hover:text-white hover:border-jade/30 hover:bg-jade/5"
                            )}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Navigation */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleYearChange(currentYear)}
                            disabled={loading || selectedYear === currentYear}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                selectedYear === currentYear
                                    ? "bg-jade/20 text-jade border border-jade/30"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-jade/30"
                            )}
                        >
                            {currentYear}
                        </button>
                        <button
                            onClick={() => handleYearChange(currentYear + 1)}
                            disabled={loading || selectedYear === currentYear + 1}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                selectedYear === currentYear + 1
                                    ? "bg-jade/20 text-jade border border-jade/30"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-jade/30"
                            )}
                        >
                            {currentYear + 1}
                        </button>
                    </div>
                </div>

                {/* Rate Limit Info */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-gray-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>Each year requires a separate API call. Previously viewed years are cached.</span>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400">
                    {error}
                </div>
            )}

            {/* Loading State */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center gap-4"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-jade/20 animate-ping absolute inset-0" />
                            <div className="w-16 h-16 rounded-full border-2 border-t-jade border-jade/20 animate-spin" />
                        </div>
                        <p className="text-spirit text-sm">Calculating {selectedYear} energy flow...</p>
                    </motion.div>
                ) : yearData ? (
                    <motion.div
                        key={`year-${selectedYear}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <YearFlowCard
                            data={yearData}
                            selectedMonth={selectedMonth}
                            onMonthSelect={setSelectedMonth}
                        />
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

interface YearFlowCardProps {
    data: BaziFlowYear;
    selectedMonth: number | null;
    onMonthSelect: (index: number | null) => void;
}

function YearFlowCard({ data, selectedMonth, onMonthSelect }: YearFlowCardProps) {
    const yearStem = getStemData(data.gan);
    const yearBranch = getBranchData(data.zhi);
    const selectedMonthData = selectedMonth !== null ? data.months[selectedMonth] : null;

    return (
        <div className="space-y-6">
            {/* Year Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl overflow-hidden"
            >
                <div className="p-6 bg-gradient-to-r from-jade/10 to-transparent border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-jade leading-none">{data.year}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Year</div>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="flex flex-col">
                            <div className="text-2xl font-serif text-white">{data.gan_zhi}</div>
                            <div className="text-[9px] text-spirit font-mono">Age {data.age}</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-center bg-white/5 px-4 py-2 rounded-xl border border-white/5 min-w-[5rem]">
                            <div className="text-xl font-serif text-white">{data.gan}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">{yearStem?.pinyin}</div>
                            <div className="text-[9px] text-spirit uppercase">{yearStem?.translation.split(' ')[1]}</div>
                        </div>
                        <div className="text-center bg-white/5 px-4 py-2 rounded-xl border border-white/5 min-w-[5rem]">
                            <div className="text-xl font-serif text-white">{data.zhi}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold">{yearBranch?.pinyin}</div>
                            <div className="text-[9px] text-spirit uppercase">{yearBranch?.translation}</div>
                        </div>
                    </div>
                </div>

                {/* Year-Level Interactions & Stars */}
                <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                    {/* Annual Interactions */}
                    <div className="p-6">
                        <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Annual Interactions
                        </h3>
                        {data.interactions && data.interactions.length > 0 ? (
                            <div className="space-y-3">
                                {data.interactions.map((inter, idx) => (
                                    <InteractionCard key={idx} interaction={inter} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">No major interactions this year.</p>
                        )}
                    </div>

                    {/* Annual Stars */}
                    <div className="p-6 bg-void/20">
                        <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Annual Stars
                        </h3>
                        {data.stars && data.stars.length > 0 ? (
                            <div className="space-y-2">
                                {data.stars.map((star, idx) => (
                                    <StarCard key={idx} star={star} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 italic">No special stars active this year.</p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Monthly Flow Grid */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                    <CalendarDays className="w-3 h-3" /> Monthly Transitions
                    {selectedMonth !== null && (
                        <button
                            onClick={() => onMonthSelect(null)}
                            className="ml-auto text-jade hover:text-white transition-colors"
                        >
                            ← View All
                        </button>
                    )}
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {data.months.map((month, idx) => {
                        const mStem = getStemData(month.gan);
                        const mBranch = getBranchData(month.zhi);
                        const isSelected = selectedMonth === idx;
                        const hasInteractions = month.interactions && month.interactions.length > 0;
                        const hasStars = month.stars && month.stars.length > 0;

                        return (
                            <motion.button
                                key={idx}
                                onClick={() => onMonthSelect(isSelected ? null : idx)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={clsx(
                                    "relative p-3 rounded-xl border text-center transition-all",
                                    isSelected
                                        ? "bg-jade/20 border-jade/50 ring-2 ring-jade/30"
                                        : "bg-void/40 border-white/5 hover:border-jade/30 hover:bg-jade/5"
                                )}
                            >
                                {/* Activity Indicators */}
                                {(hasInteractions || hasStars) && (
                                    <div className="absolute top-1 right-1 flex gap-0.5">
                                        {hasInteractions && <div className="w-1.5 h-1.5 rounded-full bg-clay" />}
                                        {hasStars && <div className="w-1.5 h-1.5 rounded-full bg-jade" />}
                                    </div>
                                )}

                                <div className="text-[8px] text-gray-600 mb-1 font-mono">Month {idx + 1}</div>
                                <div className="text-lg font-serif text-white">{month.gan_zhi}</div>
                                <div className={clsx(
                                    "text-[8px] uppercase font-bold transition-colors",
                                    isSelected ? "text-jade" : "text-gray-400"
                                )}>
                                    {mStem?.pinyin.slice(0, 3)}·{mBranch?.pinyin.slice(0, 3)}
                                </div>
                                <div className="text-[8px] text-spirit/60 uppercase mt-0.5">
                                    {mBranch?.translation.slice(0, 3)}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Month Details */}
            <AnimatePresence>
                {selectedMonthData && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <MonthDetailCard month={selectedMonthData} year={data.year} index={selectedMonth!} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MonthDetailCard({ month, year, index }: { month: BaziFlowMonth; year: number; index: number }) {
    const mStem = getStemData(month.gan);
    const mBranch = getBranchData(month.zhi);

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-jade/20">
            {/* Month Header */}
            <div className="p-4 bg-gradient-to-r from-jade/10 to-transparent border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="text-lg font-serif text-white">{month.gan_zhi}</div>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="text-sm text-spirit">Month {index + 1} • {year}</div>
                </div>
                <div className="flex gap-2">
                    <div className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400">
                        {mStem?.pinyin} • {mStem?.translation}
                    </div>
                    <div className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400">
                        {mBranch?.pinyin} • {mBranch?.translation}
                    </div>
                </div>
            </div>

            {/* Month Content */}
            <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                {/* Monthly Interactions */}
                <div className="p-4">
                    <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Monthly Interactions
                    </h4>
                    {month.interactions && month.interactions.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                            {month.interactions.map((inter, idx) => (
                                <InteractionCard key={idx} interaction={inter} compact />
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic">No major interactions this month.</p>
                    )}
                </div>

                {/* Monthly Stars */}
                <div className="p-4 bg-void/20">
                    <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Monthly Stars
                    </h4>
                    {month.stars && month.stars.length > 0 ? (
                        <div className="space-y-2">
                            {month.stars.map((star, idx) => (
                                <StarCard key={idx} star={star} compact />
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic">No special stars active this month.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function InteractionCard({ interaction, compact = false }: { interaction: Interaction; compact?: boolean }) {
    return (
        <div className={clsx(
            "rounded-xl bg-black/20 border border-white/5 hover:border-clay/30 transition-colors",
            compact ? "p-2" : "p-3"
        )}>
            <div className="flex justify-between items-start mb-1 text-[10px] font-bold">
                <span className="text-clay uppercase tracking-tight">
                    {interaction.id?.replace(/_/g, ' ') || interaction.type}
                </span>
                {interaction.transform_to && (
                    <span className="text-spirit">→ {interaction.transform_to}</span>
                )}
            </div>
            <div className="flex gap-1.5 items-center my-1.5">
                {(interaction.stems || interaction.branches || []).map((c, i) => (
                    <div key={i} className="flex flex-col items-center bg-void px-2 py-1 rounded-lg border border-white/5">
                        <span className={clsx("text-white font-serif", compact ? "text-xs" : "text-sm")}>{c}</span>
                        <span className="text-[7px] text-gray-500 uppercase font-mono">{getGanzhiPinyin(c)}</span>
                        <span className="text-[7px] text-spirit/60 uppercase font-bold">{getGanzhiTranslation(c).split(' ').pop()}</span>
                    </div>
                ))}
            </div>
            {!compact && interaction.interpretation && (
                <p className="text-[9px] text-gray-400 italic line-clamp-3">
                    {interaction.interpretation}
                </p>
            )}
        </div>
    );
}

function StarCard({ star, compact = false }: { star: Star; compact?: boolean }) {
    return (
        <div className={clsx(
            "rounded-lg bg-white/5 border border-white/5",
            compact ? "p-2" : "p-2"
        )}>
            <div className="text-xs font-bold text-white flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                {star.name}
            </div>
            {!compact && star.desc && (
                <p className="text-[10px] text-spirit leading-tight mt-1">{star.desc}</p>
            )}
        </div>
    );
}
