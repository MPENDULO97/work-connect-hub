// src/components/JobsList.jsx
import React from 'react';

export default function JobsList({ jobs }) {
  return (
    <div className="space-y-2">
      {jobs.map(job => (
        <div key={job._id} className="p-2 border rounded shadow-sm">
          <h3 className="font-bold">{job.title}</h3>
          <p>{job.category} | {job.price} {job.currency}</p>
          <p>{job.locationName}</p>
        </div>
      ))}
    </div>
  );
}
