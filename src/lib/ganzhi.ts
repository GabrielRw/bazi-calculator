
export interface GanzhiData {
    pinyin: string;
    translation: string;
    element: string;
    polarity: "Yang" | "Yin";
    zodiac?: string;
}

export const HEAVENLY_STEMS: Record<string, GanzhiData> = {
    "甲": { pinyin: "Jiǎ", translation: "Yang Wood", element: "Wood", polarity: "Yang" },
    "乙": { pinyin: "Yǐ", translation: "Yin Wood", element: "Wood", polarity: "Yin" },
    "丙": { pinyin: "Bǐng", translation: "Yang Fire", element: "Fire", polarity: "Yang" },
    "丁": { pinyin: "Dīng", translation: "Yin Fire", element: "Fire", polarity: "Yin" },
    "戊": { pinyin: "Wù", translation: "Yang Earth", element: "Earth", polarity: "Yang" },
    "己": { pinyin: "Jǐ", translation: "Yin Earth", element: "Earth", polarity: "Yin" },
    "庚": { pinyin: "Gēng", translation: "Yang Metal", element: "Metal", polarity: "Yang" },
    "辛": { pinyin: "Xīn", translation: "Yin Metal", element: "Metal", polarity: "Yin" },
    "壬": { pinyin: "Rén", translation: "Yang Water", element: "Water", polarity: "Yang" },
    "癸": { pinyin: "Guǐ", translation: "Yin Water", element: "Water", polarity: "Yin" },
};

export const EARTHLY_BRANCHES: Record<string, GanzhiData> = {
    "子": { pinyin: "Zǐ", translation: "Rat", element: "Water", polarity: "Yang", zodiac: "Rat" },
    "丑": { pinyin: "Chǒu", translation: "Ox", element: "Earth", polarity: "Yin", zodiac: "Ox" },
    "寅": { pinyin: "Yín", translation: "Tiger", element: "Wood", polarity: "Yang", zodiac: "Tiger" },
    "卯": { pinyin: "Mǎo", translation: "Rabbit", element: "Wood", polarity: "Yin", zodiac: "Rabbit" },
    "辰": { pinyin: "Chén", translation: "Dragon", element: "Earth", polarity: "Yang", zodiac: "Dragon" },
    "巳": { pinyin: "Sì", translation: "Snake", element: "Fire", polarity: "Yin", zodiac: "Snake" },
    "午": { pinyin: "Wǔ", translation: "Horse", element: "Fire", polarity: "Yang", zodiac: "Horse" },
    "未": { pinyin: "Wèi", translation: "Goat", element: "Earth", polarity: "Yin", zodiac: "Goat" },
    "申": { pinyin: "Shēn", translation: "Monkey", element: "Metal", polarity: "Yang", zodiac: "Monkey" },
    "酉": { pinyin: "Yǒu", translation: "Rooster", element: "Metal", polarity: "Yin", zodiac: "Rooster" },
    "戌": { pinyin: "Xū", translation: "Dog", element: "Earth", polarity: "Yang", zodiac: "Dog" },
    "亥": { pinyin: "Hài", translation: "Pig", element: "Water", polarity: "Yin", zodiac: "Pig" },
};

export function getStemData(char: string): GanzhiData | undefined {
    return HEAVENLY_STEMS[char];
}

export function getBranchData(char: string): GanzhiData | undefined {
    return EARTHLY_BRANCHES[char];
}

export function getGanzhiTranslation(char: string): string {
    const data = HEAVENLY_STEMS[char] || EARTHLY_BRANCHES[char];
    return data ? data.translation : char;
}

export function getGanzhiPinyin(char: string): string {
    const data = HEAVENLY_STEMS[char] || EARTHLY_BRANCHES[char];
    return data ? data.pinyin : char;
}
