"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BaziResult, BaziFlowResult, SynastryResult, LifespanResult } from "@/types/bazi";
import { AICardType, ChartContext, AIHistoryItem } from "@/types/ai";
import AIIcon from "./AIIcon";
import clsx from 'clsx';

interface AskAIButtonProps {
    cardType: AICardType;
    cardData: Record<string, unknown>;
    chartContext: ChartContext;
    onExplanation: (explanation: string) => void;
    onError: (error: string) => void;
    onRequestStart?: (cardTitle: string, isCacheHit?: boolean) => void;
    cardTitle: string;
    history?: AIHistoryItem[];
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

export default function AskAIButton({
    cardType,
    cardData,
    chartContext,
    onExplanation,
    onError,
    onRequestStart,
    cardTitle,
    history,
    size = 'md',
    className
}: AskAIButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const sizeClasses = {
        xs: 'px-1.5 py-0.5 text-[9px]',
        sm: 'px-3 py-1.5 text-[10px]',
        md: 'px-4 py-2 text-xs',
        lg: 'px-6 py-3 text-sm'
    };

    const iconSizes = {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18
    };

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isLoading) return;

        // Check cache first
        if (history) {
            const cachedItem = history.find(item =>
                item.cardTitle === cardTitle &&
                item.cardType === cardType
            );

            if (cachedItem) {
                if (onRequestStart) onRequestStart(cardTitle, true);
                onExplanation(cachedItem.explanation);
                return;
            }
        }

        setIsLoading(true);
        if (onRequestStart) onRequestStart(cardTitle);

        try {
            const response = await fetch('/api/bazi/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardType, cardData, chartContext }),
            });

            if (!response.ok) throw new Error('Failed to fetch explanation');
            const data = await response.json();
            onExplanation(data.explanation);
        } catch (err: any) {
            onError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={clsx(
                "flex items-center gap-1.5 font-bold uppercase tracking-widest rounded-lg transition-all border",
                isLoading
                    ? "bg-jade/5 border-jade/20 text-jade/50 cursor-not-allowed"
                    : "bg-jade/10 border-jade/30 text-jade hover:bg-jade/20 hover:border-jade/50",
                sizeClasses[size],
                className
            )}
            title="Ask AI to explain this aspect"
        >
            {isLoading ? (
                <Loader2 className={clsx("animate-spin", size === 'xs' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5')} />
            ) : (
                <AIIcon size={iconSizes[size]} className="text-current" />
            )}
            {size !== 'xs' && (isLoading ? 'Analysing...' : 'Ask AI')}
        </button>
    );
}
