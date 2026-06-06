// components/MapContainer.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapContainer({ routeData, activeRoute }: { routeData: any, activeRoute: 'coolest' | 'fastest' }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
            center: [73.8567, 18.5204], // Pune
            zoom: 15,
            pitch: 60, // Increased pitch for better 3D feel
            bearing: -17.6
        });

        setTimeout(() => {
            map.current?.resize();
        }, 500);

        map.current.on('load', () => {
            map.current?.resize();

            // Add 3D Buildings Layer with Vertical Gradient
            map.current?.addLayer({
                'id': '3d-buildings',
                'source': 'maptiler_planet',
                'source-layer': 'building',
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#e2e8f0',
                    'fill-extrusion-height': ['get', 'render_height'],
                    'fill-extrusion-base': ['get', 'render_min_height'],
                    'fill-extrusion-opacity': 0.8,
                    // AMAZING TWEAK: Adds shadows/depth to buildings
                    'fill-extrusion-vertical-gradient': true
                }
            });
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!map.current || !routeData) return;

        // --- 1. DRAW FASTEST ROUTE (GRAY DASHED) ---
        if (routeData.fastest_path) {
            const fastestSourceId = 'fastest-route-source';
            const fastestLayerId = 'fastest-route-layer';

            const fastestGeojson: any = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: routeData.fastest_path
                }
            };

            if (map.current.getSource(fastestSourceId)) {
                (map.current.getSource(fastestSourceId) as maplibregl.GeoJSONSource).setData(fastestGeojson);
                map.current.setPaintProperty(fastestLayerId, 'line-width', activeRoute === 'fastest' ? 8 : 5);
                map.current.setPaintProperty(fastestLayerId, 'line-opacity', activeRoute === 'fastest' ? 0.9 : 0.5);
            } else {
                map.current.addSource(fastestSourceId, {
                    type: 'geojson',
                    data: fastestGeojson
                });

                map.current.addLayer({
                    id: fastestLayerId,
                    type: 'line',
                    source: fastestSourceId,
                    paint: {
                        'line-color': '#64748b', // Slate Gray
                        'line-width': activeRoute === 'fastest' ? 8 : 5,
                        'line-dasharray': [3, 3], // Clearer dash pattern
                        'line-opacity': activeRoute === 'fastest' ? 0.9 : 0.5
                    }
                }); // Render on top of buildings so it is visible
            }
        }

        // --- 2. DRAW COOLEST ROUTE (ORANGE) ---
        if (routeData.path) {
            const coolSourceId = 'cool-route-source';
            const coolLayerId = 'cool-route-layer';

            const coolGeojson: any = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: routeData.path
                }
            };

            if (map.current.getSource(coolSourceId)) {
                (map.current.getSource(coolSourceId) as maplibregl.GeoJSONSource).setData(coolGeojson);
                map.current.setPaintProperty(coolLayerId, 'line-width', activeRoute === 'coolest' ? 10 : 6);
                map.current.setPaintProperty(coolLayerId, 'line-opacity', activeRoute === 'coolest' ? 1 : 0.3);
            } else {
                map.current.addSource(coolSourceId, {
                    type: 'geojson',
                    data: coolGeojson
                });

                map.current.addLayer({
                    id: coolLayerId,
                    type: 'line',
                    source: coolSourceId,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#ea580c', // Orange
                        'line-width': activeRoute === 'coolest' ? 10 : 6,
                        'line-opacity': activeRoute === 'coolest' ? 1 : 0.3
                    }
                });
            }

            // Auto-zoom to fit the path
            const bounds = routeData.path.reduce((bounds: maplibregl.LngLatBounds, coord: [number, number]) => {
                return bounds.extend(coord);
            }, new maplibregl.LngLatBounds(routeData.path[0], routeData.path[0]));

            map.current.fitBounds(bounds, { padding: 80, duration: 2000 });
        }

    }, [routeData, activeRoute]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div
                ref={mapContainer}
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            />

            {/* Legend Overlay */}
            <div className="absolute bottom-10 right-6 bg-white/90 backdrop-blur p-4 rounded-xl shadow-2xl border border-slate-200 z-20">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Route Comparison</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-1.5 rounded-full bg-orange-500"></div>
                        <span className="text-xs text-slate-800 font-bold">Coolest Path (-5°C)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-1.5 rounded-full bg-slate-300 border-b border-dashed border-slate-500"></div>
                        <span className="text-xs text-slate-500 font-medium italic">Fastest (Direct Sun)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}