import { useState, useEffect } from "react";
import {
  Search,
  MoreVertical,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const getStatusStyles = (status) => {
  const statusMap = {
    "In Progress": "bg-orange-100 text-orange-700",
    Pending: "bg-gray-300 text-gray-700",
    Submitted: "bg-green-100 text-green-700",
    Won: "bg-blue-100 text-blue-700",
    Open: "bg-green-100 text-green-700",
    Active: "bg-blue-100 text-blue-700",
    Closed: "bg-gray-300 text-gray-700",
    "Closing Soon": "bg-red-100 text-red-700",
  };
  return statusMap[status] || "bg-gray-200 text-gray-700";
};

const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");
  } catch {
    return date;
  }
};

const BACKEND_URL = "http://127.0.0.1:5000";

const AllRFPs = () => {
  const [rfpData, setRfpData] = useState([]);
  const [submittedRfpIds, setSubmittedRfpIds] = useState([]);

  // 🔴 start in loading mode
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [openFilter, setOpenFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ------------------------
  // Fetch submitted RFP IDs
  // ------------------------
  const fetchSubmittedRfpIds = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/submitted`);
      const result = await response.json();

      if (result.success && result.data) {
        setSubmittedRfpIds(result.data.map((r) => r.rfp_id));
      }
    } catch (err) {
      console.error("Error fetching submitted RFPs:", err);
    }
  };

  // ------------------------
  // Fetch all RFPs
  // ------------------------
  const fetchRFPs = async () => {
    setLoading(true);
    setError(null);
    setRfpData([]); // 🔥 clear stale data immediately

    try {
      const response = await fetch(`${BACKEND_URL}/scrape`);
      const result = await response.json();

      if (result.success && result.data) {
        const enrichedData = result.data.map((rfp, idx) => ({
          ...rfp,
          organization: rfp.organization || `Organization ${idx + 1}`,
          deadline:
            rfp.deadline ||
            new Date(Date.now() + (idx + 1) * 86400000 * 10)
              .toISOString()
              .split("T")[0],
          department: rfp.department || `Department ${idx + 1}`,
          category: rfp.category || "General",
          issue_date:
            rfp.issue_date ||
            new Date(Date.now() - 86400000 * 5)
              .toISOString()
              .split("T")[0],
          status: submittedRfpIds.includes(rfp.rfp_id)
            ? "Submitted"
            : rfp.status,
        }));

        setRfpData(enrichedData);
      } else {
        setError(result.error || "Failed to fetch RFPs");
      }
    } catch (err) {
      setError(
        `Connection error: ${err.message}. Make sure Flask backend is running on port 5000.`
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Initial load (ONLY ONCE)
  // ------------------------
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSubmittedRfpIds();
      await fetchRFPs();
    };

    init();
  }, []);

  const toggleDropdown = (key) =>
    setOpenFilter(openFilter === key ? null : key);

  // ------------------------
  // Filters
  // ------------------------
  const uniqueStatuses = [
    "All",
    ...new Set(rfpData.map((r) => r.status).filter(Boolean)),
  ];

  const uniqueCategories = [
    "All",
    ...new Set(rfpData.map((r) => r.category).filter(Boolean)),
  ];

  const filteredData = rfpData.filter((rfp) => {
    const matchesSearch =
      searchTerm === "" ||
      rfp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.rfp_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || rfp.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All" || rfp.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="px-10 pt-8 pb-6 bg-white border-b">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All RFPs</h1>
            <p className="text-sm text-gray-600 mt-2">
              Manage and track all incoming Requests for Proposals
            </p>
          </div>
          <button
            onClick={fetchRFPs}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-lg"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && !loading && (
        <div className="mx-10 mt-6 p-4 bg-red-50 border rounded-lg flex gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Error loading RFPs
            </p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchRFPs}
              className="text-xs text-red-700 underline mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="px-10 py-32 flex justify-center items-center">
          <div className="text-center">
            <RefreshCw
              size={48}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium">
              Loading RFPs from backend...
            </p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <>
          {/* STATS */}
          {rfpData.length > 0 && (
            <div className="px-10 py-6 grid grid-cols-4 gap-4">
              {[
                ["Total RFPs", rfpData.length, "text-gray-900"],
                [
                  "Open",
                  rfpData.filter((r) => r.status === "Open").length,
                  "text-green-600",
                ],
                [
                  "Closing Soon",
                  rfpData.filter((r) => r.status === "Closing Soon").length,
                  "text-red-600",
                ],
                [
                  "Won",
                  rfpData.filter((r) => r.status === "Won").length,
                  "text-blue-600",
                ],
              ].map(([label, value, color]) => (
                <div key={label} className="bg-white p-4 rounded-lg border">
                  <p className="text-xs text-gray-500 uppercase">{label}</p>
                  <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* SEARCH + FILTERS */}
          <div className="px-10 pb-6 flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, client, RFP ID…"
                className="pl-11 pr-4 py-2.5 w-full border rounded-lg text-sm"
              />
            </div>

            <div className="flex gap-3">
              {/* STATUS */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("status")}
                  className="border px-4 py-2.5 rounded-lg text-sm bg-white flex justify-between min-w-[140px]"
                >
                  Status: {statusFilter}
                  <ChevronDown size={16} />
                </button>

                {openFilter === "status" && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-lg w-48 z-20">
                    {uniqueStatuses.map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          setStatusFilter(s);
                          setOpenFilter(null);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CATEGORY */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("category")}
                  className="border px-4 py-2.5 rounded-lg text-sm bg-white flex justify-between min-w-[160px]"
                >
                  Category: {categoryFilter}
                  <ChevronDown size={16} />
                </button>

                {openFilter === "category" && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-lg w-56 z-20 max-h-72 overflow-y-auto">
                    {uniqueCategories.map((c) => (
                      <div
                        key={c}
                        onClick={() => {
                          setCategoryFilter(c);
                          setOpenFilter(null);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABLE */}
          {filteredData.length > 0 && (
            <div className="px-10 pb-8">
              <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left">RFP ID</th>
                      <th className="px-6 py-4 text-left">Title</th>
                      <th className="px-6 py-4 text-left">Organization</th>
                      <th className="px-6 py-4 text-center">Deadline</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredData.map((rfp, idx) => (
                      <tr key={rfp.rfp_id || idx}>
                        <td className="px-6 py-4 font-mono text-xs text-blue-600">
                          {rfp.rfp_id}
                        </td>
                        <td className="px-6 py-4">{rfp.title}</td>
                        <td className="px-6 py-4">{rfp.organization}</td>
                        <td className="px-6 py-4 text-center">
                          {formatDate(rfp.deadline)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${getStatusStyles(
                              rfp.status
                            )}`}
                          >
                            {rfp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <MoreVertical size={18} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EMPTY */}
          {filteredData.length === 0 && !error && (
            <div className="px-10 py-32 text-center">
              <AlertCircle size={56} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold text-lg">
                No matching RFPs
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default AllRFPs;
