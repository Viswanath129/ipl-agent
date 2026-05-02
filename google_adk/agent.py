import os
import json
from typing import List, Callable, Any

class Agent:
    def __init__(self, name: str, instructions: str, tools: List[Callable] = None, model: str = "gemini-1.5-flash"):
        self.name = name
        self.instructions = instructions
        self.tools = tools or []
        self.model = model
        
    def run(self, query: str) -> Any:
        class Response:
            def __init__(self, text):
                self.output = text

        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your_gemini_api_key_here":
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                
                tool_descriptions = "\n".join([f"- {t.__name__}: {t.__doc__}" for t in self.tools])
                
                system_prompt = f"{self.instructions}\n\nYou have access to tools:\n{tool_descriptions}\nAnswer strictly in the requested JSON format."
                
                model = genai.GenerativeModel(
                    model_name=self.model,
                    system_instruction=system_prompt
                )
                response = model.generate_content(query)
                return Response(response.text)
            except Exception as e:
                return Response(json.dumps({"error": str(e)}))
                
        # Mock logic fallback if API key is not present or library missing
        if "Sponsor" in self.name:
            if self.tools:
                brand = "Dream11" if "dream11" in query.lower() else "CEAT"
                tool_res = self.tools[0](brand, 50)
                return Response(json.dumps(tool_res))
                
        if "Debate" in self.name:
            if self.tools:
                bias = self.tools[1]("captaincy", query)
                res = {
                    "topic": "Debate Fallback - API Key Missing",
                    "side_a_strengths": ["tactical genius", "spin usage"],
                    "side_b_strengths": ["pace utilization", "aggressive fields"],
                    "neutral_verdict": "Dhoni edges tactically, Rohit equals in titles",
                    "confidence": "84%",
                    "fan_bias_detected": bias,
                    "viral_version": "5-slide Instagram debate ready"
                }
                return Response(json.dumps(res))
                
        if "Orchestrator" in self.name:
            q = query.lower()
            if any(x in q for x in ["sponsor", "roi", "brand", "visibility"]):
                return Response('{"route": "Module A"}')
            elif any(x in q for x in ["debate", "better", "goat", "compare", "vs"]):
                return Response('{"route": "Module B"}')
            else:
                return Response('{"route": "Mixed"}')

        return Response('{"error": "Agent not configured properly"}')
