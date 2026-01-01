import { useState, useEffect } from "react";
import { Search, Settings, MapPin, Calendar, Clock, Loader2, History, X, User, Users, ArrowRightLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { BaziResult, BaziFlowResult } from "@/types/bazi";

export interface FormData {
    name?: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    city: string;
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
    gender: "male",
    timeStandard: "true_solar_absolute",
    calendar: "gregorian",
};

export default function BaziForm({
    onSubmit,
    isLoading,
    history,
    onDeleteHistory,
    onSelectHistory,
    loadedData
}: BaziFormProps) {
    const [mode, setMode] = useState<"individual" | "synastry">("individual");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showHistory, setShowHistory] = useState<"A" | "B" | null>(null);

    // Two separate states for Person A (Main) and Person B (Partner)
    const [personA, setPersonA] = useState<any>(DEFAULT_FORM_DATA);
    const [personB, setPersonB] = useState<any>(DEFAULT_FORM_DATA);

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

    const handleDeleteHistoryItem = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        onDeleteHistory(index);
    };

    const formatDataForSubmit = (raw: any): FormData => ({
        ...raw,
        year: parseInt(raw.year) || 0,
        month: parseInt(raw.month) || 0,
        day: parseInt(raw.day) || 0,
        hour: parseInt(raw.hour) || 0,
        minute: parseInt(raw.minute) || 0,
        city: raw.city,
        gender: raw.gender,
        timeStandard: raw.timeStandard,
        calendar: raw.calendar
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "individual") {
            onSubmit(formatDataForSubmit(personA), "individual");
        } else {
            onSubmit({
                person_a: formatDataForSubmit(personA),
                person_b: formatDataForSubmit(personB)
            }, "synastry");
        }
    };

    // Reusable Input Group
    const renderInputGroup = (data: any, setData: any, label: string, target: "A" | "B") => (
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
                                        {history.map((item, idx) => (
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

                <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={data.year} onChange={(e) => setData({ ...data, year: e.target.value })} className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-clay focus:outline-none" placeholder="YYYY" />
                    <input type="number" value={data.month} onChange={(e) => setData({ ...data, month: e.target.value })} className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-clay focus:outline-none" placeholder="MM" />
                    <input type="number" value={data.day} onChange={(e) => setData({ ...data, day: e.target.value })} className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-clay focus:outline-none" placeholder="DD" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={data.hour} onChange={(e) => setData({ ...data, hour: e.target.value })} className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-peach focus:outline-none" placeholder="HH" />
                    <input type="number" value={data.minute} onChange={(e) => setData({ ...data, minute: e.target.value })} className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-peach focus:outline-none" placeholder="MM" />
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={data.city}
                        onChange={(e) => setData({ ...data, city: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 pl-9 text-sm text-white focus:border-jade focus:outline-none"
                        placeholder="City, Country"
                    />
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
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
