import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign } from "lucide-react";

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

interface JobsListProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
}

export default function JobsList({ jobs, onJobClick }: JobsListProps) {
  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No jobs found nearby</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-4">Nearby Jobs ({jobs.length})</h2>
      {jobs.map((job) => (
        <Card
          key={job._id}
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onJobClick?.(job)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{job.title}</CardTitle>
            <Badge variant="secondary" className="w-fit">
              {job.category}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-semibold">
                R{job.budgetMin} - R{job.budgetMax}
              </span>
            </div>
            {job.locationName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.locationName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
