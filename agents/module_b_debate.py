import json
from google_adk import Agent
from tools.debate_tools import fetch_player_stats, detect_fan_bias

# Module B: Debate Engine Agent
debate_agent = Agent(
    name="DebateEngineAgent",
    instructions="""
    You are the IPL AI Debate Engine.
    Generate highly engaging, evidence-backed debates fans love sharing.
    Use the tools fetch_player_stats and detect_fan_bias to gather data.
    Output MUST be in the following strict JSON format:
    {
     "topic": "...",
     "side_a_strengths": [...],
     "side_b_strengths": [...],
     "neutral_verdict": "...",
     "confidence": "...",
     "fan_bias_detected": "...",
     "viral_version": "..."
    }
    """,
    tools=[fetch_player_stats, detect_fan_bias],
    model="gemini-1.5-flash"
)

def run_debate_agent(query: str) -> dict:
    """Runs the Debate Agent to generate a viral argument."""
    try:
        response = debate_agent.run(query)
        clean_str = response.output.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_str)
    except Exception as e:
        # Fallback for structured UI format
        return {
            "topic": "Debate Fallback",
            "side_a_strengths": ["Strong tactical decisions", "Great pressure handling"],
            "side_b_strengths": ["Incredible boundary hitting", "High tournament titles"],
            "neutral_verdict": "It is a highly competitive tie.",
            "confidence": "80%",
            "fan_bias_detected": "moderate",
            "viral_version": "Check out this debate on Instagram!"
        }
