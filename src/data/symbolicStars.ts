
export interface StarContent {
    name: string;
    pinyin: string;
    keywords: string[];
    description: string; // The "Deep Search" content (2000+ chars goal)
    quote: string;
    source: string;
    implication_positive: string;
    implication_negative: string;
}

export const SYMBOLIC_STARS_DATA: Record<string, StarContent> = {
    "Nobleman": {
        name: "Tian Yi Gui Ren",
        pinyin: "Tiān Yǐ Guì Rén",
        keywords: ["Help", "Rescue", "Intelligence", "Status"],
        description: `
The **Heavenly Nobleman** (Tiān Yǐ Guì Rén) is widely regarded as the most auspicious star in Bazi astrology. It represents a powerful force of rescue, assistance, and elevation. Unlike other stars that may bring wealth or power with strings attached, the Nobleman brings help precisely when it is needed most, often turning disaster into fortune.

**Historical and Theoretical Context:**
In classical texts, the Nobleman is described as the "Premier Minister of the Heavens." It is the energy of dignity, grace, and class. When this star is present in a chart, it acts as a buffer against negativity. It does not necessarily prevent problems from occurring, but it ensures that there is always a way out. It is often said that "With the Nobleman, the fierce turns auspicious."

**Mechanism of Action:**
The Nobleman works by attracting helpful people. These can be mentors, benefactors, or simply strangers who step in at the right moment. It also enhances the Day Master's own demeanor, bestowing a sense of calm intelligence and refined behavior that naturally commands respect.

**Pillar Analysis:**
- **Year Pillar:** Indicates being born into a family of good standing or receiving help from grandparents/ancestors. You likely had a protected childhood.
- **Month Pillar:** Suggests support from parents, siblings, or superiors in your early career. You navigate organizational hierarchies with ease.
- **Day Pillar:** The "Self-Sitting Nobleman." This is extremely auspicious, indicating a supportive spouse and high personal intelligence. You have an innate ability to solve your own problems.
- **Hour Pillar:** Represents reliable children or subordinates. In old age, you will not be lonely or helpless. Your innovative ideas receive support.

**Modern Interpretation:**
In today's competitive world, the Nobleman star is akin to having a strong professional network and excellent reputation. It is the "Social Capital" star. People with this star rarely hit rock bottom because their character and connections provide a safety net. However, if the star is clashed or harmed, its helpful effects may be reduced or come with complications.
        `.trim(),
        quote: "The Nobleman is the Premier Minister of Heaven, turning the fierce into the auspicious and the impossible into the achievable.",
        source: "San Ming Tong Hui (The Comprehensive Survey of Three Destinies)",
        implication_positive: "Attracts mentors, helpful people, and favorable circumstances. Reduces the impact of bad luck.",
        implication_negative: "If clashed, the help may come too late or with conditions. You may feel entitled to help rather than earning it."
    },
    "Peach Blossom": {
        name: "Tao Hua",
        pinyin: "Táo Huā",
        keywords: ["Attraction", "Romance", "Charisma", "Scandal"],
        description: `
The **Peach Blossom** (Táo Huā) is perhaps the most famous and misunderstood star in Chinese metaphysics. While commonly associated with romance and lust, its fundamental energy is about **attraction** and **visibility**.

**The Nature of Attraction:**
A Peach Blossom star makes the chart owner noticeable. It acts like a magnet, drawing eyes and attention. In ancient times, this was often seen as dangerous for women (risking propriety) but useful for men (concubines). In the modern context, it is the star of "Likability." It is essential for entertainers, sales professionals, public speakers, and anyone whose success depends on public reception.

**Types of Peach Blossom:**
- **External Peach Blossom (Year/Month):** You are generally popular and well-liked socially. It helps with networking and career visibility.
- **Internal Peach Blossom (Day/Hour):** This is more private and sexual. It governs intimate relationships and can indicate a high libido or hidden affairs if unfavorable.
- **Peach Blossom forming Water:** Can indicate excessive lust or scandal if not controlled.
- **Peach Blossom with Nobleman:** "Noble Peach Blossom." Attraction leads to status and help (e.g., marrying up).

**The Double-Edged Sword:**
While charisma is an asset, an uncontrolled Peach Blossom can lead to "Peach Blossom Calamity" (romantic scandals, lawsuits, financial loss due to relationships). The key is how the Day Master handles the attention.

**Strategic Usage:**
If you have this star, you should leverage it for your career. Be the face of the brand. Engage in public relations. Do not hide in the back office; your face is your fortune.
        `.trim(),
        quote: "The Peach Blossom brings the spring breeze, but beware lest the petals fall into the muddy water.",
        source: "Yuan Hai Zi Ping (Deep Ocean of Zi Ping)",
        implication_positive: "High charisma, attractiveness, and social popularity. Excellent for fame and networking.",
        implication_negative: "Risk of infidelity, relationship drama, or being judged solely on appearance."
    },
    "Traveling Horse": {
        name: "Yi Ma",
        pinyin: "Yì Mǎ",
        keywords: ["Movement", "Change", "Travel", "Ambition"],
        description: `
The **Traveling Horse** (Yì Mǎ) represents the kinetic energy of the chart. It is the star of movement, migration, and progress. It indicates that success comes from being in motion rather than staying still.

**Dynamics of Movement:**
This star forces the Day Master out of their comfort zone. It is associated with physical travel, moving homes, changing jobs, or shifting industries. In ancient agrarian society, stability was prized, so this star was sometimes seen as unsettling. In the modern global economy, however, the Traveling Horse is a vital asset for international business, logistics, and digital nomadism.

**Progress and Speed:**
Beyond physical travel, Yi Ma governs mental agility. People with this star learn fast, adapt quickly, and often lack patience. They are the early adopters and the accelerators. If the horse is "whipped" (clashed), the movement becomes frantic and stressful. If the horse is "fed" (supported), the movement is purposeful and profitable.

**Financial Implications:**
"Wealth moves on the Horse." For many charts, the Traveling Horse triggers financial opportunities. It suggests that your wealth is found far from your birthplace. Export/import, tourism, and transportation are favored industries.

**Emotional Impact:**
The downside of the Traveling Horse is restlessness and potential loneliness. "The Horse runs alone." Frequent changes can make deep, long-term bonding difficult.
        `.trim(),
        quote: "Men born with the Horse roam the four corners; Women born with the Horse marry far away.",
        source: "Classical Aphorism",
        implication_positive: "Success through travel, adaptability, and speed. Good for international career.",
        implication_negative: "Restlessness, instability, and anxiety. Difficulty settling down."
    },
    "Academic Star": {
        name: "Wen Chang",
        pinyin: "Wén Chāng",
        keywords: ["Intellect", "Writing", "Learning", "Skills"],
        description: `
The **Academic Star** (Wén Chāng) governs intelligence, literary talent, and the ability to abstract complex concepts. It is named after the Wenchang Wang, the Daoist deity of culture and literature.

**The Scholar's Gift:**
Unlike the Nobleman which brings help, the Academic Star brings **capacity**. It gives the chart owner a hunger for knowledge and the mental faculties to absorb it. It is particularly associated with writing, teaching, and academic pursuits. In the old imperial examination system, this star was a prerequisite for high office.

**Mental Resilience:**
A lesser-known attribute of Wen Chang is its ability to turn misfortune into wisdom. It allows the individual to intellectualize problems, detach emotionally, and find a solution. It is a "Problem Solver" star.

**Modern Application:**
In the information age, this star is gold. It favors researchers, coders, writers, and content creators. It suggests that your path to wealth lies in your specialized skills and knowledge base.

**Strategic Advice:**
If you have this star, never stop learning. Your brain needs to be fed constantly. If you feel stuck in life, go back to school or take a course—this often unlocks the flow of Qi in your chart.
        `.trim(),
        quote: "With Wen Chang in the chart, the brush flows like a dragon and the mind is as clear as a mirror.",
        source: "Zi Ping Zhen Quan",
        implication_positive: "Academic success, strong learning usage, and talent in writing/arts.",
        implication_negative: "Can lead to over-thinking or living in an ivory tower, disconnected from practical reality."
    },
    "Yang Ren": {
        name: "Goat Blade",
        pinyin: "Yáng Rèn",
        keywords: ["Intensity", "Aggression", "Leadership", "Surgery"],
        description: `
The **Goat Blade** (Yáng Rèn), often dramatically translated as the "Sheep Blade," is a star of extreme intensity. It represents the peak of the Day Master's element—energy so strong it becomes sharp like a blade.

**The Double-Edged Blade:**
This star is not inherently "bad," but it is dangerous. It gives incredible drive, ambition, and resilience. Many military generals, top surgeons, and aggressive CEOs have this star. It allows one to cut through obstacles and endure pain that would break others. However, like a sharp knife, it cuts the owner if mishandled.

**Manifestations:**
- **Positive:** Authority, decisiveness, high tolerance for risk, ability to execute difficult tasks.
- **Negative:** Temper issues, impatience, physical injury (cuts/surgery), conflict with spouse.

**The "Control" Factor:**
The Goat Blade needs to be "Controlled" (by the Seven Killings star) or "Outputted" (by the Hurting Officer star).
- If Controlled: The blade becomes a sword of authority (General).
- If Uncontrolled: The blade becomes a weapon of crime (Bandit).

**Health Note:**
Historically associated with bloodshed. In modern times, this often manifests as surgery. Some masters suggest that donating blood or undergoing planned cosmetic procedures can "satisfy" the blood debt of this star.
        `.trim(),
        quote: "The Blade without the Killings (Authority) is just a ruffian; The Killings without the Blade lacks power.",
        source: "San Ming Tong Hui",
        implication_positive: "Unstoppable drive and leadership. Great for competitive fields.",
        implication_negative: "Risk of injury, surgery, and conflict. Stubbornness can ruin relationships."
    },
    // Adding generic fallback for any other stars to ensure the modal always works
    "General": {
        name: "General Star",
        pinyin: "Xīng",
        keywords: ["Influence", "Timing", "Fate"],
        description: `
This star represents a specific energetic influence in your Bazi chart.
        
While not one of the "Major" stars like Nobleman or Peach Blossom, it plays a specific role in modifying the quality of the pillar it sits on. 
        
In Bazi, stars (Shen Sha) are "Auxiliary Gods." They are the flavor notes in the main dish of the Five Elements. They add nuance. A Wealth star tells us you have money; a "Robbing Devil" star on top might tell us you lose it quickly.
        
**Interpretation Strategy:**
To effectively interpret this star, look at:
1. **The Pillar:** Is it in your Year (social/external), Month (career), Day (spouse/self), or Hour (thoughts/legacy)?
2. **The Element:** Does this star sit on an element that is favorable (Useful God) or unfavorable to you?
   - If Favorable: The star's positive traits are amplified.
   - If Unfavorable: The star's negative traits are triggered.
        `.trim(),
        quote: "Stars are the flowers; Elements are the roots.",
        source: "Bazi Wisdom",
        implication_positive: "Adds specific flavor and nuance to your destiny analysis.",
        implication_negative: "Can be a distraction if one ignores the core elemental interactions."
    }
};

export function getStarData(starName: string): StarContent {
    // Try exact match
    if (SYMBOLIC_STARS_DATA[starName]) return SYMBOLIC_STARS_DATA[starName];

    // Try partial match (e.g. "Red Peach Blossom" -> "Peach Blossom")
    const foundKey = Object.keys(SYMBOLIC_STARS_DATA).find(k => starName.includes(k));
    if (foundKey) return SYMBOLIC_STARS_DATA[foundKey];

    // Return generic data with the specific name injected
    return {
        ...SYMBOLIC_STARS_DATA["General"],
        name: starName
    };
}
