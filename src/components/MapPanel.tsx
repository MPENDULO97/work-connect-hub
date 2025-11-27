import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapPanelProps {
  jobs: any[];
  center?: [number, number]; // [lng, lat]
  onJobClick?: (job: any) => void;
}

export default function MapPanel({ jobs, center, onJobClick }: MapPanelProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center || [28.0473, -26.2041], // Default: Johannesburg
      zoom: 11
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [center]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add markers for jobs with location
    jobs.forEach((job) => {
      if (job.location?.coordinates) {
        const [lng, lat] = job.location.coordinates;

        const el = document.createElement('div');
        el.className = 'job-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#3b82f6';
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${job.title}</h3>
                <p style="font-size: 12px; color: #666;">${job.category}</p>
                <p style="font-weight: bold; color: #3b82f6; margin-top: 4px;">R ${job.price}</p>
              </div>`
            )
          )
          .addTo(map.current!);

        el.addEventListener('click', () => {
          onJobClick?.(job);
        });
      }
    });
  }, [jobs, mapLoaded, onJobClick]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Job Locations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="w-full h-[400px] lg:h-[600px]" />
      </CardContent>
    </Card>
  );
}
