// MatchedProducts.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Package, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  FileText
} from "lucide-react";

const MatchedProducts = () => {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMatchedProducts();
  }, [rfpId]);

  const fetchMatchedProducts = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/rfps/${rfpId}/matched-products`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setData(result);
      } else {
        setError(result.error || "Failed to fetch matched products");
      }
    } catch (error) {
      setError(`Connection error: ${error.message}`);
      console.error("Error fetching matched products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority) => {
    switch(priority) {
      case 'High': 
        return "bg-red-100 text-red-700 border-red-200";
      case 'Medium': 
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 'Low': 
        return "bg-green-100 text-green-700 border-green-200";
      default: 
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-blue-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading matched products...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing RFP requirements</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Matches</h2>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => navigate(-1)} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  ← Back to RFPs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { rfp, matched_products } = data;
  // Show only top 3 products
  const displayProducts = matched_products.slice(0, 3);

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
      >
        <ArrowLeft size={16} />
        Back to RFPs
      </button>

      {/* RFP Details Card */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                RFP DETAILS
              </span>
              <span className="font-mono text-xs text-gray-500">
                #{rfp.rfp_id}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {rfp.title}
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            rfp.status.toLowerCase() === 'closed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {rfp.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Organization</p>
            <p className="font-semibold text-gray-900">{rfp.organization}</p>
          </div>
          
          {rfp.department && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Department</p>
              <p className="font-semibold text-gray-900">{rfp.department}</p>
            </div>
          )}
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Deadline</p>
            <p className="font-semibold text-gray-900">{rfp.deadline}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="font-semibold text-gray-900">{rfp.category}</p>
          </div>
        </div>

        {rfp.description && (
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{rfp.description}</p>
          </div>
        )}
      </div>

      {/* Matched Products Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Top 3 Matched Products</h2>
            <p className="text-sm text-gray-500 mt-1">
              Best {displayProducts.length} products matching your RFP requirements
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-50 rounded-lg">
            <span className="text-sm font-semibold text-blue-700">
              Showing Top {displayProducts.length}
            </span>
          </div>
        </div>

        {/* Products Grid - 3 columns for top 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayProducts.map((product, index) => (
            <div 
              key={product.sku} 
              className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                    #{index + 1} MATCH
                  </span>
                  <span className={`px-3 py-1 border rounded-full text-xs font-bold ${getPriorityStyles(product.priority)}`}>
                    {product.priority}
                  </span>
                </div>
                
                {/* Match Score Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Match Score</span>
                    <span className={`text-lg font-bold ${getMatchScoreColor(product.match_percent)}`}>
                      {product.match_percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        product.match_percent >= 70 ? 'bg-green-500' :
                        product.match_percent >= 50 ? 'bg-blue-500' :
                        product.match_percent >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${product.match_percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {product.product_name}
                </h3>
                <p className="text-xs font-mono text-gray-500 mb-4">
                  SKU: {product.sku}
                </p>

                {/* Technical Specs */}
                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package size={14} />
                    Technical Specifications
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">Category</p>
                      <p className="text-xs font-semibold text-gray-900">{product.category}</p>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">Material</p>
                      <p className="text-xs font-semibold text-gray-900">{product.conductor_material}</p>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">Size</p>
                      <p className="text-xs font-semibold text-gray-900">{product.conductor_size_sqmm} sqmm</p>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-0.5">Voltage</p>
                      <p className="text-xs font-semibold text-gray-900">{product.voltage_rating} kV</p>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded-lg col-span-2">
                      <p className="text-xs text-gray-500 mb-0.5">Standard</p>
                      <p className="text-xs font-semibold text-gray-900">{product.standard_iec}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={14} className="text-yellow-700" />
                    <span className="text-xs font-semibold text-yellow-800">PRICING</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-yellow-700 mb-1">Unit Price</p>
                      <p className="text-base font-bold text-yellow-900">₹{product.unit_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-700 mb-1">Test Price</p>
                      <p className="text-base font-bold text-yellow-900">₹{product.test_price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-xs flex items-center justify-center gap-1">
                    <CheckCircle size={14} />
                    Select
                  </button>
                  <button className="px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-xs flex items-center justify-center gap-1">
                    <FileText size={14} />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {displayProducts.length === 0 && (
        <div className="bg-white border rounded-xl p-12 text-center">
          <AlertCircle size={56} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Matched Products Found
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            No products in the catalogue match this RFP's requirements
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Back to RFPs
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchedProducts;