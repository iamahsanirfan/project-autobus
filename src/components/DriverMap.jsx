'use client';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

export default function DriverMap({ busId }) {
  const [position, setPosition] = useState([24.8607, 67.0011]);
  const [map, setMap] = useState(null);

  // Custom bus icon
  const busIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23C5172E"><path d="M18 11H6V6h12v5zM16.5 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"/></svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Get current location
  useEffect(() => {
    if (!map) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        map.setView([latitude, longitude]);
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return (
    <div className="w-full">
      <div className="relative rounded-xl overflow-hidden border-2 border-[#FCF259] shadow-lg">
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: "400px", width: "100%" }}
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={busIcon} />
        </MapContainer>
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-lg z-[1000]">
          <h3 className="font-bold text-[#4A102A]">Bus ID: {busId}</h3>
          <p className="text-sm">
            Position: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-[#4A102A] p-4 rounded-xl border border-[#FCF259]/20">
          <div className="text-gray-300 text-sm">Speed</div>
          <div className="text-white font-bold text-xl">42 km/h</div>
        </div>
        <div className="bg-[#4A102A] p-4 rounded-xl border border-[#FCF259]/20">
          <div className="text-gray-300 text-sm">Next Stop</div>
          <div className="text-white font-bold text-xl">Karachi University</div>
          <div className="text-[#FCF259] text-sm">ETA: 8 minutes</div>
        </div>
      </div>
    </div>
  );
}