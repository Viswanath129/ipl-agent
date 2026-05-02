import json
from tools.sponsor_tools import sponsor_roi_tool

try:
    from google.adk.agents import Agent
except ImportError:
    Agent = None

# Module A: Sponsor ROI Agent
sponsor_agent = (
    Agent(
        name="SponsorROIAgent",
        instruction=(
            "You are the IPL Brand Sponsor ROI Agent. Use sponsor_roi_tool for "
            "brand visibility, social mentions, and estimated sponsor ROI. "
            "Return strict JSON."
        ),
        tools=[sponsor_roi_tool],
        model="gemini-flash-latest",
    )
    if Agent
    else None
)

def run_sponsor_agent(query: str) -> dict:
    """Runs the Sponsor Agent to generate an ROI report."""
    brand = "Dream11"
    for candidate in ["Dream11", "CEAT", "Puma"]:
        if candidate.lower() in query.lower():
            brand = candidate
            break

    try:
        if sponsor_agent and hasattr(sponsor_agent, "run"):
            response = sponsor_agent.run(query)
            clean_str = response.output.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_str)
    except Exception:
        pass

    return sponsor_roi_tool(brand=brand)
