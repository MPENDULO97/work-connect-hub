import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
}

interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherPanelProps {
  jobs: Job[];
}

export default function WeatherPanel({ jobs }: WeatherPanelProps) {
  const [weather, setWeather] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobs.length === 0) return;

    const fetchWeather = async () => {
      setLoading(true);
      const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

      if (!apiKey) {
        console.warn("OpenWeather API key not found");
        setLoading(false);
        return;
      }

      for (const job of jobs) {
        try {
          const [lng, lat] = job.location.coordinates;
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                lat,
                lon: lng,
                appid: apiKey,
                units: "metric",
              },
            }
          );

          setWeather((prev) => ({
            ...prev,
            [job._id]: {
              temp: Math.round(response.data.main.temp),
              description: response.data.weather[0].description,
              humidity: response.data.main.humidity,
              windSpeed: response.data.wind.speed,
              icon: response.data.weather[0].main,
            },
          }));
        } catch (error) {
          console.error(`Failed to fetch weather for job ${job._id}:`, error);
        }
      }
      setLoading(false);
    };

    fetchWeather();
  }, [jobs]);

  const getWeatherIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "clouds":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No jobs to show weather for</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-4">Weather Conditions</h2>
      {jobs.slice(0, 5).map((job) => {
        const jobWeather = weather[job._id];

        return (
          <Card key={job._id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium line-clamp-1">{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && !jobWeather ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : jobWeather ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {getWeatherIcon(jobWeather.icon)}
                    <div className="text-right">
                      <p className="text-3xl font-bold">{jobWeather.temp}°C</p>
                      <p className="text-sm text-muted-foreground capitalize">{jobWeather.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span>{jobWeather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>{jobWeather.windSpeed} m/s</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Weather unavailable</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
