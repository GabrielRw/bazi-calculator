"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Copy, Check, ChevronRight, History, Trash2 } from "lucide-react";
import { AIHistoryItem } from "@/types/ai";

interface AISidebarProps {
    isOpen: boolean;
    onClose: () => void;
    explanation: string;
    cardTitle?: string;
    isLoading?: boolean;
    history?: AIHistoryItem[];
    onSelectHistory?: (item: AIHistoryItem) => void;
    onClearHistory?: () => void;
}

// Simple markdown parser for common patterns
function parseMarkdown(text: string): React.ReactNode[] {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];
    let listItems: string[] = [];
    let listKey = 0;

    const flushList = () => {
        if (listItems.length > 0) {
            result.push(
                <ul key={`list-${listKey++}`} className="my-3 ml-4 space-y-1.5">
                    {listItems.map((item, i) => (
                        <li key={i} className="text-gray-300 text-sm leading-relaxed flex gap-2">
                            <span className="text-jade mt-0.5">•</span>
                            <span>{parseBold(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    const parseBold = (str: string): React.ReactNode[] => {
        const parts = str.split(/\*\*(.+?)\*\*/g);
        return parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
        );
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
            flushList();
            result.push(
                <h4 key={index} className="text-jade text-xs font-bold uppercase tracking-widest mt-5 mb-2">
                    {parseBold(trimmed.slice(4))}
                </h4>
            );
        } else if (trimmed.startsWith('## ')) {
            flushList();
            result.push(
                <h3 key={index} className="text-white text-sm font-bold uppercase tracking-wider mt-5 mb-2 pb-2 border-b border-white/10">
                    {parseBold(trimmed.slice(3))}
                </h3>
            );
        } else if (trimmed.startsWith('# ')) {
            flushList();
            result.push(
                <h2 key={index} className="text-white text-base font-bold mb-3">
                    {parseBold(trimmed.slice(2))}
                </h2>
            );
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            listItems.push(trimmed.slice(2));
        } else if (trimmed === '---' || trimmed === '***') {
            flushList();
            result.push(<hr key={index} className="border-white/10 my-4" />);
        } else if (trimmed === '') {
            flushList();
        } else {
            flushList();
            result.push(
                <p key={index} className="text-gray-300 text-sm leading-relaxed mb-3">
                    {parseBold(trimmed)}
                </p>
            );
        }
    });

    flushList();
    return result;
}

export default function AISidebar({
    isOpen,
    onClose,
    explanation,
    cardTitle,
    isLoading = false,
    history = [],
    onSelectHistory,
    onClearHistory
}: AISidebarProps) {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [view, setView] = useState<"current" | "history">("current");

    useEffect(() => {
        setMounted(true);
    }, []);

    // Switch to current view when a new explanation arrives or loading starts
    useEffect(() => {
        if (explanation || isLoading) {
            setView("current");
        }
    }, [explanation, isLoading]);

    // Typewriter effect
    useEffect(() => {
        if (!isOpen || !explanation || view !== "current") {
            if (view === "current") setDisplayedText("");
            return;
        }

        let index = 0;
        const interval = setInterval(() => {
            if (index < explanation.length) {
                setDisplayedText(explanation.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 5);

        return () => clearInterval(interval);
    }, [isOpen, explanation, view]);

    const parsedContent = useMemo(() => parseMarkdown(view === "current" ? displayedText : explanation), [displayedText, explanation, view]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(explanation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - only on mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[199] lg:hidden"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[420px] z-[200] bg-void/95 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setView(view === "current" ? "history" : "current")}
                                    className={clsx(
                                        "p-2 rounded-lg border transition-all",
                                        view === "history"
                                            ? "bg-jade text-black border-jade"
                                            : "bg-jade/10 border-jade/20 text-jade hover:bg-jade/20"
                                    )}
                                    title={view === "current" ? "View History" : "Back to Analysis"}
                                >
                                    {view === "current" ? <History className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </button>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        {view === "current" ? "AI Analysis" : "History"}
                                    </h3>
                                    {view === "current" && cardTitle && (
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                            {cardTitle}
                                        </p>
                                    )}
                                    {view === "history" && (
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                            Past explanations
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {view === "current" && (
                                    <button
                                        onClick={handleCopy}
                                        disabled={!explanation}
                                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-jade disabled:opacity-50"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-jade" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                                {view === "history" && onClearHistory && history.length > 0 && (
                                    <button
                                        onClick={onClearHistory}
                                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                                        title="Clear all history"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {view === "current" ? (
                                isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4">
                                        <div className="w-8 h-8 border-2 border-jade/30 border-t-jade rounded-full animate-spin" />
                                        <p className="text-sm text-gray-500">Analyzing...</p>
                                    </div>
                                ) : explanation ? (
                                    <div className="min-h-[100px]">
                                        {parsedContent}
                                        {displayedText.length < explanation.length && (
                                            <span className="inline-block w-0.5 h-4 bg-jade animate-pulse ml-0.5" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                        <Sparkles className="w-12 h-12 text-jade/20" />
                                        <div>
                                            <p className="text-sm text-gray-400">No analysis yet</p>
                                            <p className="text-xs text-gray-600 mt-1">Click an Ask AI button to get started</p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                /* History View */
                                <div className="space-y-4">
                                    {history.length > 0 ? (
                                        history.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => onSelectHistory?.(item)}
                                                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-jade/30 hover:bg-white/10 transition-all group"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-jade group-hover:text-white transition-colors">
                                                        {item.cardTitle}
                                                    </span>
                                                    <span className="text-[10px] text-gray-600">
                                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                                                    {item.explanation}
                                                </p>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                                            <History className="w-12 h-12 text-gray-800" />
                                            <p className="text-sm text-gray-500">History is empty</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5 flex-shrink-0">
                            <p className="text-[10px] text-gray-600 text-center">
                                Powered by Mistral AI • Explanations are interpretive, not predictive
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

import clsx from "clsx";
