// src/components/WeatherPanel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WeatherPanel({ jobs }) {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    jobs.forEach(job => {
      const coords = job.location.coordinates;
      axios.get(`/api/weather?lat=${coords[1]}&lon=${coords[0]}`)
        .then(res => setWeather(prev => ({ ...prev, [job._id]: res.data })))
        .catch(err => console.error(err));
    });
  }, [jobs]);

  return (
    <div className="space-y-2">
      {jobs.map(job => (
        <div key={job._id} className="p-2 border rounded">
          <h3 className="font-bold">{job.title}</h3>
          <p>{job.category}</p>
          {weather[job._id] ? (
            <p>Temp: {weather[job._id].temp}°C, {weather[job._id].description}</p>
          ) : <p>Loading weather...</p>}
        </div>
      ))}
    </div>
  );
}
