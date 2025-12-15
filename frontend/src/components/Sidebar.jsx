import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Send,
  CheckCircle,
  Box,
  DollarSign,
  ChevronLeft,
} from "lucide-react";


const Sidebar = ({ isCollapsed, onToggle }) => {
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
    `px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition-all duration-200 ${
      active
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 p-6 hidden lg:flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Branding / Logo */}
      <div className={`flex items-center gap-3 mb-8 ${isCollapsed && "justify-center"}`}>
       <Link to="/">
  <img
    src="/logo.png"
    alt="RFPro Logo"
    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
  />
</Link>
        {!isCollapsed && (
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 text-lg truncate">
              RFP Automation
            </h2>
            <p className="text-xs text-gray-500 truncate">by QuickBid</p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`mb-6 p-2.5 rounded-lg transition-all duration-200 font-medium flex items-center justify-center ${
          isCollapsed
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft 
          size={20} 
          className={`transition-transform duration-300 ${isCollapsed && "rotate-180"}`}
        />
      </button>

      {/* Divider */}
      <div className="h-px bg-gray-200 mb-6" />

      {/* Dashboard */}
      <Link
        to="/dashboard"
        className={`${linkClass(pathname === "/dashboard")} ${isCollapsed && "justify-center px-2"}`}
        title={isCollapsed ? "Dashboard" : ""}
      >
        <LayoutDashboard size={18} className="flex-shrink-0" />
        {!isCollapsed && <span className="truncate">Dashboard</span>}
      </Link>

      {/* RFP Section */}
      {!isCollapsed && (
        <p className="text-xs text-gray-400 uppercase mt-6 mb-2 px-4 tracking-wide font-semibold">
          RFPs
        </p>
      )}

      {/* All RFPs */}
      <Link
        to="/rfps"
        className={`${linkClass(isAllRfpRoute)} ${isCollapsed && "justify-center px-2"}`}
        title={isCollapsed ? "All RFPs" : ""}
      >
        <Folder size={18} className="flex-shrink-0" />
        {!isCollapsed && <span className="truncate">All RFPs</span>}
      </Link>

      {/* New / Incoming */}
      <Link
        to="/rfps/new"
        className={`${linkClass(isNewRfpRoute)} ${isCollapsed && "justify-center px-2"}`}
        title={isCollapsed ? "New / Incoming" : ""}
      >
        <Send size={18} className="flex-shrink-0" />
        {!isCollapsed && <span className="truncate">New / Incoming</span>}
      </Link>

      {/* Submitted */}
      <Link
        to="/rfps/submitted"
        className={`${linkClass(isSubmittedRfpRoute)} ${isCollapsed && "justify-center px-2"}`}
        title={isCollapsed ? "Submitted" : ""}
      >
        <CheckCircle size={18} className="flex-shrink-0" />
        {!isCollapsed && <span className="truncate">Submitted</span>}
      </Link>

      {/* Tools */}
      {!isCollapsed && (
        <p className="text-xs text-gray-400 uppercase mt-6 mb-2 px-4 tracking-wide font-semibold">
          Tools
        </p>
      )}

      <Link
        to="/productCatalogue"
        className={`${linkClass(pathname === "/productCatalogue")} ${isCollapsed && "justify-center px-2"}`}
        title={isCollapsed ? "Product Catalogue" : ""}
      >
        <Box size={18} className="flex-shrink-0" />
        {!isCollapsed && <span className="truncate">Product Catalogue</span>}
      </Link>

      <Link
        to="/pricingCatalogue"
        className={`${linkClass(pathname === "/pricingCatalogue")} ${isCollapsed && "justify-center px-2"}`}
        title={isCollapsed ? "Pricing" : ""}
      >
        <DollarSign size={18} className="flex-shrink-0" />
        {!isCollapsed && <span className="truncate">Pricing</span>}
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="pt-6 border-t border-gray-200 mt-auto">
          <p className="text-xs text-gray-500 text-center">
            QuickBid © {new Date().getFullYear()}
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
