import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, LayoutDashboard, Plus } from "lucide-react";

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">
            Idea<span className="text-primary">Validator</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            asChild
            variant={location.pathname === "/ideas" ? "secondary" : "ghost"}
            size="sm"
          >
            <Link to="/ideas">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Dashboard</span>
            </Link>
          </Button>
          <Button
            asChild
            variant={location.pathname === "/" ? "glow" : "default"}
            size="sm"
          >
            <Link to="/">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">New Idea</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
