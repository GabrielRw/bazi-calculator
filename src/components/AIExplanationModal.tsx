"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Copy, Check } from "lucide-react";

interface AIExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    explanation: string;
    cardTitle?: string;
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
        }, 8); // Speed of typewriter

        return () => clearInterval(interval);
    }, [isOpen, explanation]);

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
                        className="relative z-[201] w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-gradient-to-b from-[#0F0F12] to-[#0A0A0C] border border-white/10 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                    <Sparkles className="w-4 h-4 text-purple-300" />
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
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
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
                            <div className="prose prose-invert prose-sm max-w-none">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {displayedText}
                                    {displayedText.length < explanation.length && (
                                        <span className="inline-block w-0.5 h-4 bg-purple-400 animate-pulse ml-0.5" />
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Footer gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0A0A0C] to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
