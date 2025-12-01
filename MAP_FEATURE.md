# 🗺️ Map Feature - Complete Guide

## Overview

The Map feature provides a complete dashboard for viewing nearby jobs with:
- **Interactive Map** using Leaflet + OpenStreetMap (100% free)
- **Route Calculation** using OpenRouteService (free tier: 2000 requests/day)
- **Weather Information** using OpenWeather API (free tier: 1000 requests/day)

## Features

### 1. Jobs Map Panel (Center)
- Shows all open projects on an interactive map
- User location marker (blue)
- Job location markers (red)
- Route lines from user to each job
- Click markers for job details including:
  - Title, category, budget
  - Distance and ETA
  - Location name

### 2. Jobs List (Left Sidebar)
- List of all nearby jobs
- Shows title, category, description
- Budget range in ZAR
- Location name
- Click to view on map

### 3. Weather Panel (Right Sidebar)
- Real-time weather for each job location
- Temperature, conditions, humidity, wind speed
- Weather icons (sun, clouds, rain)
- Updates automatically

## How to Use

### Access the Map
1. Log in to your account
2. Click "Map View" in the navigation
3. Allow location access when prompted (or use default Johannesburg location)

### View Jobs
- Jobs appear as markers on the map
- Blue routes show the path from your location to each job
- Click any marker to see job details and distance/ETA

### Check Weather
- Weather cards on the right show conditions at each job location
- Useful for planning outdoor work

## API Keys Required

Make sure these are in your `.env` file:

```env
# OpenRouteService (for routing)
VITE_ORS_API_KEY=your_openrouteservice_api_key

# OpenWeather (for weather data)
VITE_OPENWEATHER_KEY=your_openweather_api_key
```

### Get Free API Keys

**OpenRouteService:**
1. Go to https://openrouteservice.org/dev/#/signup
2. Sign up for free account
3. Get API key (2000 requests/day free)

**OpenWeather:**
1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Get API key (1000 requests/day free)

## Components

### DashboardLayout.tsx
Main container that:
- Fetches user location
- Loads nearby jobs from API
- Manages authentication
- Coordinates all panels

### JobsMapPanel.tsx
Interactive map that:
- Displays Leaflet map with OpenStreetMap tiles
- Shows user and job markers
- Fetches routes from OpenRouteService
- Draws route polylines
- Shows distance and ETA in popups

### JobsList.tsx
Sidebar list that:
- Displays job cards
- Shows key job information
- Allows clicking to focus on map

### WeatherPanel.tsx
Weather sidebar that:
- Fetches weather from OpenWeather API
- Shows temperature, conditions, humidity, wind
- Updates for each job location
- Displays weather icons

## Technical Details

### Location Services
- Uses browser Geolocation API
- Falls back to Johannesburg if denied
- Shows notification if using default location
- "Enable Location" button to retry

### Route Calculation
- Uses OpenRouteService Directions API
- Calculates driving routes
- Returns distance (meters) and duration (seconds)
- Formats as km/m and hours/minutes

### Weather Data
- Uses OpenWeather Current Weather API
- Fetches for each job location
- Returns temperature, conditions, humidity, wind
- Updates when jobs change

### Map Styling
- OpenStreetMap tiles (free, no API key needed)
- Blue polylines for routes
- Standard Leaflet markers
- Responsive design

## Limitations

### Free Tier Limits
- **OpenRouteService**: 2000 requests/day
- **OpenWeather**: 1000 requests/day
- **OpenStreetMap**: Unlimited (but be respectful)

### Performance
- Routes calculated on component mount
- Weather fetched for up to 5 jobs
- May take a few seconds to load all data

### Browser Support
- Requires modern browser with Geolocation API
- Works on desktop and mobile
- Best on Chrome, Firefox, Safari, Edge

## Troubleshooting

### Map not loading
- Check that `leaflet` and `react-leaflet` are installed
- Verify Leaflet CSS is imported
- Check browser console for errors

### Routes not showing
- Verify `VITE_ORS_API_KEY` is set in `.env`
- Check API key is valid
- Check daily request limit not exceeded
- Look for errors in browser console

### Weather not loading
- Verify `VITE_OPENWEATHER_KEY` is set in `.env`
- Check API key is valid
- Check daily request limit not exceeded
- Look for errors in browser console

### Location not working
- Allow location access in browser
- Check browser supports Geolocation API
- Falls back to Johannesburg if denied

## Future Enhancements

Potential improvements:
- [ ] Filter jobs by distance
- [ ] Sort by distance or budget
- [ ] Save favorite locations
- [ ] Multiple route options (walking, cycling)
- [ ] Traffic information
- [ ] Weather forecast (not just current)
- [ ] Cluster markers when zoomed out
- [ ] Custom marker icons by category
- [ ] Export routes to Google Maps
- [ ] Offline map caching

## Cost Comparison

**This Solution (Free):**
- OpenStreetMap: Free
- OpenRouteService: Free (2000/day)
- OpenWeather: Free (1000/day)
- **Total: R0/month**

**Google Maps Alternative:**
- Maps JavaScript API: $7 per 1000 loads
- Directions API: $5 per 1000 requests
- **Estimated: R500-2000/month**

**Mapbox Alternative:**
- Maps: $5 per 1000 loads
- Directions: $5 per 1000 requests
- **Estimated: R500-2000/month**

## Support

For issues:
1. Check browser console for errors
2. Verify API keys are correct
3. Check API rate limits
4. Review component props and data

---

Built with ❤️ using free and open-source tools
