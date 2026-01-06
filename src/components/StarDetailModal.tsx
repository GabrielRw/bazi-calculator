"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Quote, BookOpen, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { Star as StarType } from "@/types/bazi";
import { getStarData } from "@/data/symbolicStars";
import { useEffect } from "react";

interface StarDetailModalProps {
    star: StarType | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function StarDetailModal({ star, isOpen, onClose }: StarDetailModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!star) return null;

    const content = getStarData(star.name);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#121212] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-[#121212]/95 backdrop-blur z-10 border-b border-white/5 p-6 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 text-jade text-xs font-bold uppercase tracking-widest mb-2">
                                        <Star className="w-4 h-4" /> Symbolic Star (Shen Sha)
                                    </div>
                                    <h2 className="text-2xl font-serif text-white mb-1">{content.name}</h2>
                                    <div className="text-sm text-gray-500 font-mono">{content.pinyin}</div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-8">
                                {/* Keywords */}
                                <div className="flex flex-wrap gap-2">
                                    {content.keywords.map(k => (
                                        <span key={k} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                                            {k}
                                        </span>
                                    ))}
                                    <span className="px-3 py-1 rounded-full bg-spirit/10 border border-spirit/20 text-xs font-bold text-spirit">
                                        Found in {star.pillar} Pillar ({star.zhi})
                                    </span>
                                </div>

                                {/* Quote */}
                                <div className="relative p-6 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5">
                                    <Quote className="absolute top-4 left-4 w-6 h-6 text-jade/20" />
                                    <div className="relative z-10 text-center">
                                        <p className="text-lg font-serif italic text-gray-200 mb-3">
                                            &quot;{content.quote}&quot;
                                        </p>
                                        <div className="text-xs text-jade uppercase tracking-widest font-bold">
                                            — {content.source}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Description */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide">
                                        <BookOpen className="w-4 h-4 text-jade" /> Traditional Analysis
                                    </div>
                                    <div className="prose prose-invert prose-sm leading-relaxed text-gray-400">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                // Convert newlines to br and simple markdown bolding to strong
                                                __html: content.description
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/\n/g, '<br/>')
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Implications Grid */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-jade/5 border border-jade/10 rounded-xl">
                                        <div className="flex items-center gap-2 text-jade text-xs font-bold uppercase mb-2">
                                            <ThumbsUp className="w-3 h-3" /> Auspicious side
                                        </div>
                                        <p className="text-sm text-gray-300 leading-snug">
                                            {content.implication_positive}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase mb-2">
                                            <ThumbsDown className="w-3 h-3" /> Inauspicious side
                                        </div>
                                        <p className="text-sm text-gray-300 leading-snug">
                                            {content.implication_negative}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-[10px] text-gray-500 text-center pt-8 border-t border-white/5">
                                    <Sparkles className="w-3 h-3 inline-block mr-1 opacity-50" />
                                    Stars modify the quality of the Heavenly Stems and Earthly Branches. Their effect depends on the strength of your Useful God.
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
