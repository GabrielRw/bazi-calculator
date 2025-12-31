export interface GanZhiInfo {
    name: string;
    pinyin: string;
    element: string;
    polarity: string;
    zodiac?: string; // For Zhi
    hidden?: string[]; // For Zhi
}

export interface TenGodInfo {
    stem: string;
    hidden?: Array<{
        gan: string;
        info: GanZhiInfo;
        ten_god: string;
        pinyin: string;
    }>;
}

export interface Pillar {
    label: string;
    gan: string;
    zhi: string;
    gan_info: GanZhiInfo;
    zhi_info: GanZhiInfo;
    nayin?: string;
    life_stage?: {
        chinese: string;
        name: string;
    };
    gan_pinyin: string;
    zhi_pinyin: string;
    ten_gods?: TenGodInfo;
    interpretation?: string;
}

export interface DayMaster {
    stem: string;
    info: GanZhiInfo;
    pinyin: string;
}

export interface LuckPillar {
    start_age: number;
    start_year: number;
    end_year: number;
    gan_zhi: string;
    gan: string;
    zhi: string;
    gan_pinyin: string;
    zhi_pinyin: string;
}

export interface LuckCycle {
    start_age_years: number;
    is_forward: boolean;
    pillars: LuckPillar[];
}

export interface ElementData {
    scoring_model: string;
    points: Record<string, number>;
    percentages: Record<string, number>;
    dominant: string;
}

export interface Star {
    name: string;
    pillar: string;
    zhi: string;
    desc: string;
}

export interface Interaction {
    id?: string;
    type: string;
    pillars: string[]; // e.g. ["month", "day"]
    stems?: string[];
    branches?: string[];
    interpretation?: string;
    transform_to?: string;
    can_transform?: boolean;
    transform_level?: string;
    transform_score?: number;
}

export interface Professional {
    dm_strength: string;
    structure: string;
    yong_shen_candidates: string[];
    favorable_elements: string[];
    unfavorable_elements: string[];
    interpretation: string;
    professional_debug?: {
        dm_strength_score: number;
        seasonal_factor: number;
        season_reason: string;
        balance_ratio: number;
        yong_shen_rationale: string[];
        structure_rationale: string;
    };
}

export interface BaziFlowMonth {
    index: number;
    gan_zhi: string;
    gan: string;
    zhi: string;
    gan_pinyin: string;
    zhi_pinyin: string;
    interactions?: Interaction[];
    stars?: Star[];
}

export interface BaziFlowYear {
    year: number;
    gan_zhi: string;
    gan: string;
    zhi: string;
    gan_pinyin?: string;
    zhi_pinyin?: string;
    age: number;
    months: BaziFlowMonth[];
    interactions: Interaction[];
    stars: Star[];
    active_luck?: {
        gan_zhi: string;
        start_year: number;
        end_year: number;
    };
}

export interface BaziFlowResult {
    target_year: number;
    years: BaziFlowYear[];
}

export interface BaziResult {
    day_master: DayMaster;
    pillars: Pillar[];
    luck_cycle: LuckCycle;
    elements: ElementData;
    summary: {
        lunar_date: string;
        zodiac: string;
        solar_term: string | null;
    };
    stars: Star[];
    interactions: Interaction[];
    professional: Professional;
    xun_kong?: {
        void_branches: string[];
        xun_name: string;
        xun_index: number;
        day_pillar: string;
        applies_to?: string[];
    };
    astro_debug?: {
        input_local_time: string;
        effective_solar_time: string;
        resolved_timezone: string;
        time_standard: string;
        solar_terms: Record<string, string>;
    };
}
