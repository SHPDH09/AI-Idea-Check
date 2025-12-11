import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Users,
  TrendingUp,
  Swords,
  Code2,
  AlertTriangle,
  DollarSign,
  MessageSquare,
} from "lucide-react";

interface AIReportProps {
  report: {
    problem?: string;
    customer?: string;
    market?: string;
    competitor?: string[];
    tech_stack?: string[];
    risk_level?: string;
    profitability_score?: number;
    justification?: string;
  };
}

export function AIReport({ report }: AIReportProps) {
  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "bg-success/20 text-success border-success/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const sections = [
    {
      icon: Target,
      title: "Problem",
      content: report.problem,
      color: "text-primary",
    },
    {
      icon: Users,
      title: "Target Customer",
      content: report.customer,
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      title: "Market Analysis",
      content: report.market,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score & Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Profitability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-3">
              <span className={`text-5xl font-bold font-display ${getScoreColor(report.profitability_score || 0)}`}>
                {report.profitability_score || 0}
              </span>
              <span className="text-muted-foreground text-lg mb-1">/100</span>
            </div>
            <Progress 
              value={report.profitability_score || 0} 
              className="h-2 bg-muted"
            />
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`text-lg px-4 py-2 ${getRiskColor(report.risk_level || "")}`}>
              {report.risk_level || "Unknown"} Risk
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, index) => (
          <Card key={index} variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <section.icon className={`h-5 w-5 ${section.color}`} />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {section.content || "Not available"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitors */}
      {report.competitor && report.competitor.length > 0 && (
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Swords className="h-5 w-5 text-primary" />
              Competitor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.competitor.map((comp, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{comp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tech Stack */}
      {report.tech_stack && report.tech_stack.length > 0 && (
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Recommended Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {report.tech_stack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1 text-sm border-primary/30 text-primary bg-primary/5"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Justification */}
      {report.justification && (
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Expert Justification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed italic">
              "{report.justification}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
