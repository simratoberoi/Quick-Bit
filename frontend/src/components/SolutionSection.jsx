import { CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">The Solution</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
              AI That Wins Proposals For You
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              RFPro automates your entire proposal workflow — from discovering opportunities to 
              submitting winning proposals. Let AI handle the grunt work while your team focuses on strategy.
            </p>

            <div className="space-y-4">
              {[
                { icon: Zap, text: "Automated discovery and extraction" },
                { icon: Shield, text: "AI-powered analysis and matching" },
                { icon: TrendingUp, text: "Smart pricing and proposal generation" },
                { icon: CheckCircle, text: "One-click submission and tracking" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" style = {{color: "#ffffff"}}/>
                  </div>
                  <span className="text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-20 bg-secondary/50 rounded-lg mt-6 flex items-center justify-center">
                  <span className="text-primary font-medium">RFP Summary Generated</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="h-24 bg-muted rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-2">Match Score</div>
                    <div className="text-2xl font-bold text-primary">94%</div>
                  </div>
                  <div className="h-24 bg-muted rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-2">Est. Value</div>
                    <div className="text-2xl font-bold text-foreground">$45K</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
