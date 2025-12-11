import { Header } from "@/components/Header";
import { IdeaForm } from "@/components/IdeaForm";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <main className="container relative py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
            Validate Your{" "}
            <span className="gradient-text">Startup Idea</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant AI-powered analysis of your startup concept. Understand market fit, 
            identify competitors, and receive actionable insights.
          </p>
        </div>

        {/* Form */}
        <IdeaForm />

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Market Analysis",
              description: "Understand your target market size and growth potential",
            },
            {
              title: "Competitor Insights",
              description: "Identify key competitors and differentiation opportunities",
            },
            {
              title: "Tech Recommendations",
              description: "Get practical technology stack suggestions",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card/50 border border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
