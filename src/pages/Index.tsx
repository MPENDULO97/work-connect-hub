import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/lib/auth";
import { Briefcase, Users, Shield, TrendingUp, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.getSession();
      if (user) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold">Work Connect</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="bg-gradient-to-r from-primary to-primary-light hover:opacity-90 shadow-primary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              South Africa's Premier Freelance Platform
            </Badge>
            <h1 className="font-display font-bold mb-6 text-balance">
              Find Top Talent or Land Your Next{" "}
              <span className="gradient-text">Big Project</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with skilled freelancers and exciting opportunities in South Africa. 
              All transactions in ZAR, built for local professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/auth/signup?role=freelancer">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-light hover:opacity-90 shadow-primary text-lg px-8">
                  Find Work
                </Button>
              </Link>
              <Link to="/auth/signup?role=client">
                <Button size="lg" variant="outline" className="border-2 text-lg px-8">
                  Hire Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold mb-4">Why Choose Work Connect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the South African market with local payment solutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Escrow Protection",
                description: "Secure payments held in escrow until work is approved",
                color: "text-primary",
              },
              {
                icon: Briefcase,
                title: "Local Projects",
                description: "Connect with clients and freelancers across South Africa",
                color: "text-accent",
              },
              {
                icon: TrendingUp,
                title: "Fair Pricing",
                description: "Set your rates in ZAR and grow your earnings",
                color: "text-success",
              },
              {
                icon: Users,
                title: "Quality Talent",
                description: "Verified professionals with portfolios and reviews",
                color: "text-info",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <h3 className="font-display font-semibold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to success</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* For Clients */}
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all">
              <CardContent className="p-8">
                <h3 className="font-display font-bold text-2xl mb-6 text-primary">For Clients</h3>
                <div className="space-y-4">
                  {[
                    "Post your project with budget in ZAR",
                    "Review proposals from talented freelancers",
                    "Hire the perfect match for your needs",
                    "Release payment upon completion",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <p className="pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* For Freelancers */}
            <Card className="border-2 border-accent/20 hover:border-accent/50 transition-all">
              <CardContent className="p-8">
                <h3 className="font-display font-bold text-2xl mb-6 text-accent">For Freelancers</h3>
                <div className="space-y-4">
                  {[
                    "Create your professional profile",
                    "Browse projects matching your skills",
                    "Submit compelling proposals",
                    "Deliver great work and get paid",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                        {index + 1}
                      </div>
                      <p className="pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of South African professionals already using Work Connect
          </p>
          <Link to="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-light hover:opacity-90 shadow-primary text-lg px-12">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-display font-bold">Work Connect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Work Connect. Built for South Africa 🇿🇦
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
