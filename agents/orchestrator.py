import json
from google_adk import Agent
from agents.module_a_sponsor_roi import run_sponsor_agent
from agents.module_b_debate import run_debate_agent

orchestrator_agent = Agent(
    name="MasterOrchestrator",
    instructions="""
    You are the central router for the IPL Influence Engine.
    Analyze the user query.
    If the user asks about sponsors, brand visibility, marketing, or ROI, return {"route": "Module A"}.
    If the user asks about goat, compare, who better, debate, legacy, return {"route": "Module B"}.
    If mixed, return {"route": "Mixed"}.
    Output only the JSON.
    """,
    model="gemini-1.5-flash"
)

def handle_query(query: str) -> dict:
    """Orchestrates query routing between sub-agents."""
    try:
        response = orchestrator_agent.run(query)
        clean_str = response.output.replace("```json", "").replace("```", "").strip()
        route_data = json.loads(clean_str)
        route = route_data.get("route", "Module B")
    except Exception:
        # Heuristic fallback routing
        q = query.lower()
        if any(w in q for w in ["sponsor", "roi", "visibility", "brand", "marketing"]):
            route = "Module A"
        elif any(w in q for w in ["debate", "better", "goat", "compare", "vs"]):
            route = "Module B"
        else:
            route = "Mixed"
            
    result = {"route_taken": route, "query": query}
    
    if route == "Module A":
        result["module_a_output"] = run_sponsor_agent(query)
    elif route == "Module B":
        result["module_b_output"] = run_debate_agent(query)
    else: # Mixed
        result["module_a_output"] = run_sponsor_agent(query)
        result["module_b_output"] = run_debate_agent(query)
        
    return result
