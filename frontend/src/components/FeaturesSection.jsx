import { 
  Search, 
  FileText, 
  Brain, 
  Puzzle, 
  Calculator, 
  FileOutput, 
  Send, 
  LayoutDashboard 
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Automated RFP Discovery & Scraping",
    description: "Continuously scan government portals, procurement sites, and industry databases to find relevant RFP opportunities automatically.",
  },
  {
    icon: FileText,
    title: "PDF & Document Extraction",
    description: "Extract and clean text from RFP PDFs, technical documents, annexures, and BOQs using advanced PDF parsing tools.",
  },
  {
    icon: Brain,
    title: "AI-Powered RFP Summarization",
    description: "Convert lengthy RFP documents into structured, easy-to-understand summaries with key requirements highlighted.",
  },
  {
    icon: Puzzle,
    title: "Intelligent Product Matching",
    description: "Compare RFP requirements with your product catalogue using keyword matching, embeddings similarity, and technical parameter mapping.",
  },
  {
    icon: Calculator,
    title: "Automated Pricing Calculation",
    description: "Automatically compute product cost, delivery charges, margins, taxes/fees, and generate final quotes instantly.",
  },
  {
    icon: FileOutput,
    title: "Proposal Generation (AI-Assisted)",
    description: "Create professional proposals with company intro, RFP summary, technical compliance, pricing table, and PDF output.",
  },
  {
    icon: Send,
    title: "Automated Proposal Submission",
    description: "Submit proposals via email automatically or prepare for manual upload on portal-based RFPs based on instructions.",
  },
  {
    icon: LayoutDashboard,
    title: "Centralized RFP Dashboard",
    description: "View RFPs, generate proposals, track submissions, and manage product & pricing catalogues in a single interface.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Key Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
            Everything You Need to Win More RFPs
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete end-to-end solution that handles every step of your RFP workflow with precision and speed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl  group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
