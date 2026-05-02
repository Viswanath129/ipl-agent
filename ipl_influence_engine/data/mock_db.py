def get_mock_sponsor_data(brand_name: str, match: str = "Overall") -> dict:
    """Mock database lookup for sponsor ROI data."""
    data = {
        "Dream11": {
            "visibility_score": 92, "social_mentions": 140000, 
            "sentiment": "positive", "roi": "312%", 
            "player": "Rohit Sharma", "channel": "Instagram reels", 
            "rec": "Increase spend in death overs branding"
        },
        "CEAT": {
            "visibility_score": 85, "social_mentions": 95000, 
            "sentiment": "positive", "roi": "250%", 
            "player": "Shreyas Iyer", "channel": "Twitter threads", 
            "rec": "Focus on strategic timeouts"
        },
        "Puma": {
            "visibility_score": 98, "social_mentions": 250000, 
            "sentiment": "very positive", "roi": "450%", 
            "player": "Virat Kohli", "channel": "YouTube Shorts", 
            "rec": "Double down on Kohli behind-the-scenes"
        }
    }
    return data.get(brand_name, {
        "visibility_score": 70, "social_mentions": 50000, 
        "sentiment": "neutral", "roi": "150%", 
        "player": "Unknown", "channel": "TV Ads", 
        "rec": "Optimize targeting"
    })

def get_mock_player_stats(player_name: str) -> dict:
    """Mock database lookup for player statistics."""
    stats = {
        "Kohli": {"runs": 8000, "strike_rate": 131.9, "titles": 0, "clutch_score": 85, "legacy": "King of Chases"},
        "Dhoni": {"runs": 5000, "strike_rate": 135.9, "titles": 5, "clutch_score": 98, "legacy": "Captain Cool, Best Finisher"},
        "Rohit": {"runs": 6500, "strike_rate": 130.0, "titles": 5, "clutch_score": 90, "legacy": "Hitman, Master Tactician"},
        "Bumrah": {"wickets": 150, "economy": 7.3, "titles": 5, "clutch_score": 99, "legacy": "Death Over God"}
    }
    return stats.get(player_name, {"runs": 1000, "strike_rate": 120, "titles": 0, "clutch_score": 70, "legacy": "Solid Player"})
