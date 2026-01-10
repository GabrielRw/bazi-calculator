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
    | 'daymaster';

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
