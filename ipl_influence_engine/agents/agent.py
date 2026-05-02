from tools.debate_tools import compare_players_tool, debate_tool, legacy_analyzer_tool, stats_retrieval_tool
from tools.sponsor_tools import (
    logo_visibility_tool,
    social_mentions_tool,
    sponsor_comparison_tool,
    sponsor_report_export_tool,
    sponsor_roi_tool,
)

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
        tools=[
            sponsor_roi_tool,
            logo_visibility_tool,
            social_mentions_tool,
            sponsor_comparison_tool,
            sponsor_report_export_tool,
            debate_tool,
            stats_retrieval_tool,
            compare_players_tool,
            legacy_analyzer_tool,
        ],
    )
    if Agent
    else None
)
