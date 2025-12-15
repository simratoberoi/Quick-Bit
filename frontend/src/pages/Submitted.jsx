import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle, Download } from "lucide-react";
import html2pdf from "html2pdf.js";

 const BACKEND_URL = import.meta.env.VITE_API_URL;

const SubmittedRFPs = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const fetchSubmitted = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/submitted`);
      const result = await response.json();
      if (result.success && result.data) setSubmittedData(result.data);
      else {
        setError(result.error || "Failed to fetch submitted RFPs");
        setSubmittedData([]);
      }
    } catch (err) {
      setError(`Connection error: ${err.message}.`);
      setSubmittedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmitted();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    }
    return new Date(dateStr).toLocaleDateString("en-GB").replace(/\//g, "-");
  };

  const handleDownloadProposal = async (rfp) => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/rfps/${rfp.rfp_id}/matched-products`
      );
      const result = await response.json();
      if (!result.success) return alert("Failed to fetch proposal details.");
      const rfpDetails = result.rfp;
      const matchedProduct = result.matched_products[0];

      const proposalText = `TECHNICAL & COMMERCIAL PROPOSAL\nRFP ID: ${rfpDetails.rfp_id}\nTitle: ${rfpDetails.title}\nMatch: ${matchedProduct.match_percent}%`;

      const element = document.createElement("div");
      element.style.padding = "20px";
      element.style.fontFamily = "Arial, sans-serif";
      element.style.fontSize = "12px";
      element.style.lineHeight = "1.6";
      element.style.whiteSpace = "pre-wrap";
      element.textContent = proposalText;

      html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `Proposal_${rfp.rfp_id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
        })
        .from(element)
        .save();
    } catch (err) {
      console.error(err);
      alert("Failed to download proposal.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="flex-1 p-6 lg:p-8 bg-gray-50 min-h-screen transition-all duration-300">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Submitted RFPs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track proposals that have been successfully submitted.
        </p>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Error loading RFPs</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchSubmitted}
              className="text-xs text-red-700 underline mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <RefreshCw size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading submitted RFPs...</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && submittedData.length > 0 && (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">RFP Title</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Deadline</th>
                <th className="px-6 py-3 text-center">Match Score</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submittedData.map((rfp) => (
                <tr key={rfp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{rfp.title}</td>
                  <td className="px-6 py-4 text-gray-700">{rfp.client}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(rfp.deadline)}</td>
                  <td className="px-6 py-4 text-center font-semibold text-blue-600">
                    {rfp.match_percent > 0 ? `${rfp.match_percent.toFixed(1)}%` : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                      {rfp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDownloadProposal(rfp)}
                      className="px-3 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty */}
      {!loading && submittedData.length === 0 && !error && (
        <div className="flex justify-center items-center py-32 text-center">
          <AlertCircle size={56} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg">No submitted RFPs</p>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Submitted proposals will appear here
          </p>
          <button
            onClick={fetchSubmitted}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>
      )}
    </main>
  );
};

export default SubmittedRFPs;
