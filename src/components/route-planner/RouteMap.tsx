'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polyline, 
  useMap, 
  Popup,
} from 'react-leaflet';
import L, { LatLngTuple, Icon } from 'leaflet';
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

// Custom icons
const createCustomIcon = (color: string): Icon => new Icon({
  iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const busIcon: Icon = new Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FCF259"><path d="M18 11H6V6h12v5zM16.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/></svg>',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// OpenRouteService API configuration
const ORS_API_KEY = "5b3ce3597851110001cf6248b61e38e8146e4ca4a10e8435948f8974";
const ORS_ENDPOINT = "https://api.openrouteservice.org/v2/directions/driving-car";

// Fixed bus stops for "Route Todos los dias"
const BUS_STOPS = [
  { name: "Karachi South", position: [24.854555, 67.010805] as LatLngTuple },
  { name: "Kutchery Road", position: [24.8550, 67.0120] as LatLngTuple },
  { name: "Strachan Road", position: [24.8560, 67.0130] as LatLngTuple },
  { name: "M.R Kyani Road", position: [24.8570, 67.0125] as LatLngTuple },
  { name: "Dr Ziauddin Ahmed Road", position: [24.8565, 67.0110] as LatLngTuple },
  { name: "Kutchery", position: [24.8555, 67.0100] as LatLngTuple },
  { name: "Karachi South", position: [24.854555, 67.010805] as LatLngTuple } // Return to start
];

interface RouteProgressProps {
  route: LatLngTuple[];
}

function FitBounds({ route }: RouteProgressProps) {
  const map = useMap();
  
  useEffect(() => {
    if (route?.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  
  return null;
}

export default function AdminRouteMap() {
  const [busPosition, setBusPosition] = useState<LatLngTuple>(BUS_STOPS[0].position);
  const [progress, setProgress] = useState(0);
  const [isTraveling, setIsTraveling] = useState(false);
  const [eta, setEta] = useState('--:--');
  const [distance, setDistance] = useState('0 km');
  const [busStatus, setBusStatus] = useState<'offline' | 'online'>('offline');
  const [currentStop, setCurrentStop] = useState(BUS_STOPS[0].name);
  const [routePath, setRoutePath] = useState<LatLngTuple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [routeError, setRouteError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState('Todos los dias');

  // Fetch the route from OpenRouteService
  const fetchRoute = useCallback(async () => {
    setIsLoading(true);
    setRouteError(null);
    
    try {
      // Prepare coordinates for API request
      const coordinates = BUS_STOPS.map(stop => [stop.position[1], stop.position[0]]);
      
      const response = await fetch(ORS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ORS_API_KEY
        },
        body: JSON.stringify({
          coordinates,
          instructions: false,
          geometry: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Routing failed. Please try again later.');
      }

      const data = await response.json();
      
      if (!data?.features?.[0]?.geometry?.coordinates) {
        throw new Error('Invalid route data structure from API');
      }

      // Convert coordinates to [lat, lng] format
      const routeCoords = data.features[0].geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple
      );

      setRoutePath(routeCoords);

      // Calculate distance
      if (data.features[0].properties?.summary) {
        const summary = data.features[0].properties.summary;
        const distKm = summary.distance / 1000;
        setDistance(`${distKm.toFixed(1)} km`);
      }
    } catch (error: any) {
      console.error('Routing error:', error);
      setRouteError(error.message || 'Failed to generate route. Using fallback path.');
      // Fallback to straight line path
      const fallbackPath = BUS_STOPS.map(stop => stop.position);
      setRoutePath(fallbackPath);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start the bus journey
  const startJourney = useCallback(() => {
    if (!routePath || routePath.length === 0) {
      setRouteError('No route available to start journey');
      return;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsTraveling(true);
    setBusStatus('online');
    setBusPosition(routePath[0]);
    setProgress(0);
    setCurrentStop(BUS_STOPS[0].name);
    
    const totalPoints = routePath.length;
    const duration = 60000; // 1 minute for full journey
    const startTime = performance.now();
    
    const animateBus = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProgress(progress);
      
      const currentIndex = Math.min(
        Math.floor(progress * totalPoints), 
        totalPoints - 1
      );
      
      if (routePath[currentIndex]) {
        setBusPosition(routePath[currentIndex]);
        
        // Update current stop based on position
        const closestStopIndex = Math.floor(progress * BUS_STOPS.length);
        if (closestStopIndex < BUS_STOPS.length) {
          setCurrentStop(BUS_STOPS[closestStopIndex].name);
        }
      }
      
      // Calculate ETA
      if (progress < 1) {
        const remaining = (1 - progress) * (duration / 1000);
        const etaDate = new Date(Date.now() + remaining * 1000);
        setEta(etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        animationRef.current = requestAnimationFrame(animateBus);
      } else {
        setIsTraveling(false);
        setBusStatus('offline');
        setEta('Arrived');
      }
    };
    
    animationRef.current = requestAnimationFrame(animateBus);
  }, [routePath]);

  // Stop the journey
  const stopJourney = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsTraveling(false);
    setBusStatus('offline');
  }, []);

  // Reset the journey
  const resetRoute = useCallback(() => {
    stopJourney();
    setBusPosition(BUS_STOPS[0].position);
    setProgress(0);
    setEta('--:--');
    setCurrentStop(BUS_STOPS[0].name);
  }, [stopJourney]);

  // Fetch route on component mount
  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-[#4A102A] to-[#85193C] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FCF259]"
    >
      <div className="p-6 bg-[#4A102A] border-b border-[#85193C]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Bus Management System</h2>
            <p className="text-gray-300">Admin panel for Route Todos los dias</p>
          </div>
          <div className="mt-3 md:mt-0 bg-[#C5172E] text-white px-4 py-2 rounded-lg flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${busStatus === 'online' ? 'bg-green-400' : 'bg-gray-300'}`}></div>
            <span>Bus Status: {busStatus === 'online' ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Controls panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-[#85193C] rounded-xl p-5 border border-[#FCF259]/20 shadow-lg">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Route Controls</h3>
                
                {/* Route Selection */}
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Select Bus Route</label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full bg-[#4A102A] text-white rounded-lg py-3 px-4 border border-[#FCF259]/30 focus:outline-none focus:ring-2 focus:ring-[#FCF259]"
                  >
                    <option value="Todos los dias">Route Todos los dias</option>
                    <option value="Route 2" disabled>Route 2 (Coming Soon)</option>
                    <option value="Route 3" disabled>Route 3 (Coming Soon)</option>
                  </select>
                </div>
                
                {/* Current Stop */}
                <div className="bg-[#4A102A] p-4 rounded-lg mb-4">
                  <div className="text-gray-300 text-sm">Current Stop</div>
                  <div className="text-white font-bold text-xl mt-1">{currentStop}</div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#4A102A] p-4 rounded-lg">
                    <div className="text-gray-300 text-sm">Total Distance</div>
                    <div className="text-white font-bold text-lg">{distance}</div>
                  </div>
                  <div className="bg-[#4A102A] p-4 rounded-lg">
                    <div className="text-gray-300 text-sm">Estimated Arrival</div>
                    <div className="text-white font-bold text-lg">{eta}</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Route Progress</span>
                    <span className="text-[#FCF259] font-bold">{(progress * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[#4A102A] h-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FCF259] to-[#C5172E] transition-all duration-300"
                      style={{ width: `${progress * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Loading and Error States */}
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FCF259]"></div>
                  <span className="ml-3 text-white">Loading route data...</span>
                </div>
              )}
              
              {routeError && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-center">
                  <p className="text-red-200">{routeError}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-3">
                {!isTraveling ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startJourney}
                    disabled={isLoading || routePath.length === 0}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
                      isLoading || routePath.length === 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Start Journey
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopJourney}
                    className="flex-1 py-3 px-4 rounded-lg font-bold transition-colors bg-red-600 hover:bg-red-700 text-white"
                  >
                    Stop Journey
                  </motion.button>
                )}
                
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
          
          {/* Bus Stops List */}
          <div className="bg-[#85193C] rounded-xl p-5 border border-[#FCF259]/20 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Route Stops</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {BUS_STOPS.map((stop, index) => (
                <div 
                  key={index}
                  className={`w-full p-4 rounded-lg transition-all ${
                    stop.name === currentStop 
                      ? 'bg-[#C5172E] border border-[#FCF259]' 
                      : 'bg-[#4A102A] hover:bg-[#5a1c44]'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#85193C] flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{stop.name}</div>
                      <div className="text-gray-300 text-sm mt-1">
                        {stop.position[0].toFixed(6)}, {stop.position[1].toFixed(6)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="w-full lg:w-2/3">
          <div className="relative rounded-xl overflow-hidden border-2 border-[#FCF259] h-[70vh]">
            <MapContainer 
              center={BUS_STOPS[0].position} 
              zoom={16} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Route Path */}
              {routePath.length > 0 && (
                <Polyline 
                  positions={routePath} 
                  pathOptions={{ 
                    color: '#FCF259', 
                    weight: 6,
                    dashArray: '10, 10'
                  }}
                />
              )}
              
              {/* Bus Stops */}
              {BUS_STOPS.map((stop, index) => (
                <Marker 
                  key={index} 
                  position={stop.position}
                  icon={createCustomIcon('#FFFFFF')}
                >
                  <Popup>
                    <div className="font-bold">{stop.name}</div>
                    <div className="text-sm">Stop #{index + 1}</div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Bus Marker */}
              <Marker position={busPosition} icon={busIcon}>
                <Popup>
                  <div className="font-bold">Route Todos los dias</div>
                  <div>Status: {busStatus === 'online' ? 'Moving' : 'Stopped'}</div>
                  <div>Current Stop: {currentStop}</div>
                </Popup>
              </Marker>
              
              {routePath.length > 0 && <FitBounds route={routePath} />}
            </MapContainer>
            
            {/* Map Overlays */}
            <div className="absolute top-4 right-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-3 text-white z-[1000] shadow-lg">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 rounded-full bg-[#FCF259] mr-2"></div>
                <span>Bus Location</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
                <span>Bus Stop</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-3 text-white z-[1000] shadow-lg">
              <div className="text-sm font-bold">Route: Todos los dias</div>
              <div className="text-xs">{BUS_STOPS[0].name} to {BUS_STOPS[BUS_STOPS.length - 1].name}</div>
            </div>
            
            {/* Route Info Card */}
            <div className="absolute top-4 left-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-4 text-white z-[1000] shadow-lg max-w-xs">
              <h3 className="font-bold text-lg mb-2">Route Information</h3>
              <ul className="text-sm space-y-1">
                <li className="flex">
                  <span className="text-[#FCF259] w-24">Bus Name:</span>
                  <span>Route Todos los dias</span>
                </li>
                <li className="flex">
                  <span className="text-[#FCF259] w-24">Total Stops:</span>
                  <span>{BUS_STOPS.length}</span>
                </li>
                <li className="flex">
                  <span className="text-[#FCF259] w-24">Distance:</span>
                  <span>{distance}</span>
                </li>
                <li className="flex">
                  <span className="text-[#FCF259] w-24">Status:</span>
                  <span className={busStatus === 'online' ? 'text-green-400' : 'text-red-400'}>
                    {busStatus === 'online' ? 'In Transit' : 'At Terminal'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}