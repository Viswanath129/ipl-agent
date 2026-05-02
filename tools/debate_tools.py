from data.mock_db import get_mock_player_stats

def fetch_player_stats(player1: str, player2: str) -> dict:
    """
    Fetches comparative stats, legacy, and clutch scores for two players for debate.
    
    Args:
        player1 (str): First player name.
        player2 (str): Second player name.
        
    Returns:
        dict: A structured comparison.
    """
    p1_stats = get_mock_player_stats(player1)
    p2_stats = get_mock_player_stats(player2)
    
    return {
        player1: p1_stats,
        player2: p2_stats,
        "comparison": f"{player1} vs {player2} statistical breakdown."
    }

def detect_fan_bias(topic: str, query: str) -> str:
    """
    Analyzes the query and topic to detect underlying emotional polarization or fan bias.
    
    Args:
        topic (str): The debate topic.
        query (str): The user's input query.
        
    Returns:
        str: Bias level.
    """
    lower_q = query.lower()
    if "goat" in lower_q or "always" in lower_q or "destroyed" in lower_q:
        return "high emotional polarization"
    if "better" in lower_q or "stats" in lower_q:
        return "moderate bias"
    return "low bias / analytical"
