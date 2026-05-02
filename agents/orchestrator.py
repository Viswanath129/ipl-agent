from agents.module_a_sponsor_roi import run_sponsor_agent
from agents.module_b_debate import run_debate_agent
from data.database import log_query


def classify_query(q: str) -> str:
    """Classify a query without relying on model availability."""
    normalized = q.lower()
    sponsor_words = ["roi", "brand", "sponsor", "visibility", "marketing"]
    debate_words = ["vs", "better", "goat", "compare", "captain", "debate"]

    sponsor_hit = any(word in normalized for word in sponsor_words)
    debate_hit = any(word in normalized for word in debate_words)

    if sponsor_hit and debate_hit:
        return "mixed"
    if sponsor_hit:
        return "sponsor"
    if debate_hit:
        return "debate"
    return "general"


def handle_query(query: str) -> dict:
    """Orchestrates query routing between sub-agents."""
    route = classify_query(query)
    log_query(query, route)
    result = {"route_taken": route, "query": query}

    if route == "sponsor":
        result["module_a_output"] = run_sponsor_agent(query)
    elif route == "debate":
        result["module_b_output"] = run_debate_agent(query)
    elif route == "mixed":
        result["module_a_output"] = run_sponsor_agent(query)
        result["module_b_output"] = run_debate_agent(query)
    else:
        result["message"] = "Ask about IPL sponsor ROI, brand visibility, or player/team debates."

    return result
