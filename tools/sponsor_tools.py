from data.mock_db import get_mock_sponsor_data

def calculate_roi(brand_name: str, spend: float) -> dict:
    """
    Calculates the ROI, visibility score, and engagement metrics for an IPL sponsor.
    
    Args:
        brand_name (str): The name of the brand/sponsor (e.g., 'Dream11').
        spend (float): The total spend by the sponsor in INR crores.
    
    Returns:
        dict: A dictionary containing visibility, sentiment, mentions, and ROI.
    """
    data = get_mock_sponsor_data(brand_name)
    multiplier = spend / 10 if spend > 0 else 1
    
    return {
        "brand_name": brand_name,
        "visibility_score": min(100, int(data["visibility_score"] * multiplier)),
        "social_mentions": int(data["social_mentions"] * multiplier),
        "sentiment": data["sentiment"],
        "estimated_roi": data["roi"],
        "best_player_association": data["player"],
        "best_content_channel": data["channel"],
        "recommendation": data["rec"]
    }
