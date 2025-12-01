import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  location: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  locationName?: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface JobsMapPanelProps {
  jobs: Job[];
  userLocation: UserLocation;
}

interface RouteData {
  coordinates: [number, number][]; // [lng, lat]
  distance: number;
  duration: number;
}

export default function JobsMapPanel({ jobs, userLocation }: JobsMapPanelProps) {
  const [routes, setRoutes] = useState<Record<string, RouteData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userLocation || jobs.length === 0) return;

    const fetchRoutes = async () => {
      setLoading(true);
      const apiKey = import.meta.env.VITE_ORS_API_KEY;

      if (!apiKey) {
        console.warn("OpenRouteService API key not found");
        setLoading(false);
        return;
      }

      for (const job of jobs) {
        try {
          const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car",
            {
              coordinates: [
                [userLocation.lng, userLocation.lat],
                [job.location.coordinates[0], job.location.coordinates[1]],
              ],
            },
            {
              headers: {
                Authorization: apiKey,
                "Content-Type": "application/json",
              },
            }
          );

          const feature = response.data.features[0];
          setRoutes((prev) => ({
            ...prev,
            [job._id]: {
              coordinates: feature.geometry.coordinates,
              distance: feature.properties.segments[0].distance,
              duration: feature.properties.segments[0].duration,
            },
          }));
        } catch (error) {
          console.error(`Failed to fetch route for job ${job._id}:`, error);
        }
      }
      setLoading(false);
    };

    fetchRoutes();
  }, [jobs, userLocation]);

  const formatDistance = (meters: number) => {
    return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return minutes < 60 ? `${minutes}min` : `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <div className="font-semibold">Your Location</div>
          </Popup>
        </Marker>

        {/* Job markers and routes */}
        {jobs.map((job) => {
          const coords = job.location.coordinates;
          const route = routes[job._id];
          const polyline = route?.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]) || [];

          return (
            <div key={job._id}>
              <Marker position={[coords[1], coords[0]]}>
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.category}</p>
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Budget:</span> R{job.budgetMin} - R{job.budgetMax}
                    </p>
                    {job.locationName && (
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Location:</span> {job.locationName}
                      </p>
                    )}
                    {route && (
                      <div className="text-sm border-t pt-2 mt-2">
                        <p>
                          <span className="font-semibold">Distance:</span> {formatDistance(route.distance)}
                        </p>
                        <p>
                          <span className="font-semibold">ETA:</span> {formatDuration(route.duration)}
                        </p>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
              {polyline.length > 0 && <Polyline positions={polyline} color="#3b82f6" weight={3} opacity={0.7} />}
            </div>
          );
        })}
      </MapContainer>

      {loading && (
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm">Loading routes...</p>
        </div>
      )}
    </div>
  );
}
