import { Button } from "/src/ui/button";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Send, 
  Settings, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const stats = [
  { label: "Active RFPs", value: "24", icon: FileText, change: "+3 this week" },
  { label: "Proposals Sent", value: "156", icon: Send, change: "+12 this month" },
  { label: "Win Rate", value: "42%", icon: TrendingUp, change: "+5% vs last quarter" },
  { label: "Avg Response Time", value: "2.4 days", icon: Clock, change: "-1.2 days improved" },
];

const recentRFPs = [
  { id: 1, title: "Enterprise Software Solution RFP", client: "TechCorp Inc.", deadline: "Dec 15, 2024", status: "In Progress", match: 94 },
  { id: 2, title: "Cloud Infrastructure Services", client: "Global Finance Ltd.", deadline: "Dec 18, 2024", status: "Pending", match: 87 },
  { id: 3, title: "IT Security Assessment", client: "Healthcare Systems", deadline: "Dec 20, 2024", status: "Submitted", match: 91 },
  { id: 4, title: "Data Analytics Platform", client: "Retail Giants Co.", deadline: "Dec 22, 2024", status: "Won", match: 96 },
];

const getStatusColor = (status) => {
  switch (status) {
    case "In Progress": return "bg-accent/20 text-accent";
    case "Pending": return "bg-muted text-muted-foreground";
    case "Submitted": return "bg-secondary text-secondary-foreground";
    case "Won": return "bg-primary/20 text-primary";
    default: return "bg-muted text-muted-foreground";
  }
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-6 hidden lg:block">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-xl text-foreground">RFPro</span>
        </Link>

        <nav className="space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: FileText, label: "RFPs", active: false },
            { icon: Send, label: "Proposals", active: false },
            { icon: Settings, label: "Settings", active: false },
          ].map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your RFP overview.</p>
          </div>
          <Button variant="hero" className="gap-2">
            <Plus className="w-4 h-4" />
            New RFP
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-accent">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent RFPs */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">Recent RFPs</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search RFPs..." 
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">RFP Title</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Deadline</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Match</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {recentRFPs.map((rfp) => (
                  <tr key={rfp.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-medium text-foreground">{rfp.title}</span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{rfp.client}</td>
                    <td className="py-4 px-6 text-muted-foreground">{rfp.deadline}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-primary">{rfp.match}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rfp.status)}`}>
                        {rfp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
