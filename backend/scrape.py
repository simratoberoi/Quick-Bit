import requests
from bs4 import BeautifulSoup
import pandas as pd
from config import RFP_LISTING_URL

def safe_text(element):
    return element.text.strip() if element else ""

def scrape_rfps():
    response = requests.get(RFP_LISTING_URL)
    soup = BeautifulSoup(response.text, "lxml")

    rfp_cards = soup.select(".rfp-card")

    rfp_data = []

    for card in rfp_cards:
        title = safe_text(card.select_one(".rfp-title"))
        rfp_id = safe_text(card.select_one(".rfp-id"))
        status = safe_text(card.select_one(".status-badge"))
        desc = safe_text(card.select_one(".rfp-description"))

        rfp_data.append({
            "rfp_id": rfp_id,
            "title": title,
            "status": status,
            "description": desc
        })

    df = pd.DataFrame(rfp_data)
    df.to_csv("data/scraped_rfps.csv", index=False)

    return df
