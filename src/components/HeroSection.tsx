// src/components/HeroSection.tsx
import { motion } from 'framer-motion';

type HeroSectionProps = {
  activeBuses: number;
  isOnline: boolean;
};

export default function HeroSection({ activeBuses, isOnline }: HeroSectionProps) {
  return (
    <section className="pt-28 pb-20 md:pt-40 md:pb-32 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-12 md:mb-0"
          >
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-[#FCF259] font-bold">
                {isOnline ? 'SERVICE ACTIVE' : 'SERVICE OFFLINE'}
              </span>
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Track Buses in <br className="hidden md:block" />
              <span className="text-[#FCF259]">Karachi</span> in Real-time
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-200 text-lg mb-8 max-w-lg"
            >
              Never miss your bus again! See exactly where your bus is and when it will arrive at your stop.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <button className="bg-[#C5172E] hover:bg-[#b01529] text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Track Your Bus
              </button>

              <button className="bg-transparent border-2 border-[#FCF259] text-[#FCF259] hover:bg-[#FCF259] hover:text-[#4A102A] font-bold py-3 px-8 rounded-lg transition-colors">
                Download App
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="md:w-1/2 relative"
          >
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FCF259] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#C5172E] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute top-20 left-20 w-80 h-80 bg-[#85193C] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

              <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-xl">Active Buses</h3>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <motion.div 
                    key={activeBuses}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-7xl font-bold text-[#FCF259]"
                  >
                    {activeBuses}
                  </motion.div>
                  <p className="text-gray-300">currently operating</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((route) => (
                    <div key={route} className="bg-[#85193C] p-4 rounded-lg">
                      <div className="text-[#FCF259] text-lg font-bold">{Math.floor(activeBuses / 3) + (route % 2)}</div>
                      <div className="text-white text-sm">Route {route}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
