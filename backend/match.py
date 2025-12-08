import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_technical_specs(text):
    """Extract technical specifications from RFP text"""
    specs = {}
    
    # Extract conductor size (e.g., "6 sqmm", "0.75 sqmm")
    size_match = re.search(r'(\d+\.?\d*)\s*sqmm', text, re.IGNORECASE)
    if size_match:
        specs['conductor_size'] = size_match.group(1)
    
    # Extract voltage rating (e.g., "0.6/1 kV", "1.5/1.5 kV")
    voltage_match = re.search(r'(\d+\.?\d*/\d+\.?\d*)\s*kV', text, re.IGNORECASE)
    if voltage_match:
        specs['voltage'] = voltage_match.group(1)
    
    # Extract conductor material
    if re.search(r'\bcopper\b', text, re.IGNORECASE):
        specs['conductor'] = 'copper'
    elif re.search(r'\baluminium\b|\baluminum\b', text, re.IGNORECASE):
        specs['conductor'] = 'aluminium'
    
    # Extract standards
    standards = re.findall(r'(IEC[-\s]?\d+[-\s]?\d*|IS[-\s]?\d+|TUV[-\s]?[\w\-]+)', text, re.IGNORECASE)
    if standards:
        specs['standards'] = ' '.join(standards)
    
    return specs

def assign_priority(match_percent):
    """Assign priority based on match percentage"""
    if match_percent > 50:
        return "High"
    elif match_percent > 30:
        return "Medium"
    else:
        return "Low"

def match_rfps_with_catalogue(rfp_df):
    """Match RFPs with product catalogue using TF-IDF and technical specs"""
    try:
        # Load catalogue
        catalogue_df = pd.read_csv("product_catalogue_rows.csv")
        
        # Ensure requirements column exists
        if "requirements" not in rfp_df.columns:
            rfp_df["requirements"] = ""
        
        # Extract technical specs from descriptions
        rfp_df["tech_specs"] = rfp_df["description"].apply(extract_technical_specs)
        
        # Build rich product descriptions for catalogue
        catalogue_df["combined_text"] = (
            catalogue_df["product_name"].fillna("").astype(str) + " " +
            catalogue_df["category"].fillna("").astype(str) + " " +
            catalogue_df["conductor_material"].fillna("").astype(str) + " " +
            catalogue_df["standard_iec"].fillna("").astype(str) + " " +
            catalogue_df["conductor_size_sqmm"].fillna("").astype(str) + " sqmm " +
            catalogue_df["voltage_rating"].fillna("").astype(str) + " kV"
        )
        
        # Build RFP text
        rfp_df["combined_text"] = (
            rfp_df["title"].fillna("").astype(str) + " " +
            rfp_df["description"].fillna("").astype(str) + " " +
            rfp_df["requirements"].fillna("").astype(str) + " " +
            rfp_df["category"].fillna("").astype(str)
        )
        
        # Vectorize and calculate similarity
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),  # Use bigrams for better matching
            min_df=1,
            max_df=0.95
        )
        tfidf_catalogue = vectorizer.fit_transform(catalogue_df["combined_text"])
        tfidf_rfp = vectorizer.transform(rfp_df["combined_text"])
        
        # Calculate cosine similarity
        similarity_scores = cosine_similarity(tfidf_rfp, tfidf_catalogue)
        
        # Get best matches
        best_matches = similarity_scores.argmax(axis=1)
        best_scores = similarity_scores.max(axis=1)
        
        # Attach matched results
        matched_indices = best_matches
        rfp_df["matched_sku"] = catalogue_df.iloc[matched_indices]["sku"].values
        rfp_df["match_percent"] = (best_scores * 100).round(2)
        
        # Assign priority based on match percentage
        rfp_df["priority"] = rfp_df["match_percent"].apply(assign_priority)
        
        # Add product details
        rfp_df["matched_product_name"] = catalogue_df.iloc[matched_indices]["product_name"].values
        rfp_df["matched_category"] = catalogue_df.iloc[matched_indices]["category"].values
        rfp_df["matched_standard"] = catalogue_df.iloc[matched_indices]["standard_iec"].values
        rfp_df["matched_conductor_material"] = catalogue_df.iloc[matched_indices]["conductor_material"].values
        rfp_df["matched_conductor_size"] = catalogue_df.iloc[matched_indices]["conductor_size_sqmm"].values
        rfp_df["matched_voltage_rating"] = catalogue_df.iloc[matched_indices]["voltage_rating"].values
        rfp_df["unit_price"] = catalogue_df.iloc[matched_indices]["unit_price"].values
        rfp_df["test_price"] = catalogue_df.iloc[matched_indices]["test_price"].values
        
        print(f"✓ Successfully matched {len(rfp_df)} RFPs with catalogue")
        return rfp_df
        
    except Exception as e:
        print(f"✗ Matching failed: {str(e)}")
        return None