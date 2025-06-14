// src/components/LiveMapSection.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type LiveMapSectionProps = {
  activeBuses: number;
};

type BusLocation = {
  id: number;
  lat: number;
  lng: number;
  route: number;
};

export default function LiveMapSection({ activeBuses }: LiveMapSectionProps) {
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);

  useEffect(() => {
    const generateBusLocations = () => {
      const locations: BusLocation[] = [];
      for (let i = 0; i < activeBuses; i++) {
        locations.push({
          id: i,
          lat: 24.86 + (Math.random() * 0.1 - 0.05),
          lng: 67.01 + (Math.random() * 0.1 - 0.05),
          route: Math.floor(Math.random() * 3) + 1
        });
      }
      setBusLocations(locations);
    };

    generateBusLocations();
    const interval = setInterval(generateBusLocations, 5000);

    return () => clearInterval(interval);
  }, [activeBuses]);

  return (
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
            See all active buses moving in real-time across Karachi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-[#85193C] rounded-2xl overflow-hidden border-2 border-[#FCF259] shadow-xl"
        >
          {/* Map visualization */}
          <div className="h-96 w-full relative overflow-hidden">
            {/* Karachi map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5a1c44] to-[#7d2a5d]">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-2 bg-gray-400 rounded-full opacity-30"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: '10%',
                    width: '80%',
                    transform: `rotate(${i % 2 === 0 ? 0 : 3}deg)`
                  }}
                ></div>
              ))}

              {/* Bus markers */}
              {busLocations.map((bus) => (
                <motion.div
                  key={bus.id}
                  className="absolute w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"
                  style={{
                    backgroundColor:
                      bus.route === 1 ? '#C5172E' :
                      bus.route === 2 ? '#FCF259' : '#4A102A',
                    left: `${((bus.lng - 66.96) / 0.2) * 100}%`,
                    top: `${((24.91 - bus.lat) / 0.2) * 100}%`
                  }}
                  animate={{ x: [0, -2, 0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Map controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="bg-white/20 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h3 className="text-white font-bold mb-2">Route Legend</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#C5172E] mr-2"></div>
                <span className="text-white text-sm">Route 1</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#FCF259] mr-2"></div>
                <span className="text-white text-sm">Route 2</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#4A102A] mr-2"></div>
                <span className="text-white text-sm">Route 3</span>
              </div>
            </div>
          </div>

          {/* Search box */}
          <div className="absolute top-4 left-4 right-4 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a bus stop or route..."
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-full py-3 px-6 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#FCF259] focus:border-transparent"
              />
              <button className="absolute right-3 top-3 bg-[#C5172E] text-white rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
