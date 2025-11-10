import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <Navigation />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary animate-glow" />
            <span className="text-sm font-medium">
              AI-Powered Ad Intelligence
            </span>
          </div>

          <h1 className="text-7xl font-bold gradient-text animate-fade-in leading-tight">
            AdSpy for SaaS
          </h1>

          <p
            className="text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            Unlock the secrets behind winning SaaS ads. Analyze top campaigns,
            compare strategies, and generate high-converting variations—all
            powered by AI.
          </p>

          <div
            className="flex gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Link to="/dashboard">
              <Button
                size="lg"
                className="text-lg gap-2 shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] transition-all"
              >
                Start Analyzing Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div
            className="grid md:grid-cols-3 gap-6 mt-20 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl card-hover group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search & Discover</h3>
              <p className="text-muted-foreground">
                Browse ads from leading SaaS brands like Notion, Slack, Figma,
                and 15+ more companies
              </p>
            </div>

            <div className="p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl card-hover group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                AI-Powered Analysis
              </h3>
              <p className="text-muted-foreground">
                Deep insights into messaging, emotional hooks, and conversion
                strategies with advanced AI
              </p>
            </div>

            <div className="p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl card-hover group">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compare & Generate</h3>
              <p className="text-muted-foreground">
                Compare multiple ads side-by-side and generate winning
                variations instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
