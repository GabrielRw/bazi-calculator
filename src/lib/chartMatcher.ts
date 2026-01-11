/**
 * Chart Matching Algorithm
 * 
 * Compares user's BaZi chart against famous people database
 * using weighted scoring across multiple factors.
 */

import { BaziResult } from '@/types/bazi';
import { FamousPerson, FAMOUS_PEOPLE } from '@/data/famousPeople';

export interface ChartMatch {
    person: FamousPerson;
    score: number;
    breakdown: {
        dayMaster: number;
        dmStrength: number;
        elements: number;
        structure: number;
        pillars: number;
        stars: number;
    };
    commonalities: string[];
}

// Weights for each matching factor (total = 100%)
const WEIGHTS = {
    dayMaster: 0.30,
    dmStrength: 0.15,
    elements: 0.20,
    structure: 0.15,
    pillars: 0.10,
    stars: 0.10,
};

/**
 * Calculate cosine similarity between two element distributions
 */
function elementSimilarity(
    userElements: Record<string, number>,
    famousElements: string[]
): number {
    // Convert famous person's dominant elements to a simple distribution weight
    const famousWeights: Record<string, number> = {
        Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
    };

    famousElements.forEach((el, i) => {
        famousWeights[el] = 1 - (i * 0.3); // Primary = 1.0, Secondary = 0.7
    });

    // Normalize user percentages
    const userTotal = Object.values(userElements).reduce((a, b) => a + b, 0);
    const userNorm: Record<string, number> = {};
    Object.entries(userElements).forEach(([el, val]) => {
        userNorm[el] = val / (userTotal || 1);
    });

    // Calculate dot product and magnitudes
    let dotProduct = 0;
    let userMag = 0;
    let famousMag = 0;

    ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].forEach(el => {
        const u = userNorm[el] || 0;
        const f = famousWeights[el] || 0;
        dotProduct += u * f;
        userMag += u * u;
        famousMag += f * f;
    });

    const magnitude = Math.sqrt(userMag) * Math.sqrt(famousMag);
    return magnitude > 0 ? dotProduct / magnitude : 0;
}

/**
 * Count matching pillar characters (Gan-Zhi)
 */
function pillarMatches(
    userPillars: BaziResult['pillars'],
    famousPerson: FamousPerson
): number {
    // We only have famous person's day master, so compare just that
    const userDayPillar = userPillars.find(p => p.label === 'Day');
    if (!userDayPillar) return 0;

    // Check if day stem matches
    if (userDayPillar.gan === famousPerson.dayMaster.stem) {
        return 1;
    }
    return 0;
}

/**
 * Calculate shared stars (simplified - would need actual star data from famous people)
 */
function starMatches(
    userStars: BaziResult['stars'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _famousPerson: FamousPerson
): number {
    // Since we don't have pre-computed stars for famous people,
    // return a baseline based on user's star count (more stars = more potential matches)
    if (!userStars || userStars.length === 0) return 0;
    return Math.min(userStars.length / 10, 1) * 0.5; // Baseline 50% if user has stars
}

/**
 * Match a user's chart against all famous people
 * Returns sorted array of top matches
 */
export function matchCharts(
    userChart: BaziResult,
    topN: number = 5
): ChartMatch[] {
    const matches: ChartMatch[] = [];

    for (const person of FAMOUS_PEOPLE) {
        const commonalities: string[] = [];

        // 1. Day Master comparison (30%)
        let dayMasterScore = 0;
        const userDM = userChart.day_master;

        if (userDM.stem === person.dayMaster.stem) {
            dayMasterScore = 1.0;
            commonalities.push(`Same Day Master: ${person.dayMaster.stem}`);
        } else if (userDM.info.element === person.dayMaster.element) {
            dayMasterScore = 0.5;
            commonalities.push(`Same element: ${person.dayMaster.element}`);
        } else if (userDM.info.polarity === person.dayMaster.polarity) {
            dayMasterScore = 0.2;
        }

        // 2. DM Strength comparison (15%)
        let dmStrengthScore = 0;
        const userStrength = userChart.professional.dm_strength;
        if (userStrength.toLowerCase() === person.dmStrength.toLowerCase()) {
            dmStrengthScore = 1.0;
            commonalities.push(`Both ${person.dmStrength} Day Master`);
        } else if (
            (userStrength.toLowerCase().includes('weak') && person.dmStrength === 'Weak') ||
            (userStrength.toLowerCase().includes('strong') && person.dmStrength === 'Strong')
        ) {
            dmStrengthScore = 0.8;
        }

        // 3. Element distribution comparison (20%)
        const elementsScore = elementSimilarity(
            userChart.elements.percentages,
            person.dominantElements
        );
        if (elementsScore > 0.7) {
            commonalities.push(`Similar element balance`);
        }

        // 4. Structure comparison (15%)
        let structureScore = 0;
        const userStructure = userChart.professional.structure.toLowerCase();
        const famousStructure = person.structure.toLowerCase();

        if (userStructure === famousStructure ||
            userStructure.includes(famousStructure) ||
            famousStructure.includes(userStructure.split(' ')[0])) {
            structureScore = 1.0;
            commonalities.push(`Same structure: ${person.structure}`);
        } else if (
            // Partial matches for similar structures
            (userStructure.includes('resource') && famousStructure.includes('resource')) ||
            (userStructure.includes('wealth') && famousStructure.includes('wealth')) ||
            (userStructure.includes('officer') && famousStructure.includes('officer')) ||
            (userStructure.includes('killing') && famousStructure.includes('killing'))
        ) {
            structureScore = 0.6;
        }

        // 5. Pillar matches (10%)
        const pillarScore = pillarMatches(userChart.pillars, person);

        // 6. Star matches (10%)
        const starsScore = starMatches(userChart.stars, person);

        // Calculate weighted total
        const totalScore = (
            dayMasterScore * WEIGHTS.dayMaster +
            dmStrengthScore * WEIGHTS.dmStrength +
            elementsScore * WEIGHTS.elements +
            structureScore * WEIGHTS.structure +
            pillarScore * WEIGHTS.pillars +
            starsScore * WEIGHTS.stars
        ) * 100;

        matches.push({
            person,
            score: Math.round(totalScore),
            breakdown: {
                dayMaster: Math.round(dayMasterScore * 100),
                dmStrength: Math.round(dmStrengthScore * 100),
                elements: Math.round(elementsScore * 100),
                structure: Math.round(structureScore * 100),
                pillars: Math.round(pillarScore * 100),
                stars: Math.round(starsScore * 100),
            },
            commonalities: commonalities.slice(0, 3), // Top 3 commonalities
        });
    }

    // Sort by score descending and return top N
    return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
}

/**
 * Get a text description of the match quality
 */
export function getMatchDescription(score: number): string {
    if (score >= 70) return 'Strong Match';
    if (score >= 50) return 'Notable Match';
    if (score >= 35) return 'Moderate Match';
    return 'Light Similarities';
}
