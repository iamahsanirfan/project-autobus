'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const karachiCenter = [24.8607, 67.0011];

export default function LiveLeafletMap() {
  const [busLocations, setBusLocations] = useState([]);
  const [map, setMap] = useState(null);

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
      for (let i = 0; i < 15; i++) {
        const route = Math.floor(Math.random() * 3) + 1;
        locations.push({
          id: i,
          position: [
            karachiCenter[0] + (Math.random() * 0.1 - 0.05),
            karachiCenter[1] + (Math.random() * 0.1 - 0.05)
          ],
          route: `Route ${route}`,
          busNumber: `KBT-${100 + i}`,
          nextStop: ["NIPA Chowrangi", "Saddar", "Gulshan"][Math.floor(Math.random() * 3)],
          eta: Math.floor(Math.random() * 15) + 1,
          color: route === 1 ? "#C5172E" : route === 2 ? "#FCF259" : "#4A102A"
        });
      }
      setBusLocations(locations);
    };

    generateBusLocations();
    const interval = setInterval(generateBusLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fit map to markers when data changes
  useEffect(() => {
    if (map && busLocations.length > 0) {
      const bounds = L.latLngBounds(busLocations.map(bus => bus.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [busLocations, map]);

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-[#FCF259] shadow-xl">
      <MapContainer 
        center={karachiCenter} 
        zoom={12} 
        style={{ height: "500px", width: "100%" }}
        whenCreated={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {busLocations.map((bus) => (
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
  );
}