from data.mock_db import get_mock_player_stats


KNOWN_PLAYERS = ["Kohli", "Dhoni", "Rohit", "Bumrah"]

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


def debate_tool(topic: str) -> dict:
    """
    Generate a balanced IPL comparison debate.

    Args:
        topic: IPL debate topic, such as "Dhoni vs Rohit as captain".

    Returns:
        dict: Balanced debate output with strengths, verdict, confidence, and bias.
    """
    lower_topic = topic.lower()
    players = [player for player in KNOWN_PLAYERS if player.lower() in lower_topic]
    if len(players) < 2:
        players = ["Dhoni", "Rohit"]

    player_a, player_b = players[0], players[1]
    stats = fetch_player_stats(player_a, player_b)
    bias = detect_fan_bias(topic, topic)

    a_stats = stats[player_a]
    b_stats = stats[player_b]

    return {
        "topic": topic,
        "side_a": player_a,
        "side_b": player_b,
        "side_a_strengths": [
            f"Legacy: {a_stats.get('legacy', 'strong IPL record')}",
            f"Clutch score: {a_stats.get('clutch_score', 'unknown')}",
            f"Titles: {a_stats.get('titles', 'unknown')}",
        ],
        "side_b_strengths": [
            f"Legacy: {b_stats.get('legacy', 'strong IPL record')}",
            f"Clutch score: {b_stats.get('clutch_score', 'unknown')}",
            f"Titles: {b_stats.get('titles', 'unknown')}",
        ],
        "neutral_verdict": (
            f"{player_a} vs {player_b} depends on whether the user values peak impact, "
            "title outcomes, or role-specific consistency. Treat this as an evidence-led comparison, not a fan-war verdict."
        ),
        "confidence": "78%",
        "fan_bias_detected": bias,
        "viral_version": f"{player_a} vs {player_b}: trophies, clutch moments, and legacy in one clean IPL debate.",
        "data_source": "mock_player_stats",
    }
