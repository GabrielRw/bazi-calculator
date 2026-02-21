import { notFound } from "next/navigation";
import Link from "next/link";
import { FAMOUS_CHARTS_DATA } from "@/data/famousPeopleCharts";
import { CATEGORY_COLORS, FamousCategory } from "@/data/famousPeople";
import { Metadata } from "next";

// Components
import FamousChartDisplay from "@/components/FamousChartDisplay";
import { ChartContext } from "@/types/ai";
import { BaziResult } from "@/types/bazi";

const BASE_URL = "https://bazi-calculator-liart.vercel.app";

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

    const chart = person.chart as unknown as BaziResult;
    const dmElement = chart.day_master?.info?.element || "Unknown";
    const dmPolarity = chart.day_master?.info?.polarity || "";
    const zodiac = chart.summary?.zodiac || "";
    const structure = chart.professional?.structure || "";

    const title = `${person.name} Bazi | Four Pillars of Destiny Chart | True Bazi`;
    const description = `Explore ${person.name}'s Bazi chart — a ${dmPolarity} ${dmElement} Day Master${zodiac ? ` born in the year of the ${zodiac}` : ''}, with ${structure}. Full Four Pillars analysis including element balance, luck cycles, and destiny patterns.`;

    return {
        title,
        description,
        keywords: [
            `${person.name} bazi`,
            `${person.name} bazi chart`,
            `${person.name} four pillars`,
            `${person.name} chinese astrology`,
            `${person.name} birth chart`,
            `${person.name} day master`,
            `${person.name} ${dmElement} day master`,
            'bazi calculator',
            'four pillars of destiny',
            'chinese astrology famous people',
        ],
        openGraph: {
            title,
            description,
            type: 'article',
            siteName: 'True Bazi',
            url: `${BASE_URL}/famous-charts/${person.id}`,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `${BASE_URL}/famous-charts/${person.id}`,
        },
    };
}

// JSON-LD Structured Data Component
function JsonLd({ person, chart }: { person: typeof FAMOUS_CHARTS_DATA[0]; chart: BaziResult }) {
    const dmElement = chart.day_master?.info?.element || "Unknown";
    const dmPolarity = chart.day_master?.info?.polarity || "";
    const structure = chart.professional?.structure || "";

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: person.name,
        birthDate: `${person.birth.year}-${String(person.birth.month).padStart(2, '0')}-${String(person.birth.day).padStart(2, '0')}`,
        birthPlace: {
            "@type": "Place",
            name: `${person.birth.city}, ${person.birth.country}`,
        },
    };

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${person.name} Bazi Chart — ${dmPolarity} ${dmElement} Day Master`,
        description: `Complete Bazi analysis of ${person.name}: ${structure}, element balance, luck cycles, and destiny patterns.`,
        author: {
            "@type": "Organization",
            name: "True Bazi",
            url: BASE_URL,
        },
        publisher: {
            "@type": "Organization",
            name: "True Bazi",
            url: BASE_URL,
        },
        mainEntityOfPage: `${BASE_URL}/famous-charts/${person.id}`,
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: BASE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Famous Bazi Charts",
                item: `${BASE_URL}/famous-charts`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: `${person.name} Bazi`,
                item: `${BASE_URL}/famous-charts/${person.id}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}

// Related Charts Helper
function getRelatedCharts(currentId: string, category: string, count = 3) {
    const sameCategory = FAMOUS_CHARTS_DATA.filter(
        (p) => p.id !== currentId && p.category === category
    );
    // If not enough same-category, fill from other categories
    const others = FAMOUS_CHARTS_DATA.filter(
        (p) => p.id !== currentId && p.category !== category
    );
    return [...sameCategory, ...others].slice(0, count);
}

export default async function FamousPersonPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const person = FAMOUS_CHARTS_DATA.find(p => p.id === slug);

    if (!person) {
        notFound();
    }

    const chart = person.chart as unknown as BaziResult;
    const dmElement = chart.day_master?.info?.element || "Unknown";
    const dmPolarity = chart.day_master?.info?.polarity || "";
    const dmName = chart.day_master?.info?.name || "";
    const structure = chart.professional?.structure || "";
    const zodiac = chart.summary?.zodiac || "";

    // Construct correct ChartContext matching src/types/ai.ts
    const chartContext: ChartContext = {
        dayMaster: chart.day_master,
        elements: chart.elements,
        structure: chart.professional.structure,
        dmStrength: chart.professional.dm_strength,
        pillars: chart.pillars
    };

    const categoryColors = CATEGORY_COLORS[person.category as FamousCategory] || CATEGORY_COLORS.artist;
    const relatedCharts = getRelatedCharts(person.id, person.category);

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            {/* JSON-LD Structured Data */}
            <JsonLd person={person} chart={chart} />

            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex items-center gap-2 text-sm text-gray-500">
                    <li>
                        <Link href="/" className="hover:text-jade transition-colors">Home</Link>
                    </li>
                    <li className="text-gray-600">/</li>
                    <li>
                        <Link href="/famous-charts" className="hover:text-jade transition-colors">Famous Charts</Link>
                    </li>
                    <li className="text-gray-600">/</li>
                    <li className="text-white font-medium">{person.name}</li>
                </ol>
            </nav>

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
                    {person.name} <span className="text-jade">Bazi</span>
                </h1>

                <div className="glass-card p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
                    <h2 className="text-lg font-bold text-jade mb-3">About</h2>
                    <p className="text-lg text-gray-300 leading-relaxed mb-4">
                        {person.brief}
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        Born in {person.birth.year} in {person.birth.city}, {person.birth.country}, {person.name} is a <strong className="text-white">{dmPolarity} {dmElement} ({dmName})</strong> Day Master
                        {structure && <> with a <strong className="text-white">{structure}</strong></>}
                        {zodiac && <>, born in the year of the <strong className="text-white">{zodiac}</strong></>}.
                        Explore the full Four Pillars of Destiny chart below, including element balance, luck cycles, and hidden stems.
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

            {/* Related Famous Charts */}
            {relatedCharts.length > 0 && (
                <section className="mt-16 pt-12 border-t border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-2">Explore More Famous Bazi Charts</h2>
                    <p className="text-sm text-gray-500 mb-8">Discover the Four Pillars of other notable figures</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {relatedCharts.map((related) => {
                            const relatedChart = related.chart as unknown as BaziResult;
                            const relatedDm = relatedChart.day_master?.info;
                            const relatedColors = CATEGORY_COLORS[related.category as FamousCategory] || CATEGORY_COLORS.artist;

                            return (
                                <Link
                                    key={related.id}
                                    href={`/famous-charts/${related.id}`}
                                    className="glass-card rounded-xl p-5 hover:bg-white/5 transition-all group border border-white/5 hover:border-jade/20"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`w-2 h-2 rounded-full ${relatedColors.bg.replace('/20', '')}`} />
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${relatedColors.text}`}>
                                            {related.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-jade transition-colors mb-1">
                                        {related.name}
                                    </h3>
                                    {relatedDm && (
                                        <p className="text-xs text-gray-500 mb-2">
                                            {relatedDm.polarity} {relatedDm.element} Day Master
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {related.brief}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
