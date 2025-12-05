import { AlertTriangle, Clock, FileX, Target } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Time-Consuming Process",
    description: "Teams spend 20+ hours reading, analyzing, and responding to a single RFP manually.",
  },
  {
    icon: FileX,
    title: "Missed Opportunities",
    description: "Important RFPs get overlooked or deadlines are missed due to overwhelming workload.",
  },
  {
    icon: AlertTriangle,
    title: "Inconsistent Quality",
    description: "Manual proposals vary in quality, missing key requirements and competitive positioning.",
  },
  {
    icon: Target,
    title: "Low Win Rates",
    description: "Without proper analysis and matching, proposals fail to address exact client needs.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">The Problem</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
            RFP Management is Broken
          </h2>
          <p className="text-lg text-muted-foreground">
            Traditional RFP processes drain resources, miss deadlines, and fail to win business. 
            Your team deserves better.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-background border border-border hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
              <p className="text-muted-foreground text-sm">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
