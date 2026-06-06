// app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MapContainer from '@/components/MapContainer';

export default function Home() {
  const [routeData, setRouteData] = useState<any>(null);
  const [activeRoute, setActiveRoute] = useState<'coolest' | 'fastest'>('coolest');

  return (
    <main className="flex flex-col md:flex-row h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      <section className="w-full h-[350px] min-h-[350px] md:h-full md:w-[380px] md:min-w-[380px] border-b md:border-b-0 md:border-r border-slate-200 bg-white p-6 flex flex-col z-10 shadow-lg overflow-y-auto">
        <Sidebar
          onRouteCalculated={setRouteData}
          routeData={routeData}
          activeRoute={activeRoute}
          setActiveRoute={setActiveRoute}
        />
      </section>

      <section className="flex-1 h-full relative bg-slate-100">
        <MapContainer
          routeData={routeData}
          activeRoute={activeRoute}
        />
      </section>
    </main>
  );
}