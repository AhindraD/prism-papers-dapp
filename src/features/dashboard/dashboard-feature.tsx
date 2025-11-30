'use client';

import React from 'react';
import { Hero, StatsBar, AboutSection } from './components-home';


export default function DashboardFeature() {
  return (
    <main className="min-h-screen bg-cyber-black text-white selection:bg-cyber-pink selection:text-white relative overflow-hidden">

      {/* UI Layers */}
      <Hero />
      <StatsBar />
      <AboutSection />
    </main>
  )
}
