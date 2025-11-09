import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Save, TrendingUp } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Analyze SaaS Ads Now
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover what makes successful SaaS ads work. Get AI-powered insights and generate new variations instantly.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-transform">
              <Link to="/dashboard">
                <Search className="w-5 h-5 mr-2" />
                Start Analyzing
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-border bg-card-gradient hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search Brands</h3>
              <p className="text-muted-foreground">
                Enter any SaaS brand name to discover their ad creatives across platforms
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border border-border bg-card-gradient hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-muted-foreground">
                Get instant AI insights on emotional tone, hooks, and why the ad works
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border border-border bg-card-gradient hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Variations</h3>
              <p className="text-muted-foreground">
                Create 3 new ad variations based on successful patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master SaaS Advertising?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join marketers who are using AI to decode successful ad strategies and create better campaigns
          </p>
          <Button asChild size="lg">
            <Link to="/dashboard">
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
