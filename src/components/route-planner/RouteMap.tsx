// components/route-planner/RouteMap.tsx
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
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default marker icons
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

const karachiCenter: LatLngTuple = [24.8607, 67.0011];

// Custom icons
const createCustomIcon = (color: string) => new L.Icon({
  iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${encodeURIComponent(color)}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const startIcon = createCustomIcon('#C5172E');
const endIcon = createCustomIcon('#4A102A');
const busIcon = new L.Icon({
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
    if (route?.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  
  return null;
}

interface BusStop {
  name: string;
  position: LatLngTuple;
}

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || '5b3ce3597851110001cf6248b61e38e8146e4ca4a10e8435948f8974';
const ORS_ENDPOINT = 'https://api.openrouteservice.org/v2/directions/driving-car';

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

export default function RouteMap() {
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
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const animationRef = useRef<number | null>(null);

  // Generate route with error handling
  const generateRoute = useCallback(async () => {
    if (!startPoint || !endPoint) return;
    
    // Check if points are too close
    const distance = L.latLng(startPoint).distanceTo(L.latLng(endPoint));
    if (distance < 100) {
      setRoutingError("Locations are too close (must be >100m apart)");
      return;
    }

    setIsRouting(true);
    setRoutingError(null);
    
    try {
      const response = await fetch(ORS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ORS_API_KEY
        },
        body: JSON.stringify({
          coordinates: [
            [startPoint[1], startPoint[0]], // [lng, lat]
            [endPoint[1], endPoint[0]]  // [lng, lat]
          ],
          instructions: false,
          geometry: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Routing failed. Please try different locations.');
      }

      const data = await response.json();
      
      if (!data?.features?.[0]?.geometry?.coordinates) {
        throw new Error('Invalid route data structure from API');
      }

      const routeCoords = data.features[0].geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple
      );

      setRoute(routeCoords);

      // Calculate distance and ETA
      if (data.features[0].properties?.summary) {
        const summary = data.features[0].properties.summary;
        const distKm = summary.distance / 1000;
        setDistance(`${distKm.toFixed(1)} km`);

        const durationSec = summary.duration;
        const etaTime = new Date(Date.now() + durationSec * 1000);
        setEta(etaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error: any) {
      console.error('Routing error:', error);
      setRoutingError(error.message || 'Failed to generate route. Please try again.');
      setRoute([]);
    } finally {
      setIsRouting(false);
    }
  }, [startPoint, endPoint]);

  // Start the bus animation
  const startJourney = useCallback(() => {
    if (!route || route.length === 0) {
      setRoutingError('No route available to start journey');
      return;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsTraveling(true);
    setBusPosition(route[0]);
    setProgress(0);
    
    const totalPoints = route.length;
    const duration = 30000; // 30 seconds for full journey
    const startTime = performance.now();
    
    const animateBus = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProgress(progress);
      
      const currentIndex = Math.min(
        Math.floor(progress * totalPoints), 
        totalPoints - 1
      );
      
      if (route[currentIndex]) {
        setBusPosition(route[currentIndex]);
      }
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateBus);
      } else {
        setIsTraveling(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animateBus);
  }, [route]);

  // Handle map clicks
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    const position: LatLngTuple = [e.latlng.lat, e.latlng.lng];
    
    if (!startPoint) {
      setStartPoint(position);
      setSearchStart(`Custom Point (${position[0].toFixed(4)}, ${position[1].toFixed(4)})`);
    } else if (!endPoint) {
      setEndPoint(position);
      setSearchEnd(`Custom Point (${position[0].toFixed(4)}, ${position[1].toFixed(4)})`);
    }
  }, [startPoint, endPoint]);

  // Generate route when both points are set
  useEffect(() => {
    if (startPoint && endPoint) {
      generateRoute();
    }
  }, [startPoint, endPoint, generateRoute]);

  // Search suggestions with debounce
  const handleSearch = useCallback((type: 'start' | 'end', value: string) => {
    if (type === 'start') setSearchStart(value);
    else setSearchEnd(value);
    
    if (value.length > 2) {
      const filtered = busStops.filter(stop => 
        stop.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, []);

  // Select a bus stop from suggestions
  const selectSuggestion = useCallback((stop: BusStop, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartPoint(stop.position);
      setSearchStart(stop.name);
    } else {
      setEndPoint(stop.position);
      setSearchEnd(stop.name);
    }
    setSuggestions([]);
    setSelectedStop(stop);
    
    if (mapRef.current) {
      mapRef.current.flyTo(stop.position, 15);
    }
  }, []);

  // Reset everything
  const resetRoute = useCallback(() => {
    setStartPoint(null);
    setEndPoint(null);
    setRoute([]);
    setBusPosition(null);
    setProgress(0);
    setIsTraveling(false);
    setSearchStart('');
    setSearchEnd('');
    setSelectedStop(null);
    setRoutingError(null);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

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
        <h2 className="text-2xl font-bold text-white mb-2">Bus Route Planner</h2>
        <p className="text-gray-300">Select pickup and drop-off points to see your route</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Controls panel */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="bg-[#85193C] rounded-xl p-4 border border-[#FCF259]/20">
            <div className="space-y-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-gray-300 mb-2">Pickup Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchStart}
                    onChange={(e) => handleSearch('start', e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full bg-[#4A102A] text-white rounded-lg py-3 px-4 border border-[#FCF259]/30 focus:outline-none focus:ring-2 focus:ring-[#FCF259]"
                    disabled={isRouting || isTraveling}
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
              
              {/* Drop-off Location */}
              <div>
                <label className="block text-gray-300 mb-2">Drop-off Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchEnd}
                    onChange={(e) => handleSearch('end', e.target.value)}
                    placeholder="Enter drop-off location"
                    className="w-full bg-[#4A102A] text-white rounded-lg py-3 px-4 border border-[#FCF259]/30 focus:outline-none focus:ring-2 focus:ring-[#FCF259]"
                    disabled={isRouting || isTraveling}
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
              
              {/* Distance and ETA */}
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
              
              {/* Progress Bar */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Route Progress</span>
                  <span className="text-[#FCF259] font-bold">{(progress * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-[#4A102A] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FCF259] to-[#C5172E] transition-all duration-300"
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Status Indicators */}
              {isRouting && (
                <div className="flex items-center justify-center py-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FCF259]"></div>
                  <span className="ml-2 text-white">Generating route...</span>
                </div>
              )}
              
              {routingError && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-center">
                  <p className="text-red-200">{routingError}</p>
                  <button 
                    className="mt-2 text-[#FCF259] underline"
                    onClick={resetRoute}
                  >
                    Reset and try again
                  </button>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startJourney}
                  disabled={route.length === 0 || isTraveling || isRouting}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold transition-colors ${
                    route.length === 0 || isTraveling || isRouting
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-[#C5172E] hover:bg-[#b01529] text-white'
                  }`}
                >
                  {isTraveling ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                      Traveling...
                    </div>
                  ) : 'Start Journey'}
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
          
          {/* Popular Bus Stops */}
          <div className="bg-[#85193C] rounded-xl p-4 border border-[#FCF259]/20">
            <h3 className="text-lg font-bold text-white mb-3">Popular Bus Stops</h3>
            <div className="space-y-3">
              {busStops.slice(0, 5).map((stop, index) => (
                <button 
                  key={index}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedStop?.name === stop.name 
                      ? 'bg-[#C5172E]' 
                      : 'bg-[#4A102A] hover:bg-[#C5172E]'
                  }`}
                  onClick={() => {
                    setSelectedStop(stop);
                    if (mapRef.current) {
                      mapRef.current.flyTo(stop.position, 15);
                    }
                  }}
                  disabled={isRouting || isTraveling}
                >
                  <div className="text-white">{stop.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div className="w-full lg:w-2/3">
          <div className="relative rounded-xl overflow-hidden border-2 border-[#FCF259] h-[70vh]">
            <MapContainer 
              center={karachiCenter} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
              ref={mapRef as React.RefObject<L.Map>}
              whenCreated={(map) => {
                mapRef.current = map;
                map.on('click', handleMapClick);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Bus Stops */}
              {busStops.map((stop, index) => (
                <Marker 
                  key={index} 
                  position={stop.position}
                  eventHandlers={{
                    click: () => setSelectedStop(stop)
                  }}
                >
                  <Popup>
                    <div className="font-bold">{stop.name}</div>
                    <div className="flex space-x-2 mt-2">
                      <button 
                        className="bg-[#C5172E] text-white px-2 py-1 rounded text-sm"
                        onClick={() => {
                          setStartPoint(stop.position);
                          setSearchStart(stop.name);
                        }}
                      >
                        Set Pickup
                      </button>
                      <button 
                        className="bg-[#4A102A] text-white px-2 py-1 rounded text-sm border border-[#FCF259]/30"
                        onClick={() => {
                          setEndPoint(stop.position);
                          setSearchEnd(stop.name);
                        }}
                      >
                        Set Dropoff
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Start/End Points */}
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
              
              {/* Route */}
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
              
              {/* Bus */}
              {busPosition && (
                <Marker position={busPosition} icon={busIcon}>
                  <Popup>Bus Location</Popup>
                </Marker>
              )}
              
              {route.length > 0 && <RouteProgress route={route} progress={progress} />}
            </MapContainer>
            
            {/* Map Legend */}
            <div className="absolute top-4 right-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-3 text-white z-[1000]">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#C5172E] mr-2"></div>
                <span>Pickup Point</span>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-[#4A102A] mr-2"></div>
                <span>Drop-off Point</span>
              </div>
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-[#FCF259] mr-2"></div>
                <span>Bus Location</span>
              </div>
            </div>
            
            {/* Map Instructions */}
            <div className="absolute bottom-4 left-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-3 text-white z-[1000]">
              <div className="text-sm">Click on map to set locations</div>
            </div>
            
            {/* Selected Stop Controls */}
            {selectedStop && (
              <div className="absolute top-4 left-4 bg-[#4A102A]/90 backdrop-blur-sm rounded-lg p-4 text-white z-[1000] max-w-xs">
                <h3 className="font-bold text-lg mb-2">{selectedStop.name}</h3>
                <div className="flex space-x-3">
                  <button 
                    className="bg-[#C5172E] hover:bg-[#b01529] text-white py-2 px-3 rounded text-sm"
                    onClick={() => {
                      setStartPoint(selectedStop.position);
                      setSearchStart(selectedStop.name);
                      setSelectedStop(null);
                    }}
                  >
                    Set as Pickup
                  </button>
                  <button 
                    className="bg-[#4A102A] hover:bg-[#5a1c44] text-white py-2 px-3 rounded text-sm border border-[#FCF259]/30"
                    onClick={() => {
                      setEndPoint(selectedStop.position);
                      setSearchEnd(selectedStop.name);
                      setSelectedStop(null);
                    }}
                  >
                    Set as Drop-off
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}