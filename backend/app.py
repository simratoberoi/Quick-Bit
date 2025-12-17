from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pandas as pd
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import csv
from scrape import scrape_rfps
from match import match_rfps_with_catalogue
from generate import generate_proposal
from smtplib import SMTPAuthenticationError

load_dotenv()

app = Flask(__name__)
CORS(app)



def fix_date(date_str):
    """Convert scraped date into ISO (YYYY-MM-DD). Returns the original string if parsing fails."""

    if not date_str or not isinstance(date_str, str):
        return date_str

    original_str = date_str.strip()
    
    cleaned = (
        date_str.replace("IST", "")
                .replace("at", "")
                .replace(",", "")
                .replace("|", "")
                .strip()
    )

    if not cleaned:
        return original_str

    
    date_part = cleaned.split(" ")[0]

    formats = [
        "%d-%b-%Y",     
        "%d-%b-%y",     
        "%d-%m-%Y",     
        "%d-%m-%y",     
        "%d/%m/%Y",    
        "%d/%m/%y",   
        "%d %B %Y",   
        "%d %b %Y",    
        "%b %d %Y",    
        "%Y-%m-%d",    
        "%m/%d/%Y",   
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(date_part, fmt)
            return dt.strftime("%Y-%m-%d")
        except:
            continue

   
    return original_str


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "✓ Backend running",
        "message": "RFP Automation API",
        "endpoints": {
            "/": "Health check",
            "/run": "Run full pipeline (scrape → match → generate)",
            "/scrape": "Scrape RFPs only",
            "/match": "Match scraped RFPs with catalogue",
            "/proposals": "Generate proposals from matched data",
            "/new-incoming": "Fetch new incoming RFPs with matches and priorities",
            "/dashboard-rfps": "Fetch all RFPs for dashboard display"
        }
    })



@app.route("/run", methods=["GET"])
def run_pipeline():
    try:
        print("\n" + "="*60)
        print("STARTING RFP AUTOMATION PIPELINE")
        print("="*60)


        print("\n[1/3] Scraping RFP listings...")
        scraped_df = scrape_rfps()

        if scraped_df is None or scraped_df.empty:
            return jsonify({"error": "Scraping returned no results"}), 500


        if "deadline" in scraped_df.columns:
            scraped_df["deadline"] = scraped_df["deadline"].apply(fix_date)


        print("\n[2/3] Matching RFPs with product catalogue...")
        matched_df = match_rfps_with_catalogue(scraped_df)

        if matched_df is None or matched_df.empty:
            return jsonify({"error": "Matching failed"}), 500


        if "deadline" in matched_df.columns:
            matched_df["deadline"] = matched_df["deadline"].apply(fix_date)


        print("\n[3/3] Generating proposals...")
        proposals = []
        for idx, row in matched_df.iterrows():
            proposal_text = generate_proposal(row)

            proposals.append({
                "rfp_id": row.get("rfp_id"),
                "title": row.get("title"),
                "organization": row.get("organization"),
                "deadline": fix_date(row.get("deadline")),
                "matched_sku": row.get("matched_sku"),
                "match_percent": float(row.get("match_percent", 0)),
                "matched_product": row.get("matched_product_name"),
                "unit_price": float(row.get("unit_price", 0)),
                "proposal": proposal_text
            })

        print(f"\n✓ Pipeline completed successfully!")
        print("="*60 + "\n")

        return jsonify({
            "success": True,
            "summary": {
                "total_rfps": len(scraped_df),
                "matched_rfps": len(matched_df),
                "proposals_generated": len(proposals),
                "avg_match_score": float(matched_df["match_percent"].mean())
            },
            "scraped_rfps": scraped_df.to_dict(orient="records"),
            "match_results": matched_df[["rfp_id", "title", "matched_sku", "match_percent"]].to_dict(orient="records"),
            "proposals": proposals
        })

    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500



