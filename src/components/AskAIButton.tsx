"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { AICardType, ChartContext } from "@/types/ai";

interface AskAIButtonProps {
    cardType: AICardType;
    cardData: Record<string, unknown>;
    chartContext: ChartContext;
    onExplanation: (explanation: string) => void;
    onError: (error: string) => void;
    className?: string;
    size?: "sm" | "md";
}

export default function AskAIButton({
    cardType,
    cardData,
    chartContext,
    onExplanation,
    onError,
    className = "",
    size = "sm"
}: AskAIButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch('/api/bazi/explain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardType,
                    cardData,
                    chartContext
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get AI explanation');
            }

            onExplanation(data.explanation);
        } catch (err) {
            onError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const sizeClasses = size === "sm"
        ? "p-1.5 text-[10px]"
        : "px-3 py-1.5 text-xs";

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`
                flex items-center gap-1.5 
                bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                hover:from-purple-500/30 hover:to-pink-500/30
                border border-purple-500/30 hover:border-purple-400/50
                text-purple-300 hover:text-purple-200
                rounded-lg font-bold uppercase tracking-wider
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeClasses}
                ${className}
            `}
            title="Ask AI to explain this aspect"
        >
            {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
                <Sparkles className="w-3 h-3" />
            )}
            {size === "md" && (loading ? "Thinking..." : "Ask AI")}
        </button>
    );
}
