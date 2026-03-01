"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GaugeChartProps {
    value: number;
    label: string;
    colors?: string[];
    pillColor?: string;
    pillTextColor?: string;
}

export function GaugeChart({
    value,
    label,
    colors = ["#ef4444", "#f59e0b", "#10b981"], // Red (Low/Risk) -> Green (High/Safe)
    pillColor = "bg-green-500/20",
    pillTextColor = "text-green-500",
}: GaugeChartProps) {
    const data = [
        { name: "Segment 1", value: 33.33, color: colors[0] },
        { name: "Segment 2", value: 33.33, color: colors[1] },
        { name: "Segment 3", value: 33.34, color: colors[2] },
    ];

    // Needle rotation: 0% maps to -90deg (Left), 50% to 0deg (Up), 100% to 90deg (Right)
    const needleRotation = (value / 100) * 180 - 90;

    return (
        <div className="relative w-full aspect-[2/1] flex flex-col items-center justify-end overflow-hidden pb-1">
            <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="92%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="82%"
                            outerRadius="100%"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Needle Indicator */}
            <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none">
                <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
                    <g transform={`rotate(${needleRotation}, 100, 92)`} className="transition-transform duration-1000 ease-in-out">
                        <path
                            d="M 98,92 L 100,25 L 102,92 Z"
                            fill="#94a3b8" /* slate-400 */
                            className="drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]"
                        />
                        <circle cx="100" cy="92" r="4" fill="#64748b" /* slate-500 */ />
                        <circle cx="100" cy="92" r="1.5" fill="white" />
                    </g>
                </svg>
            </div>

            {/* Display Value - Scaled down and lowered to avoid overlap */}
            <div className="absolute bottom-6 flex flex-col items-center">
                <span className="text-4xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
                    {value}
                </span>
            </div>

            {/* Label Pill */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-0.5 flex items-center justify-center rounded-sm text-[8px] uppercase tracking-widest font-black truncate max-w-[90%] border border-white/5 shadow-sm ${pillColor}`}>
                <span className={`drop-shadow-sm ${pillTextColor}`}>{label}</span>
            </div>
        </div>
    );
}
