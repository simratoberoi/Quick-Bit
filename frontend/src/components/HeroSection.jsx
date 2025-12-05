import { Button } from "/src/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center pt-20">
      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              AI-Powered RFP Automation
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Automate RFPs
            <br />
            <span className="text-primary">Accelerate Wins</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Transform your proposal process with intelligent automation. From discovery to submission, 
            close more deals faster with AI-powered precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/dashboard">
             <Button
  variant="hero"
  size="xl"
  className="group"
  style={{
    backgroundColor: "#1B76FF",
    color: "#FFFFFF",
    padding: "1rem 2rem",
    fontSize: "1.25rem",
    borderRadius: "0.75rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  }}
>
  Get Started
</Button>
            </Link>
          
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { value: "85%", label: "Time Saved" },
            { value: "3x", label: "More Proposals" },
            { value: "99%", label: "Accuracy" },
            { value: "40%", label: "Higher Win Rate" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
