import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Famous Bazi Charts — Celebrity Four Pillars Library | True Bazi',
    description:
        'Explore Bazi (Four Pillars of Destiny) charts of famous historical figures, artists, leaders, and visionaries. Calculated with True Solar Time for maximum precision.',
    keywords: [
        'famous bazi charts',
        'celebrity bazi',
        'four pillars of destiny',
        'chinese astrology famous people',
        'bazi database',
        'celebrity birth chart chinese',
    ],
    openGraph: {
        title: 'Famous Bazi Charts — Celebrity Four Pillars Library',
        description:
            'Explore Bazi charts of famous historical figures, artists, leaders, and visionaries.',
        type: 'website',
        siteName: 'True Bazi',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Famous Bazi Charts — Celebrity Four Pillars Library',
        description:
            'Explore Bazi charts of famous historical figures, artists, leaders, and visionaries.',
    },
    alternates: {
        canonical: 'https://bazi-calculator-liart.vercel.app/famous-charts',
    },
};

export default function FamousChartsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
