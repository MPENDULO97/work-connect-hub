import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Briefcase, LogOut, User, Plus, Loader2, DollarSign, FileText, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth/login");
        return;
      }

      setUser(session.user);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);

      // Fetch user roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const roles = rolesData?.map((r) => r.role) || [];
      setUserRoles(roles);

      // Fetch projects if client
      if (roles.includes("client")) {
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*")
          .eq("client_id", session.user.id)
          .order("created_at", { ascending: false });
        setProjects(projectsData || []);
      }

      // Fetch proposals if freelancer
      if (roles.includes("freelancer")) {
        const { data: proposalsData } = await supabase
          .from("proposals")
          .select("*, projects(*)")
          .eq("freelancer_id", session.user.id)
          .order("created_at", { ascending: false });
        setProposals(proposalsData || []);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isFreelancer = userRoles.includes("freelancer");
  const isClient = userRoles.includes("client");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold">Work Connect</span>
            </Link>
            <div className="flex items-center space-x-4">
              {isClient && (
                <Link to="/projects/new">
                  <Button className="bg-gradient-to-r from-primary to-primary-light">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Project
                  </Button>
                </Link>
              )}
              {isFreelancer && (
                <Link to="/projects">
                  <Button variant="outline">
                    Browse Projects
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, {profile?.full_name || "User"}!
          </h1>
          <div className="flex gap-2">
            {userRoles.map((role) => (
              <Badge key={role} variant="secondary" className="capitalize">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Proposals</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proposals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue={isClient ? "myprojects" : "proposals"} className="space-y-4">
          <TabsList>
            {isClient && <TabsTrigger value="myprojects">My Projects</TabsTrigger>}
            {isFreelancer && <TabsTrigger value="proposals">My Proposals</TabsTrigger>}
            {isFreelancer && <TabsTrigger value="available">Available Work</TabsTrigger>}
          </TabsList>

          {isClient && (
            <TabsContent value="myprojects" className="space-y-4">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Link to="/projects/new">
                      <Button>Post Your First Project</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription className="mt-2">{project.description}</CardDescription>
                        </div>
                        <Badge variant={project.status === "open" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Budget: R {project.budget_min} - R {project.budget_max}</span>
                        <span>•</span>
                        <span>{project.project_type === "fixed" ? "Fixed Price" : "Hourly"}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          )}

          {isFreelancer && (
            <TabsContent value="proposals" className="space-y-4">
              {proposals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No proposals yet</p>
                    <Link to="/projects">
                      <Button>Browse Projects</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                proposals.map((proposal) => (
                  <Card key={proposal.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{proposal.projects?.title}</CardTitle>
                          <CardDescription className="mt-2">{proposal.cover_letter}</CardDescription>
                        </div>
                        <Badge variant={proposal.status === "accepted" ? "default" : "secondary"}>
                          {proposal.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-primary">Your bid: R {proposal.bid_amount}</span>
                        {proposal.estimated_duration && (
                          <>
                            <span>•</span>
                            <span className="text-muted-foreground">{proposal.estimated_duration}</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          )}

          {isFreelancer && (
            <TabsContent value="available">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Browse available projects</p>
                  <Link to="/projects">
                    <Button>View All Projects</Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
