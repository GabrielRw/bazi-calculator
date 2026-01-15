# True BaZi Calculator

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

A professional-grade **Chinese astrology (BaZi / Four Pillars of Destiny)** calculator built with Next.js. Features true solar time calculations, famous chart comparisons, AI-powered insights, and comprehensive destiny analysis.

![True BaZi Calculator Screenshot](docs/screenshot-hero.png)

## ✨ Features

### Core Calculator
- **Four Pillars Chart** - Year, Month, Day, and Hour pillars with Heavenly Stems & Earthly Branches
- **True Solar Time** - Precise calculations using geographic coordinates (not just timezone)
- **Day Master Analysis** - Personality insights based on your Day Master element
- **Element Balance (Wu Xing)** - Interactive five-element distribution visualization
- **Luck Cycles** - 10-year luck pillars with timing analysis

### Advanced Analysis
- **Health & Constitution** - TCM-based constitutional analysis
- **Symbolic Stars (Shen Sha)** - Traditional star interpretations
- **Yong Shen / Useful Gods** - Strategic element recommendations
- **Chart Rarity Score** - How unique is your destiny chart?
- **Neijing Life Curve** - Jing-Qi-Shen energy modeling

### Famous Charts Library
- **138+ Historical Figures** - Pre-computed charts for celebrities, leaders, scientists
- **SEO-Optimized Pages** - Individual pages for each famous person
- **Chart Matching** - Compare your chart with famous personalities

### AI Integration
- **Smart Explanations** - Context-aware AI insights for each chart section
- **History Tracking** - Review past AI explanations

## 📸 Screenshots

<!-- Add your screenshots here -->
![Four Pillars Chart](docs/screenshot-pillars.png)
![Element Balance](docs/screenshot-wuxing.png)
![Famous Charts](docs/screenshot-famous.png)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GabrielRw/bazi-calculator.git
   cd bazi-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys (see [API Configuration](#api-configuration) below).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Configuration

This project uses the [Free Astro API](https://freeastroapi.com) for BaZi calculations. You'll need to obtain an API key:

1. Visit [freeastroapi.com](https://freeastroapi.com)
2. Sign up for a free account
3. Copy your API key

### Environment Variables

Create a `.env.local` file with:

```env
# Required: Free Astro API Key
# Get yours at https://freeastroapi.com
ASTRO_API_KEY=your_api_key_here

# Optional: OpenAI API Key (for AI explanations)
OPENAI_API_KEY=your_openai_key_here
```

> ⚠️ **Important**: Never commit your `.env.local` file. It's already in `.gitignore`.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (proxy to Free Astro API)
│   ├── famous-charts/     # Famous people chart pages
│   └── contact/           # Contact page
├── components/            # React components
│   ├── FourPillars.tsx   # Four Pillars display
│   ├── WuxingChart.tsx   # Five Elements visualization
│   ├── HealthSection.tsx # TCM constitution analysis
│   └── ...
├── data/                  # Static data
│   ├── famousPeople.ts   # Famous people database
│   └── famousPeopleCharts.ts  # Pre-computed charts
├── lib/                   # Utilities
│   └── chartMatcher.ts   # Chart matching algorithm
└── types/                 # TypeScript definitions
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: [Free Astro API](https://freeastroapi.com) for BaZi calculations
- **AI**: OpenAI GPT-4 for explanations (optional)

## 📊 API Endpoints

The app proxies requests through internal API routes:

| Endpoint | Description |
|----------|-------------|
| `/api/bazi/natal` | Calculate natal chart |
| `/api/bazi/flow` | Get annual/monthly flow |
| `/api/bazi/health` | Health & constitution analysis |
| `/api/bazi/lifespan` | Neijing energy curve |
| `/api/bazi/synastry` | Relationship compatibility |
| `/api/bazi/explain` | AI explanations |
| `/api/geo/search` | City/location search |

## 🌟 Famous Charts

The project includes pre-computed BaZi charts for 138+ historical figures:

- **Artists**: Mozart, Picasso, Beethoven, David Bowie...
- **Leaders**: Napoleon, Lincoln, Gandhi, Obama...
- **Scientists**: Einstein, Tesla, Marie Curie...
- **Entrepreneurs**: Steve Jobs, Elon Musk, Oprah...
- **Performers**: Michael Jordan, Marilyn Monroe...

### Regenerating Famous Charts

To regenerate the famous charts data:

```bash
npx tsx scripts/generateFamousCharts.ts
```

This requires the `ASTRO_API_KEY` in your `.env.local`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Free Astro API](https://freeastroapi.com) - For providing the BaZi calculation engine
- The traditional Chinese metaphysics community for preserving this ancient wisdom

## 📬 Contact

For questions or feedback, please open an issue or visit the [Contact page](https://truebazi.com/contact).

---

Made with ☯ by the True BaZi team
