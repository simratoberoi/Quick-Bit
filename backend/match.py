import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def match_rfps_with_catalogue(rfp_df):
    # Load product catalogue
    catalogue_df = pd.read_csv("product_catalogue_rows.csv")

    # Use lowercase "sku" as the key column
    SKU_COL = "sku"

    # Build product descriptions for matching
    catalogue_df["combined_text"] = (
        catalogue_df["product_name"].astype(str) + " " +
        catalogue_df["category"].astype(str) + " " +
        catalogue_df["standard_iec"].astype(str)
    )

    # Build RFP text for matching
    rfp_df["combined_text"] = (
        rfp_df["title"].astype(str) + " " +
        rfp_df["description"].astype(str)
    )

    # Vectorize
    vectorizer = TfidfVectorizer()
    tfidf_matrix_catalogue = vectorizer.fit_transform(catalogue_df["combined_text"])
    tfidf_matrix_rfp = vectorizer.transform(rfp_df["combined_text"])

    # Compute cosine similarity
    similarity_scores = cosine_similarity(tfidf_matrix_rfp, tfidf_matrix_catalogue)

    # Find best match for each RFP
    best_matches = similarity_scores.argmax(axis=1)
    best_scores = similarity_scores.max(axis=1)

    # Attach match results
    rfp_df["matched_sku"] = [
        catalogue_df.iloc[idx][SKU_COL] for idx in best_matches
    ]
    rfp_df["match_percent"] = (best_scores * 100).round(2)

    return rfp_df
