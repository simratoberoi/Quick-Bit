import { Button } from "/src/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small teams getting started",
    features: [
      "50 RFPs/month",
      "Basic AI summarization",
      "Email submission",
      "Standard support",
      "1 user",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$299",
    period: "/month",
    description: "For growing teams with higher volume",
    features: [
      "Unlimited RFPs",
      "Advanced AI matching",
      "Auto-pricing engine",
      "Priority support",
      "5 users",
      "Custom templates",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "SSO & security",
      "Unlimited users",
      "SLA guarantee",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your team size and RFP volume. Scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-card-hover scale-105"
                  : "bg-card text-card-foreground border-border hover:shadow-card-hover"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className={`text-xl font-semibold mb-2 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/dashboard">
                <Button
                  variant={plan.highlighted ? "secondary" : "hero"}
                  className="w-full"
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
