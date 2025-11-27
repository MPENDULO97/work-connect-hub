// src/components/MapPanel.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapPanel({ jobs, userLocation }) {
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    if (!userLocation) return;

    jobs.forEach(job => {
      axios.post('https://api.openrouteservice.org/v2/directions/driving-car', {
        coordinates: [
          [userLocation.lng, userLocation.lat],
          [job.location.coordinates[0], job.location.coordinates[1]]
        ]
      }, {
        headers: { Authorization: import.meta.env.VITE_ORS_API_KEY, 'Content-Type': 'application/json' }
      }).then(res => {
        setRoutes(prev => ({ ...prev, [job._id]: res.data.features[0].geometry.coordinates }));
      }).catch(err => console.error(err));
    });
  }, [jobs, userLocation]);

  return (
    <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>Your Location</Popup>
      </Marker>
      {jobs.map(job => {
        const coords = job.location.coordinates;
        const polyline = routes[job._id]?.map(([lng, lat]) => [lat, lng]) || [];
        return (
          <React.Fragment key={job._id}>
            <Marker position={[coords[1], coords[0]]}>
              <Popup>
                <div>
                  <strong>{job.title}</strong><br/>
                  {job.category}<br/>
                  Price: {job.price} {job.currency}<br/>
                  Distance/ETA: {polyline.length > 0 ? `${polyline.length} points` : 'Loading...'}
                </div>
              </Popup>
            </Marker>
            {polyline.length > 0 && <Polyline positions={polyline} color="blue" />}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
