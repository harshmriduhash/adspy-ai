import { Link, useLocation } from "react-router-dom";
import { Search, BookmarkCheck, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent"
          >
            AdSpy
          </Link>

          <div className="flex gap-2 items-center">
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
