import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lightbulb, Sparkles, Loader2 } from "lucide-react";

export function IdeaForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert the idea into the database
      const { data: idea, error: insertError } = await supabase
        .from("ideas")
        .insert({ title: title.trim(), description: description.trim() })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Idea Submitted!",
        description: "AI analysis is starting...",
      });

      // Trigger the AI analysis
      const { error: analyzeError } = await supabase.functions.invoke("analyze-idea", {
        body: {
          ideaId: idea.id,
          title: idea.title,
          description: idea.description,
        },
      });

      if (analyzeError) {
        console.error("Analysis error:", analyzeError);
        toast({
          title: "Analysis Started",
          description: "Your idea was saved. Analysis may take a moment.",
        });
      }

      navigate("/ideas");
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast({
        title: "Error",
        description: "Failed to submit your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-2xl mx-auto animate-slide-up">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <Lightbulb className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl gradient-text">Submit Your Startup Idea</CardTitle>
        <CardDescription className="text-base">
          Our AI will analyze your idea and provide detailed insights on viability, market fit, and more.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              Idea Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., AI-Powered Personal Finance App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 bg-input border-border focus:border-primary focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target audience? What makes it unique?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[160px] bg-input border-border focus:border-primary focus:ring-primary resize-none"
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            variant="glow"
            size="xl"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Validate My Idea
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
