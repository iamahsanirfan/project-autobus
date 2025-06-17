'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Dynamically import Leaflet components to avoid SSR
const AdminRouteMap = dynamic(() => import('@/components/route-planner/RouteMap'), {
  ssr: false,
  loading: () => <div className="text-white text-center p-8">Loading map...</div>
});

const RoutePlanner = dynamic(() => import('@/components/RoutePlanner'), {
  ssr: false,
  loading: () => <div className="text-white text-center p-8">Loading route planner...</div>
});

export default function Home() {
  const [activeTab, setActiveTab] = useState('admin');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2c0a1a] to-[#5a1c44]">
      <header className="bg-[#4A102A] border-b border-[#85193C] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Autobus Karachi</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'admin'
                  ? 'bg-[#C5172E] text-white'
                  : 'bg-[#4A102A] text-gray-300 hover:bg-[#5a1c44]'
              }`}
            >
              Admin Dashboard
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'planner'
                  ? 'bg-[#C5172E] text-white'
                  : 'bg-[#4A102A] text-gray-300 hover:bg-[#5a1c44]'
              }`}
            >
              Route Planner
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'admin' ? <AdminRouteMap /> : <RoutePlanner />}
        </motion.div>
      </main>

      <footer className="bg-[#4A102A] border-t border-[#85193C] p-4 text-center text-gray-400">
        <p>© 2023 Autobus Karachi. All rights reserved.</p>
      </footer>
    </div>
  );
}