@app.route("/scrape", methods=["GET"])
def scrape_only():
    try:
        df = scrape_rfps()

        if df is None or df.empty:
            return jsonify({"success": False, "error": "No RFPs found"}), 404

        if "deadline" in df.columns:
            df["deadline"] = df["deadline"].apply(fix_date)

        return jsonify({
            "success": True,
            "count": len(df),
            "data": df.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500



@app.route("/match", methods=["POST"])
def match_only():
    try:
        df = pd.read_csv("scraped_rfps.csv")


        if "deadline" in df.columns:
            df["deadline"] = df["deadline"].apply(fix_date)

        matched_df = match_rfps_with_catalogue(df)

        if matched_df is None:
            return jsonify({"error": "Matching failed"}), 500

        if "deadline" in matched_df.columns:
            matched_df["deadline"] = matched_df["deadline"].apply(fix_date)

        return jsonify({
            "success": True,
            "count": len(matched_df),
            "data": matched_df.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/new-incoming", methods=["GET"])
def new_incoming():
    """
    Fetch newly scraped RFPs with match percentages and priority levels
    Excludes RFPs with 'Closed' status
    Returns: List of new/incoming RFPs with priority assignment
    """
    try:
        print("\n[NEW-INCOMING] Fetching and processing new RFPs...")
        
        scraped_df = scrape_rfps()
        
        if scraped_df is None or scraped_df.empty:
            return jsonify({
                "success": False,
                "error": "No RFPs found during scraping",
                "data": []
            }), 404
        

        scraped_df = scraped_df[scraped_df["status"].str.lower() != "closed"]
        
        if scraped_df.empty:
            return jsonify({
                "success": False,
                "error": "No open RFPs found (all are closed)",
                "data": []
            }), 404
        

        if "deadline" in scraped_df.columns:
            scraped_df["deadline"] = scraped_df["deadline"].apply(fix_date)
        

        matched_df = match_rfps_with_catalogue(scraped_df)
        
        if matched_df is None or matched_df.empty:
            return jsonify({
                "success": False,
                "error": "Matching failed",
                "data": []
            }), 500
        

        if "deadline" in matched_df.columns:
            matched_df["deadline"] = matched_df["deadline"].apply(fix_date)

        new_incoming_data = []
        for idx, row in matched_df.iterrows():
            new_incoming_data.append({
                "id": idx + 1,
                "rfp_id": row.get("rfp_id", ""),
                "title": row.get("title", ""),
                "client": row.get("organization", ""),
                "department": row.get("department", ""),
                "deadline": row.get("deadline", ""),
                "detection": "Recently detected",
                "match_percent": float(row.get("match_percent", 0)),
                "priority": row.get("priority", "Low"),
                "matched_product": row.get("matched_product_name", ""),
                "matched_sku": row.get("matched_sku", ""),
                "category": row.get("category", ""),
                "status": row.get("status", "")
            })
        
        print(f"✓ Retrieved {len(new_incoming_data)} new incoming RFPs (closed RFPs excluded)")
        
        return jsonify({
            "success": True,
            "count": len(new_incoming_data),
            "data": new_incoming_data
        })
    
    except Exception as e:
        import traceback
        print(f"✗ Error in /new-incoming: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "data": []
        }), 500


@app.route("/submitted", methods=["GET"])
def submitted():
    """
    Fetch all submitted RFPs (tracked in submitted_rfps.csv)
    Returns: List of submitted RFPs regardless of their original status
    """
    try:
        print("\n[SUBMITTED] Fetching submitted RFPs...")
        
        submitted_file = "submitted_rfps.csv"
        

        if not os.path.exists(submitted_file):
            return jsonify({
                "success": True,
                "error": "No submitted RFPs yet",
                "count": 0,
                "data": []
            }), 200
        

        submitted_ids = []
        try:
            with open(submitted_file, 'r', newline='') as f:
                reader = csv.DictReader(f)
                if reader.fieldnames:
                    submitted_ids = [row['rfp_id'] for row in reader]
        except Exception as e:
            print(f"✗ Error reading submitted file: {str(e)}")
            return jsonify({
                "success": True,
                "error": "Could not read submitted RFPs",
                "count": 0,
                "data": []
            }), 200
        
        if not submitted_ids:
            return jsonify({
                "success": True,
                "error": "No submitted RFPs yet",
                "count": 0,
                "data": []
            }), 200
        

        scraped_df = scrape_rfps()
        
        if scraped_df is None or scraped_df.empty:
            return jsonify({
                "success": True,
                "error": "No RFPs found during scraping",
                "count": 0,
                "data": []
            }), 200
        

        submitted_df = scraped_df[scraped_df['rfp_id'].isin(submitted_ids)]
        
        if submitted_df.empty:
            return jsonify({
                "success": True,
                "error": "No submitted RFPs found",
                "count": 0,
                "data": []
            }), 200
        

        if "deadline" in submitted_df.columns:
            submitted_df["deadline"] = submitted_df["deadline"].apply(fix_date)
        

        matched_df = match_rfps_with_catalogue(submitted_df)
        
        if matched_df is None:
            matched_df = submitted_df
        else:
            if "deadline" in matched_df.columns:
                matched_df["deadline"] = matched_df["deadline"].apply(fix_date)
        

        submitted_data = []
        for idx, row in matched_df.iterrows():
            submitted_data.append({
                "id": idx + 1,
                "rfp_id": row.get("rfp_id", ""),
                "title": row.get("title", ""),
                "client": row.get("organization", ""),
                "deadline": row.get("deadline", ""),
                "status": "Submitted",
                "priority": row.get("priority", "Medium"),
                "match_percent": float(row.get("match_percent", 0)) if "match_percent" in row else 0,
                "matched_product": row.get("matched_product_name", ""),
                "matched_sku": row.get("matched_sku", ""),
                "department": row.get("department", ""),
                "category": row.get("category", "")
            })
        
        print(f"✓ Retrieved {len(submitted_data)} submitted RFPs")
        
        return jsonify({
            "success": True,
            "count": len(submitted_data),
            "data": submitted_data
        })
    
    except Exception as e:
        import traceback
        print(f"✗ Error in /submitted: {str(e)}")
        return jsonify({
            "success": True,
            "error": "Could not fetch submitted RFPs",
            "count": 0,
            "data": []
        }), 200

@app.route("/dashboard-rfps", methods=["GET"])
def dashboard_rfps():
    """
    Fetch all scraped RFPs for dashboard display
    Maps status: Open/Active → 'In Progress', Closed → 'Submitted'
    Returns: List of all RFPs with mapped status
    """
    try:
        print("\n[DASHBOARD] Fetching all RFPs for dashboard...")
        

        scraped_df = scrape_rfps()
        
        if scraped_df is None or scraped_df.empty:
            return jsonify({
                "success": False,
                "error": "No RFPs found during scraping",
                "data": []
            }), 404
        

        if "deadline" in scraped_df.columns:
            scraped_df["deadline"] = scraped_df["deadline"].apply(fix_date)
        

        matched_df = match_rfps_with_catalogue(scraped_df)
        
        if matched_df is None:
            matched_df = scraped_df
        else:

            if "deadline" in matched_df.columns:
                matched_df["deadline"] = matched_df["deadline"].apply(fix_date)
        

        dashboard_data = []
        for idx, row in matched_df.iterrows():
            original_status = str(row.get("status", "")).lower()
            if original_status == "closed":
                display_status = "Submitted"
            elif original_status in ["open", "active", "opening soon"]:
                display_status = "In Progress"
            else:
                display_status = "Pending"
            
            dashboard_data.append({
                "id": idx + 1,
                "rfp_id": row.get("rfp_id", ""),
                "title": row.get("title", ""),
                "client": row.get("organization", ""),
                "deadline": row.get("deadline", ""),
                "status": display_status,
                "match": float(row.get("match_percent", 0)),
                "priority": row.get("priority", "Medium"),
                "matched_product": row.get("matched_product_name", ""),
                "matched_sku": row.get("matched_sku", ""),
                "department": row.get("department", ""),
                "category": row.get("category", ""),
                "original_status": original_status
            })
        
        print(f"✓ Retrieved {len(dashboard_data)} RFPs for dashboard")
        
        return jsonify({
            "success": True,
            "count": len(dashboard_data),
            "data": dashboard_data
        })
    
    except Exception as e:
        import traceback
        print(f"✗ Error in /dashboard-rfps: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc(),
            "data": []
        }), 500


@app.route("/rfps/<rfp_id>/matched-products", methods=["GET"])
def get_matched_products(rfp_id):
    """
    Get top 3 matched products for a specific RFP
    """
    try:
        print(f"\n[MATCHED-PRODUCTS] Fetching matches for RFP: {rfp_id}")
        

        try:
            scraped_df = pd.read_csv("scraped_rfps.csv")
        except FileNotFoundError:

            scraped_df = scrape_rfps()
            if scraped_df is None or scraped_df.empty:
                return jsonify({
                    "success": False,
                    "error": "No RFPs found"
                }, 404)
        

        rfp_row = scraped_df[scraped_df['rfp_id'] == rfp_id]
        
        if rfp_row.empty:
            return jsonify({
                "success": False,
                "error": f"RFP with ID '{rfp_id}' not found"
            }, 404)
        

        try:
            catalogue_df = pd.read_csv("product_catalogue_rows.csv")
        except FileNotFoundError:
            return jsonify({
                "success": False,
                "error": "Product catalogue not found"
            }), 500

        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        rfp_text = (
            str(rfp_row.iloc[0].get("title", "")) + " " +
            str(rfp_row.iloc[0].get("description", "")) + " " +
            str(rfp_row.iloc[0].get("requirements", "")) + " " +
            str(rfp_row.iloc[0].get("category", ""))
        )
        

        catalogue_df["combined_text"] = (
            catalogue_df["product_name"].fillna("").astype(str) + " " +
            catalogue_df["category"].fillna("").astype(str) + " " +
            catalogue_df["conductor_material"].fillna("").astype(str) + " " +
            catalogue_df["standard_iec"].fillna("").astype(str) + " " +
            catalogue_df["conductor_size_sqmm"].fillna("").astype(str) + " sqmm " +
            catalogue_df["voltage_rating"].fillna("").astype(str) + " kV"
        )

        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            max_df=0.95
        )
        
        tfidf_catalogue = vectorizer.fit_transform(catalogue_df["combined_text"])
        tfidf_rfp = vectorizer.transform([rfp_text])
        
        similarity_scores = cosine_similarity(tfidf_rfp, tfidf_catalogue)[0]
        

        top_n = 3 
        top_indices = similarity_scores.argsort()[-top_n:][::-1]
        top_scores = similarity_scores[top_indices]
        

        matched_products = []
        for idx, score in zip(top_indices, top_scores):
            product = catalogue_df.iloc[idx]
            match_percent = round(score * 100, 2)

            if match_percent > 50:
                priority = "High"
            elif match_percent > 30:
                priority = "Medium"
            else:
                priority = "Low"
            
            matched_products.append({
                "sku": str(product.get("sku", "")),
                "product_name": str(product.get("product_name", "")),
                "category": str(product.get("category", "")),
                "conductor_material": str(product.get("conductor_material", "N/A")),
                "conductor_size_sqmm": str(product.get("conductor_size_sqmm", "N/A")),
                "voltage_rating": str(product.get("voltage_rating", "N/A")),
                "standard_iec": str(product.get("standard_iec", "N/A")),
                "unit_price": float(product.get("unit_price", 0)),
                "test_price": float(product.get("test_price", 0)),
                "match_percent": match_percent,
                "priority": priority
            })
        

        rfp_details = {
            "rfp_id": str(rfp_row.iloc[0].get("rfp_id", "")),
            "title": str(rfp_row.iloc[0].get("title", "")),
            "description": str(rfp_row.iloc[0].get("description", "")),
            "organization": str(rfp_row.iloc[0].get("organization", "")),
            "department": str(rfp_row.iloc[0].get("department", "")),
            "category": str(rfp_row.iloc[0].get("category", "")),
            "deadline": fix_date(rfp_row.iloc[0].get("deadline", "")),
            "status": str(rfp_row.iloc[0].get("status", ""))
        }
        
        print(f"✓ Found {len(matched_products)} matched products for RFP {rfp_id}")
        
        return jsonify({
            "success": True,
            "rfp": rfp_details,
            "matched_products": matched_products,
            "total_matches": len(matched_products)
        })
        
    except Exception as e:
        import traceback
        print(f"✗ Error in /rfps/{rfp_id}/matched-products: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


def mark_rfp_as_submitted(rfp_id):
    """
    Track submitted RFP in a separate CSV file
    """
    try:
        submitted_file = "submitted_rfps.csv"

        submitted_rfps = []
        if os.path.exists(submitted_file):
            with open(submitted_file, 'r', newline='') as f:
                reader = csv.DictReader(f)
                if reader.fieldnames:
                    submitted_rfps = list(reader)

        if not any(rfp['rfp_id'] == rfp_id for rfp in submitted_rfps):
            submitted_rfps.append({
                'rfp_id': rfp_id,
                'submitted_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

            with open(submitted_file, 'w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=['rfp_id', 'submitted_date'])
                writer.writeheader()
                writer.writerows(submitted_rfps)
            
            print(f"✓ RFP {rfp_id} marked as submitted")
            return True
        else:
            print(f"⚠ RFP {rfp_id} already marked as submitted")
            return True
            
    except Exception as e:
        print(f"✗ Error marking RFP as submitted: {str(e)}")
        return False


def is_rfp_submitted(rfp_id):
    """
    Check if an RFP has been submitted
    """
    try:
        submitted_file = "submitted_rfps.csv"
        
        if not os.path.exists(submitted_file):
            return False
        
        with open(submitted_file, 'r', newline='') as f:
            reader = csv.DictReader(f)
            if reader.fieldnames:
                return any(rfp['rfp_id'] == rfp_id for rfp in reader)
        
        return False
    except Exception as e:
        print(f"✗ Error checking submitted status: {str(e)}")
        return False

@app.route("/submit-proposal", methods=["POST"])
def submit_proposal():
    """
    Submit proposal via email
    Marks RFP as submitted and sends email to organization contact
    """
    try:
        # safer JSON parsing
        data = request.get_json(force=True, silent=True) or {}
        
        rfp_id = data.get("rfp_id")
        rfp_title = data.get("rfp_title", "")
        organization = data.get("organization", "")
        proposal_text = data.get("proposal_text", "")
        to_email = data.get("to_email", None)

        if not rfp_id:
            return jsonify({"success": False, "error": "Missing rfp_id"}), 400
        if not to_email:
            return jsonify({"success": False, "error": "Missing to_email"}), 400

        print(f"\n[SUBMIT] Submitting proposal for RFP: {rfp_id}")

        sender_email = os.getenv("EMAIL_SENDER", "mockasianpaints@gmail.com")
        sender_password = os.getenv("EMAIL_PASSWORD")
        send_email_flag = os.getenv("SEND_EMAIL", "false").lower() == "true"

        # Mark as submitted first
        mark_rfp_as_submitted(rfp_id)

        # If SEND_EMAIL is not explicitly true, skip email (for hosted environments)
        if not send_email_flag:
            print("⚠ SEND_EMAIL not enabled -> skipping email (RFP marked as submitted).")
            return jsonify({
                "success": True,
                "message": f"Proposal submitted successfully for {organization}",
                "rfp_id": rfp_id,
                "email_sent": False
            }), 200

        # Only attempt SMTP if SEND_EMAIL=true AND password exists
        if not sender_password:
            print("⚠ EMAIL_PASSWORD not set -> cannot send email.")
            return jsonify({
                "success": True,
                "message": f"Proposal submitted successfully for {organization}",
                "rfp_id": rfp_id,
                "email_sent": False
            }), 200

        # Compose email
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Proposal Submission for {rfp_title or rfp_id}"
        msg["From"] = sender_email
        msg["To"] = to_email

        email_body = f"""
Dear Procurement Team,

Please find our technical and commercial proposal for the following RFP:

RFP ID: {rfp_id}
Title: {rfp_title}
Organization: {organization}

{proposal_text}

---
Submitted by: Simrat Pyrotech
Email: {sender_email}
Contact: simratpyrotech@gmail.com

This is an automated submission. Please do not reply to this email.
        """
        part = MIMEText(email_body, "plain")
        msg.attach(part)

        # Attempt SMTP send and provide clearer error responses
        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
                server.login(sender_email, sender_password)
                server.send_message(msg)
            print(f"✓ Proposal email sent to {to_email}")

            return jsonify({
                "success": True,
                "message": f"Proposal submitted successfully to {organization}",
                "rfp_id": rfp_id,
                "email_sent_to": to_email,
                "email_sent": True
            }), 200

        except SMTPAuthenticationError as auth_err:
            print(f"✗ SMTP Authentication Error: {str(auth_err)}")
            return jsonify({
                "success": True,
                "message": f"Proposal submitted successfully for {organization} (email delivery failed)",
                "rfp_id": rfp_id,
                "email_sent": False,
                "warning": "RFP marked as submitted but email could not be sent."
            }), 200

        except smtplib.SMTPException as smtp_err:
            print(f"✗ SMTP Error: {str(smtp_err)}")
            return jsonify({
                "success": True,
                "message": f"Proposal submitted successfully for {organization} (email delivery failed)",
                "rfp_id": rfp_id,
                "email_sent": False,
                "warning": "RFP marked as submitted but email could not be sent."
            }), 200

    except Exception as e:
        import traceback
        print(f"✗ Error in /submit-proposal: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


if __name__ == "__main__":
    print("\n" + "="*60)
    print("RFP AUTOMATION BACKEND SERVER")
    print("="*60)
    app.run(debug=True, host='0.0.0.0', port=5000)