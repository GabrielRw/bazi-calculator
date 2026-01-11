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
        latitude?: number;
        longitude?: number;
    };
    current_age?: number;
    health?: HealthResult;
}

export interface SynastryResult {
    score: number;
    score_breakdown: {
        day_master: number;
        spouse_palace: number;
        pillars: number;
        elements: number;
        hidden_bonus: number;
    };
    overall_compatibility: string;
    day_master_analysis: {
        dm_a: string;
        dm_b: string;
        relation: string;
        score: number;
        description: string;
        dynamic: string;
    };
    spouse_palace_analysis: {
        branch_a: string;
        branch_b: string;
        interaction: string;
        score: number;
        description: string;
        type: string;
    };
    element_analysis: {
        score: number;
        details: string[];
        a_needs: string;
        b_needs: string;
    };
    pillar_interactions: Array<{
        pillar: string;
        weight: number;
        branch_interaction: {
            type: string;
            label: string;
            score_modifier: number;
        };
        stem_interaction: string;
        net_score: number;
    }>;
    hidden_interactions: {
        connections: string[];
        count: number;
    };
    conflict_scan: {
        clashes: number;
        harms: number;
        punishments: number;
        destructions: number;
    };
    conflict_summary: string;
}

export interface LifespanCurvePoint {
    age: number;
    year: number;
    j0: number;              // Baseline Jing
    j_final: number;         // Modified Jing (Blue)
    jing_prenatal: number;   // Inherited (Pre-Heaven) Jing
    jing_postnatal: number;  // Acquired (Post-Heaven) Jing buffer
    qi: number;              // Total usable Qi
    qi_pre_heaven: number;   // Innate Qi flow (Yuan Qi)
    qi_post_heaven: number;  // Metabolic Qi from lifestyle
    prenatal_integrity: number; // 0-1, how well original essence is preserved
    shen: number;            // Spirit/Coherence (Gold)
    S: number;               // Support Index
    D: number;               // Drain Index
    V: number;               // Volatility Index
    H: number;               // Harmony Index
    explain: string;         // Explanation text
}

export interface LifespanResult {
    metadata: {
        max_age: number;
        sex: string;
        cultivation_level?: number;
        algorithm: string;
    };
    curve: LifespanCurvePoint[];
}

// Health & Constitution Types
export interface HealthBalanceStrategy {
    priority_elements: string[];
    reason: string[];
}

export interface HealthBaziContext {
    day_master: string;
    day_master_element: string;
    day_master_strength: string;
    favorable_elements: string[];
    unfavorable_elements: string[];
    rationale: string[];
    balance_strategy: HealthBalanceStrategy;
}

export interface SeasonalAdjustments {
    month_branch: string;
    multipliers: Record<string, number>;
}

export interface HealthElementBalance {
    raw_absolute: Record<string, number>;
    raw_total: number;
    raw_distribution: Record<string, number>;
    effective_pre_normalized: Record<string, number>;
    effective_distribution: Record<string, number>;
    effective_method: string;
    seasonal_adjustments: SeasonalAdjustments;
    rooting_scores: Record<string, number>;
    rooting_raw: Record<string, number>;
    dominant_elements: string[];
    weak_elements: string[];
}

export interface HealthConstitution {
    temperature: string;
    temperature_score: number;
    temperature_scale: string;
    temperature_components: Record<string, number>;
    moisture: string;
    moisture_score: number;
    moisture_scale?: string;
    moisture_components?: Record<string, number>;
}

export interface HealthTimingPeak {
    period?: string;  // For decade peaks
    year?: number;    // For year peaks
    gan_zhi: string;
    strain_index: number;
    strain_type?: string;
    drivers?: string[];
    level: string;
}

export interface HealthTiming {
    decade_peaks: HealthTimingPeak[];
    year_peaks: HealthTimingPeak[];
    analysis_range: string;
}

export interface HealthDataQuality {
    rooting_model: string;
    hidden_stems_weighting: string;
    transformations: string;
}

export interface HealthResult {
    bazi_context: HealthBaziContext;
    element_balance: HealthElementBalance;
    constitution: HealthConstitution;
    timing?: HealthTiming;
    data_quality: HealthDataQuality;
    disclaimer: string;
}
