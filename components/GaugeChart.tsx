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
    colors = ["#10b981", "#f59e0b", "#ef4444"],
    pillColor = "bg-green-500/20",
    pillTextColor = "text-green-500",
}: GaugeChartProps) {
    const data = [
        { name: "Segment 1", value: 33.33, color: colors[0] },
        { name: "Segment 2", value: 33.33, color: colors[1] },
        { name: "Segment 3", value: 33.34, color: colors[2] },
    ];

    return (
        <div className="relative w-full aspect-[2/1] flex flex-col items-center">
            <div className="absolute inset-0 pb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="75%"
                            outerRadius="100%"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Display Value */}
            <div className="absolute bottom-8 flex flex-col items-center">
                <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-slate-100 leading-none">
                    {value}
                </span>
            </div>

            {/* Label Pill */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-1 flex items-center justify-center rounded-sm text-sm font-semibold truncate max-w-[90%] shadow-lg ${pillColor}`}>
                <span className={`drop-shadow-sm ${pillTextColor}`}>{label}</span>
            </div>
        </div>
    );
}
