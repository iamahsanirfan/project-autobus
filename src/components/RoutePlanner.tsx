'use client';
import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup, useMapEvents } from 'react-leaflet';
import L, { LatLngTuple, Icon, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete (Icon.Default.prototype as any)._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const karachiCenter: LatLngTuple = [24.8607, 67.0011];

// Custom icons
const startIcon = new Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23C5172E"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const endIcon = new Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234A102A"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const busIcon = new Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FCF259"><path d="M18 11H6V6h12v5zM16.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/></svg>',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface RouteProgressProps {
  route: LatLngTuple[];
  progress: number;
}

function RouteProgress({ route, progress }: RouteProgressProps) {
  const map = useMap();
  
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  
  return null;
}

// Component to handle map click events
function MapClickHandler({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

interface BusStop {
  name: string;
  position: LatLngTuple;
}

export default function RoutePlanner() {
  const [startPoint, setStartPoint] = useState<LatLngTuple | null>(null);
  const [endPoint, setEndPoint] = useState<LatLngTuple | null>(null);
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const [busPosition, setBusPosition] = useState<LatLngTuple | null>(null);
  const [progress, setProgress] = useState(0);
  const [isTraveling, setIsTraveling] = useState(false);
  const [eta, setEta] = useState('--:--');
  const [distance, setDistance] = useState('0 km');
  const [searchStart, setSearchStart] = useState('');
  const [searchEnd, setSearchEnd] = useState('');
  const [suggestions, setSuggestions] = useState<BusStop[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  
  // Sample bus stops in Karachi
  const busStops: BusStop[] = [
    { name: "Gulshan Chowrangi", position: [24.9068, 67.0771] },
    { name: "NIPA", position: [24.8912, 67.0673] },
    { name: "Karachi University", position: [24.9365, 67.1100] },
    { name: "Saddar", position: [24.8484, 67.0287] },
    { name: "Empress Market", position: [24.8564, 67.0279] },
    { name: "Clifton", position: [24.8142, 67.0253] },
    { name: "Defence", position: [24.7984, 67.0456] },
    { name: "Korangi", position: [24.8012, 67.1098] },
    { name: "North Nazimabad", position: [24.9412, 67.0529] },
    { name: "Liaquatabad", position: [24.9035, 67.0362] },
    { name: "Gulistan-e-Johar", position: [24.9043, 67.0948] },
    { name: "Malir", position: [24.8932, 67.1867] }
  ];

  // Generate a route between two points
  const generateRoute = () => {
    if (!startPoint || !endPoint) return;
    
    // Simulate route generation with intermediate points
    const newRoute: LatLngTuple[] = [
      startPoint,
      [startPoint[0] + 0.01, startPoint[1] + 0.01] as LatLngTuple,
      [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2] as LatLngTuple,
      [endPoint[0] - 0.01, endPoint[1] - 0.01] as LatLngTuple,
      endPoint
    ];
    
    setRoute(newRoute);
    
    // Calculate distance
    const dist = calculateDistance(startPoint, endPoint);
    setDistance(`${dist.toFixed(1)} km`);
    
    // Calculate ETA (1 min per km + traffic factor)
    const time = Math.ceil(dist * (1 + Math.random() * 0.3));
    const now = new Date();
    now.setMinutes(now.getMinutes() + time);
    setEta(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
  };

  // Calculate distance between two points
  const calculateDistance = (point1: LatLngTuple, point2: LatLngTuple) => {
    const R = 6371; // Earth radius in km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Start the bus journey
  const startJourney = () => {
    if (route.length === 0) return;
    
    setIsTraveling(true);
    setBusPosition(route[0]);
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 0.01;
      setProgress(currentProgress);
      
      if (currentProgress >= 1) {
        clearInterval(interval);
        setIsTraveling(false);
        return;
      }
      
      // Calculate current bus position
      const segmentIndex = Math.floor(currentProgress * (route.length - 1));
      const segmentProgress = (currentProgress * (route.length - 1)) - segmentIndex;
      const currentPos: LatLngTuple = [
        route[segmentIndex][0] + (route[segmentIndex + 1][0] - route[segmentIndex][0]) * segmentProgress,
        route[segmentIndex][1] + (route[segmentIndex + 1][1] - route[segmentIndex][1]) * segmentProgress
      ];
      
      setBusPosition(currentPos);
    }, 100);
  };

  // Handle map click
  const handleMapClick = (e: LeafletMouseEvent) => {
    if (!startPoint) {
      setStartPoint([e.latlng.lat, e.latlng.lng]);
    } else if (!endPoint) {
      setEndPoint([e.latlng.lat, e.latlng.lng]);
      generateRoute();
    }
  };

  // Search suggestions
  const handleSearch = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setSearchStart(value);
      if (value.length > 2) {
        setSuggestions(
          busStops.filter(stop => 
            stop.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        setSuggestions([]);
      }
    } else {
      setSearchEnd(value);
      if (value.length > 2) {
        setSuggestions(
          busStops.filter(stop => 
            stop.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        setSuggestions([]);
      }
    }
  };

  // Select a suggestion
  const selectSuggestion = (stop: BusStop, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartPoint(stop.position);
      setSearchStart(stop.name);
    } else {
      setEndPoint(stop.position);
      setSearchEnd(stop.name);
      if (startPoint) {
        generateRoute();
      }
    }
    setSuggestions([]);
  };

  // Reset the route
  const resetRoute = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRoute([]);
    setBusPosition(null);
    setProgress(0);
    setIsTraveling(false);
    setSearchStart('');
    setSearchEnd('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-[#4A102A] to-[#85193C] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FCF259]"
    >
      <div className="p-6 bg-[#4A102A] border-b border-[#85193C]">
        <h2 className="text-2xl font-bold text-white mb-2">Plan Your Bus Route</h2>
        <p className="text-gray-300">Set pickup and drop-off points to see your route</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Controls panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#85193C] rounded-xl p-4 border border-[#FCF259]/20">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Pickup Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchStart}
                    onChange={(e) => handleSearch('start', e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full bg-[#4A102A] text-white rounded-lg py-3 px-4 border border-[#FCF259]/30 focus:outline-none focus:ring-2 focus:ring-[#FCF259]"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#4A102A] rounded-lg shadow-lg border border-[#FCF259]/20 max-h-60 overflow-y-auto">
                      {suggestions.map((stop, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-[#C5172E] cursor-pointer"
                          onClick={() => selectSuggestion(stop, 'start')}
                        >
                          <div className="text-white">{stop.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Drop-off Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchEnd}
                    onChange={(e) => handleSearch('end', e.target.value)}
                    placeholder="Enter drop-off location"
                    className="w-full bg-[#4A102A] text-white rounded-lg py-3 px-4 border border-[#FCF259]/30 focus:outline-none focus:ring-2 focus:ring-[#FCF259]"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#4A102A] rounded-lg shadow-lg border border-[#FCF259]/20 max-h-60 overflow-y-auto">
                      {suggestions.map((stop, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-[#C5172E] cursor-pointer"
                          onClick={() => selectSuggestion(stop, 'end')}
                        >
                          <div className="text-white">{stop.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#4A102A] p-3 rounded-lg">
                  <div className="text-gray-300 text-sm">Distance</div>
                  <div className="text-white font-bold">{distance}</div>
                </div>
                <div className="bg-[#4A102A] p-3 rounded-lg">
                  <div className="text-gray-300 text-sm">Estimated Arrival</div>
                  <div className="text-white font-bold">{eta}</div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Route Progress</span>
                  <span className="text-[#FCF259] font-bold">{(progress * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#4A102A] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FCF259] transition-all duration-300"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startJourney}
                  disabled={route.length === 0 || isTraveling}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
                    route.length === 0 || isTraveling
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-[#C5172E] hover:bg-[#b01529] text-white'
                  }`}
                >
                  {isTraveling ? 'Traveling...' : 'Start Journey'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetRoute}
                  className="bg-[#4A102A] hover:bg-[#5a1c44] text-white py-3 px-4 rounded-lg border border-[#FCF259]/30 transition-colors"
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#85193C] rounded-xl p-4 border border-[#FCF259]/20">
            <h3 className="text-lg font-bold text-white mb-3">Popular Routes</h3>
            <div className="space-y-3">
              <button 
                className="w-full text-left p-3 bg-[#4A102A] hover:bg-[#C5172E] rounded-lg transition-colors"
                onClick={() => {
                  setStartPoint([24.9068, 67.0771]); // Gulshan Chowrangi
                  setEndPoint([24.8564, 67.0279]); // Empress Market
                  setSearchStart("Gulshan Chowrangi");
                  setSearchEnd("Empress Market");
                  generateRoute();
                }}
              >
                <div className="text-white">Gulshan Chowrangi → Empress Market</div>
                <div className="text-gray-400 text-sm">Route 1 - 45 min</div>
              </button>
              
              <button 
                className="w-full text-left p-3 bg-[#4A102A] hover:bg-[#C5172E] rounded-lg transition-colors"
                onClick={() => {
                  setStartPoint([24.9412, 67.0529]); // North Nazimabad
                  setEndPoint([24.8012, 67.1098]); // Korangi
                  setSearchStart("North Nazimabad");
                  setSearchEnd("Korangi");
                  generateRoute();
                }}
              >
                <div className="text-white">North Nazimabad → Korangi</div>
                <div className="text-gray-400 text-sm">Route 2 - 55 min</div>
              </button>
              
              <button 
                className="w-full text-left p-3 bg-[#4A102A] hover:bg-[#C5172E] rounded-lg transition-colors"
                onClick={() => {
                  setStartPoint([24.7984, 67.0456]); // Defence
                  setEndPoint([24.9365, 67.1100]); // Karachi University
                  setSearchStart("Defence");
                  setSearchEnd("Karachi University");
                  generateRoute();
                }}
              >
                <div className="text-white">Defence → Karachi University</div>
                <div className="text-gray-400 text-sm">Route 3 - 65 min</div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative rounded-xl overflow-hidden border-2 border-[#FCF259] h-[500px]">
            <MapContainer 
              center={karachiCenter} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              {/* Add MapClickHandler component */}
              <MapClickHandler onClick={handleMapClick} />
              
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {startPoint && (
                <Marker position={startPoint} icon={startIcon}>
                  <Popup>Pickup Location</Popup>
                </Marker>
              )}
              
              {endPoint && (
                <Marker position={endPoint} icon={endIcon}>
                  <Popup>Drop-off Location</Popup>
                </Marker>
              )}
              
              {route.length > 0 && (
                <Polyline 
                  positions={route} 
                  pathOptions={{ 
                    color: '#FCF259', 
                    weight: 4,
                    dashArray: '5, 10'
                  }}
                />
              )}
              
              {busPosition && (
                <Marker position={busPosition} icon={busIcon}>
                  <Popup>Bus Location</Popup>
                </Marker>
              )}
              
              {route.length > 0 && <RouteProgress route={route} progress={progress} />}
            </MapContainer>
            
            <div className="absolute top-4 right-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-3 text-white z-[1000]">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#C5172E] mr-2"></div>
                <span>Pickup Point</span>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-[#4A102A] mr-2"></div>
                <span>Drop-off Point</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-3 text-white z-[1000]">
              <div className="text-sm">Click on map to set locations</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}