// src/pages/index.jsx
"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import RoutePlanner from '@/components/RoutePlanner'; // Import RoutePlanner
import FeaturesSection from '@/components/FeaturesSection';
import DownloadSection from '@/components/DownloadSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const [activeBuses, setActiveBuses] = useState(12);
  const [isOnline, setIsOnline] = useState(true);
  
  // Simulate bus count changing
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBuses(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newCount = Math.max(8, Math.min(15, prev + change));
        return newCount;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A102A] to-[#85193C]">
      <Head>
        <title>Karachi Bus Tracker | Real-time Bus Locations</title>
        <meta name="description" content="Track buses in Karachi in real-time. Never miss your bus again!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main>
        <HeroSection activeBuses={activeBuses} isOnline={isOnline} />
        
        {/* Route Planner Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Plan Your Journey</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Easily find the best bus route from your pickup to drop-off location
              </p>
            </motion.div>
            
            <RoutePlanner />
          </div>
        </section>
        
        <FeaturesSection />
        
        {/* Live Map Section */}
        <section id="map" className="py-20 px-4 bg-[#4A102A]">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Bus Map</h2>
              <p className="text-gray-200 max-w-2xl mx-auto">
                Track buses in real-time across Karachi
              </p>
            </motion.div>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-[#85193C] p-6 rounded-2xl border border-[#FCF259]/20"
              >
                <div className="text-4xl font-bold text-[#FCF259] mb-2">15+</div>
                <h3 className="text-xl font-bold text-white mb-2">Active Routes</h3>
                <p className="text-gray-300">Covering all major areas of Karachi</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-[#85193C] p-6 rounded-2xl border border-[#FCF259]/20"
              >
                <div className="text-4xl font-bold text-[#FCF259] mb-2">300+</div>
                <h3 className="text-xl font-bold text-white mb-2">Bus Stops</h3>
                <p className="text-gray-300">Conveniently located throughout the city</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-[#85193C] p-6 rounded-2xl border border-[#FCF259]/20"
              >
                <div className="text-4xl font-bold text-[#FCF259] mb-2">24/7</div>
                <h3 className="text-xl font-bold text-white mb-2">Service Updates</h3>
                <p className="text-gray-300">Real-time tracking and notifications</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        <DownloadSection />
      </main>
      
      <Footer />
    </div>
  );
}