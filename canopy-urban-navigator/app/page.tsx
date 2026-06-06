// app/page.tsx
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MapContainer from '@/components/MapContainer';

export default function Home() {
  const [routeData, setRouteData] = useState<any>(null);
  const [activeRoute, setActiveRoute] = useState<'coolest' | 'fastest'>('coolest');

  return (
    <main className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      <section className="w-[380px] min-w-[380px] border-r border-slate-200 bg-white p-6 flex flex-col z-10 shadow-lg">
        <Sidebar
          onRouteCalculated={setRouteData}
          routeData={routeData}
          activeRoute={activeRoute}
          setActiveRoute={setActiveRoute}
        />
      </section>

      <section className="flex-1 relative bg-slate-100">
        <MapContainer
          routeData={routeData}
          activeRoute={activeRoute}
        />
      </section>
    </main>
  );
}