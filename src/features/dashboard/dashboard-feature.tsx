"use client"

import React from 'react';
import { NeuralGrid, NavBar, Hero, StatsBar, Footer, AboutSection } from './components-home'


export default function DashboardFeature() {
  return (
    <main className="min-h-screen bg-cyber-black text-white selection:bg-cyber-pink selection:text-white relative overflow-hidden">
      {/* Background Grid */}
      <NeuralGrid />

      {/* UI Layers */}
      <Hero />
      <StatsBar />
      <AboutSection />
    </main>
  )
}
