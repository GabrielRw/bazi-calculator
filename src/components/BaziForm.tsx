"use client";

import { useState } from "react";
import { Search, Settings, MapPin, Calendar, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface BaziFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

interface FormData {
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

export default function BaziForm({ onSubmit, isLoading }: BaziFormProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        year: 1995,
        month: 9,
        day: 29,
        hour: 20,
        minute: 30,
        city: "New York",
        gender: "male",
        timeStandard: "true_solar_absolute",
        calendar: "gregorian",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto w-full"
        >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
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
                                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-clay focus:outline-none transition-colors"
                                    placeholder="Year"
                                />
                                <span className="absolute right-3 top-3 text-gray-500 text-xs font-mono group-focus-within:text-clay">YYYY</span>
                            </div>
                            <div className="group relative">
                                <input
                                    type="number"
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                    className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-clay focus:outline-none transition-colors"
                                    placeholder="MM"
                                />
                            </div>
                            <div className="group relative">
                                <input
                                    type="number"
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
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
                                onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) })}
                                className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-peach focus:outline-none transition-colors"
                                placeholder="HH"
                            />
                            <input
                                type="number"
                                value={formData.minute}
                                onChange={(e) => setFormData({ ...formData, minute: parseInt(e.target.value) })}
                                className="w-full bg-void/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-peach focus:outline-none transition-colors"
                                placeholder="MM"
                            />
                        </div>
                    </div>

                    {/* Location & Advanced */}
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

                        {/* Gender Selector - Visible */}
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
                                            <div>
                                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1.5 block">Time Standard</label>
                                                <select
                                                    value={formData.timeStandard}
                                                    onChange={(e) => setFormData({ ...formData, timeStandard: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-300 focus:border-clay focus:outline-none"
                                                >
                                                    <option value="civil">Standard (Civil)</option>
                                                    <option value="true_solar_absolute">True Solar (High Precision)</option>
                                                    <option value="lmt">Local Mean Time (LMT)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-1.5 block">Calendar</label>
                                                <select
                                                    value={formData.calendar}
                                                    onChange={(e) => setFormData({ ...formData, calendar: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-300 focus:border-clay focus:outline-none"
                                                >
                                                    <option value="gregorian">Gregorian</option>
                                                    <option value="julian">Julian</option>
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
        </motion.div >
    );
}
