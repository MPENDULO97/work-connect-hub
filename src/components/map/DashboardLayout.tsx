import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobsList from "./JobsList";
import JobsMapPanel from "./JobsMapPanel";
import WeatherPanel from "./WeatherPanel";
import { projectsAPI, authAPI } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  locationName?: string;
  status: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { session } = await authAPI.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
    };
    checkAuth();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Default to Johannesburg if location access denied
          setUserLocation({ lat: -26.2041, lng: 28.0473 });
          setLocationError("Using default location (Johannesburg)");
        }
      );
    } else {
      // Default location if geolocation not supported
      setUserLocation({ lat: -26.2041, lng: 28.0473 });
      setLocationError("Geolocation not supported");
    }
  }, [navigate]);

  useEffect(() => {
    if (!userLocation) return;

    // Fetch nearby jobs
    const fetchJobs = async () => {
      try {
        const allJobs = await projectsAPI.getProjects();
        
        // Filter jobs that are open and have location data
        const nearbyJobs = allJobs.filter((job: any) => 
          job.status === "open" && 
          job.location && 
          job.location.coordinates
        );

        setJobs(nearbyJobs);
      } catch (error: any) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to load nearby jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userLocation]);

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
          toast.success("Location updated!");
        },
        (error) => {
          toast.error("Failed to get location");
        }
      );
    }
  };

  if (loading || !userLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading nearby jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        {locationError && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-yellow-800">{locationError}</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleRequestLocation}>
              Enable Location
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Jobs List - Left Sidebar */}
          <aside className="lg:col-span-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <JobsList jobs={jobs} />
          </aside>

          {/* Map - Center */}
          <main className="lg:col-span-2 h-[600px] lg:h-[calc(100vh-8rem)]">
            <JobsMapPanel jobs={jobs} userLocation={userLocation} />
          </main>

          {/* Weather - Right Sidebar */}
          <aside className="lg:col-span-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <WeatherPanel jobs={jobs} />
          </aside>
        </div>
      </div>
    </div>
  );
}
