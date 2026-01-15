"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, ChevronRight } from "lucide-react";
import { FAMOUS_PEOPLE, CATEGORY_COLORS, FamousCategory } from "@/data/famousPeople";
import { FAMOUS_CHARTS_DATA } from "@/data/famousPeopleCharts";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically build verified IDs from actual chart data
const VERIFIED_IDS = new Set(FAMOUS_CHARTS_DATA.map(p => p.id));

const ALL_CATEGORIES: FamousCategory[] = ['artist', 'leader', 'scientist', 'entrepreneur', 'performer'];

export default function FamousChartsIndex() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<FamousCategory | 'all'>('all');

    const filteredPeople = useMemo(() => {
        return FAMOUS_PEOPLE.filter(person => {
            const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                person.brief.toLowerCase().includes(searchQuery.toLowerCase()) ||
                person.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = selectedCategory === 'all' || person.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-12 space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jade/10 text-jade text-xs font-bold uppercase tracking-wider mb-2"
                >
                    <Sparkles className="w-3 h-3" />
                    Bazi Database
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60"
                >
                    Famous Charts Library
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-400 max-w-2xl mx-auto"
                >
                    Explore the destiny charts of {FAMOUS_PEOPLE.length} historical figures, celebrities, and visionaries.
                    Calculated using True Solar Time for maximum precision.
                </motion.p>
            </div>

            {/* Search & Filter */}
            <div className="mb-10 space-y-4">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-jade/50 transition-all"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                            ${selectedCategory === 'all'
                                ? "bg-white text-black"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                    >
                        All
                    </button>
                    {ALL_CATEGORIES.map(cat => {
                        const colors = CATEGORY_COLORS[cat];
                        const isSelected = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border
                                    ${isSelected
                                        ? `${colors.bg} ${colors.text} ${colors.border}`
                                        : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"}`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredPeople.map((person) => {
                        const hasFullChart = VERIFIED_IDS.has(person.id);
                        const colors = CATEGORY_COLORS[person.category];

                        return (
                            <motion.div
                                layout
                                key={person.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-card rounded-xl p-5 hover:bg-white/5 transition-colors group relative overflow-hidden element-entry"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`w-2 h-2 rounded-full ${colors.bg.replace('/20', '')}`}
                                            />
                                            <span
                                                className={`text-[10px] uppercase font-bold tracking-wider ${colors.text}`}
                                            >
                                                {person.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-jade transition-colors">
                                            {person.name}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-[10px] text-gray-500 font-mono">
                                            {person.birth.year}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono">
                                            {person.birth.country}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                    {person.brief}
                                </p>

                                {/* Keywords */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {person.keywords.slice(0, 3).map(k => (
                                        <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                                            {k}
                                        </span>
                                    ))}
                                </div>

                                {hasFullChart ? (
                                    <Link
                                        href={`/famous-charts/${person.id}`}
                                        className="inline-flex items-center gap-2 text-xs font-bold text-jade hover:text-jade-light transition-colors"
                                    >
                                        View Full Analysis <ChevronRight className="w-3 h-3" />
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 cursor-not-allowed">
                                        Analysis Coming Soon
                                    </span>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredPeople.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p>No famous figures found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
