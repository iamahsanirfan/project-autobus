import { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import DriverMap from '@/components/DriverMap';

export default function DriverPage() {
  const [isTracking, setIsTracking] = useState(true);
  const [speed, setSpeed] = useState(42);
  const [busId] = useState('KBT-001'); // In a real app, this would come from auth or context
  
  // Simulate speed changes
  useState(() => {
    const interval = setInterval(() => {
      setSpeed(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to 2
        const newSpeed = Math.max(0, Math.min(80, prev + change));
        return newSpeed;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A102A] to-[#85193C]">
      <Head>
        <title>Driver Dashboard | Karachi Bus Tracker</title>
        <meta name="description" content="Driver dashboard for Karachi Bus Tracker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Driver Dashboard</h1>
            <p className="text-gray-300">Bus ID: {busId} | Route 1: Gulshan to Saddar</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${isTracking ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span>{isTracking ? 'Tracking Active' : 'Tracking Paused'}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTracking(!isTracking)}
              className={`px-4 py-2 rounded-lg font-bold ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isTracking ? 'Pause Tracking' : 'Resume Tracking'}
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-[#4A102A] rounded-2xl p-6 border border-[#FCF259]/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Live Location</h2>
              <div className="text-[#FCF259]">Accuracy: 5m</div>
            </div>
            
            <DriverMap busId={busId} />
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-[#85193C] p-4 rounded-lg">
                <div className="text-gray-300 text-sm">Next Stop</div>
                <div className="text-white font-bold">Karachi University</div>
                <div className="text-[#FCF259] text-sm">ETA: 8 minutes</div>
              </div>
              
              <div className="bg-[#85193C] p-4 rounded-lg">
                <div className="text-gray-300 text-sm">Passengers</div>
                <div className="text-white font-bold">24 / 40</div>
                <div className="text-[#FCF259] text-sm">Capacity: 60%</div>
              </div>
            </div>
          </motion.div>
          
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#4A102A] rounded-2xl p-6 border border-[#FCF259]/20 mb-8"
            >
              <h2 className="text-xl font-bold text-white mb-6">Bus Status</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Speed</span>
                    <span className="text-[#FCF259] font-bold">{speed} km/h</span>
                  </div>
                  <div className="w-full bg-[#85193C] h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#FCF259]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(speed / 80) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    ></motion.div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Fuel Level</span>
                    <span className="text-[#FCF259] font-bold">62%</span>
                  </div>
                  <div className="w-full bg-[#85193C] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FCF259]" style={{ width: '62%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">Temperature</span>
                    <span className="text-[#FCF259] font-bold">28°C</span>
                  </div>
                  <div className="w-full bg-[#85193C] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FCF259]" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#4A102A] rounded-2xl p-6 border border-[#FCF259]/20"
            >
              <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#85193C] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#C5172E] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#85193C] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#C5172E] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Reports
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#85193C] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#C5172E] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#85193C] p-4 rounded-lg flex flex-col items-center text-white hover:bg-[#C5172E] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}