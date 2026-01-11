import { BaziResult, DayMaster, ElementData } from "@/types/bazi";

export type AICardType =
    | 'pillar'
    | 'star'
    | 'interaction'
    | 'structure'
    | 'wuxing'
    | 'yongshen'
    | 'void'
    | 'luck'
    | 'lifespan'
    | 'daymaster'
    | 'roots'
    | 'element_balance'
    | 'health';

export interface AIHistoryItem {
    id: string;
    timestamp: number;
    cardType: AICardType;
    cardTitle: string;
    explanation: string;
    chartId: string; // Hash or unique string for the current chart
}

export interface ChartContext {
    dayMaster: DayMaster;
    elements: ElementData;
    structure: string;
    dmStrength: string;
    pillars: BaziResult['pillars'];
}

export interface AIExplanationRequest {
    cardType: AICardType;
    cardData: Record<string, unknown>;
    chartContext: ChartContext;
}

export interface AIExplanationResponse {
    explanation: string;
    tokens_used?: number;
    error?: string;
}
