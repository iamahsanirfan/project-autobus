// src/components/HomeMapSection.jsx
'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const karachiCenter = [24.8607, 67.0011];

export default function HomeMapSection() {
  const [busLocations, setBusLocations] = useState([]);
  const [map, setMap] = useState(null);
  const [activeRoute, setActiveRoute] = useState(0);
  
  // Custom bus icon
  const createBusIcon = (color) => {
    return new L.Icon({
      iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="M18 11H6V6h12v5zM16.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/></svg>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  // Simulate live bus data
  useEffect(() => {
    const generateBusLocations = () => {
      const locations = [];
      const routes = [
        { id: 1, name: "Route 1", color: "#C5172E", stops: 8 },
        { id: 2, name: "Route 2", color: "#FCF259", stops: 12 },
        { id: 3, name: "Route 3", color: "#4A102A", stops: 6 }
      ];
      
      routes.forEach(route => {
        for (let i = 0; i < route.stops; i++) {
          locations.push({
            id: `${route.id}-${i}`,
            position: [
              karachiCenter[0] + (Math.random() * 0.1 - 0.05),
              karachiCenter[1] + (Math.random() * 0.1 - 0.05)
            ],
            route: route.name,
            busNumber: `KBT-${100 + i}`,
            nextStop: ["NIPA", "Saddar", "Gulshan", "University"][Math.floor(Math.random() * 4)],
            eta: Math.floor(Math.random() * 15) + 1,
            color: route.color
          });
        }
      });
      setBusLocations(locations);
    };

    generateBusLocations();
    const interval = setInterval(generateBusLocations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fit map to markers when data changes
  useEffect(() => {
    if (map && busLocations.length > 0) {
      const bounds = L.latLngBounds(busLocations.map(bus => bus.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [busLocations, map]);

  // Filter buses by route
  const filteredBuses = activeRoute === 0 
    ? busLocations 
    : busLocations.filter(bus => bus.route === `Route ${activeRoute}`);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-16 px-4 bg-[#4A102A]"
    >
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Live Bus Tracking
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Track buses in real-time across Karachi with our interactive map
          </motion.p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <div className="bg-[#85193C] rounded-xl p-6 border border-[#FCF259]/20">
              <h3 className="text-xl font-bold text-white mb-4">Bus Routes</h3>
              
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => setActiveRoute(0)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeRoute === 0 
                      ? 'bg-[#C5172E] text-white' 
                      : 'bg-[#4A102A] hover:bg-[#5a1c44] text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-3"></div>
                    <span>All Routes</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveRoute(1)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeRoute === 1 
                      ? 'bg-[#C5172E] text-white' 
                      : 'bg-[#4A102A] hover:bg-[#5a1c44] text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C5172E] mr-3"></div>
                    <span>Route 1: Gulshan to Saddar</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveRoute(2)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeRoute === 2 
                      ? 'bg-[#C5172E] text-white' 
                      : 'bg-[#4A102A] hover:bg-[#5a1c44] text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#FCF259] mr-3"></div>
                    <span>Route 2: North Nazimabad to Korangi</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveRoute(3)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeRoute === 3 
                      ? 'bg-[#C5172E] text-white' 
                      : 'bg-[#4A102A] hover:bg-[#5a1c44] text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4A102A] mr-3"></div>
                    <span>Route 3: Clifton to Airport</span>
                  </div>
                </button>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium text-white mb-3">Active Buses</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {filteredBuses.slice(0, 5).map((bus) => (
                    <div key={bus.id} className="bg-[#4A102A] p-3 rounded-lg flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: bus.color }}
                      ></div>
                      <div>
                        <div className="text-white font-medium">{bus.busNumber}</div>
                        <div className="text-gray-400 text-sm">ETA: {bus.eta} min</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-2/3"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#FCF259] shadow-xl h-[500px]">
              <MapContainer 
                center={karachiCenter} 
                zoom={12} 
                style={{ height: "100%", width: "100%" }}
                whenCreated={setMap}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {filteredBuses.map((bus) => (
                  <Marker 
                    key={bus.id} 
                    position={bus.position}
                    icon={createBusIcon(bus.color)}
                  >
                    <Popup className="custom-popup">
                      <div className="font-bold text-[#4A102A]">{bus.busNumber}</div>
                      <div className="text-sm mb-1">{bus.route}</div>
                      <div className="flex items-center mb-1">
                        <span className="text-gray-600 mr-2">Next Stop:</span>
                        <span className="font-medium">{bus.nextStop}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">ETA:</span>
                        <span className="font-bold text-[#C5172E]">{bus.eta} min</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              <div className="absolute top-4 left-4 right-4 max-w-md z-[1000]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for bus stops or routes..."
                    className="w-full bg-white/90 backdrop-blur-sm text-gray-800 rounded-full py-3 px-6 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#FCF259] focus:border-transparent shadow-lg"
                  />
                  <button className="absolute right-3 top-3 bg-[#C5172E] text-white rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg z-[1000]">
                <h3 className="font-bold text-[#4A102A] mb-2">Route Legend</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#C5172E] mr-2"></div>
                    <span className="text-sm">Route 1</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#FCF259] mr-2"></div>
                    <span className="text-sm">Route 2</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#4A102A] mr-2"></div>
                    <span className="text-sm">Route 3</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}