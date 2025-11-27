import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/lib/auth";
import { jobsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, LogOut, Plus, Loader2, MapPin, DollarSign, Search } from "lucide-react";

const CATEGORIES = [
  'All',
  'Cleaning',
  'Gardening',
  'Plumbing',
  'Electrical',
  'Delivery',
  'Laundry',
  'Ironing',
  'Babysitting',
  'Pet Care',
  'Cooking',
  'Grocery Shopping',
  'Car Wash',
  'Painting',
  'Carpentry',
  'Handyman',
  'Appliance Repair',
  'Tutoring',
  'Moving',
  'House Sitting',
  'Errands',
  'Locksmith',
  'Pest Control',
  'Window Cleaning',
  'Gutter Cleaning',
  'Furniture Assembly',
  'Other'
];

const Jobs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Gardening',
    location: '',
    price: ''
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [filter, searchQuery, user]);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getSession();
      
      if (!currentUser) {
        navigate("/auth/login");
        return;
      }

      setUser(currentUser);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const params: any = {};
      
      if (filter !== 'All') {
        params.category = filter;
      }
      
      if (searchQuery) {
        params.q = searchQuery;
      }

      const data = await jobsAPI.list(params);
      setJobs(data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error(error.message || "Failed to load jobs");
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = authService.getToken();
      await jobsAPI.create({
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location || null,
        price: form.price ? parseFloat(form.price) : null,
        currency: 'ZAR'
      }, token || undefined);

      toast.success("Job posted successfully!");
      setForm({ title: '', description: '', category: 'Gardening', location: '', price: '' });
      setIsDialogOpen(false);
      fetchJobs();
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error(error.message || "Failed to post job");
    }
  };

  const handleSignOut = async () => {
    await authService.logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold">Work Connect</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to post a job listing
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePostJob} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Lawn mowing - 2 hours"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (ZAR)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g., 200"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Johannesburg, Sandton"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the job in detail..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Post Job</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Available Jobs</h1>
          <p className="text-muted-foreground">Browse and find work opportunities in your area</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No jobs found</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Post the First Job</Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job._id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{job.category}</Badge>
                    {job.price && (
                      <div className="flex items-center text-primary font-bold">
                        <DollarSign className="h-4 w-4" />
                        {job.currency} {job.price}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  {job.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.location}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">{job.description}</CardDescription>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Posted by {job.poster?.fullName || 'User'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
