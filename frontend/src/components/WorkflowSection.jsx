import { Search, FileSearch, Package, DollarSign, Send, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Scrape RFPs",
    description: "Auto-discover relevant opportunities",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Extract & Summarize",
    description: "Parse documents and requirements",
  },
  {
    icon: Package,
    number: "03",
    title: "Match Products",
    description: "AI matches your best offerings",
  },
  {
    icon: DollarSign,
    number: "04",
    title: "Auto-Price",
    description: "Generate competitive quotes",
  },
  {
    icon: Send,
    number: "05",
    title: "Submit Proposal",
    description: "One-click submission ready",
  },
  {
    icon: BarChart3,
    number: "06",
    title: "Track Everything",
    description: "Monitor in your dashboard",
  },
];

const WorkflowSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
            Simple 6-Step Workflow
          </h2>
          <p className="text-lg text-muted-foreground">
            From discovery to submission, our streamlined process ensures you never miss an opportunity.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connection Line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-border" />
          
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center">
                {/* Icon Circle */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-6 shadow-button">
                  <step.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                
                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-full w-full h-0.5 -translate-y-1/2">
                    <div className="absolute right-4 -top-1 w-2 h-2 border-t-2 border-r-2 border-primary/40 rotate-45" />
                  </div>
                )}
                
                {/* Content */}
                <div className="text-center">
                  <span className="text-xs font-bold text-accent mb-1 block">Step {step.number}</span>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Timeline */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <step.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xs font-bold text-accent">Step {step.number}</span>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
