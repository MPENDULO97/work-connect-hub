import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Wind, Loader2 } from 'lucide-react';

interface WeatherPanelProps {
  lat: number;
  lon: number;
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export default function WeatherPanel({ lat, lon }: WeatherPanelProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`
        );
        
        if (!response.ok) throw new Error('Weather unavailable');
        
        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Weather data unavailable');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {error || 'Weather unavailable'}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Weather</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{weather.temp}°C</div>
            <div className="text-sm text-muted-foreground">
              Feels like {weather.feelsLike}°C
            </div>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-16 h-16"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Cloud className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{weather.description}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span>{weather.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span>{weather.windSpeed} m/s wind</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
