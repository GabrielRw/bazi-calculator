"use client";

import { ElementData, Pillar } from "@/types/bazi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, Droplets, Flame, Mountain, Hammer, Waves, Shield, Activity, Zap, Scale } from "lucide-react";

interface WuxingChartProps {
    data: ElementData;
    pillars?: Pillar[];
}

// Element positions in a pentagon (clockwise from top: Fire, Earth, Metal, Water, Wood)
// This follows the traditional Chinese arrangement
const ELEMENTS = [
    { name: "Fire", chinese: "火", angle: -90 },    // Top
    { name: "Earth", chinese: "土", angle: -18 },   // Top-right
    { name: "Metal", chinese: "金", angle: 54 },    // Bottom-right
    { name: "Water", chinese: "水", angle: 126 },   // Bottom-left
    { name: "Wood", chinese: "木", angle: 198 },    // Top-left
];

// Element colors matching the design system
const ELEMENT_COLORS: Record<string, { fill: string; text: string; glow: string }> = {
    Wood: { fill: "#22c55e", text: "text-green-400", glow: "rgba(34, 197, 94, 0.5)" },
    Fire: { fill: "#ef4444", text: "text-red-400", glow: "rgba(239, 68, 68, 0.5)" },
    Earth: { fill: "#eab308", text: "text-yellow-400", glow: "rgba(234, 179, 8, 0.5)" },
    Metal: { fill: "#a1a1aa", text: "text-gray-300", glow: "rgba(161, 161, 170, 0.5)" },
    Water: { fill: "#3b82f6", text: "text-blue-400", glow: "rgba(59, 130, 246, 0.5)" },
};

// Generating cycle (sheng): Wood → Fire → Earth → Metal → Water → Wood
const GENERATING_CYCLE = [
    { from: "Wood", to: "Fire" },
    { from: "Fire", to: "Earth" },
    { from: "Earth", to: "Metal" },
    { from: "Metal", to: "Water" },
    { from: "Water", to: "Wood" },
];

// Controlling cycle (ke): Wood → Earth → Water → Fire → Metal → Wood
const CONTROLLING_CYCLE = [
    { from: "Wood", to: "Earth" },
    { from: "Earth", to: "Water" },
    { from: "Water", to: "Fire" },
    { from: "Fire", to: "Metal" },
    { from: "Metal", to: "Wood" },
];

// Element relationship maps
const ELEMENT_GENERATOR: Record<string, string> = {
    Wood: "Water",   // Water nourishes Wood
    Fire: "Wood",    // Wood feeds Fire
    Earth: "Fire",   // Fire creates Earth
    Metal: "Earth",  // Earth bears Metal
    Water: "Metal",  // Metal collects Water
};

const ELEMENT_CONTROLLER: Record<string, string> = {
    Wood: "Metal",   // Metal chops Wood
    Fire: "Water",   // Water quenches Fire
    Earth: "Wood",   // Wood parts Earth
    Metal: "Fire",   // Fire melts Metal
    Water: "Earth",  // Earth absorbs Water
};

// Professional recommendations for each element
const ELEMENT_REMEDIES: Record<string, { nourish: string; express: string; control: string }> = {
    Wood: {
        nourish: "Spend time near water, embrace learning and introspection. Swimming, meditation by rivers, or studying nurtures Wood energy.",
        express: "Channel through creativity, growth activities, and physical movement. Gardening, hiking, and artistic pursuits help express excess Wood.",
        control: "Introduce Metal energy through structure, discipline, and clarity. Minimalist aesthetics, decisive action, and organized environments temper Wood.",
    },
    Fire: {
        nourish: "Engage with Wood energy through growth and vitality. Reading, learning new skills, and surrounding yourself with plants feeds Fire.",
        express: "Channel through social connection, creative expression, and visibility. Public speaking, performing arts, and celebration help express excess Fire.",
        control: "Introduce Water energy through rest, reflection, and emotional depth. Meditation, journaling, and quiet contemplation temper Fire.",
    },
    Earth: {
        nourish: "Connect with Fire energy through passion and warmth. Cultivate joy, attend gatherings, and engage your heart to feed Earth.",
        express: "Channel through nurturing, stability, and practical service. Cooking, caregiving, and building lasting foundations help express excess Earth.",
        control: "Introduce Wood energy through movement and change. Exercise, travel, and embracing new experiences temper Earth.",
    },
    Metal: {
        nourish: "Ground through Earth energy with stability and nourishment. Healthy routines, nature walks, and mindful eating feed Metal.",
        express: "Channel through precision, refinement, and letting go. Decluttering, completing projects, and ceremonial practices help express excess Metal.",
        control: "Introduce Fire energy through warmth and spontaneity. Social gatherings, passion projects, and joyful activities temper Metal.",
    },
    Water: {
        nourish: "Connect with Metal energy through clarity and release. Deep breathing, minimalism, and honoring endings feeds Water.",
        express: "Channel through wisdom, flow, and adaptability. Writing, counseling, and going with life's currents help express excess Water.",
        control: "Introduce Earth energy through grounding and boundaries. Regular schedules, stable environments, and practical focus temper Water.",
    },
};

export default function WuxingChart({ data, pillars }: WuxingChartProps) {
    const [showInsights, setShowInsights] = useState(false);
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const nodeRadius = 28;

    // Calculate position for each element
    const getPosition = (angle: number) => {
        const rad = (angle * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(rad),
            y: centerY + radius * Math.sin(rad),
        };
    };

    const elementPositions = ELEMENTS.reduce((acc, el) => {
        acc[el.name] = getPosition(el.angle);
        return acc;
    }, {} as Record<string, { x: number; y: number }>);

    // Get element index for animation delay
    const getElementIndex = (name: string) => ELEMENTS.findIndex(e => e.name === name);

    // Calculate curved path for controlling cycle (inner star)
    const getControlPath = (from: string, to: string) => {
        const start = elementPositions[from];
        const end = elementPositions[to];
        // Create a slightly curved path toward center
        const midX = (start.x + end.x) / 2 + (centerX - (start.x + end.x) / 2) * 0.3;
        const midY = (start.y + end.y) / 2 + (centerY - (start.y + end.y) / 2) * 0.3;
        return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-4 flex items-center gap-2">
                <span className="text-lg">☯</span> Wu Xing - Five Phases
            </h3>

            <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* SVG Chart */}
                <div className="relative flex-shrink-0">
                    <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                        <defs>
                            {/* Glow filters for each element */}
                            {ELEMENTS.map(el => (
                                <filter key={`glow-${el.name}`} id={`glow-${el.name}`} x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            ))}
                            {/* Arrow marker for generating cycle */}
                            <marker id="arrow-gen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                <path d="M0,0 L0,6 L8,3 z" fill="#22c55e" opacity="0.7" />
                            </marker>
                            {/* Arrow marker for controlling cycle */}
                            <marker id="arrow-ctrl" markerWidth="6" markerHeight="6" refX="5" refY="2" orient="auto">
                                <path d="M0,0 L0,4 L6,2 z" fill="#ef4444" opacity="0.5" />
                            </marker>
                        </defs>

                        {/* Outer circle (subtle) */}
                        <circle cx={centerX} cy={centerY} r={radius + 15} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                        {/* Generating Cycle - Outer pentagon edges */}
                        {GENERATING_CYCLE.map((cycle, i) => {
                            const start = elementPositions[cycle.from];
                            const end = elementPositions[cycle.to];
                            // Offset slightly to not overlap with nodes
                            const angle = Math.atan2(end.y - start.y, end.x - start.x);
                            const offsetStart = {
                                x: start.x + nodeRadius * Math.cos(angle),
                                y: start.y + nodeRadius * Math.sin(angle),
                            };
                            const offsetEnd = {
                                x: end.x - (nodeRadius + 8) * Math.cos(angle),
                                y: end.y - (nodeRadius + 8) * Math.sin(angle),
                            };

                            return (
                                <motion.line
                                    key={`gen-${i}`}
                                    x1={offsetStart.x}
                                    y1={offsetStart.y}
                                    x2={offsetEnd.x}
                                    y2={offsetEnd.y}
                                    stroke="#22c55e"
                                    strokeWidth="2"
                                    strokeOpacity="0.4"
                                    markerEnd="url(#arrow-gen)"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                                />
                            );
                        })}

                        {/* Controlling Cycle - Inner star paths */}
                        {CONTROLLING_CYCLE.map((cycle, i) => (
                            <motion.path
                                key={`ctrl-${i}`}
                                d={getControlPath(cycle.from, cycle.to)}
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="1.5"
                                strokeOpacity="0.3"
                                strokeDasharray="4 4"
                                markerEnd="url(#arrow-ctrl)"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1.2 + i * 0.1 }}
                            />
                        ))}

                        {/* Element Nodes */}
                        {ELEMENTS.map((el, i) => {
                            const pos = elementPositions[el.name];
                            const colors = ELEMENT_COLORS[el.name];
                            const percentage = data.percentages[el.name] || 0;
                            const isDominant = data.dominant === el.name;
                            const scaleFactor = 0.4 + (percentage / 100) * 1.1; // Scale: 0% = 0.4x, 50% = 0.95x, 100% = 1.5x

                            return (
                                <motion.g
                                    key={el.name}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                                >
                                    {/* Glow effect for dominant element */}
                                    {isDominant && (
                                        <circle
                                            cx={pos.x}
                                            cy={pos.y}
                                            r={nodeRadius + 8}
                                            fill={colors.glow}
                                            opacity="0.3"
                                        />
                                    )}

                                    {/* Main circle */}
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={nodeRadius * scaleFactor}
                                        fill="rgba(10,10,10,0.9)"
                                        stroke={colors.fill}
                                        strokeWidth={isDominant ? 3 : 2}
                                        filter={isDominant ? `url(#glow-${el.name})` : undefined}
                                    />

                                    {/* Chinese character */}
                                    <text
                                        x={pos.x}
                                        y={pos.y + 2}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill={colors.fill}
                                        fontSize={isDominant ? "20" : "16"}
                                        fontWeight="bold"
                                        fontFamily="serif"
                                    >
                                        {el.chinese}
                                    </text>

                                    {/* Percentage label */}
                                    <text
                                        x={pos.x}
                                        y={pos.y + nodeRadius + 14}
                                        textAnchor="middle"
                                        fill="rgba(255,255,255,0.6)"
                                        fontSize="10"
                                        fontWeight="500"
                                    >
                                        {percentage}%
                                    </text>

                                    {/* Element name */}
                                    <text
                                        x={pos.x}
                                        y={pos.y - nodeRadius - 8}
                                        textAnchor="middle"
                                        fill="rgba(255,255,255,0.4)"
                                        fontSize="9"
                                        letterSpacing="0.1em"
                                        style={{ textTransform: 'uppercase' }}
                                    >
                                        {el.name.toUpperCase()}
                                    </text>
                                </motion.g>
                            );
                        })}

                        {/* Center Yin-Yang Symbol */}
                        <motion.g
                            initial={{ rotate: 0, opacity: 0 }}
                            animate={{ rotate: 360, opacity: 1 }}
                            transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.5 } }}
                            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                        >
                            <circle cx={centerX} cy={centerY} r="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                            <text x={centerX} y={centerY + 1} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.15)" fontSize="20">☯</text>
                        </motion.g>
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-4 text-sm">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-0.5 bg-green-500/60 rounded"></div>
                            <span className="text-gray-400">
                                <span className="text-green-400 font-bold">Shēng</span> 生 - Generating Cycle
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 pl-9">
                            Wood feeds Fire → Fire creates Earth → Earth bears Metal → Metal collects Water → Water nourishes Wood
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-0.5 bg-red-500/50 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #ef4444 0, #ef4444 4px, transparent 4px, transparent 8px)' }}></div>
                            <span className="text-gray-400">
                                <span className="text-red-400 font-bold">Kè</span> 克 - Controlling Cycle
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 pl-9">
                            Wood parts Earth → Earth absorbs Water → Water quenches Fire → Fire melts Metal → Metal chops Wood
                        </p>
                    </div>

                    <div className="pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: ELEMENT_COLORS[data.dominant].fill, boxShadow: `0 0 8px ${ELEMENT_COLORS[data.dominant].glow}` }}></div>
                            <span className="text-white font-bold">{data.dominant}</span>
                            <span className="text-gray-500">is your dominant element</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Node size reflects element strength in your chart.
                        </p>
                    </div>
                </div>
            </div>

            {/* Professional Insights Panel */}
            <div className="mt-8 pt-4 border-t border-white/5">
                <button
                    onClick={() => setShowInsights(!showInsights)}
                    className="w-full flex items-center justify-between group"
                >
                    <span className="text-xs uppercase tracking-widest font-bold text-gray-500 group-hover:text-white transition-colors flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Professional Strategic Insights
                    </span>
                    {showInsights ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                <AnimatePresence>
                    {showInsights && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 grid md:grid-cols-2 gap-8">
                                {/* Strategic Balance */}
                                <div className="space-y-6">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-jade" /> Strategic Balance
                                    </h4>

                                    {/* Dominant Element Strategy */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="text-xs text-jade uppercase tracking-wider font-bold mb-2">
                                            Managing Excess {data.dominant}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-xs font-bold text-gray-300 block mb-1">How to Express (Healthy Outlet)</span>
                                                <p className="text-xs text-gray-500 leading-relaxed">{ELEMENT_REMEDIES[data.dominant].express}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-300 block mb-1">How to Control (Balance)</span>
                                                <p className="text-xs text-gray-500 leading-relaxed">{ELEMENT_REMEDIES[data.dominant].control}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weakest Element Strategy */}
                                    {(() => {
                                        const weakest = Object.entries(data.percentages).sort(([, a], [, b]) => a - b)[0];
                                        if (weakest && weakest[1] < 20) {
                                            return (
                                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                    <div className="text-xs text-spirit uppercase tracking-wider font-bold mb-2">
                                                        Nourishing Weak {weakest[0]}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-300 block mb-1">How to Strengthen</span>
                                                        <p className="text-xs text-gray-500 leading-relaxed">{ELEMENT_REMEDIES[weakest[0]].nourish}</p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>

                                {/* Yin/Yang Analysis */}
                                {pillars && (
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <span className="text-lg leading-none">☯</span> Yin Yang Dynamics
                                        </h4>

                                        {(() => {
                                            // Calculate Yin/Yang balance
                                            let yinCount = 0;
                                            let yangCount = 0;
                                            const total = 8; // 4 pillars * 2 (stem + branch)

                                            pillars.forEach(p => {
                                                if (p.gan_info.polarity === "Yin") yinCount++;
                                                else yangCount++;

                                                if (p.zhi_info.polarity === "Yin") yinCount++;
                                                else yangCount++;
                                            });

                                            const yangPercent = Math.round((yangCount / total) * 100);
                                            const yinPercent = 100 - yangPercent;

                                            let balanceText = "Balanced";
                                            let balanceDesc = "Your chart shows a harmonious mix of action and reflection.";

                                            if (yangPercent > 65) {
                                                balanceText = "Yang Dominant";
                                                balanceDesc = "You are action-oriented, expressive, and influential. You likely prefer leading and initiating over waiting.";
                                            } else if (yinPercent > 65) {
                                                balanceText = "Yin Dominant";
                                                balanceDesc = "You are reflective, strategic, and nurturing. You likely strength lies in sustaining, planning, and supporting.";
                                            }

                                            return (
                                                <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                                    <div className="flex items-end justify-between mb-4">
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-white mb-1">{yangPercent}%</div>
                                                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Yang</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-white mb-1">{yinPercent}%</div>
                                                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Yin</div>
                                                        </div>
                                                    </div>

                                                    {/* Balance Bar */}
                                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex mb-6">
                                                        <div style={{ width: `${yangPercent}%` }} className="h-full bg-white opacity-90" />
                                                        <div style={{ width: `${yinPercent}%` }} className="h-full bg-black border border-white/20" />
                                                    </div>

                                                    <div className="text-center">
                                                        <div className="text-sm font-bold text-jade mb-2">{balanceText}</div>
                                                        <p className="text-xs text-gray-500 leading-relaxed">
                                                            {balanceDesc}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
