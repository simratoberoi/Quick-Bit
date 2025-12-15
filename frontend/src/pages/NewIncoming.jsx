import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  AlertCircle,
  Package,
} from "lucide-react";

const getPriorityStyles = (priority) => {
  if (priority === "High") return "bg-red-100 text-red-700";
  if (priority === "Medium") return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
};

const BACKEND_URL = "http://127.0.0.1:5000";

const NewIncoming = () => {
  const navigate = useNavigate();

  const [rfpData, setRfpData] = useState([]);
  const [submittedRfpIds, setSubmittedRfpIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔴 start in loading mode
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  // Fetch new incoming RFPs
  // ------------------------
  const fetchNewIncoming = async () => {
    setLoading(true);
    setError(null);
    setRfpData([]); // 🔥 clear stale data immediately

    try {
      const response = await fetch(`${BACKEND_URL}/new-incoming`);
      const result = await response.json();

      if (result.success && result.data) {
        setRfpData(result.data);
      } else {
        setError(result.error || "Failed to fetch new RFPs");
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
      await fetchNewIncoming();
    };

    init();
  }, []);

  // ------------------------
  // Navigation handlers
  // ------------------------
  const handleViewMatches = (rfpId) => {
    setRfpData([]);
    setLoading(true);
    navigate(`/rfps/${rfpId}/matched-products`);
  };

  const handleGenerateProposal = (rfpId) => {
    navigate(`/rfps/${rfpId}/edit-proposal`);
  };

  // ------------------------
  // Filtering logic
  // ------------------------
  const filteredData = rfpData.filter((rfp) => {
    const matchesSearch =
      searchTerm === "" ||
      rfp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfp.rfp_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const isNotSubmitted = !submittedRfpIds.includes(rfp.rfp_id);

    return matchesSearch && isNotSubmitted;
  });

  return (
    <main className="flex-1 p-6 lg:p-8 bg-gray-50 min-h-screen transition-all duration-300">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          New / Incoming RFPs
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Newly detected work opportunities waiting to be reviewed.
        </p>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              Error loading RFPs
            </p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchNewIncoming}
              className="text-xs text-red-700 underline mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by RFP title or client name..."
            className="pl-10 pr-3 py-2 w-full border rounded-lg text-sm"
          />
        </div>

        <button
          onClick={fetchNewIncoming}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm bg-white flex-shrink-0"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">
            {loading ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <RefreshCw
              size={48}
              className="animate-spin text-blue-600 mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium">
              Fetching new RFPs from backend...
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && filteredData.length > 0 && (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase border-b">
              <tr>
                <th className="px-6 py-4 text-left">RFP ID</th>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-center">Match</th>
                <th className="px-6 py-4 text-center">Priority</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.map((rfp) => (
                <tr key={rfp.id}>
                  <td className="px-6 py-4 font-mono text-xs text-blue-600">
                    {rfp.rfp_id}
                  </td>
                  <td className="px-6 py-4">{rfp.title}</td>
                  <td className="px-6 py-4">{rfp.client}</td>
                  <td className="px-6 py-4 text-center font-bold text-blue-600">
                    {rfp.match_percent.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getPriorityStyles(
                        rfp.priority
                      )}`}
                    >
                      {rfp.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleViewMatches(rfp.rfp_id)}
                      className="px-3 py-2 bg-purple-600 text-white text-xs rounded-md"
                    >
                      <Package size={14} className="inline mr-1" />
                      View Matches
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredData.length === 0 && !error && (
        <div className="flex justify-center items-center py-32 text-center">
          <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">No new RFPs found</p>
        </div>
      )}
    </main>
  );
};


export default NewIncoming;
