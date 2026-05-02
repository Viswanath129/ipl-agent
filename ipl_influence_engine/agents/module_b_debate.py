import json
from tools.debate_tools import (
    compare_players_tool,
    debate_tool,
    detect_fan_bias,
    fetch_player_stats,
    legacy_analyzer_tool,
    stats_retrieval_tool,
)

try:
    from google.adk.agents import Agent
except ImportError:
    Agent = None

# Module B: Debate Engine Agent
debate_agent = (
    Agent(
        name="DebateEngineAgent",
        instruction=(
            "You are the IPL AI Debate Engine. Use debate_tool, "
            "fetch_player_stats, and detect_fan_bias for balanced, evidence-led "
            "IPL comparisons. Return strict JSON."
        ),
        tools=[fetch_player_stats, detect_fan_bias, debate_tool, stats_retrieval_tool, compare_players_tool, legacy_analyzer_tool],
        model="gemini-flash-latest",
    )
    if Agent
    else None
)

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
