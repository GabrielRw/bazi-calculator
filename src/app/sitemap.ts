import { MetadataRoute } from 'next';
import { FAMOUS_CHARTS_DATA } from '@/data/famousPeopleCharts';

const BASE_URL = 'https://bazi-calculator-liart.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    const famousChartEntries: MetadataRoute.Sitemap = FAMOUS_CHARTS_DATA.map((person) => ({
        url: `${BASE_URL}/famous-charts/${person.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${BASE_URL}/famous-charts`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...famousChartEntries,
    ];
}
