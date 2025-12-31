import { useState, useEffect } from "react";
import { Search, Settings, MapPin, Calendar, Clock, Loader2, History, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface BaziFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

interface FormData {
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

interface HistoryItem extends FormData {
    timestamp: number;
    label: string;
}

export default function BaziForm({ onSubmit, isLoading }: BaziFormProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        year: "",
        month: "",
        day: "",
        hour: "",
        minute: "",
        city: "",
        gender: "male" as "male" | "female",
        timeStandard: "true_solar_absolute",
        calendar: "gregorian",
    });

    useEffect(() => {
        const saved = localStorage.getItem("bazi_history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load history", e);
            }
        }
    }, []);

    const saveToHistory = (data: FormData) => {
        const label = data.name
            ? data.name
            : `${data.year}-${data.month}-${data.day} ${data.city}`;

        const newItem: HistoryItem = {
            ...data,
            timestamp: Date.now(),
            label
        };

        const updated = [newItem, ...history.filter(h => {
            // If names match (and aren't empty), treat as update
            if (data.name && h.name === data.name) return false;

            // Otherwise check for exact duplicate data parameters
            return h.year !== newItem.year ||
                h.month !== newItem.month ||
                h.day !== newItem.day ||
                h.hour !== newItem.hour ||
                h.city !== newItem.city
        }
        )].slice(0, 10);

        setHistory(updated);
        localStorage.setItem("bazi_history", JSON.stringify(updated));
    };

    const loadHistoryItem = (item: HistoryItem) => {
        setFormData({
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
        });
        setShowHistory(false);
    };

    const deleteHistoryItem = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const updated = history.filter((_, i) => i !== index);
        setHistory(updated);
        localStorage.setItem("bazi_history", JSON.stringify(updated));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: FormData = {
            ...formData,
            year: parseInt(formData.year) || 0,
            month: parseInt(formData.month) || 0,
            day: parseInt(formData.day) || 0,
            hour: parseInt(formData.hour) || 0,
            minute: parseInt(formData.minute) || 0,
            city: formData.city,
            gender: formData.gender,
            timeStandard: formData.timeStandard,
            calendar: formData.calendar
        };

        saveToHistory(data);
        onSubmit(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto w-full"
        >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6 relative">
                {/* History Toggle */}
                <div className="absolute top-4 right-4 z-20">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowHistory(!showHistory)}
                            className={clsx(
                                "p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider",
                                showHistory ? "bg-clay text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <History className="w-4 h-4" />
                            <span className="hidden md:inline">History</span>
                        </button>

                        <AnimatePresence>
                            {showHistory && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-72 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="p-3 border-b border-white/5 flex justify-between items-center bg-black/20">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved Charts</span>
                                        <button
                                            onClick={() => setShowHistory(false)}
                                            className="text-gray-500 hover:text-white transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        {history.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500 text-xs italic">
                                                No saved charts yet.
                                                <br />Calculate one to save it automatically.
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-white/5">
                                                {history.map((item, idx) => (
                                                    <div
                                                        key={item.timestamp}
                                                        onClick={() => loadHistoryItem(item)}
                                                        className="p-3 hover:bg-white/5 cursor-pointer group transition-colors flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <div className="text-sm text-white font-bold">
                                                                {item.name || item.city || "Unknown"}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {item.year}-{item.month}-{item.day} {item.city && item.name ? `• ${item.city}` : ''}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => deleteHistoryItem(e, idx)}
                                                            className="p-1.5 rounded-full hover:bg-red-500/20 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Name Input (Optional) */}
                <div className="space-y-4">
                    <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                        <User className="w-4 h-4" /> Personal Details (Optional)
                    </h3>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-clay focus:outline-none transition-colors"
                        placeholder="Name (e.g. 'John Doe' or 'My 2024 Chart')"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Date & Time Section */}
                    <div className="flex-1 space-y-4">
                        <h3 className="text-clay font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Birth Date
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="group relative">
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-clay focus:outline-none transition-colors"
                                    placeholder="Year"
                                />
                                <span className={clsx(
                                    "absolute right-3 top-3 text-gray-500 text-xs font-mono transition-opacity pointer-events-none",
                                    (formData.year || isLoading) ? "opacity-0" : "opacity-100 group-focus-within:opacity-0"
                                )}>
                                    YYYY
                                </span>
                            </div>
                            <div className="group relative">
                                <input
                                    type="number"
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                    className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-clay focus:outline-none transition-colors"
                                    placeholder="MM"
                                />
                            </div>
                            <div className="group relative">
                                <input
                                    type="number"
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                    className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-clay focus:outline-none transition-colors"
                                    placeholder="DD"
                                />
                            </div>
                        </div>

                        <h3 className="text-peach font-bold uppercase tracking-wider text-xs flex items-center gap-2 mt-6">
                            <Clock className="w-4 h-4" /> Birth Time
                        </h3>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                value={formData.hour}
                                onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                                className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-peach focus:outline-none transition-colors"
                                placeholder="HH"
                            />
                            <input
                                type="number"
                                value={formData.minute}
                                onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                                className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-peach focus:outline-none transition-colors"
                                placeholder="MM"
                            />
                        </div>
                    </div>

                    {/* Location & Advanced Section */}
                    <div className="flex-1 space-y-4">
                        <h3 className="text-jade font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Location
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:border-jade focus:outline-none transition-colors"
                                placeholder="City, Country"
                            />
                            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                        </div>

                        {/* Gender Selector */}
                        <div className="pt-2">
                            <h3 className="text-clay font-bold uppercase tracking-wider text-xs flex items-center gap-2 mb-2">
                                Gender (for Luck Cycles)
                            </h3>
                            <div className="flex gap-4 p-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.gender === "male" ? "border-clay bg-clay/20" : "border-white/20 group-hover:border-white/40"}`}>
                                        {formData.gender === "male" && <div className="w-2.5 h-2.5 rounded-full bg-clay" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="hidden"
                                        checked={formData.gender === "male"}
                                        onChange={() => setFormData({ ...formData, gender: "male" })}
                                    />
                                    <span className={`text-sm ${formData.gender === "male" ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}>Male</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.gender === "female" ? "border-peach bg-peach/20" : "border-white/20 group-hover:border-white/40"}`}>
                                        {formData.gender === "female" && <div className="w-2.5 h-2.5 rounded-full bg-peach" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        className="hidden"
                                        checked={formData.gender === "female"}
                                        onChange={() => setFormData({ ...formData, gender: "female" })}
                                    />
                                    <span className={`text-sm ${formData.gender === "female" ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}>Female</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors group"
                            >
                                <Settings className="w-3 h-3 group-hover:rotate-45 transition-transform" />
                                {showAdvanced ? "Basic View" : "Advanced Astrology"}
                            </button>

                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-3"
                                    >
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5 grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1.5 block">Time Standard</label>
                                                <div className="space-y-3">
                                                    <select
                                                        value={formData.timeStandard}
                                                        onChange={(e) => setFormData({ ...formData, timeStandard: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-clay focus:outline-none transition-all"
                                                    >
                                                        <option value="true_solar_absolute" className="bg-void">True Solar Absolute (Recommended)</option>
                                                        <option value="true_solar_relative" className="bg-void">True Solar Relative</option>
                                                        <option value="civil" className="bg-void">Standard Civil Time</option>
                                                    </select>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                        <div className={clsx("p-2 rounded-lg border text-[10px] leading-relaxed transition-all", formData.timeStandard === "true_solar_absolute" ? "bg-clay/10 border-clay/30 text-white" : "bg-white/5 border-transparent text-gray-500")}>
                                                            <span className="font-bold block text-clay mb-0.5">Absolute</span>
                                                            Corrects for both longitude and the equation of time for maximum precision.
                                                        </div>
                                                        <div className={clsx("p-2 rounded-lg border text-[10px] leading-relaxed transition-all", formData.timeStandard === "true_solar_relative" ? "bg-peach/10 border-peach/30 text-white" : "bg-white/5 border-transparent text-gray-500")}>
                                                            <span className="font-bold block text-peach mb-0.5">Relative</span>
                                                            Uses localized true solar adjustments relative to the mean solar noon.
                                                        </div>
                                                        <div className={clsx("p-2 rounded-lg border text-[10px] leading-relaxed transition-all", formData.timeStandard === "civil" ? "bg-jade/10 border-jade/30 text-white" : "bg-white/5 border-transparent text-gray-500")}>
                                                            <span className="font-bold block text-jade mb-0.5">Civil</span>
                                                            Standard clock time without solar corrections (least accurate for Bazi).
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1.5 block">Calendar</label>
                                                <select
                                                    value={formData.calendar}
                                                    onChange={(e) => setFormData({ ...formData, calendar: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-clay focus:outline-none"
                                                >
                                                    <option value="gregorian" className="bg-void">Gregorian (Standard)</option>
                                                    <option value="julian" className="bg-void">Julian (Historical)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={clsx(
                        "w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-clay/20",
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
                        "Reveal Destiny"
                    )}
                </button>
            </form>
        </motion.div>
    );
}
