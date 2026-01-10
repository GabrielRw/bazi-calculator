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
    size?: "xs" | "sm" | "md";
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

    const sizeClasses = size === "xs"
        ? "p-1.5"
        : size === "sm"
            ? "p-1.5 text-[10px]"
            : "px-3 py-1.5 text-xs";

    const iconSize = size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3";

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`
                flex items-center gap-1.5 
                bg-jade/10 hover:bg-jade/20
                border border-jade/30 hover:border-jade/50
                text-jade hover:text-white
                rounded-lg font-bold uppercase tracking-wider
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeClasses}
                ${className}
            `}
            title="Ask AI to explain this aspect"
        >
            {loading ? (
                <Loader2 className={`${iconSize} animate-spin`} />
            ) : (
                <Sparkles className={iconSize} />
            )}
            {size !== "xs" && (size === "md" ? (loading ? "Thinking..." : "Ask AI") : "")}
        </button>
    );
}
