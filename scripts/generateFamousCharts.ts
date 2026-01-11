/**
 * Script to generate pre-computed BaZi chart data for famous people
 * Run with: npx ts-node --esm scripts/generateFamousCharts.ts
 */

const FAMOUS_PEOPLE_SUBSET = [
    { id: 'mozart', name: 'Wolfgang Amadeus Mozart', birth: { year: 1756, month: 1, day: 27, hour: 20, minute: 0, city: 'Salzburg', country: 'Austria' }, category: 'artist', brief: 'Prolific and influential composer of the Classical period.' },
    { id: 'picasso', name: 'Pablo Picasso', birth: { year: 1881, month: 10, day: 25, hour: 23, minute: 15, city: 'Málaga', country: 'Spain' }, category: 'artist', brief: 'Co-founder of Cubism and one of the most influential artists.' },
    { id: 'beethoven', name: 'Ludwig van Beethoven', birth: { year: 1770, month: 12, day: 16, hour: 13, minute: 0, city: 'Bonn', country: 'Germany' }, category: 'artist', brief: 'German composer who bridged Classical and Romantic eras.' },
    { id: 'einstein', name: 'Albert Einstein', birth: { year: 1879, month: 3, day: 14, hour: 11, minute: 30, city: 'Ulm', country: 'Germany' }, category: 'scientist', brief: 'Theoretical physicist who developed the theory of relativity.' },
    { id: 'napoleon', name: 'Napoleon Bonaparte', birth: { year: 1769, month: 8, day: 15, hour: 10, minute: 0, city: 'Ajaccio', country: 'France' }, category: 'leader', brief: 'French military leader and emperor who conquered much of Europe.' },
    { id: 'steve-jobs', name: 'Steve Jobs', birth: { year: 1955, month: 2, day: 24, hour: 19, minute: 15, city: 'San Francisco', country: 'USA' }, category: 'entrepreneur', brief: 'Co-founder of Apple who revolutionized personal computing.' },
    { id: 'michael-jordan', name: 'Michael Jordan', birth: { year: 1963, month: 2, day: 17, hour: 13, minute: 40, city: 'Brooklyn', country: 'USA' }, category: 'performer', brief: 'Widely considered the greatest basketball player of all time.' },
    { id: 'marilyn-monroe', name: 'Marilyn Monroe', birth: { year: 1926, month: 6, day: 1, hour: 9, minute: 30, city: 'Los Angeles', country: 'USA' }, category: 'performer', brief: 'Iconic actress and model, symbol of 1950s glamour.' },
    { id: 'elon-musk', name: 'Elon Musk', birth: { year: 1971, month: 6, day: 28, hour: 7, minute: 30, city: 'Pretoria', country: 'South Africa' }, category: 'entrepreneur', brief: 'Entrepreneur behind Tesla, SpaceX, and various tech ventures.' },
    { id: 'oprah-winfrey', name: 'Oprah Winfrey', birth: { year: 1954, month: 1, day: 29, hour: 4, minute: 30, city: 'Kosciusko', country: 'USA' }, category: 'performer', brief: 'Media mogul, talk show host, and philanthropist.' },
];

const API_URL = 'https://astro-api-1qnc.onrender.com/api/v1/chinese/bazi';

async function fetchChart(person: typeof FAMOUS_PEOPLE_SUBSET[0]) {
    const apiKey = process.env.ASTRO_API_KEY;
    if (!apiKey) {
        throw new Error('ASTRO_API_KEY not set');
    }

    const body = {
        year: person.birth.year,
        month: person.birth.month,
        day: person.birth.day,
        hour: person.birth.hour,
        minute: person.birth.minute,
        city: person.birth.city,
        time_mode: 'true_solar_absolute',
    };

    console.log(`Fetching chart for ${person.name}...`);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`API error for ${person.name}: ${response.status}`);
    }

    return response.json();
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function main() {
    const results: Record<string, unknown>[] = [];

    // Check if key is loaded
    if (!process.env.ASTRO_API_KEY) {
        console.error('Error: ASTRO_API_KEY not found in .env.local');
        // Try to fallback to NEXT_PUBLIC if available (though unlikely for a backend key)
        if (process.env.NEXT_PUBLIC_ASTRO_API_KEY) {
            console.log('Using NEXT_PUBLIC_ASTRO_API_KEY instead');
            process.env.ASTRO_API_KEY = process.env.NEXT_PUBLIC_ASTRO_API_KEY;
        } else {
            console.log('Available env keys:', Object.keys(process.env).filter(k => k.includes('KEY')));
            process.exit(1);
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ASTRO_API_KEY || ''
    };

    console.log('Starting chart generation for', FAMOUS_PEOPLE_SUBSET.length, 'people...');

    for (const person of FAMOUS_PEOPLE_SUBSET) {
        try {
            const chart = await fetchChart(person);
            results.push({
                id: person.id,
                name: person.name,
                category: person.category,
                birth: person.birth,
                brief: person.brief,
                chart: chart,
            });
            console.log(`✓ ${person.name} done`);
            // Wait 500ms between requests to avoid rate limiting
            await new Promise(r => setTimeout(r, 500));
        } catch (error) {
            console.error(`✗ ${person.name} failed:`, error);
        }
    }

    const outputPath = path.resolve(__dirname, '../src/data/famousPeopleCharts.ts');
    const content = `// Generated by scripts/generateFamousCharts.ts
// Do not edit manually

export const FAMOUS_CHARTS_DATA = ${JSON.stringify(results, null, 2)};
`;

    fs.writeFileSync(outputPath, content);
    console.log(`\nSuccessfully wrote ${results.length} charts to ${outputPath}`);
}

main().catch(console.error);
