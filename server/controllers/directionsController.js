import axios from 'axios';

// Proxy Mapbox Directions API
export const getDirections = async (req, res) => {
  try {
    const { from, to, mode = 'driving' } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'From and to coordinates required' });
    }
    
    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Mapbox not configured' });
    }
    
    // from and to should be "lng,lat" format
    const profile = mode === 'walking' ? 'walking' : mode === 'cycling' ? 'cycling' : 'driving';
    
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${from};${to}`,
      {
        params: {
          access_token: token,
          geometries: 'geojson',
          overview: 'simplified',
          steps: false
        }
      }
    );
    
    const route = response.data.routes[0];
    if (!route) {
      return res.status(404).json({ error: 'No route found' });
    }
    
    // Return minimal data
    res.json({
      distance: Math.round(route.distance), // meters
      duration: Math.round(route.duration), // seconds
      geometry: route.geometry
    });
  } catch (error) {
    console.error('Directions API error:', error);
    res.status(500).json({ error: 'Directions service unavailable' });
  }
};

// Get distance matrix (multiple origins/destinations)
export const getMatrix = async (req, res) => {
  try {
    const { origins, destinations, mode = 'driving' } = req.query;
    
    if (!origins || !destinations) {
      return res.status(400).json({ error: 'Origins and destinations required' });
    }
    
    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Mapbox not configured' });
    }
    
    const profile = mode === 'walking' ? 'walking' : mode === 'cycling' ? 'cycling' : 'driving';
    
    // Format: lng,lat;lng,lat
    const coordinates = `${origins};${destinations}`;
    
    const response = await axios.get(
      `https://api.mapbox.com/directions-matrix/v1/mapbox/${profile}/${coordinates}`,
      {
        params: {
          access_token: token,
          sources: '0', // First coordinate is source
          destinations: 'all'
        }
      }
    );
    
    res.json({
      durations: response.data.durations[0], // seconds
      distances: response.data.distances ? response.data.distances[0] : null // meters
    });
  } catch (error) {
    console.error('Matrix API error:', error);
    res.status(500).json({ error: 'Matrix service unavailable' });
  }
};
