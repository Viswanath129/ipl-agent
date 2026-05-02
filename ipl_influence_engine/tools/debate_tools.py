from services.debate_engine import (
    analyze_legacy,
    compare_players,
    detect_bias,
    judge_debate,
    retrieve_stats,
)


KNOWN_PLAYERS = ["Kohli", "Dhoni", "Rohit", "ABD", "Bumrah"]

def fetch_player_stats(player1: str, player2: str) -> dict:
    """
    Fetches comparative stats, legacy, and clutch scores for two players for debate.
    
    Args:
        player1 (str): First player name.
        player2 (str): Second player name.
        
    Returns:
        dict: A structured comparison.
    """
    return {player1: retrieve_stats(player1), player2: retrieve_stats(player2), "comparison": compare_players(player1, player2)}

def detect_fan_bias(topic: str, query: str) -> str:
    """
    Analyzes the query and topic to detect underlying emotional polarization or fan bias.
    
    Args:
        topic (str): The debate topic.
        query (str): The user's input query.
        
    Returns:
        str: Bias level.
    """
    return detect_bias(query).get("bias_label", "low")


def debate_tool(topic: str) -> dict:
    """
    Generate a balanced IPL comparison debate.

    Args:
        topic: IPL debate topic, such as "Dhoni vs Rohit as captain".

    Returns:
        dict: Balanced debate output with strengths, verdict, confidence, and bias.
    """
    return judge_debate(topic)


def stats_retrieval_tool(entity: str) -> dict:
    """Retrieve curated IPL stats for a player or team."""
    return retrieve_stats(entity)


def compare_players_tool(player1: str, player2: str, lens: str = "overall") -> dict:
    """Compare two IPL players or teams under a selected lens."""
    return compare_players(player1, player2, lens)


def legacy_analyzer_tool(entity: str) -> dict:
    """Analyze legacy and narrative strength for an IPL player or team."""
    return analyze_legacy(entity)
