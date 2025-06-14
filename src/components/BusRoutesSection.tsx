// src/components/BusRoutesSection.jsx
import { motion } from 'framer-motion';

export default function BusRoutesSection() {
  const routes = [
    { 
      id: 1, 
      name: "Gulshan-e-Iqbal to Saddar", 
      stops: ["Gulshan Chowrangi", "NIPA", "Karachi University", "Empress Market", "Saddar"],
      color: "#C5172E"
    },
    { 
      id: 2, 
      name: "North Nazimabad to Korangi", 
      stops: ["Five Star Chowrangi", "Sohrab Goth", "Numaish", "Gulshan Chowrangi", "Korangi"],
      color: "#FCF259"
    },
    { 
      id: 3, 
      name: "Clifton to Airport", 
      stops: ["Seaview", "Dolmen Mall", "Frere Hall", "Civic Center", "Airport"],
      color: "#4A102A"
    }
  ];

  return (
    <section id="routes" className="py-20 px-4 bg-[#85193C]">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Popular Bus Routes</h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Explore the most frequented bus routes across Karachi with detailed stop information
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#4A102A] rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="p-6" style={{ borderBottom: `4px solid ${route.color}` }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: route.color }}>
                    {route.id}
                  </div>
                  <h3 className="text-xl font-bold text-white">{route.name}</h3>
                </div>
                
                <div className="space-y-3 mt-6">
                  {route.stops.map((stop, stopIndex) => (
                    <div key={stopIndex} className="flex">
                      <div className="flex flex-col items-center mr-3">
                        <div className={`w-3 h-3 rounded-full ${stopIndex === 0 ? 'bg-green-400' : stopIndex === route.stops.length - 1 ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                        {stopIndex < route.stops.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-600"></div>
                        )}
                      </div>
                      <div className="text-gray-300">{stop}</div>
                    </div>
                  ))}
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors"
                >
                  Track This Route
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}