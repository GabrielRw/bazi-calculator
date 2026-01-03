import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Settings, Loader2, History, User, Users, ArrowRightLeft, MapPin, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { BaziResult, BaziFlowResult } from "@/types/bazi";

// City Search API Result
interface CityResult {
    name: string;
    country: string;
    lat: number;
    lng: number;
    timezone: string;
    population: number;
}

// Validation Errors Interface
interface ValidationErrors {
    year?: string;
    month?: string;
    day?: string;
    hour?: string;
    minute?: string;
    city?: string;
}

export interface FormData {
    name?: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    city: string;
    lat?: number;
    lng?: number;
    gender: "male" | "female";
    timeStandard: string;
    calendar: string;
}

export interface SynastryRequest {
    person_a: FormData;
    person_b: FormData;
}

export interface HistoryItem extends FormData {
    timestamp: number;
    label: string;
    result?: BaziResult;
    flowResult?: BaziFlowResult;
}

interface BaziFormProps {
    onSubmit: (data: FormData | SynastryRequest, mode: "individual" | "synastry") => void;
    isLoading: boolean;
    history: HistoryItem[];
    onDeleteHistory: (index: number) => void;
    onSelectHistory: (item: HistoryItem) => void;
    loadedData?: FormData | null;
}

const DEFAULT_FORM_DATA = {
    name: "",
    year: "",
    month: "",
    day: "",
    hour: "",
    minute: "",
    city: "",
    lat: "",
    lng: "",
    gender: "male",
    timeStandard: "true_solar_absolute",
    calendar: "gregorian",
};

