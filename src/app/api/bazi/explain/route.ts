import { NextResponse } from 'next/server';
import { AICardType } from '@/types/ai';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Card-specific prompt generators to ensure non-redundant, focused explanations
const PROMPT_GENERATORS: Record<AICardType, (cardData: Record<string, unknown>, chartContext: Record<string, unknown>) => string> = {
    pillar: (cardData, chartContext) => {
        const pillar = cardData as { label: string; gan: string; zhi: string; gan_info: { element: string; polarity: string; pinyin: string }; zhi_info: { element: string; zodiac: string; pinyin: string }; interpretation?: string; life_stage?: { name: string } };
        return `You are an expert BaZi (Four Pillars of Destiny) analyst. Explain this SPECIFIC pillar in the context of the person's chart.

PILLAR DATA:
- Type: ${pillar.label} Pillar
- Heavenly Stem: ${pillar.gan} (${pillar.gan_info?.pinyin}) - ${pillar.gan_info?.element} ${pillar.gan_info?.polarity}
- Earthly Branch: ${pillar.zhi} (${pillar.zhi_info?.pinyin}) - ${pillar.zhi_info?.zodiac}
${pillar.life_stage ? `- Life Stage: ${pillar.life_stage.name}` : ''}
${pillar.interpretation ? `- Base Interpretation: ${pillar.interpretation}` : ''}

CHART CONTEXT (for reference only):
- Day Master: ${(chartContext.dayMaster as { info?: { element?: string; polarity?: string } })?.info?.element} ${(chartContext.dayMaster as { info?: { polarity?: string } })?.info?.polarity}
- Structure: ${chartContext.structure}
- DM Strength: ${chartContext.dmStrength}

RULES:
1. Focus ONLY on this ${pillar.label} pillar's meaning for this specific person
2. DO NOT discuss: other pillars, stars, interactions, or favorable elements (those have their own explanations)
3. Explain: the pillar's domain (${pillar.label === 'Year' ? 'ancestors, social circle, early life' :
                pillar.label === 'Month' ? 'career, parents, young adulthood' :
                    pillar.label === 'Day' ? 'self, marriage, core identity' :
                        'children, aspirations, legacy'
            })
4. Keep it personal and specific - avoid generic statements
5. Maximum 200 words`;
    },

    star: (cardData) => {
        const star = cardData as { name: string; pillar: string; zhi: string; desc: string };
        return `You are an expert BaZi (Four Pillars of Destiny) analyst specializing in Symbolic Stars (Shen Sha).

STAR DATA:
- Name: ${star.name}
- Location: ${star.pillar} Pillar (${star.zhi})
- Description: ${star.desc}

RULES:
1. Focus ONLY on this specific star and its influence
2. DO NOT discuss: other stars, pillar meanings, interactions, or elements (those have their own explanations)
3. Explain: how this star manifests in the person's life through its pillar location
4. Include: practical implications and timing of activation
5. Keep it personal and specific - avoid generic statements
6. Maximum 180 words`;
    },

    interaction: (cardData) => {
        const interaction = cardData as { type: string; pillars: string[]; stems?: string[]; branches?: string[]; interpretation?: string; transform_to?: string };
        return `You are an expert BaZi (Four Pillars of Destiny) analyst specializing in elemental interactions.

INTERACTION DATA:
- Type: ${interaction.type}
- Characters: ${interaction.stems?.join('') || interaction.branches?.join('') || 'N/A'}
- Pillars Affected: ${interaction.pillars?.join(' + ') || 'N/A'}
${interaction.transform_to ? `- Transforms to: ${interaction.transform_to}` : ''}
${interaction.interpretation ? `- Base Interpretation: ${interaction.interpretation}` : ''}

RULES:
1. Focus ONLY on this specific interaction and its dynamics
2. DO NOT discuss: individual pillar meanings, stars, or other interactions (those have their own explanations)
3. Explain: the tension or harmony this creates between life domains
4. Include: practical manifestations and how to work with this energy
5. Keep it personal and specific - avoid generic statements
6. Maximum 180 words`;
    },

    structure: (cardData, chartContext) => {
        const structure = chartContext.structure as string;
        const dmStrength = chartContext.dmStrength as string;
        const professional = cardData as { yong_shen_candidates?: string[]; favorable_elements?: string[]; interpretation?: string };
        return `You are an expert BaZi (Four Pillars of Destiny) analyst specializing in chart structures.

STRUCTURE DATA:
- Chart Structure: ${structure}
- Day Master Strength: ${dmStrength}
- Useful Elements (Yong Shen): ${professional.yong_shen_candidates?.join(', ') || 'N/A'}
- Favorable Elements: ${professional.favorable_elements?.join(', ') || 'N/A'}
${professional.interpretation ? `- Base Interpretation: ${professional.interpretation}` : ''}

RULES:
1. Focus ONLY on the chart structure type and its implications
2. DO NOT discuss: individual pillars, stars, specific interactions, or element remedies (those have their own explanations)
3. Explain: what this structure means for decision-making and life strategy
4. Include: the relationship between structure and Day Master strength
5. Keep it personal and specific - avoid generic statements
6. Maximum 200 words`;
    },

    wuxing: (cardData, chartContext) => {
        const elements = chartContext.elements as { dominant: string; percentages: Record<string, number> };
        return `You are an expert BaZi (Four Pillars of Destiny) analyst specializing in Wu Xing (Five Elements) dynamics.

ELEMENT DATA:
- Dominant Element: ${elements.dominant}
- Distribution: ${Object.entries(elements.percentages || {}).map(([el, pct]) => `${el}: ${pct}%`).join(', ')}

RULES:
1. Focus ONLY on the overall elemental balance and what it means
2. DO NOT discuss: individual pillars, stars, interactions, or specific remedies (those have their own explanations)
3. Explain: the elemental imbalance pattern and its life implications
4. Include: general tendencies this creates (without prescribing specific actions)
5. Keep it personal and specific - avoid generic statements
6. Maximum 180 words`;
    },

    yongshen: (cardData, chartContext) => {
        const professional = cardData as { yong_shen_candidates?: string[]; favorable_elements?: string[]; unfavorable_elements?: string[] };
        const dmStrength = chartContext.dmStrength as string;
        return `You are an expert BaZi (Four Pillars of Destiny) analyst specializing in Yong Shen (Useful God) analysis.

YONG SHEN DATA:
- Day Master Strength: ${dmStrength}
- Useful Elements: ${professional.yong_shen_candidates?.join(', ') || 'N/A'}
- Favorable Elements: ${professional.favorable_elements?.join(', ') || 'N/A'}
- Unfavorable Elements: ${professional.unfavorable_elements?.join(', ') || 'N/A'}

RULES:
1. Focus ONLY on the Yong Shen selection and practical remedies
2. DO NOT discuss: individual pillars, stars, interactions, or chart structure theory (those have their own explanations)
3. Explain: why these elements are useful and how to incorporate them
4. Include: specific, actionable suggestions for daily life
5. Keep it personal and specific - avoid generic statements
6. Maximum 200 words`;
    },

    void: (cardData) => {
        const voidData = cardData as { void_branches?: string[]; applies_to?: string[] };
        return `You are an expert BaZi (Four Pillars of Destiny) analyst specializing in Xun Kong (Void Branches).

VOID DATA:
- Void Branches: ${voidData.void_branches?.join(', ') || 'N/A'}
- Affects Pillars: ${voidData.applies_to?.join(', ') || 'None in natal chart'}

RULES:
1. Focus ONLY on the void branches and their spiritual/practical meaning
2. DO NOT discuss: other pillars, stars, interactions, or elements (those have their own explanations)
3. Explain: what "emptiness" means for these specific branches
4. Include: how voids activate through time and what to expect
5. Keep it personal and specific - avoid generic statements
6. Maximum 180 words`;
    }
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.MISTRAL_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'AI API key not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { cardType, cardData, chartContext } = body;

        if (!cardType || !cardData) {
            return NextResponse.json(
                { error: 'Missing cardType or cardData' },
                { status: 400 }
            );
        }

        const promptGenerator = PROMPT_GENERATORS[cardType as AICardType];
        if (!promptGenerator) {
            return NextResponse.json(
                { error: `Unknown card type: ${cardType}` },
                { status: 400 }
            );
        }

        const prompt = promptGenerator(cardData, chartContext || {});

        const response = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 400,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Mistral API Error:', errorData);
            return NextResponse.json(
                { error: 'AI service temporarily unavailable' },
                { status: 502 }
            );
        }

        const data = await response.json();
        const explanation = data.choices?.[0]?.message?.content || 'No explanation generated.';
        const tokensUsed = data.usage?.total_tokens;

        return NextResponse.json({
            explanation,
            tokens_used: tokensUsed
        });

    } catch (error) {
        console.error('AI Explain Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
