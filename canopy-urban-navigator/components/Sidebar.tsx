// components/Sidebar.tsx
'use client';

import { useState } from 'react';

export default function Sidebar({
    onRouteCalculated,
    routeData,
    activeRoute,       // ADD THIS
    setActiveRoute
}: {
    onRouteCalculated: (data: any) => void,
    routeData: any
    activeRoute: 'coolest' | 'fastest';
    setActiveRoute: (route: 'coolest' | 'fastest') => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Calculate Coolest Route");
    const [start, setStart] = useState('Kondhwa, Pune');
    const [end, setEnd] = useState('FC Road Cafe, Pune');


    const handleCalculate = async () => {
        setIsLoading(true);

        // AI Loading Animation sequence
        setLoadingText("Analyzing satellite heat maps...");
        setTimeout(() => setLoadingText("Calculating shadow angles..."), 800);
        setTimeout(() => setLoadingText("Optimizing for comfort..."), 1600);

        try {
            const response = await fetch('http://localhost:8000/api/route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start, end })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            onRouteCalculated(data);

        } catch (error) {
            console.error("API Error:", error);
            alert("Failed to connect to the Python backend! Make sure 'uvicorn main:app --reload' is running.");
        } finally {
            // Keep button in disabled state briefly before resetting
            setTimeout(() => {
                setIsLoading(false);
                setLoadingText("Calculate Coolest Route");
            }, 500);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-8">
            {/* Brand/Logo */}
            <header className="flex items-center gap-3 pb-6 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white text-xl font-bold">C</div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">Canopy Navigator</h1>
            </header>

            {/* 1. Route Planning */}
            <section className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Route Planning</h2>

                <label className="text-sm font-medium text-slate-700">Starting Point</label>
                <input
                    type="text"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 shadow-inner focus:ring-2 focus:ring-orange-200 outline-none"
                />

                <label className="text-sm font-medium text-slate-700">Destination</label>
                <input
                    type="text"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 shadow-inner focus:ring-2 focus:ring-orange-200 outline-none"
                />

                <button
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${isLoading
                        ? 'bg-orange-400 cursor-not-allowed animate-pulse'
                        : 'bg-orange-600 hover:bg-orange-700 shadow-lg'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {loadingText}
                        </span>
                    ) : (
                        "Calculate Coolest Route"
                    )}
                </button>
            </section>

            {/* 2. Route Options */}
            <section className="flex-1 flex flex-col gap-4 pt-6 border-t border-slate-200">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Route Options</h2>

                {/* Option: Coolest */}
                <div
                    onClick={() => setActiveRoute('coolest')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${activeRoute === 'coolest'
                        ? 'bg-orange-50 border-orange-500 shadow-md'
                        : 'bg-white border-slate-100 opacity-60 hover:opacity-100'
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${activeRoute === 'coolest' ? 'bg-orange-500 animate-pulse' : 'bg-orange-300'}`}></span>
                            <span className="font-bold text-orange-950 text-lg">Coolest Route</span>
                        </div>
                        {routeData && routeData.status === "success" && (
                            <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded-md text-xs font-black uppercase tracking-tighter">
                                Feels -{routeData.metrics?.temp_reduction}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-sm text-orange-800 font-medium">
                            {routeData?.metrics?.time || "18 mins"} ({routeData?.metrics?.shade || "85%"} Shade)
                        </div>
                        <div className="text-[10px] text-orange-600 font-bold uppercase">Optimized for Comfort</div>
                    </div>
                </div>

                {/* Option: Fastest */}
                <div
                    onClick={() => setActiveRoute('fastest')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${activeRoute === 'fastest'
                        ? 'bg-slate-100 border-slate-400 shadow-md grayscale-0 opacity-100'
                        : 'bg-slate-50 border-transparent opacity-50 grayscale hover:opacity-80 hover:grayscale-0'
                        }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-3 h-3 rounded-full ${activeRoute === 'fastest' ? 'bg-slate-600' : 'bg-slate-400'}`}></span>
                        <span className={`font-semibold ${activeRoute === 'fastest' ? 'text-slate-900' : 'text-slate-800'}`}>Fastest Route</span>
                    </div>
                    <div className="text-xs text-slate-500">
                        {routeData?.metrics?.fastest_time || "15 mins"} (12% Shade) — Direct Sun
                    </div>
                </div>
            </section>
        </div>
    );
}