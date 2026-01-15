import { notFound } from "next/navigation";
import { FAMOUS_CHARTS_DATA } from "@/data/famousPeopleCharts";
import { CATEGORY_COLORS, FamousCategory } from "@/data/famousPeople";
import { Metadata } from "next";

// Components
import FamousChartDisplay from "@/components/FamousChartDisplay";
import { ChartContext } from "@/types/ai";
import { BaziResult } from "@/types/bazi";

// SSG: Generate params for all verified charts
export async function generateStaticParams() {
    return FAMOUS_CHARTS_DATA.map((person) => ({
        slug: person.id,
    }));
}

// SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const person = FAMOUS_CHARTS_DATA.find(p => p.id === slug);

    if (!person) return {};

    const title = `${person.name} Bazi Chart - Four Pillars Analysis | True Bazi`;
    const description = `Explore ${person.name}'s Bazi (Four Pillars of Destiny) chart. Discover their Day Master, element balance, luck cycles, and destiny patterns. Complete Chinese astrology analysis.`;

    return {
        title,
        description,
        keywords: [`${person.name} bazi`, `${person.name} four pillars`, `${person.name} chinese astrology`, `${person.name} birth chart`, 'bazi calculator', 'four pillars of destiny'],
        openGraph: {
            title,
            description,
            type: 'article',
            siteName: 'True Bazi',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default async function FamousPersonPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const person = FAMOUS_CHARTS_DATA.find(p => p.id === slug);

    if (!person) {
        notFound();
    }

    const chart = person.chart as unknown as BaziResult;

    // Construct correct ChartContext matching src/types/ai.ts
    const chartContext: ChartContext = {
        dayMaster: chart.day_master,
        elements: chart.elements,
        structure: chart.professional.structure,
        dmStrength: chart.professional.dm_strength,
        pillars: chart.pillars
    };

    const categoryColors = CATEGORY_COLORS[person.category as FamousCategory] || CATEGORY_COLORS.artist;

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* Hero Section */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors.bg} ${categoryColors.text}`}
                    >
                        {person.category}
                    </span>
                    <span className="text-sm text-gray-500 font-mono">
                        {person.birth.year}-{person.birth.month}-{person.birth.day}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    {person.name}
                </h1>

                <div className="glass-card p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-bold text-jade mb-3">About</h2>
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                        {person.brief}
                    </p>

                    {/* Birth Data Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Birth Date</div>
                            <div className="text-white font-mono">{person.birth.year}-{String(person.birth.month).padStart(2, '0')}-{String(person.birth.day).padStart(2, '0')}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Birth Time</div>
                            <div className="text-white font-mono">{String(person.birth.hour).padStart(2, '0')}:{String(person.birth.minute || 0).padStart(2, '0')}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Birth City</div>
                            <div className="text-white">{person.birth.city}</div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Country</div>
                            <div className="text-white">{person.birth.country}</div>
                        </div>
                    </div>
                    <div className="mt-3 text-[10px] text-gray-600 uppercase tracking-wider">
                        ✦ Calculated using True Solar Time for maximum precision
                    </div>
                </div>
            </div>

            {/* Chart Analysis */}
            <FamousChartDisplay
                chart={chart}
                chartContext={chartContext}
            />
        </div>
    );
}
