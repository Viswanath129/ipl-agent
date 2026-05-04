import os
import google.generativeai as genai
from typing import List, Callable, Any

class Agent:
    def __init__(
        self,
        name: str,
        model: str,
        description: str,
        instruction: str,
        tools: List[Callable] = None
    ):
        self.name = name
        self.model_name = model
        self.description = description
        self.instruction = instruction
        self.tools_list = tools or []
        
        # Configure Gemini
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
        if not api_key:
             # Fallback to the one the user gave me if not in env
             api_key = "AIzaSyCPAFtyah0VpLGCmhr87jQLSxO-6A1A0hw"
        
        genai.configure(api_key=api_key)
        
        # Initialize model with tools
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", # Use a stable name
            system_instruction=self.instruction,
            tools=self.tools_list
        )
        self.chat = self.model.start_chat(enable_automatic_function_calling=True)

    def run(self, query: str) -> Any:
        try:
            response = self.chat.send_message(query)
            # If the response has parts and one is text, return it
            for part in response.candidates[0].content.parts:
                if part.text:
                    return part.text
            return "Query processed successfully."
        except Exception as e:
            print(f"Error in Agent {self.name}: {e}")
            return f"Error: {str(e)}"
