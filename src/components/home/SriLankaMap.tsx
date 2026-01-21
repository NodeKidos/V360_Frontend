import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Sri Lanka city coordinates
export const sriLankaCities = [
  { name: "Colombo", lat: 6.9335, lng: 79.8500 },
  { name: "Gampaha", lat: 7.0917, lng: 80.0114 },
  { name: "Kalutara", lat: 6.5854, lng: 79.9607 },
  { name: "Kandy", lat: 7.2906, lng: 80.6337 },
  { name: "Matale", lat: 7.4675, lng: 80.6234 },
  { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891 },
  { name: "Galle", lat: 6.0535, lng: 80.2210 },
  { name: "Matara", lat: 5.9549, lng: 80.5550 },
  { name: "Hambantota", lat: 6.1429, lng: 81.1212 },
  { name: "Jaffna", lat: 9.6615, lng: 80.0255 },
  { name: "Kilinochchi", lat: 9.3961, lng: 80.4039 },
  { name: "Mannar", lat: 8.9810, lng: 79.9044 },
  { name: "Vavuniya", lat: 8.7542, lng: 80.4982 },
  { name: "Mullaitivu", lat: 9.2671, lng: 80.8142 },
  { name: "Batticaloa", lat: 7.7310, lng: 81.6747 },
  { name: "Ampara", lat: 7.2914, lng: 81.6747 },
  { name: "Trincomalee", lat: 8.5874, lng: 81.2152 },
  { name: "Kurunegala", lat: 7.4863, lng: 80.3623 },
  { name: "Puttalam", lat: 8.0362, lng: 79.8283 },
  { name: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
  { name: "Polonnaruwa", lat: 7.9403, lng: 81.0188 },
  { name: "Badulla", lat: 6.9934, lng: 81.0550 },
  { name: "Monaragala", lat: 6.8728, lng: 81.3507 },
  { name: "Ratnapura", lat: 6.6828, lng: 80.4009 },
  { name: "Kegalle", lat: 7.2513, lng: 80.3464 },
];

// Custom purple marker icon
const createCustomIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z"
                fill="${isSelected ? "#B749DB" : "#8B2BB9"}"
                stroke="${isSelected ? "#5B247A" : "#B749DB"}"
                stroke-width="2"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
        ${isSelected
        ? '<div style="position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; background: #22c55e; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 12px; font-weight: bold;">✓</span></div>'
        : ""
      }
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// Component to handle map bounds
function SetMapBounds() {
  const map = useMap();

  useEffect(() => {
    // Sri Lanka bounds
    const bounds: L.LatLngBoundsExpression = [
      [5.9, 79.5], // Southwest
      [9.9, 82.0], // Northeast
    ];
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map]);

  return null;
}

// Map Click Handler
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface Destination {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  coordinates?: { lat: number; lng: number };
}

interface SriLankaMapProps {
  selectedCities: string[];
  onCityClick: (cityName: string) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  destinations?: Destination[];
  currentLocation?: { lat: number; lng: number };
}

export default function SriLankaMap({
  selectedCities,
  onCityClick,
  onLocationSelect,
  destinations = [],
  currentLocation,
}: SriLankaMapProps) {
  const [mapKey, setMapKey] = useState(0);

  // Force a small delay on map mount to fix Leaflet's grey tile/layout issue
  useEffect(() => {
    const timer = setTimeout(() => setMapKey(1), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show both hardcoded cities and database destinations for better reference
  // Filter out destinations without valid coordinates
  // Show both hardcoded cities and database destinations for better reference
  const citiesToDisplay = [
    ...sriLankaCities,
    ...(destinations.length > 0
      ? destinations.filter(d => d.latitude || d.longitude || d.coordinates).map(d => ({
        name: d.name,
        lat: d.latitude || d.coordinates?.lat || 0,
        lng: d.longitude || d.coordinates?.lng || 0
      }))
      : [])
  ];

  // Filter out duplicates based on very close coordinates
  const uniqueCities = citiesToDisplay.filter((city, index, self) =>
    index === self.findIndex((c) => (
      Math.abs(c.lat - city.lat) < 0.001 && Math.abs(c.lng - city.lng) < 0.001
    ))
  );

  // Check if current selection is one of the displayed cities/points
  const isCustomLocation = !!(currentLocation && !uniqueCities.some(c =>
    Math.abs(c.lat - currentLocation.lat) < 0.001 &&
    Math.abs(c.lng - currentLocation.lng) < 0.001
  ));

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-[#E5D4EF] shadow-lg">
      <MapContainer
        key={mapKey} // Use mapKey to force remount on initial load
        center={[7.8731, 80.7718]} // Center of Sri Lanka
        zoom={8}
        className="w-full h-full"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetMapBounds />

        {uniqueCities.map((city) => {
          const isSelected = !!(selectedCities.includes(city.name) || (
            currentLocation &&
            Math.abs(city.lat - currentLocation.lat) < 0.0001 &&
            Math.abs(city.lng - currentLocation.lng) < 0.0001
          ));
          return (
            <Marker
              key={`${city.name}-${city.lat}-${city.lng}`}
              position={[city.lat, city.lng]}
              icon={createCustomIcon(isSelected)}
              eventHandlers={{
                click: () => onCityClick(city.name),
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-[#5B247A] text-[16px]">
                    {city.name}
                  </p>
                  <button
                    onClick={() => onCityClick(city.name)}
                    className={`mt-2 px-4 py-1 rounded-md text-white text-sm font-semibold ${isSelected
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#B749DB] hover:bg-[#8B2BB9]"
                      }`}
                  >
                    {isSelected ? "Deselect" : "Select"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {isCustomLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={createCustomIcon(true)}
          >
            <Popup>
              <div className="text-center p-2">
                <p className="font-bold text-[#B749DB]">Pinned Location</p>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {currentLocation.lat.toFixed(4)}<br />
                  Lng: {currentLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {onLocationSelect && <MapClickHandler onMapClick={onLocationSelect} />}
      </MapContainer>
    </div>
  );
}
