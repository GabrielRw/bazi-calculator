"use client";

import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LifespanCurvePoint, LifespanResult } from "@/types/bazi";
import { AICardType, ChartContext, AIHistoryItem } from "@/types/ai";
import { Activity, Zap, Brain, Droplets, Sparkles, Loader2 } from "lucide-react";
import AskAIButton from "./AskAIButton";

interface JingQiShenChartProps {
    data: LifespanCurvePoint[];
    metadata?: LifespanResult["metadata"];
    currentAge?: number;
    cultivationFactor?: number;
    onCultivationChange?: (value: number) => void;
    chartContext?: ChartContext;
    onAIExplanation?: (explanation: string, cardTitle: string, cardType?: AICardType) => void;
    onAIRequest?: (cardTitle: string) => void;
    aiHistory?: AIHistoryItem[];
}

export default function JingQiShenChart({ data, metadata, currentAge, cultivationFactor = 0.5, onCultivationChange, chartContext, onAIExplanation, onAIRequest, aiHistory }: JingQiShenChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Chart Dimensions
    const width = 800; // viewBox width
    const height = 300; // viewBox height
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Scales
    const maxAge = 120;
    const maxValue = 100;

    const xScale = (age: number) => (age / maxAge) * chartWidth + padding.left;
    const yScale = (value: number) => chartHeight - (value / maxValue) * chartHeight + padding.top;

    // Smoothing function (Catmull-Rom to Cubic Bezier)
    const getControlPoint = (current: { x: number, y: number }, previous: { x: number, y: number }, next: { x: number, y: number }, reverse?: boolean) => {
        const p = previous || current;
        const n = next || current;
        const smoothing = 0.2;

        const o = {
            length: Math.sqrt(Math.pow(n.x - p.x, 2) + Math.pow(n.y - p.y, 2)),
            angle: Math.atan2(n.y - p.y, n.x - p.x)
        };

        const angle = o.angle + (reverse ? Math.PI : 0);
        const length = o.length * smoothing;

        return {
            x: current.x + Math.cos(angle) * length,
            y: current.y + Math.sin(angle) * length
        };
    };

    const createSmoothPath = (points: { x: number, y: number }[]) => {
        return points.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point.x},${point.y}`;

            const start = a[i - 1]; // Previous point (start of curve)
            const end = point;      // Current point (end of curve)

            // Control points
            const cps = getControlPoint(start, a[i - 2], end); // Control point start
            const cpe = getControlPoint(end, start, a[i + 1], true); // Control point end

            return `${acc} C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${end.x},${end.y}`;
        }, "");
    };

    // Generate Paths
    const paths = useMemo(() => {
        if (!data || data.length === 0) return { jing: "", qi: "", shen: "" };

        const getPoints = (key: keyof Pick<LifespanCurvePoint, "j_final" | "qi" | "shen">) => {
            return data.map(point => ({
                x: xScale(point.age),
                y: yScale(point[key])
            }));
        };

        return {
            jing: createSmoothPath(getPoints("j_final")),
            qi: createSmoothPath(getPoints("qi")),
            shen: createSmoothPath(getPoints("shen"))
        };
    }, [data]);

    // Handle Mouse Move for Tooltip
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Convert screen X to SVG X (approximate scaling)
        const svgX = (x / rect.width) * width;

        // Convert SVG X to Age
        const age = Math.round(((svgX - padding.left) / chartWidth) * maxAge);

        // Find closest data point
        const index = data.findIndex(p => p.age === age);

        if (index !== -1) {
            setHoveredIndex(index);
        }
    };

    const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;

    return (
        <div
            className="glass-card rounded-2xl p-6 select-none min-w-0"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            {/* Header: Title + AI Button */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Neijing Life Curve
                </h3>

                {/* AI Button */}
                {chartContext && onAIExplanation && (
                    <AskAIButton
                        cardType="lifespan"
                        cardData={{ currentAge, curve: data }}
                        chartContext={chartContext}
                        onExplanation={(exp) => onAIExplanation(exp, "Life Energy Curves", "lifespan")}
                        onError={(err) => console.error(err)}
                        onRequestStart={onAIRequest}
                        cardTitle="Life Energy Curves"
                        history={aiHistory}
                        size="md"
                    />
                )}
            </div>

            {/* Legend - separate row for mobile visibility */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    <span className="text-blue-400">Jing (Essence)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-green-400">Qi (Energy)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                    <span className="text-yellow-400">Shen (Spirit)</span>
                </div>
            </div>

            {/* Experimental Disclaimer */}
            <div className="mb-4 flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="text-yellow-500 mt-0.5"><Zap className="w-3 h-3" /></div>
                <div className="text-[10px] text-yellow-200/80 leading-relaxed">
                    <strong className="text-yellow-500">Experimental Feature:</strong> This life curve projection is currently in beta. The algorithm is highly sensitive and results should be treated as interpretative explorations rather than definitive lifespan predictions. Do not rely on this for medical or critical life planning.
                </div>
            </div>

            {/* Cultivation Slider */}
            {onCultivationChange && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Cultivation Scenario
                        </label>
                        <span className="text-xs font-mono text-jade">{Math.round(cultivationFactor * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={cultivationFactor}
                        onChange={(e) => onCultivationChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-jade"
                    />
                    <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                        <span>Depleted</span>
                        <span>Average</span>
                        <span>Cultivated</span>
                    </div>
                </div>
            )}

            <div className="relative w-full aspect-[2.6/1]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map(val => (
                        <g key={val}>
                            <line
                                x1={padding.left}
                                y1={yScale(val)}
                                x2={width - padding.right}
                                y2={yScale(val)}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="1"
                            />
                            <text
                                x={padding.left - 10}
                                y={yScale(val)}
                                fill="rgba(255,255,255,0.2)"
                                fontSize="10"
                                dominantBaseline="middle"
                                textAnchor="end"
                            >
                                {val}
                            </text>
                        </g>
                    ))}

                    {/* Age Labels */}
                    {[0, 20, 40, 60, 80, 100, 120].map(age => (
                        <text
                            key={age}
                            x={xScale(age)}
                            y={height - 10}
                            fill="rgba(255,255,255,0.2)"
                            fontSize="10"
                            textAnchor="middle"
                        >
                            {age}
                        </text>
                    ))}

                    {/* Gradient Defs */}
                    <defs>
                        <linearGradient id="gradJing" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradQi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradShen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#eab308" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Areas under lines (optional, adds depth) */}
                    <path d={`${paths.jing} L ${xScale(maxAge)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`} fill="url(#gradJing)" />
                    <path d={`${paths.qi} L ${xScale(maxAge)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`} fill="url(#gradQi)" />
                    <path d={`${paths.shen} L ${xScale(maxAge)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`} fill="url(#gradShen)" />

                    {/* Lines */}
                    <path d={paths.jing} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={paths.qi} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={paths.shen} fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Tooltip Cursor Line */}
                    {activePoint && (
                        <line
                            x1={xScale(activePoint.age)}
                            y1={padding.top}
                            x2={xScale(activePoint.age)}
                            y2={height - padding.bottom}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    )}

                    {/* Current Age Node Highlights */}
                    {activePoint && (
                        <>
                            <circle cx={xScale(activePoint.age)} cy={yScale(activePoint.j_final)} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
                            <circle cx={xScale(activePoint.age)} cy={yScale(activePoint.qi)} r="4" fill="#22c55e" stroke="white" strokeWidth="2" />
                            <circle cx={xScale(activePoint.age)} cy={yScale(activePoint.shen)} r="4" fill="#eab308" stroke="white" strokeWidth="2" />
                        </>
                    )}
                </svg>

                {/* Tooltip Overlay */}
                <AnimatePresence>
                    {activePoint && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl pointer-events-none z-10 min-w-[200px]"
                            style={{
                                left: xScale(activePoint.age) > width / 2 ? 'auto' : xScale(activePoint.age) + 20,
                                right: xScale(activePoint.age) > width / 2 ? width - xScale(activePoint.age) + 20 : 'auto'
                            }}
                        >
                            <div className="flex items-baseline justify-between mb-3 border-b border-white/10 pb-2">
                                <div className="text-lg font-bold text-white">{activePoint.year}</div>
                                <div className="text-xs text-gray-400">Age {activePoint.age}</div>
                            </div>

                            <div className="space-y-2 mb-3">
                                {/* Jing Section */}
                                <div className="flex justify-between text-xs">
                                    <span className="text-blue-400 font-bold flex items-center gap-1.5"><Droplets className="w-3 h-3" /> Jing</span>
                                    <span className="font-mono text-white">{activePoint.j_final.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] pl-4 text-gray-500">
                                    <span>Pre-Heaven (Inherited)</span>
                                    <span className="font-mono">{activePoint.jing_prenatal?.toFixed(1) ?? '-'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] pl-4 text-gray-500">
                                    <span>Post-Heaven (Acquired)</span>
                                    <span className="font-mono">{activePoint.jing_postnatal?.toFixed(1) ?? '-'}</span>
                                </div>

                                {/* Qi Section */}
                                <div className="flex justify-between text-xs mt-2">
                                    <span className="text-green-400 font-bold flex items-center gap-1.5"><Zap className="w-3 h-3" /> Qi</span>
                                    <span className="font-mono text-white">{activePoint.qi.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] pl-4 text-gray-500">
                                    <span>Yuan Qi (Innate Flow)</span>
                                    <span className="font-mono">{activePoint.qi_pre_heaven?.toFixed(1) ?? '-'}</span>
                                </div>
                                <div className="flex justify-between text-[10px] pl-4 text-gray-500">
                                    <span>Metabolic Qi (Lifestyle)</span>
                                    <span className="font-mono">{activePoint.qi_post_heaven?.toFixed(1) ?? '-'}</span>
                                </div>

                                {/* Shen Section */}
                                <div className="flex justify-between text-xs mt-2">
                                    <span className="text-yellow-400 font-bold flex items-center gap-1.5"><Brain className="w-3 h-3" /> Shen</span>
                                    <span className="font-mono text-white">{activePoint.shen.toFixed(1)}</span>
                                </div>

                                {/* Prenatal Integrity */}
                                {activePoint.prenatal_integrity !== undefined && (
                                    <div className="flex justify-between text-[10px] mt-2 pt-2 border-t border-white/10">
                                        <span className="text-purple-400 font-bold">Prenatal Integrity</span>
                                        <span className="font-mono text-purple-300">{(activePoint.prenatal_integrity * 100).toFixed(0)}%</span>
                                    </div>
                                )}
                            </div>

                            {activePoint.explain && (
                                <div className="text-[10px] text-gray-300 italic border-t border-white/10 pt-2 leading-relaxed">
                                    {activePoint.explain}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-center text-[10px] text-gray-500">
                <div>Vol: {activePoint?.V.toFixed(2) ?? '-'}</div>
                <div>Supp: {activePoint?.S.toFixed(2) ?? '-'}</div>
                <div>Drain: {activePoint?.D.toFixed(2) ?? '-'}</div>
                <div>Harm: {activePoint?.H.toFixed(2) ?? '-'}</div>
            </div>
        </div>
    );
}
