import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Send,
  CheckCircle,
  Box,
  DollarSign,
} from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();

  const isNewRfpRoute =
    pathname === "/rfps/new" ||
    pathname.startsWith("/rfps/new") ||
    pathname.includes("/matched-products");

  const isSubmittedRfpRoute =
    pathname === "/rfps/submitted" ||
    pathname.startsWith("/rfps/submitted");

  const isAllRfpRoute =
    pathname === "/rfps" ||
    (
      pathname.startsWith("/rfps") &&
      !isNewRfpRoute &&
      !isSubmittedRfpRoute
    );

  const linkClass = (active) =>
    `px-4 py-3 rounded-lg flex items-center gap-3 text-sm ${
      active
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 p-6 hidden lg:flex flex-col">
      {/* Branding */}
     <div className="flex items-center gap-3 mb-8">
  <img
    src="/logo.png"
    alt="RFPro Logo"
    className="h-12 w-12 rounded-full object-cover"
  />
  <div>
    <h2 className="font-semibold text-gray-900 text-lg">
      RFP Automation
    </h2>
    <p className="text-xs text-gray-500">by QuickBid</p>
  </div>
</div>

      {/* Dashboard */}
      <Link to="/dashboard" className={linkClass(pathname === "/dashboard")}>
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      {/* RFP Section */}
      <p className="text-xs text-gray-400 uppercase mt-6 mb-1 px-4 tracking-wide">
        RFPs
      </p>

      {/* All RFPs */}
      <Link to="/rfps" className={linkClass(isAllRfpRoute)}>
        <Folder size={18} />
        All RFPs
      </Link>

      {/* New / Incoming */}
      <Link to="/rfps/new" className={linkClass(isNewRfpRoute)}>
        <Send size={18} />
        New / Incoming
      </Link>

      {/* Submitted */}
      <Link to="/rfps/submitted" className={linkClass(isSubmittedRfpRoute)}>
        <CheckCircle size={18} />
        Submitted
      </Link>

      {/* Tools */}
      <p className="text-xs text-gray-400 uppercase mt-6 mb-1 px-4 tracking-wide">
        Tools
      </p>

      <Link to="/productCatalogue" className={linkClass(pathname === "/productCatalogue")}>
        <Box size={18} />
        Product Catalogue
      </Link>

      <Link to="/pricingCatalogue" className={linkClass(pathname === "/pricingCatalogue")}>
        <DollarSign size={18} />
        Pricing
      </Link>
    </aside>
  );
};

export default Sidebar;
