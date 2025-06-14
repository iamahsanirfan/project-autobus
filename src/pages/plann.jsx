"use client";
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RouteMap = dynamic(
  () => import('@/components/RouteMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-white text-xl">Loading map...</div>
      </div>
    )
  }
);

export default function RoutePlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A102A] to-[#85193C]">
      <Navbar />
      
      <main className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Plan Your Journey</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Set pickup and drop-off locations to find the best bus route
            </p>
          </motion.div>
          
          <RouteMap />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}