// Static cache of popular cities for instant results
const POPULAR_CITIES: CityResult[] = [
    { name: "New York", country: "US", lat: 40.7128, lng: -74.006, timezone: "America/New_York", population: 8336817 },
    { name: "Los Angeles", country: "US", lat: 34.0522, lng: -118.2437, timezone: "America/Los_Angeles", population: 3979576 },
    { name: "Chicago", country: "US", lat: 41.8781, lng: -87.6298, timezone: "America/Chicago", population: 2693976 },
    { name: "Houston", country: "US", lat: 29.7604, lng: -95.3698, timezone: "America/Chicago", population: 2320268 },
    { name: "San Francisco", country: "US", lat: 37.7749, lng: -122.4194, timezone: "America/Los_Angeles", population: 873965 },
    { name: "London", country: "GB", lat: 51.5074, lng: -0.1278, timezone: "Europe/London", population: 8982000 },
    { name: "Manchester", country: "GB", lat: 53.4808, lng: -2.2426, timezone: "Europe/London", population: 553230 },
    { name: "Paris", country: "FR", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris", population: 2138551 },
    { name: "Lyon", country: "FR", lat: 45.7640, lng: 4.8357, timezone: "Europe/Paris", population: 516092 },
    { name: "Marseille", country: "FR", lat: 43.2965, lng: 5.3698, timezone: "Europe/Paris", population: 861635 },
    { name: "Berlin", country: "DE", lat: 52.52, lng: 13.405, timezone: "Europe/Berlin", population: 3644826 },
    { name: "Munich", country: "DE", lat: 48.1351, lng: 11.582, timezone: "Europe/Berlin", population: 1471508 },
    { name: "Hamburg", country: "DE", lat: 53.5511, lng: 9.9937, timezone: "Europe/Berlin", population: 1841179 },
    { name: "Tokyo", country: "JP", lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo", population: 13960000 },
    { name: "Osaka", country: "JP", lat: 34.6937, lng: 135.5023, timezone: "Asia/Tokyo", population: 2691000 },
    { name: "Beijing", country: "CN", lat: 39.9042, lng: 116.4074, timezone: "Asia/Shanghai", population: 21540000 },
    { name: "Shanghai", country: "CN", lat: 31.2304, lng: 121.4737, timezone: "Asia/Shanghai", population: 24280000 },
    { name: "Hong Kong", country: "HK", lat: 22.3193, lng: 114.1694, timezone: "Asia/Hong_Kong", population: 7500700 },
    { name: "Taipei", country: "TW", lat: 25.033, lng: 121.5654, timezone: "Asia/Taipei", population: 2646204 },
    { name: "Singapore", country: "SG", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore", population: 5685800 },
    { name: "Seoul", country: "KR", lat: 37.5665, lng: 126.978, timezone: "Asia/Seoul", population: 9776000 },
    { name: "Sydney", country: "AU", lat: -33.8688, lng: 151.2093, timezone: "Australia/Sydney", population: 5312163 },
    { name: "Melbourne", country: "AU", lat: -37.8136, lng: 144.9631, timezone: "Australia/Melbourne", population: 5078193 },
    { name: "Toronto", country: "CA", lat: 43.6532, lng: -79.3832, timezone: "America/Toronto", population: 2731571 },
    { name: "Vancouver", country: "CA", lat: 49.2827, lng: -123.1207, timezone: "America/Vancouver", population: 631486 },
    { name: "Montreal", country: "CA", lat: 45.5017, lng: -73.5673, timezone: "America/Toronto", population: 1762949 },
    { name: "Mumbai", country: "IN", lat: 19.076, lng: 72.8777, timezone: "Asia/Kolkata", population: 12442373 },
    { name: "Delhi", country: "IN", lat: 28.7041, lng: 77.1025, timezone: "Asia/Kolkata", population: 16787941 },
    { name: "Bangalore", country: "IN", lat: 12.9716, lng: 77.5946, timezone: "Asia/Kolkata", population: 8443675 },
    { name: "Bangkok", country: "TH", lat: 13.7563, lng: 100.5018, timezone: "Asia/Bangkok", population: 8280925 },
    { name: "Dubai", country: "AE", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai", population: 3331420 },
    { name: "Moscow", country: "RU", lat: 55.7558, lng: 37.6173, timezone: "Europe/Moscow", population: 12506468 },
    { name: "São Paulo", country: "BR", lat: -23.5505, lng: -46.6333, timezone: "America/Sao_Paulo", population: 12325232 },
    { name: "Rio de Janeiro", country: "BR", lat: -22.9068, lng: -43.1729, timezone: "America/Sao_Paulo", population: 6747815 },
    { name: "Mexico City", country: "MX", lat: 19.4326, lng: -99.1332, timezone: "America/Mexico_City", population: 8918653 },
    { name: "Amsterdam", country: "NL", lat: 52.3676, lng: 4.9041, timezone: "Europe/Amsterdam", population: 872680 },
    { name: "Rome", country: "IT", lat: 41.9028, lng: 12.4964, timezone: "Europe/Rome", population: 2872800 },
    { name: "Milan", country: "IT", lat: 45.4642, lng: 9.19, timezone: "Europe/Rome", population: 1352000 },
    { name: "Madrid", country: "ES", lat: 40.4168, lng: -3.7038, timezone: "Europe/Madrid", population: 3223334 },
    { name: "Barcelona", country: "ES", lat: 41.3874, lng: 2.1686, timezone: "Europe/Madrid", population: 1620343 },
    { name: "Vienna", country: "AT", lat: 48.2082, lng: 16.3738, timezone: "Europe/Vienna", population: 1897000 },
    { name: "Zurich", country: "CH", lat: 47.3769, lng: 8.5417, timezone: "Europe/Zurich", population: 402762 },
    { name: "Geneva", country: "CH", lat: 46.2044, lng: 6.1432, timezone: "Europe/Zurich", population: 201818 },
    { name: "Brussels", country: "BE", lat: 50.8503, lng: 4.3517, timezone: "Europe/Brussels", population: 1209000 },
    { name: "Stockholm", country: "SE", lat: 59.3293, lng: 18.0686, timezone: "Europe/Stockholm", population: 975904 },
    { name: "Copenhagen", country: "DK", lat: 55.6761, lng: 12.5683, timezone: "Europe/Copenhagen", population: 794128 },
    { name: "Oslo", country: "NO", lat: 59.9139, lng: 10.7522, timezone: "Europe/Oslo", population: 693494 },
    { name: "Helsinki", country: "FI", lat: 60.1699, lng: 24.9384, timezone: "Europe/Helsinki", population: 656229 },
    { name: "Dublin", country: "IE", lat: 53.3498, lng: -6.2603, timezone: "Europe/Dublin", population: 544107 },
    { name: "Lisbon", country: "PT", lat: 38.7223, lng: -9.1393, timezone: "Europe/Lisbon", population: 504718 },
    { name: "Athens", country: "GR", lat: 37.9838, lng: 23.7275, timezone: "Europe/Athens", population: 664046 },
    { name: "Prague", country: "CZ", lat: 50.0755, lng: 14.4378, timezone: "Europe/Prague", population: 1309000 },
    { name: "Warsaw", country: "PL", lat: 52.2297, lng: 21.0122, timezone: "Europe/Warsaw", population: 1790658 },
    { name: "Istanbul", country: "TR", lat: 41.0082, lng: 28.9784, timezone: "Europe/Istanbul", population: 15029231 },
    { name: "Cairo", country: "EG", lat: 30.0444, lng: 31.2357, timezone: "Africa/Cairo", population: 9539673 },
    { name: "Cape Town", country: "ZA", lat: -33.9249, lng: 18.4241, timezone: "Africa/Johannesburg", population: 433688 },
    { name: "Johannesburg", country: "ZA", lat: -26.2041, lng: 28.0473, timezone: "Africa/Johannesburg", population: 957441 },
    { name: "Tel Aviv", country: "IL", lat: 32.0853, lng: 34.7818, timezone: "Asia/Jerusalem", population: 451523 },
    { name: "Auckland", country: "NZ", lat: -36.8485, lng: 174.7633, timezone: "Pacific/Auckland", population: 1657200 },
    { name: "Kuala Lumpur", country: "MY", lat: 3.139, lng: 101.6869, timezone: "Asia/Kuala_Lumpur", population: 1808000 },
    { name: "Jakarta", country: "ID", lat: -6.2088, lng: 106.8456, timezone: "Asia/Jakarta", population: 10562088 },
    { name: "Manila", country: "PH", lat: 14.5995, lng: 120.9842, timezone: "Asia/Manila", population: 1780148 },
    { name: "Ho Chi Minh City", country: "VN", lat: 10.8231, lng: 106.6297, timezone: "Asia/Ho_Chi_Minh", population: 8993082 },
];

// Session cache for API results
const citySearchCache: Map<string, CityResult[]> = new Map();

// Search popular cities locally (case-insensitive prefix match)
const searchPopularCities = (query: string): CityResult[] => {
    const lowerQuery = query.toLowerCase();
    return POPULAR_CITIES
        .filter(city => city.name.toLowerCase().startsWith(lowerQuery))
        .slice(0, 5);
};

// Validation helper functions
const validateFormData = (data: { year: string; month: string; day: string; hour: string; minute: string; city: string }): ValidationErrors => {
    const errors: ValidationErrors = {};

    const year = parseInt(data.year);
    const month = parseInt(data.month);
    const day = parseInt(data.day);
    const hour = parseInt(data.hour);
    const minute = parseInt(data.minute);

    if (!data.year || isNaN(year)) {
        errors.year = "Year is required";
    } else if (year < 1900 || year > 2100) {
        errors.year = "Year must be between 1900-2100";
    }

    if (!data.month || isNaN(month)) {
        errors.month = "Month is required";
    } else if (month < 1 || month > 12) {
        errors.month = "Month must be 1-12";
    }

    if (!data.day || isNaN(day)) {
        errors.day = "Day is required";
    } else if (day < 1 || day > 31) {
        errors.day = "Day must be 1-31";
    } else if (month && !isNaN(month)) {
        // More specific day validation based on month
        const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const maxDays = daysInMonth[month - 1] || 31;
        if (day > maxDays) {
            errors.day = `Day must be 1-${maxDays} for month ${month}`;
        }
    }

    if (data.hour === "" || data.hour === undefined) {
        errors.hour = "Hour is required";
    } else if (isNaN(hour) || hour < 0 || hour > 23) {
        errors.hour = "Hour must be 0-23";
    }

    if (data.minute === "" || data.minute === undefined) {
        errors.minute = "Minute is required";
    } else if (isNaN(minute) || minute < 0 || minute > 59) {
        errors.minute = "Minute must be 0-59";
    }

    if (!data.city || data.city.trim() === "") {
        errors.city = "City is required";
    }

    return errors;
};

export default function BaziForm({
    onSubmit,
    isLoading,
    history,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSelectHistory,
    loadedData
}: BaziFormProps) {
    const [mode, setMode] = useState<"individual" | "synastry">("individual");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showHistory, setShowHistory] = useState<"A" | "B" | null>(null);

    // Two separate states for Person A (Main) and Person B (Partner)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [personA, setPersonA] = useState<any>(DEFAULT_FORM_DATA);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [personB, setPersonB] = useState<any>(DEFAULT_FORM_DATA);

    // Validation state
    const [errorsA, setErrorsA] = useState<ValidationErrors>({});
    const [errorsB, setErrorsB] = useState<ValidationErrors>({});
    const [showErrors, setShowErrors] = useState(false);

    // City autocomplete state
    const [cityResultsA, setCityResultsA] = useState<CityResult[]>([]);
    const [cityResultsB, setCityResultsB] = useState<CityResult[]>([]);
    const [showCityDropdownA, setShowCityDropdownA] = useState(false);
    const [showCityDropdownB, setShowCityDropdownB] = useState(false);
    const [cityLoadingA, setCityLoadingA] = useState(false);
    const [cityLoadingB, setCityLoadingB] = useState(false);
    const cityInputRefA = useRef<HTMLInputElement>(null);
    const cityInputRefB = useRef<HTMLInputElement>(null);
    const cityDropdownRefA = useRef<HTMLDivElement>(null);
    const cityDropdownRefB = useRef<HTMLDivElement>(null);

    // Debounce timer ref
    const debounceTimerA = useRef<NodeJS.Timeout | null>(null);
    const debounceTimerB = useRef<NodeJS.Timeout | null>(null);

    // City search function with caching
    const searchCities = useCallback(async (query: string, target: "A" | "B") => {
        if (query.length < 2) {
            if (target === "A") {
                setCityResultsA([]);
                setShowCityDropdownA(false);
            } else {
                setCityResultsB([]);
                setShowCityDropdownB(false);
            }
            return;
        }

        const setLoading = target === "A" ? setCityLoadingA : setCityLoadingB;
        const setResults = target === "A" ? setCityResultsA : setCityResultsB;
        const setShowDropdown = target === "A" ? setShowCityDropdownA : setShowCityDropdownB;

        const cacheKey = query.toLowerCase();

        // 1. First check popular cities (instant, no loading state)
        const popularMatches = searchPopularCities(query);
        if (popularMatches.length >= 5) {
            // We have enough results from popular cities
            setResults(popularMatches);
            setShowDropdown(true);
            return;
        }

        // 2. Check session cache
        const cachedResults = citySearchCache.get(cacheKey);
        if (cachedResults) {
            // Merge with popular cities, deduplicate by name+country
            const merged = [...popularMatches];
            for (const city of cachedResults) {
                if (!merged.some(m => m.name === city.name && m.country === city.country)) {
                    merged.push(city);
                }
            }
            setResults(merged.slice(0, 5));
            setShowDropdown(true);
            return;
        }

        // 3. If we have some popular matches, show them immediately while loading more
        if (popularMatches.length > 0) {
            setResults(popularMatches);
            setShowDropdown(true);
        }

        // 4. Fetch from API for more comprehensive results
        setLoading(true);
        try {
            const response = await fetch(
                `/api/geo/search?q=${encodeURIComponent(query)}&limit=5`
            );
            if (response.ok) {
                const data = await response.json();
                const apiResults = data.results || [];

                // Cache API results
                citySearchCache.set(cacheKey, apiResults);

                // Merge with popular cities, deduplicate
                const merged = [...popularMatches];
                for (const city of apiResults) {
                    if (!merged.some(m => m.name === city.name && m.country === city.country)) {
                        merged.push(city);
                    }
                }
                setResults(merged.slice(0, 5));
                setShowDropdown(true);
            }
        } catch (error) {
            console.error("City search error:", error);
            // Keep showing popular matches if API fails
            if (popularMatches.length === 0) {
                setResults([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle city input change with debouncing
    const handleCityInputChange = useCallback((value: string, target: "A" | "B") => {
        const setData = target === "A" ? setPersonA : setPersonB;
        const data = target === "A" ? personA : personB;
        const debounceTimer = target === "A" ? debounceTimerA : debounceTimerB;

        setData({ ...data, city: value });

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new debounce timer
        debounceTimer.current = setTimeout(() => {
            searchCities(value, target);
        }, 300);
    }, [personA, personB, searchCities]);

    // Handle city selection from dropdown
    const handleCitySelect = useCallback((city: CityResult, target: "A" | "B") => {
        const setData = target === "A" ? setPersonA : setPersonB;
        const data = target === "A" ? personA : personB;
        const setShowDropdown = target === "A" ? setShowCityDropdownA : setShowCityDropdownB;

        setData({ ...data, city: `${city.name}, ${city.country}` });
        setShowDropdown(false);
    }, [personA, personB]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                cityDropdownRefA.current &&
                !cityDropdownRefA.current.contains(event.target as Node) &&
                cityInputRefA.current &&
                !cityInputRefA.current.contains(event.target as Node)
            ) {
                setShowCityDropdownA(false);
            }
            if (
                cityDropdownRefB.current &&
                !cityDropdownRefB.current.contains(event.target as Node) &&
                cityInputRefB.current &&
                !cityInputRefB.current.contains(event.target as Node)
            ) {
                setShowCityDropdownB(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Populate form when parent passes loaded data (e.g. from history)
    useEffect(() => {
        if (loadedData) {
            const formatted = {
                name: loadedData.name || "",
                year: loadedData.year.toString(),
                month: loadedData.month.toString(),
                day: loadedData.day.toString(),
                hour: loadedData.hour.toString(),
                minute: loadedData.minute.toString(),
                city: loadedData.city,
                gender: loadedData.gender,
                timeStandard: loadedData.timeStandard,
                calendar: loadedData.calendar
            };

            // If we are selecting for Person B explicitly via history UI (not implemented yet, defaulting to A)
            // Ideally we need to know WHICH person we are loading into.
            // For now, let's assume if we are in Synastry mode and A is filled, we might want to fill B? 
            // Better UX: The history selector should be contextual.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPersonA(formatted);
        }
    }, [loadedData]);

    const handleLoadHistoryItem = (item: HistoryItem, target: "A" | "B") => {
        const formatted = {
            name: item.name || "",
            year: item.year.toString(),
            month: item.month.toString(),
            day: item.day.toString(),
            hour: item.hour.toString(),
            minute: item.minute.toString(),
            city: item.city,
            gender: item.gender,
            timeStandard: item.timeStandard,
            calendar: item.calendar
        };

        if (target === "A") setPersonA(formatted);
        else setPersonB(formatted);

        setShowHistory(null);
    };



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatDataForSubmit = (raw: any): FormData => ({
        ...raw,
        year: parseInt(raw.year) || 0,
        month: parseInt(raw.month) || 0,
        day: parseInt(raw.day) || 0,
        hour: parseInt(raw.hour) || 0,
        minute: parseInt(raw.minute) || 0,
        city: raw.city,
        lat: raw.lat ? parseFloat(raw.lat) : undefined,
        lng: raw.lng ? parseFloat(raw.lng) : undefined,
        gender: raw.gender,
        timeStandard: raw.timeStandard,
        calendar: raw.calendar
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        const validationErrorsA = validateFormData(personA);
        setErrorsA(validationErrorsA);

        if (mode === "synastry") {
            const validationErrorsB = validateFormData(personB);
            setErrorsB(validationErrorsB);

            // Check if there are any errors
            const hasErrorsA = Object.keys(validationErrorsA).length > 0;
            const hasErrorsB = Object.keys(validationErrorsB).length > 0;

            if (hasErrorsA || hasErrorsB) {
                setShowErrors(true);
                return;
            }

            onSubmit({
                person_a: formatDataForSubmit(personA),
                person_b: formatDataForSubmit(personB)
            }, "synastry");
        } else {
            // Check if there are any errors for individual mode
            if (Object.keys(validationErrorsA).length > 0) {
                setShowErrors(true);
                return;
            }

            onSubmit(formatDataForSubmit(personA), "individual");
        }
    };

    // Reusable Input Group
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderInputGroup = (data: any, setData: any, label: string, target: "A" | "B") => {
        const errors = target === "A" ? errorsA : errorsB;
        const cityResults = target === "A" ? cityResultsA : cityResultsB;
        const showCityDropdown = target === "A" ? showCityDropdownA : showCityDropdownB;
        const cityLoading = target === "A" ? cityLoadingA : cityLoadingB;
        const cityInputRef = target === "A" ? cityInputRefA : cityInputRefB;
        const cityDropdownRef = target === "A" ? cityDropdownRefA : cityDropdownRefB;

        // Helper to render error message
        const renderError = (field: keyof ValidationErrors) => {
            if (showErrors && errors[field]) {
                return (
                    <div className="flex items-center gap-1 mt-1 text-red-400 text-[10px]">
                        <AlertCircle className="w-3 h-3" />
                        {errors[field]}
                    </div>
                );
            }
            return null;
        };

        // Helper to get input class with error styling
        const getInputClass = (field: keyof ValidationErrors, baseClass: string) => {
            return clsx(
                baseClass,
                showErrors && errors[field]
                    ? "border-red-500/50 focus:border-red-500"
                    : ""
            );
        };

        return (
            <div className={clsx("space-y-6 relative p-6 rounded-2xl border transition-all",
                target === "A"
                    ? "bg-white/5 border-white/10"
                    : "bg-clay/5 border-clay/20"
            )}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={clsx("font-bold uppercase tracking-wider text-xs flex items-center gap-2",
                        target === "A" ? "text-gray-400" : "text-clay"
                    )}>
                        {target === "A" ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        {label}
                    </h3>

                    {/* History Button for this specific input */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowHistory(showHistory === target ? null : target)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
                        >
                            <History className="w-3 h-3" /> Load
                        </button>

                        {/* Contextual History Dropdown */}
                        <AnimatePresence>
                            {showHistory === target && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto"
                                >
                                    {history.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-xs">No saved charts.</div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {history.map((item) => (
                                                <div
                                                    key={item.timestamp}
                                                    onClick={() => handleLoadHistoryItem(item, target)}
                                                    className="p-3 hover:bg-white/5 cursor-pointer text-left"
                                                >
                                                    <div className="text-xs text-white font-bold">{item.name || "Unknown"}</div>
                                                    <div className="text-[10px] text-gray-500">{item.year}-{item.month}-{item.day}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-clay focus:outline-none placeholder-gray-600"
                        placeholder={`Name (e.g. ${target === "A" ? "John" : "Jane"})`}
                    />

                    {/* Date fields with error display */}
                    <div className="space-y-1">
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <input
                                    type="number"
                                    value={data.year}
                                    onChange={(e) => setData({ ...data, year: e.target.value })}
                                    className={getInputClass("year", "w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-clay focus:outline-none")}
                                    placeholder="YYYY"
                                />
                                {renderError("year")}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={data.month}
                                    onChange={(e) => setData({ ...data, month: e.target.value })}
                                    className={getInputClass("month", "w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-clay focus:outline-none")}
                                    placeholder="MM"
                                />
                                {renderError("month")}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={data.day}
                                    onChange={(e) => setData({ ...data, day: e.target.value })}
                                    className={getInputClass("day", "w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-clay focus:outline-none")}
                                    placeholder="DD"
                                />
                                {renderError("day")}
                            </div>
                        </div>
                    </div>

                    {/* Time fields with error display */}
                    <div className="space-y-1">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <input
                                    type="number"
                                    value={data.hour}
                                    onChange={(e) => setData({ ...data, hour: e.target.value })}
                                    className={getInputClass("hour", "w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-peach focus:outline-none")}
                                    placeholder="HH (0-23)"
                                />
                                {renderError("hour")}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={data.minute}
                                    onChange={(e) => setData({ ...data, minute: e.target.value })}
                                    className={getInputClass("minute", "w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-peach focus:outline-none")}
                                    placeholder="MM (0-59)"
                                />
                                {renderError("minute")}
                            </div>
                        </div>
                    </div>

                    {/* City field with autocomplete */}
                    <div className="relative">
                        <input
                            ref={cityInputRef}
                            type="text"
                            value={data.city}
                            onChange={(e) => handleCityInputChange(e.target.value, target)}
                            onFocus={() => {
                                if (cityResults.length > 0) {
                                    if (target === "A") setShowCityDropdownA(true);
                                    else setShowCityDropdownB(true);
                                }
                            }}
                            className={getInputClass("city", "w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 pl-9 text-sm text-white focus:border-jade focus:outline-none")}
                            placeholder="Start typing a city..."
                        />
                        {cityLoading ? (
                            <Loader2 className="absolute left-3 top-2.5 w-3.5 h-3.5 text-jade animate-spin" />
                        ) : (
                            <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
                        )}
                        {renderError("city")}

                        {/* City Autocomplete Dropdown */}
                        <AnimatePresence>
                            {showCityDropdown && cityResults.length > 0 && (
                                <motion.div
                                    ref={cityDropdownRef}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="absolute left-0 right-0 top-full mt-1 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="divide-y divide-white/5">
                                        {cityResults.map((city, idx) => (
                                            <div
                                                key={`${city.name}-${city.country}-${idx}`}
                                                onClick={() => handleCitySelect(city, target)}
                                                className="p-3 hover:bg-jade/10 cursor-pointer flex items-center justify-between group transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-jade opacity-50 group-hover:opacity-100" />
                                                    <div>
                                                        <div className="text-sm text-white font-medium">
                                                            {city.name}
                                                            <span className="text-gray-400 ml-2">{city.country}</span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-500">
                                                            {city.timezone}
                                                            {city.population > 0 && (
                                                                <span className="ml-2">• {city.population.toLocaleString()} pop.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.gender === "male" ? "border-clay bg-clay/20" : "border-white/20"}`}>
                                {data.gender === "male" && <div className="w-2 h-2 rounded-full bg-clay" />}
                            </div>
                            <input type="radio" className="hidden" checked={data.gender === "male"} onChange={() => setData({ ...data, gender: "male" })} />
                            <span className="text-xs text-gray-400">Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${data.gender === "female" ? "border-peach bg-peach/20" : "border-white/20"}`}>
                                {data.gender === "female" && <div className="w-2 h-2 rounded-full bg-peach" />}
                            </div>
                            <input type="radio" className="hidden" checked={data.gender === "female"} onChange={() => setData({ ...data, gender: "female" })} />
                            <span className="text-xs text-gray-400">Female</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto w-full"
        >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-8 relative overflow-visible">
                {/* Mode Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="bg-black/40 p-1 rounded-xl border border-white/10 inline-flex">
                        <button
                            type="button"
                            onClick={() => setMode("individual")}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                mode === "individual" ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <User className="w-3 h-3" /> Individual
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("synastry")}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                mode === "synastry" ? "bg-clay text-white shadow-lg shadow-clay/20" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <Users className="w-3 h-3" /> Compatibility
                        </button>
                    </div>
                </div>

                <div className={clsx("grid gap-8 transition-all", mode === "synastry" ? "md:grid-cols-2" : "grid-cols-1 max-w-lg mx-auto")}>
                    {renderInputGroup(personA, setPersonA, mode === "synastry" ? "Person A" : "Birth Details", "A")}

                    {mode === "synastry" && (
                        <div className="relative">
                            <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 hidden md:block text-clay/50 bg-black rounded-full p-1 border border-white/10">
                                <ArrowRightLeft className="w-4 h-4" />
                            </div>
                            {renderInputGroup(personB, setPersonB, "Person B", "B")}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1 transition-colors uppercase tracking-widest"
                    >
                        <Settings className="w-3 h-3" />
                        {showAdvanced ? "Hide Advanced Settings" : "Advanced Settings"}
                    </button>

                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden w-full max-w-lg"
                            >
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1.5 block">Time Standard</label>
                                        <select
                                            value={personA.timeStandard}
                                            onChange={(e) => {
                                                setPersonA({ ...personA, timeStandard: e.target.value });
                                                setPersonB({ ...personB, timeStandard: e.target.value });
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:border-clay focus:outline-none"
                                        >
                                            <option value="true_solar_absolute">True Solar Absolute</option>
                                            <option value="true_solar_relative">True Solar Relative</option>
                                            <option value="civil">Civil Time</option>
                                        </select>
                                    </div>

                                    {/* Manual Coordinates */}
                                    <div>
                                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1.5 block">Manual Coordinates (optional)</label>
                                        <p className="text-[10px] text-gray-600 mb-2">Override city lookup with exact coordinates</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={personA.lat}
                                                    onChange={(e) => {
                                                        setPersonA({ ...personA, lat: e.target.value });
                                                    }}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:border-jade focus:outline-none placeholder-gray-600"
                                                    placeholder="Latitude (e.g. 48.8566)"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={personA.lng}
                                                    onChange={(e) => {
                                                        setPersonA({ ...personA, lng: e.target.value });
                                                    }}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:border-jade focus:outline-none placeholder-gray-600"
                                                    placeholder="Longitude (e.g. 2.3522)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={clsx(
                            "w-full max-w-sm py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-clay/20",
                            isLoading
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-clay to-peach text-void hover:brightness-110"
                        )}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Calculating...
                            </span>
                        ) : (
                            mode === "synastry" ? "Analyze Compatibility" : "Reveal Destiny"
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
