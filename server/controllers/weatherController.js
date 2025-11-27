import axios from 'axios';

// Proxy OpenWeather API to keep API key server-side
export const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const apiKey = process.env.OPENWEATHER_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API not configured' });
    }
    
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric'
      }
    });
    
    // Return minimal data to save bandwidth
    const weather = response.data;
    res.json({
      temp: Math.round(weather.main.temp),
      feelsLike: Math.round(weather.main.feels_like),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Weather service unavailable' });
  }
};

// Get hourly forecast
export const getForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const apiKey = process.env.OPENWEATHER_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API not configured' });
    }
    
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon,
        appid: apiKey,
        units: 'metric',
        cnt: 8 // Next 24 hours (3-hour intervals)
      }
    });
    
    // Return minimal forecast data
    const forecast = response.data.list.map(item => ({
      time: item.dt,
      temp: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      pop: Math.round(item.pop * 100) // Probability of precipitation
    }));
    
    res.json({ forecast });
  } catch (error) {
    console.error('Forecast API error:', error);
    res.status(500).json({ error: 'Forecast service unavailable' });
  }
};
