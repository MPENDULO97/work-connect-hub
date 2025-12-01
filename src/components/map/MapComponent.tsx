import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || !mapRef.current) return;

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (mapRef.current && window.google) {
          new window.google.maps.Map(mapRef.current, {
            center: { lat: -26.2041, lng: 28.0473 }, // Johannesburg coordinates
            zoom: 12,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#242f3e' }],
              },
              {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#242f3e' }],
              },
            ],
          });
        }
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    initMap();
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Warning:</strong> Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.
        </div>
      )}
    </div>
  );
};

export default MapComponent;
