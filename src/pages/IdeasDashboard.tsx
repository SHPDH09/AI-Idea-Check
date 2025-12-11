import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { IdeaCard } from "@/components/IdeaCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Inbox } from "lucide-react";

interface AIReport {
  profitability_score?: number;
  risk_level?: string;
  problem?: string;
  customer?: string;
  market?: string;
  competitor?: unknown[];
  tech_stack?: string[];
  justification?: string;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  ai_report: AIReport | null;
}

const parseAIReport = (report: unknown): AIReport | null => {
  if (!report || typeof report !== 'object') return null;
  return report as AIReport;
};

const IdeasDashboard = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("ideas-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ideas" },
        () => {
          fetchIdeas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchIdeas = async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching ideas:", error);
    } else {
      const parsedIdeas: Idea[] = (data || []).map((item) => ({
        ...item,
        ai_report: parseAIReport(item.ai_report),
      }));
      setIdeas(parsedIdeas);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="container relative py-12 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Your Ideas
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all your validated startup ideas
            </p>
          </div>
          <Button asChild variant="glow" size="lg">
            <Link to="/">
              <Plus className="h-5 w-5" />
              New Idea
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 p-6 rounded-xl bg-card/50 border border-border/50">
                <Skeleton className="h-6 w-3/4 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
                <Skeleton className="h-16 w-full bg-muted" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 bg-muted" />
                  <Skeleton className="h-6 w-24 bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 border border-border mb-6">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">No ideas yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Submit your first startup idea to get AI-powered validation and insights.
            </p>
            <Button asChild variant="glow" size="lg">
              <Link to="/">
                <Plus className="h-5 w-5" />
                Submit Your First Idea
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                id={idea.id}
                title={idea.title}
                description={idea.description}
                status={idea.status}
                createdAt={idea.created_at}
                profitabilityScore={idea.ai_report?.profitability_score}
                riskLevel={idea.ai_report?.risk_level}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default IdeasDashboard;
