"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Copy, Check } from "lucide-react";

interface AIExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    explanation: string;
    cardTitle?: string;
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

        // Header (## or ###)
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
        }
        // List item (- or *)
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            listItems.push(trimmed.slice(2));
        }
        // Horizontal rule
        else if (trimmed === '---' || trimmed === '***') {
            flushList();
            result.push(<hr key={index} className="border-white/10 my-4" />);
        }
        // Empty line
        else if (trimmed === '') {
            flushList();
        }
        // Regular paragraph
        else {
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

export default function AIExplanationModal({
    isOpen,
    onClose,
    explanation,
    cardTitle
}: AIExplanationModalProps) {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    // Typewriter effect
    useEffect(() => {
        if (!isOpen || !explanation) {
            setDisplayedText("");
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
        }, 5); // Slightly faster for better UX

        return () => clearInterval(interval);
    }, [isOpen, explanation]);

    const parsedContent = useMemo(() => parseMarkdown(displayedText), [displayedText]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(explanation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="relative z-[201] w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl glass-card border border-white/10 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-jade/10 border border-jade/20">
                                    <Sparkles className="w-4 h-4 text-jade" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        AI Analysis
                                    </h3>
                                    {cardTitle && (
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                            {cardTitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-jade"
                                    title="Copy to clipboard"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-jade" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                            <div className="min-h-[100px]">
                                {parsedContent}
                                {displayedText.length < explanation.length && (
                                    <span className="inline-block w-0.5 h-4 bg-jade animate-pulse ml-0.5" />
                                )}
                            </div>
                        </div>

                        {/* Footer gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-void to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
