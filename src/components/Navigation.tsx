import { Link, useLocation } from "react-router-dom";
import { Search, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent">
            AdSpy for SaaS
          </Link>
          
          <div className="flex gap-2">
            <Button
              variant={location.pathname === "/dashboard" ? "default" : "ghost"}
              asChild
            >
              <Link to="/dashboard">
                <Search className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            
            <Button
              variant={location.pathname === "/saved" ? "default" : "ghost"}
              asChild
            >
              <Link to="/saved">
                <BookmarkCheck className="w-4 h-4 mr-2" />
                Saved
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
