import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
  name: string;
  type: 'destination' | 'hotel' | 'excursion';
  description?: string;
  address?: string;
  status?: 'completed' | 'current' | 'upcoming'; // New: track completion status
}

interface ItineraryMapProps {
  locations: Location[];
  height?: string;
  className?: string;
}

const ItineraryMap: React.FC<ItineraryMapProps> = ({
  locations,
  height = '500px',
  className = ''
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || locations.length === 0) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers (markers and polylines)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Custom marker colors based on status and type
    const getMarkerIcon = (location: Location) => {
      // Status-based colors override type colors
      let color: string;
      let emoji: string;

      if (location.status === 'completed') {
        color = '#10B981'; // Green - completed
        emoji = '✓';
      } else if (location.status === 'current') {
        color = '#3B82F6'; // Blue - current location
        emoji = '📍';
      } else {
        color = '#9CA3AF'; // Gray - upcoming
        emoji = location.type === 'destination' ? '📍' : location.type === 'hotel' ? '🏨' : '🎯';
      }

      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 16px;
              font-weight: bold;
            ">
              ${emoji}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    };

    // Add markers for each location
    const markers: L.Marker[] = [];
    const routeCoordinates: L.LatLngExpression[] = [];

    locations.forEach((location, _index) => {
      const latLng: L.LatLngExpression = [location.lat, location.lng];
      routeCoordinates.push(latLng);

      const marker = L.marker(latLng, { icon: getMarkerIcon(location.type as any) })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Poppins', sans-serif; padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 16px; font-weight: 600;">
              ${location.name}
            </h3>
            ${location.description ? `
              <p style="margin: 4px 0; color: #6B7280; font-size: 14px;">
                ${location.description}
              </p>
            ` : ''}
            ${location.address ? `
              <p style="margin: 4px 0; color: #9CA3AF; font-size: 12px;">
                📍 ${location.address}
              </p>
            ` : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
              <span style="
                display: inline-block;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                background-color: ${location.type === 'destination' ? '#D1FAE5' : location.type === 'hotel' ? '#DBEAFE' : '#FEF3C7'};
                color: ${location.type === 'destination' ? '#065F46' : location.type === 'hotel' ? '#1E40AF' : '#92400E'};
              ">
                ${location.type.charAt(0).toUpperCase() + location.type.slice(1)}
              </span>
            </div>
          </div>
        `);

      markers.push(marker);
    });

    //Draw route polyline connecting destinations
    if (routeCoordinates.length > 1) {
      L.polyline(routeCoordinates, {
        color: '#B749DB',
        weight: 3,
        opacity: 0.7,
        smoothFactor: 1,
        dashArray: '10, 10',
      }).addTo(map);
    }

    // Fit map bounds to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden' }}
      className={`shadow-lg ${className}`}
    />
  );
};

export default ItineraryMap;
