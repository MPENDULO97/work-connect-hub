// src/components/DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import JobsList from './JobsList';
import MapPanel from './MapPanel';
import WeatherPanel from './WeatherPanel';
import axios from 'axios';

export default function DashboardLayout() {
  const [jobs, setJobs] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(pos => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    // Fetch jobs
    axios.get('/api/jobs/nearby?lat=-29.8587&lng=31.0218') // example default
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!userLocation) return <p>Loading location...</p>;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      <aside className="lg:col-span-1">
        <JobsList jobs={jobs} />
      </aside>
      <main className="lg:col-span-2">
        <MapPanel jobs={jobs} userLocation={userLocation} />
      </main>
      <aside className="lg:col-span-1">
        <WeatherPanel jobs={jobs} />
      </aside>
    </div>
  );
}
