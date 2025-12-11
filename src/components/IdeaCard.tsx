import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  profitabilityScore?: number;
  riskLevel?: string;
}

export function IdeaCard({
  id,
  title,
  description,
  status,
  createdAt,
  profitabilityScore,
  riskLevel,
}: IdeaCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "analyzing":
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30 hover:bg-warning/30">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Analyzing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getRiskBadge = () => {
    if (!riskLevel) return null;
    const colors = {
      Low: "bg-success/20 text-success border-success/30",
      Medium: "bg-warning/20 text-warning border-warning/30",
      High: "bg-destructive/20 text-destructive border-destructive/30",
    };
    return (
      <Badge className={colors[riskLevel as keyof typeof colors] || colors.Medium}>
        {riskLevel} Risk
      </Badge>
    );
  };

  return (
    <Link to={`/ideas/${id}`}>
      <Card 
        variant="glass" 
        className="group hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)] cursor-pointer"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {profitabilityScore !== undefined && (
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Score: {profitabilityScore}/100
                </Badge>
              )}
              {getRiskBadge()}
            </div>
            <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
