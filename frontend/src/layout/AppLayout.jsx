import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content - Adjusts based on sidebar state */}
      <div
        className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        } ml-0`}
      >
        {/* Content Area */}
        <div className="flex-1 pb-32">
          <Outlet />
        </div>

        {/* Footer - Full Width */}
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
