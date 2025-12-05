from flask import Flask, jsonify
from scrape import scrape_rfps
from match import match_rfps_with_catalogue
from generate import generate_proposal

app = Flask(__name__)

# --------------------------------------------------------
# Health check route (prevents 404 when opening server URL)
# --------------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend running", "message": "RFP automation API"})


# --------------------------------------------------------
# Main pipeline endpoint
# --------------------------------------------------------
@app.route("/run", methods=["GET"])
def run_pipeline():
    try:
        # 1. SCRAPE RFP LISTINGS
        scraped_df = scrape_rfps()

        # Ensure scraping returned rows
        if scraped_df is None or scraped_df.empty:
            return jsonify({"error": "Scraping returned no results"}), 500

        # 2. MATCH RFPs WITH PRODUCT CATALOG
        matched_df = match_rfps_with_catalogue(scraped_df)

        if matched_df is None or matched_df.empty:
            return jsonify({"error": "Matching failed"}), 500

        # 3. GENERATE PROPOSALS
        proposals = []
        for _, row in matched_df.iterrows():
            title = row.get("title", "")
            match_percent = row.get("match_percent", 0)

            proposal_text = generate_proposal(title, match_percent)

            proposals.append({
                "rfp_id": row.get("rfp_id"),
                "proposal": proposal_text
            })

        # Return everything in JSON-safe format
        return jsonify({
            "scraped_rfps": scraped_df.to_dict(orient="records"),
            "match_results": matched_df.to_dict(orient="records"),
            "proposals": proposals
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------------
# Local Debug Server
# --------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
