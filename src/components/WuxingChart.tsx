"use client";

import { ElementData } from "@/types/bazi";
import { motion } from "framer-motion";

interface WuxingChartProps {
    data: ElementData;
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

export default function WuxingChart({ data }: WuxingChartProps) {
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
        </div>
    );
}
