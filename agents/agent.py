from tools.debate_tools import debate_tool
from tools.sponsor_tools import sponsor_roi_tool

try:
    from google.adk.agents import Agent
except ImportError:
    Agent = None


root_agent = (
    Agent(
        name="ipl_influence_engine",
        model="gemini-flash-latest",
        description="IPL sponsor ROI intelligence and fan debate engine.",
        instruction=(
            "Route sponsor, brand, visibility, marketing, and ROI questions to "
            "sponsor_roi_tool. Route IPL comparison, versus, captaincy, GOAT, and "
            "debate questions to debate_tool. Use tool outputs as the source of "
            "truth. If data is estimated, say it is estimated."
        ),
        tools=[sponsor_roi_tool, debate_tool],
    )
    if Agent
    else None
)
