import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { AIReport } from "@/components/AIReport";
import { PinDialog } from "@/components/PinDialog";
import { EditIdeaDialog } from "@/components/EditIdeaDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Trash2,
  Pencil,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface Idea {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  ai_report: Record<string, unknown> | null;
}

const parseAIReport = (report: unknown): Record<string, unknown> | null => {
  if (!report || typeof report !== 'object') return null;
  return report as Record<string, unknown>;
};

const IdeaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIdea();

      // Subscribe to realtime updates for this idea
      const channel = supabase
        .channel(`idea-${id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "ideas",
            filter: `id=eq.${id}`,
          } as const,
          (payload) => {
            const newData = payload.new as { ai_report: unknown; created_at: string; description: string; id: string; status: string; title: string };
            setIdea({
              ...newData,
              ai_report: parseAIReport(newData.ai_report),
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  const fetchIdea = async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching idea:", error);
      toast({
        title: "Error",
        description: "Failed to load idea details.",
        variant: "destructive",
      });
    } else if (!data) {
      toast({
        title: "Not Found",
        description: "This idea doesn't exist.",
        variant: "destructive",
      });
      navigate("/ideas");
    } else {
      setIdea({
        ...data,
        ai_report: parseAIReport(data.ai_report),
      });
    }
    setIsLoading(false);
  };

  const handleDeleteClick = () => {
    setShowPinDialog(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!idea) return;

    setIsDeleting(true);
    setShowPinDialog(false);
    
    const { error } = await supabase.from("ideas").delete().eq("id", idea.id);

    if (error) {
      console.error("Error deleting idea:", error);
      toast({
        title: "Error",
        description: "Failed to delete the idea.",
        variant: "destructive",
      });
      setIsDeleting(false);
    } else {
      toast({
        title: "Deleted",
        description: "Your idea has been removed.",
      });
      navigate("/ideas");
    }
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    fetchIdea();
  };

  const handleRetry = async () => {
    if (!idea) return;

    setIsRetrying(true);

    try {
      await supabase.from("ideas").update({ status: "pending" }).eq("id", idea.id);

      const { error } = await supabase.functions.invoke("analyze-idea", {
        body: {
          ideaId: idea.id,
          title: idea.title,
          description: idea.description,
        },
      });

      if (error) throw error;

      toast({
        title: "Retrying Analysis",
        description: "AI analysis has been restarted.",
      });
    } catch (error) {
      console.error("Error retrying analysis:", error);
      toast({
        title: "Error",
        description: "Failed to restart analysis.",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const getStatusBadge = () => {
    if (!idea) return null;

    switch (idea.status) {
      case "completed":
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Analysis Complete
          </Badge>
        );
      case "analyzing":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Analyzing...
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Analysis Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground border-border">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 px-4">
          <Skeleton className="h-8 w-32 mb-8 bg-muted" />
          <Skeleton className="h-12 w-3/4 mb-4 bg-muted" />
          <Skeleton className="h-6 w-1/4 mb-8 bg-muted" />
          <Skeleton className="h-40 w-full mb-8 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full bg-muted" />
            <Skeleton className="h-32 w-full bg-muted" />
          </div>
        </main>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="container relative py-12 px-4">
        {/* Back button */}
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/ideas">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Idea Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {getStatusBadge()}
              <span className="text-sm text-muted-foreground">
                {new Date(idea.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {idea.title}
            </h1>
          </div>
          <div className="flex gap-2">
            {(idea.status === "failed" || idea.status === "pending") && (
              <Button
                variant="outline"
                onClick={handleRetry}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Retry Analysis
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleEditClick}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </div>

        {/* Description Card */}
        <Card variant="glass" className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Idea Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {idea.description}
            </p>
          </CardContent>
        </Card>

        {/* AI Report */}
        {idea.status === "completed" && idea.ai_report ? (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">
              AI Analysis Report
            </h2>
            <AIReport report={idea.ai_report} />
          </div>
        ) : idea.status === "analyzing" ? (
          <Card variant="glass" className="text-center py-12">
            <CardContent>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">
                Analyzing Your Idea...
              </h3>
              <p className="text-muted-foreground">
                Our AI is evaluating your startup concept. This usually takes 15-30 seconds.
              </p>
            </CardContent>
          </Card>
        ) : idea.status === "failed" ? (
          <Card variant="glass" className="text-center py-12 border-destructive/30">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">
                Analysis Failed
              </h3>
              <p className="text-muted-foreground mb-6">
                Something went wrong during the AI analysis. Please try again.
              </p>
              <Button variant="glow" onClick={handleRetry} disabled={isRetrying}>
                {isRetrying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Retry Analysis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card variant="glass" className="text-center py-12">
            <CardContent>
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2">
                Pending Analysis
              </h3>
              <p className="text-muted-foreground">
                This idea is waiting to be analyzed.
              </p>
            </CardContent>
          </Card>
        )}

        {/* PIN Dialog for Delete */}
        <PinDialog
          open={showPinDialog}
          onOpenChange={setShowPinDialog}
          onConfirm={handleDeleteConfirmed}
          isLoading={isDeleting}
          title="Confirm Deletion"
          description="Enter your 6-digit PIN to delete this idea permanently."
        />

        {/* Edit Dialog */}
        {idea && (
          <EditIdeaDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            idea={idea}
            onSuccess={handleEditSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default IdeaDetails;
