"use client";

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface DashboardCardProps {
    id: string;
    title: string;
    children: ReactNode;
    expanded?: boolean;
    onExpand: (id: string | null) => void;
    className?: string;
    expandedView?: ReactNode;
}

export const DashboardCard = ({
    id,
    title,
    children,
    expanded,
    onExpand,
    className = "",
    expandedView
}: DashboardCardProps) => {
    return (
        <>
            {expanded && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1001] transition-opacity animate-in fade-in"
                    onClick={() => onExpand(null)}
                />
            )}
            <div
                onClick={() => onExpand(expanded ? null : id)}
                className={`bg-white dark:bg-[#141b2a] border border-gray-200 dark:border-white/5 shadow-2xl rounded-xl cursor-pointer p-4 group transition-all duration-300 ${expanded
                        ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[600px] z-[1002] scale-100'
                        : 'hover:border-blue-500/30'
                    } ${className}`}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</h2>
                    <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </div>

                <div className="relative">
                    {children}
                </div>

                {expanded && expandedView && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {expandedView}
                    </div>
                )}
            </div>
        </>
    );
};
