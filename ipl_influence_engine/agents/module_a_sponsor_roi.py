import re
from tools.sponsor_tools import sponsor_roi_tool

def run_sponsor_agent(query: str) -> dict:
    """Runs the Sponsor Agent to generate an ROI report."""
    brand = "Dream11"
    for candidate in ["Dream11", "CEAT", "Puma", "Tata", "Jio", "Qatar Airways"]:
        if candidate.lower() in query.lower():
            brand = candidate
            break
    match = "Overall"
    match_match = re.search(r"\b(MI|CSK|RCB|KKR|SRH|GT|DC|PBKS|RR|LSG)\s+vs\s+(MI|CSK|RCB|KKR|SRH|GT|DC|PBKS|RR|LSG)\b", query, re.IGNORECASE)
    if match_match:
        match = f"{match_match.group(1).upper()} vs {match_match.group(2).upper()}"

    return sponsor_roi_tool(brand=brand, team=match)
