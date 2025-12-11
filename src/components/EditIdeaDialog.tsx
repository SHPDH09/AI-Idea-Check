import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EditIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: {
    id: string;
    title: string;
    description: string;
  };
  onSuccess: () => void;
}

export function EditIdeaDialog({
  open,
  onOpenChange,
  idea,
  onSuccess,
}: EditIdeaDialogProps) {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("ideas")
      .update({ title: title.trim(), description: description.trim() })
      .eq("id", idea.id);

    if (error) {
      console.error("Error updating idea:", error);
      toast({
        title: "Error",
        description: "Failed to update the idea.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Idea updated successfully.",
      });
      onSuccess();
      onOpenChange(false);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Idea
          </DialogTitle>
          <DialogDescription>
            Update your startup idea details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter idea title"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your startup idea"
              rows={5}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="glow" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
