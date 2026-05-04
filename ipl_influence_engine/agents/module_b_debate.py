import json
from tools.debate_tools import (
    compare_players_tool,
    debate_tool,
    detect_fan_bias,
    fetch_player_stats,
    legacy_analyzer_tool,
    stats_retrieval_tool,
)

# Module B: Debate Engine Agent (simplified without google-adk)
debate_agent = None

def run_debate_agent(query: str) -> dict:
    """Runs the Debate Agent to generate a viral argument."""
    try:
        if debate_agent and hasattr(debate_agent, "run"):
            response = debate_agent.run(query)
            clean_str = response.output.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_str)
    except Exception:
        pass

    return debate_tool(query)
