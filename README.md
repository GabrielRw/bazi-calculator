# True BaZi Calculator

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

A professional-grade **Chinese astrology (BaZi / Four Pillars of Destiny)** calculator built with Next.js. Features true solar time calculations, famous chart comparisons, AI-powered insights, and comprehensive destiny analysis.

**[Live Demo →](https://bazi-calculator-liart.vercel.app)**

![True BaZi Calculator Screenshot](docs/screenshot-hero.png)

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [API Configuration](#api-configuration)
- [Project Structure](#project-structure)
- [Technical Deep Dive](#technical-deep-dive)
- [Famous Charts](#famous-charts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Four Pillars Chart

The core of BaZi analysis - your natal chart consisting of Year, Month, Day, and Hour pillars. Each pillar contains a Heavenly Stem (天干) and Earthly Branch (地支).

![Four Pillars Chart](docs/screenshot-pillars.png)

**Key Features:**
- Heavenly Stems with element and polarity information
- Earthly Branches with hidden stems revealed
- Ten Gods (十神) relationship mapping
- Interactive hover states for detailed information

**Code Example - Fetching a Natal Chart:**
```typescript
// src/app/api/bazi/natal/route.ts
const response = await fetch('https://astro-api-1qnc.onrender.com/api/v1/chinese/bazi', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ASTRO_API_KEY!,
  },
  body: JSON.stringify({
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    city: 'New York',
    time_mode: 'true_solar_absolute', // Key for precision!
  }),
});
```

---

### Element Balance (Wu Xing)

Interactive visualization of the five elements (Wood, Fire, Earth, Metal, Water) showing their distribution in your chart.

![Element Balance](docs/screenshot-wuxing.png)

**Features:**
- Pentagon visualization with generating cycle (生) arrows
- Controlling cycle (克) dashed lines
- Yin/Yang breakdown per element
- Dominant element highlighting
- Strategic recommendations for balance

**The Five Element Cycles:**
```
Generating (生): Wood → Fire → Earth → Metal → Water → Wood
Controlling (克): Wood → Earth → Water → Fire → Metal → Wood
```

---

### Deep Pillar Analysis

Detailed breakdown of each pillar showing hidden stems, symbolic stars, and element interactions.

![Pillar Analysis](docs/screenshot-pillaranalysis.png)

**Includes:**
- Hidden stems within each Earthly Branch
- Ten Gods relationships to Day Master
- Na Yin (纳音) five-element sound
- Palace associations (Family, Marriage, Career, etc.)

---

### Symbolic Stars (Shen Sha)

Traditional star interpretations from classical BaZi texts with detailed modal explanations.

![Symbolic Stars](docs/screenshot-stars.png)

**Star Categories:**
- Nobleman Stars (贵人) - Beneficial connections
- Peach Blossom (桃花) - Romance and charisma
- Academic Stars (文昌) - Intelligence and learning
- Clash/Harm Stars - Challenges and obstacles

---

### Void Branches (Xun Kong)

Analysis of "empty" branches that indicate areas of life that may feel unfulfilled or require extra attention.

![Void Branches](docs/screenshot-voidbranch.png)

**How It Works:**
The Day Pillar determines which two branches are "void" based on the Jia-Zi (60 pillar) cycle. These voids affect different life areas depending on which pillar they appear in.

---

### Chart Rarity Score

Statistical analysis of how unique your destiny chart is compared to the general population.

![Chart Rarity](docs/screenshot-rarity.png)

**Factors Analyzed:**
- Day Master rarity
- Element distribution uniqueness
- Special structures (从格, 专旺, etc.)
- Symbolic star combinations

---

### Neijing Life Curve

Energy modeling based on Traditional Chinese Medicine principles, tracking Jing (精), Qi (气), and Shen (神) throughout life.

![Neijing Life Curve](docs/screeenshot-neijing.png)

**Energy Types:**
- **Jing (Essence)** - Inherited vitality, depletes over time
- **Qi (Energy)** - Daily energy, affected by lifestyle
- **Shen (Spirit)** - Mental clarity and awareness

**Code Example - Fetching Lifespan Data:**
```typescript
const response = await fetch('/api/bazi/lifespan', {
  method: 'POST',
  body: JSON.stringify({
    year, month, day, hour, minute, city,
    sex: 'male', // or 'female'
    cultivation_factor: 0.5, // 0-1 lifestyle factor
  }),
});
```

---

### Destiny Flow

Annual and monthly flow analysis showing how current energies interact with your natal chart.

![Destiny Flow](docs/screenshot-destinyflow.png)

![Flow Transitions](docs/screenshot-destinyflowtransitions.png)

**Features:**
- 10-Year Luck Pillars (大运)
- Annual Pillar interactions
- Monthly energy transitions
- Clash and harmony indicators

---

### Synastry / Compatibility

Relationship compatibility analysis between two charts using traditional BaZi methods.

![Synastry Analysis](docs/screenshot-bazisynastry.png)

![Element Support](docs/screenshot-synastry-elementsupport.png)

**Analysis Includes:**
- Day Master compatibility (30% weight)
- Spouse Palace harmony (20% weight)
- Element balance between partners
- Pillar interactions (clashes, combinations)
- Hidden stem connections

---

### AI-Powered Insights

Context-aware AI explanations for each chart section, providing personalized interpretations.

![AI Insights](docs/screenshot-ai.png)

**How It Works:**
Each chart section includes an "Ask AI" button that sends the chart context to an AI model for interpretation. The AI considers:
- Your Day Master and strength
- Element balance
- Current luck period
- Specific section being analyzed

---

### Famous Charts Library

Pre-computed charts for 138+ historical figures with full analysis available.

![Famous Charts](docs/screenshot-famous.png)

**Categories:**
- Artists (Mozart, Picasso, Beethoven...)
- Leaders (Napoleon, Lincoln, Gandhi...)
- Scientists (Einstein, Tesla, Curie...)
- Entrepreneurs (Jobs, Musk, Oprah...)
- Performers (Jordan, Monroe, Jackson...)

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/GabrielRw/bazi-calculator.git
cd bazi-calculator

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Edit .env.local with your API keys (see below)

# 5. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Configuration

### Required: Free Astro API

This project uses the [Free Astro API](https://freeastroapi.com) for all BaZi calculations.

1. Visit [freeastroapi.com](https://freeastroapi.com)
2. Sign up for a free account
3. Navigate to your dashboard and copy your API key

```env
# .env.local
ASTRO_API_KEY=your_free_astro_api_key_here
```

**How the API key is used:**
```typescript
// src/app/api/bazi/natal/route.ts
const response = await fetch(API_URL, {
  headers: {
    'x-api-key': process.env.ASTRO_API_KEY!, // Server-side only
  },
});
```

> **Important**: The API key is only used server-side in API routes. It is never exposed to the client.

---

### Optional: AI Explanations

For AI-powered chart explanations, you need an AI provider API key. This project is configured to use **Mistral AI** by default.

#### Default: Mistral AI

```env
# .env.local
MISTRAL_API_KEY=your_mistral_api_key_here
```

Get your key at [console.mistral.ai](https://console.mistral.ai)

**How the Mistral key is used:**
```typescript
// src/app/api/bazi/explain/route.ts
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const response = await fetch(MISTRAL_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'mistral-small-latest',
    messages: [...],
  }),
});
```

#### Alternative Providers

You can modify `src/app/api/bazi/explain/route.ts` to use other providers:

**OpenAI (GPT-4)**
```env
OPENAI_API_KEY=sk-your-openai-key-here
```
Get your key at [platform.openai.com](https://platform.openai.com)

**Anthropic (Claude)**
```env
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```
Get your key at [console.anthropic.com](https://console.anthropic.com)

**OpenRouter (Multiple Models)**
```env
OPENROUTER_API_KEY=sk-or-your-openrouter-key-here
```
Get your key at [openrouter.ai](https://openrouter.ai)

**Local Models (Ollama)**
```env
OLLAMA_BASE_URL=http://localhost:11434
```
Run Ollama locally: [ollama.ai](https://ollama.ai)

---

### Complete .env.local Example

```env
# ===========================================
# REQUIRED: Free Astro API
# ===========================================
# Get yours at https://freeastroapi.com
ASTRO_API_KEY=your_api_key_here

# ===========================================
# OPTIONAL: AI Provider (Mistral by default)
# ===========================================
# Get yours at https://console.mistral.ai
MISTRAL_API_KEY=your_mistral_key_here
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── bazi/
│   │   │   ├── natal/route.ts   # Natal chart calculation
│   │   │   ├── flow/route.ts    # Annual/monthly flow
│   │   │   ├── health/route.ts  # Health analysis
│   │   │   ├── lifespan/route.ts # Neijing curve
│   │   │   ├── synastry/route.ts # Compatibility
│   │   │   └── explain/route.ts  # AI explanations
│   │   └── geo/
│   │       └── search/route.ts   # City search
│   ├── famous-charts/
│   │   ├── page.tsx              # Famous charts index
│   │   └── [slug]/page.tsx       # Individual chart pages
│   ├── contact/page.tsx
│   ├── layout.tsx
│   └── page.tsx                  # Main calculator
│
├── components/
│   ├── FourPillars.tsx          # Four Pillars display
│   ├── WuxingChart.tsx          # Five Elements visualization
│   ├── HealthSection.tsx        # TCM constitution
│   ├── AnalysisSection.tsx      # Deep analysis
│   ├── LuckPillars.tsx          # 10-year luck cycles
│   ├── FlowSection.tsx          # Destiny flow
│   ├── JingQiShenChart.tsx      # Neijing curve
│   ├── SynastryResult.tsx       # Compatibility display
│   ├── ChartRaritySection.tsx   # Rarity score
│   ├── FamousMatchesSection.tsx # Famous chart matching
│   ├── StarDetailModal.tsx      # Star explanations
│   ├── AskAIButton.tsx          # AI integration
│   ├── AISidebar.tsx            # AI response display
│   └── TopNav.tsx               # Navigation
│
├── data/
│   ├── famousPeople.ts          # Famous people database (150+)
│   ├── famousPeopleCharts.ts    # Pre-computed charts (138)
│   └── starDetails.ts           # Symbolic star content
│
├── lib/
│   └── chartMatcher.ts          # Chart matching algorithm
│
└── types/
    ├── bazi.ts                  # BaZi type definitions
    └── ai.ts                    # AI context types
```

---

## Technical Deep Dive

### True Solar Time Calculation

Unlike simple timezone-based calculations, True Solar Time accounts for:

1. **Geographic Longitude** - The actual solar noon at your birth location
2. **Equation of Time** - Earth's elliptical orbit and axial tilt
3. **Daylight Saving Time** - Historical DST rules for accuracy

```typescript
// The API handles this automatically with time_mode
body: JSON.stringify({
  // ...
  time_mode: 'true_solar_absolute', // Most accurate
  // Other options: 'true_solar', 'standard'
})
```

### Chart Matching Algorithm

The famous chart matching uses weighted scoring:

```typescript
// src/lib/chartMatcher.ts
const WEIGHTS = {
  dayMaster: 0.30,      // Same Day Master element
  elements: 0.20,       // Element distribution similarity
  dmStrength: 0.15,     // Weak/Strong alignment
  structure: 0.15,      // Same chart structure type
  pillars: 0.10,        // Identical Gan-Zhi matches
  stars: 0.10,          // Shared symbolic stars
};
```

### Component Architecture

Each analysis section follows a consistent pattern:

```tsx
// Example: HealthSection.tsx
interface HealthSectionProps {
  data: HealthResult;
  chartContext: ChartContext;
  onAIExplanation?: (explanation: string, title: string) => void;
  onAIRequest?: (title: string) => void;
}

export default function HealthSection({ 
  data, 
  chartContext,
  onAIExplanation,
  onAIRequest 
}: HealthSectionProps) {
  // ... component logic
}
```

---

## Famous Charts

### Regenerating Charts

To regenerate all famous charts (requires API key):

```bash
npx tsx scripts/generateFamousCharts.ts
```

This script:
1. Loads all famous people from `src/data/famousPeople.ts`
2. Calls the Free Astro API for each person
3. Saves results to `src/data/famousPeopleCharts.ts`

### Adding New Famous People

1. Edit `src/data/famousPeople.ts`:

```typescript
{
  id: 'person-slug',
  name: 'Full Name',
  category: 'artist', // artist, leader, scientist, entrepreneur, performer
  birth: {
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
    city: 'Birth City',
    country: 'Country',
  },
  brief: 'Short biography...',
  keywords: ['keyword1', 'keyword2'],
}
```

2. Run the generation script
3. The new chart will appear in the Famous Charts library

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Free Astro API](https://freeastroapi.com) - For providing the BaZi calculation engine
- The traditional Chinese metaphysics community for preserving this ancient wisdom

---

## Contact

For questions or feedback, please open an issue or visit the [Contact page](https://bazi-calculator-liart.vercel.app/contact).

---

Made with care by the True BaZi team
